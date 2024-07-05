<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import AddWorkOrderDialog from './modal/AddWorkOrderModal.vue'
import { productionStore } from '@/store/logi/production'

const selectData = ref([]);
const infodata: Ref<any[]> = ref([]);
const startDate = ref("");
const endDate = ref("");

const workOrderListHeaders = [
  { title: '소요량전개번호', key: 'mrpNo' },
  { title: '소요량취합번호', key: 'mrpGatheringNo' },
  { title: '품목분류', key: 'itemClassification' },
  { title: '품목코드', key: 'itemCode' },
  { title: '품목명', key: 'itemName' },
  { title: '단위', key: 'unitOfMrp' },
  { title: '필요수량', key: 'requiredAmount' },
  { title: '작업지시기한', key: 'orderDate' },
  { title: '작업완료기한', key: 'requiredDate' }
]

//작업지시 필요항목 조회 클릭 
const WorkOrderListDataClick = async () => {
  if (startDate.value === "" || endDate.value === "") {
    alert("시작일 혹은 종료일을 선택해 주세요");
    return;
  }
  console.log('WorkOrderListDataClick', startDate.value, endDate.value);
  try {
    await productionStore().FETCH_WORKORDER_MRP_LIST(startDate.value,endDate.value);
    infodata.value = productionStore().WorkOrderMrpList;
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};



watch([startDate, endDate], () => {
  console.log(startDate.value, endDate.value);
});

const initializeInfodata = () => {
  startDate.value = '';
  endDate.value = '';
  infodata.value = [];
}

//모의전개로 보내는 데이터
const selectRow=(item:any, row:any)=>{
  console.log("row",row)
  selectData.value = row.item;
}

</script>

<template>
  <!-- 👉 작업지시 필요 리스트 -->
   <AppCardActions>
      <template #title>
         <div style="font-size: 22px;">작업지시 필요리스트 (MRP 취합 기반)</div>
      </template>

        <!-- 버튼 -->
    <VCol>
      <div class="header_wrap">
        <div>
          <label class="startDate">MPS 계획일자 선택</label>
          <label class="endDate">MPS 종료일자 선택</label>
        </div>
        <div class="header_wrap">
          <div class="startDate_wrap">
            <input name="startDate" class="date" type="date" v-model="startDate" />
          </div>
          <input class="date" type="date" v-model="endDate" />
          <VBtn 
              class="ml-3"
              color="primary"   
              @click="WorkOrderListDataClick"
              > 
              작업지시 필요항목 조회
          </VBtn>
          
            <!-- 🪄 모의전개 버튼  -->
            <AddWorkOrderDialog
               :selectData="selectData"
               @initializeInfodata="initializeInfodata"
               />
        </div>
      </div>
    </VCol>

        <!-- 테이블 내용 -->
        <VCardText>
          <VDataTable
            :headers="workOrderListHeaders"
            :items="infodata"
            :items-per-page="5"
            @click:row="selectRow"
          />
      </VCardText>
  </AppCardActions>
</template>
<style scoped>
.page_wrapper {
  /* border: 1px solid green; */
}

.header_wrap {
  position: relative;
  width: auto;
  /* border: 3px solid orange; */
  height: 70px;
  border-radius: 5px;
}

.date {
  border: none;
  width: 150px;
  height: 40px;
  border-radius: 3px;
  margin-right: 20px;
  border: 1px solid skyblue;
}

.startDate_wrap {
  display: inline-block;
}

.endDate {
  margin-left: 50px;
}

</style>