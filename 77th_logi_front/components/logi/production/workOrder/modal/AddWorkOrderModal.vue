<script lang="ts" setup>
import { ref } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { productionStore } from '@/store/logi/production'
import { defineProps, defineEmits } from "vue";
import ActualWorkOrderButton from './ActualWorkOrderButton.vue'

const infodata = ref([]);
const isDialogVisible = ref(false);
const showWarningAlert = ref(false);
const workSiteName = ref("");
const workBranch = ref("");
let productionProcessList: Ref<any[]> = ref([]);
let workplaceList: Ref<any[]> = ref([]);


const workOrderSimulationHeaders = [
  { title: '소요량전개번호', key: 'mrpNo' },
  { title: '소요량취합번호', key: 'mrpGatheringNo' },
  { title: '품목분류', key: 'itemClassification' },
  { title: '품목코드', key: 'itemCode' },
  { title: '품목명', key: 'itemName' },
  { title: '단위', key: 'unitOfMrp' },
  { title: '재고량(투입예정재고)', key: 'inputAmount', width:100 },
  { title: '재고소요/제작수량', key: 'requiredAmount', width:100 },
  { title: '재고량(재고소요이후)', key: 'stockAfterWork', width:100 },
  { title: '작업지시기한', key: 'orderDate' },
  { title: '작업완료기한', key: 'requiredDate' }
]



//부모 컴포넌트에서 받아온 데이터 
const propz = defineProps(['selectData']);
const emits = defineEmits(['initializeInfodata']);

//실제작업지시 버튼
const workOrderOk = ref({
  productionProcessCode: '',
  workPlaceCode: '',
  mrpGatheringNo: ''
});

//모의전개 alert, 테이블 데이터
const workOrderDialogClick = async () => {
  console.log('productionProcessCode>>>>>>', workOrderOk.value.productionProcessCode);
  if (!propz.selectData || Object.keys(propz.selectData).length === 0) {
    // 행을 선택하지 않았을 때
    showWarningAlert.value = true; // alert 보임 
    isDialogVisible.value = false; // Dialog를 감춤
  } else {
    try {
      const { mrpNo, mrpGatheringNo } = propz.selectData;
      workOrderOk.value.mrpGatheringNo = mrpGatheringNo;

      await productionStore().FETCH_ADD_WORKORDER_DIALOG(mrpNo, mrpGatheringNo);
      infodata.value = productionStore().AddWorkOrderDialog;
      console.log('toRaw(infodata.value): ', toRaw(infodata.value));
      
      showWarningAlert.value = false; // alert 감춤 
      isDialogVisible.value = true; // Dialog를 보임
    
    } catch (error) {
      console.error('데이터 가져오기 에러:', error);
      infodata.value = [];
    }
  }
}
//

//사용자가 작업장과 지점을 바꿀 때마다 workOrder의 productionProcessCode와 workPlaceCode 업데이트 해주기
watch([workSiteName, workBranch], () => {
  console.log(workSiteName.value, workBranch.value);
  workOrderOk.value.productionProcessCode = workSiteName.value
  workOrderOk.value.workPlaceCode = workBranch.value 
});

// close버튼 눌렀을 때 실행되는 함수
const closeDialog = () => {
  isDialogVisible.value = false;
};

// initializeInfodata는 workOrderListForm으로 부터 받아온 함수
// 테이블에 있는 데이터를 초기화하는 함수 이다
const initializeInfodata = () => {
  emits('initializeInfodata');
};

//작업장 조회
const productionProcess=async()=>{
  await productionStore().GET_PRODUCTION_PROCESS_LIST();
  const response = productionStore().productionProcessList;
  console.log("response!!!!" , response)

  productionProcessList.value = response.map((item: any) => ({
      title: item.productionProcessName, // UI에 표시됨
      value: item.productionProcessCode, // 저장되는 값 (code)
    }));
  console.log("productionProcessList.value!!!!" , productionProcessList.value)
}

// 지점조회
const workplace=async()=>{
  await productionStore().GET_WORKPLACE_LIST();
  const response = productionStore().workplaceList;
  workplaceList.value = response.map((item: any) => ({
      title: item.workplaceName, // UI에 표시됨
      value: item.workplaceCode, // 저장되는 값 (code)
    }));
  console.log("workplaceList.value!!!!" , workplaceList.value)
}

onMounted(async () => {
  await productionProcess();
  await workplace();
});

const selectDialogRow = (item: any, row: any) => {
  workOrderOk.value.productionProcessCode = row.item.mrpGatheringNo;
  console.log("나와라:", row.item.mrpGatheringNo);
  console.log("나와라:", workBranch.value);
  console.log("나와라:", workSiteName.value); 
};

</script>

<template>
  <VDialog v-model="isDialogVisible" width="1400">
    <!-- Activator -->
    <template #activator="{ props }">
      <VBtn 
          v-bind="props" 
          color="primary" 
          @click="workOrderDialogClick"
          > 작업지시 모의전개
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard>
      <VCardTitle>WorkOrder</VCardTitle>
      <div class="notice">
        <p style="font-weight: bold">
          <span class="span indented"></span>품목구분이 
          <span class="span">완제품</span>인 경우 
          <span class="span">조립생산공정</span>에서, 
          <span class="span">반제품</span>인 경우 
          <span class="span">라인공정</span>에서 작업을 해야 합니다.
        </p>
      </div>
      <VCardText>
        <VRow class="mb-4">
          <VCol cols="12" sm="6" md="2">
            <AppSelect
              v-model="workSiteName"
              :items="productionProcessList"
              label="작업장구분"
          />
          </VCol>
          <VCol cols="12" sm="6" md="2">
            <AppSelect
              v-model="workBranch"
              :items="workplaceList"
              label="지점구분"
            />
          </VCol>
        </VRow>

      <VDataTable
          :headers="workOrderSimulationHeaders"
          :items="infodata"
          @click:row="selectDialogRow"
        />
      </VCardText>

      <VCardText class="d-flex justify-end">
        <ActualWorkOrderButton 
          :DialogData="workOrderOk" 
          @closeDialog="closeDialog"
          @initializeInfodata="initializeInfodata"
        />
      </VCardText>
    </VCard>
  </VDialog>

  <!-- VAlert for warning -->
  <VAlert 
    v-if="showWarningAlert" 
    type="warning" 
    variant="tonal" 
    style="max-width: 400px;"
    >행을 선택해주세요!!
  </VAlert>
</template>

<style scoped>
.notice {
  position: relative;
}
.span {
  color: green;
}
.indented {
        margin-left: 25px; /* 원하는 만큼의 들여쓰기 크기를 설정합니다 */
}
</style>
