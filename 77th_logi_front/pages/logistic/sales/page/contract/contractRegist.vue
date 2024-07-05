<script setup lang="ts">
import { ref,watch } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import registModal from './contractRegistModal.vue'
import { salesStore } from '@/store/logi/sales';
import type { EstimateTO } from '@/types/logistic/sales/sales';

const infodata: Ref<EstimateTO[]> = ref([]);
const isDialogVisible = ref(false);
const date = ref('');
const date1 = ref('');
const infodataDetail=ref([]);
const selectRow=ref([]);
let addContractCompletion = ref(false);


const headers = [
  { title: '견적일련번호', key: 'estimateNo', width:150 },
  { title: '수주유형', key: 'contractStatus', width:170 },
  { title: '거래처명', key: 'customerCode', width:170 },
  { title: '수주요청자', key: 'contractRequester' , width:150},
  { title: '견적일자', key: 'estimateDate', width:120 },
  { title: '유효일자', key: 'effectiveDate', width:120 },
  { title: '견적담당자명', key: 'estimateRequester', width:150 },
  { title: '비고', key: 'description' , width:120},
]

const headers1 = [
  { title: '견적상세일련번호',sortable: false, key: 'estimateDetailNo' , width:180},
  { title: '품목코드', key: 'itemCode', width:150 },
  { title: '품목명', key: 'itemName', width:200 },
  { title: '단위', key: 'unitOfEstimate' , width:120},
  { title: '납기일', key: 'dueDateOfEstimate', width:170 },
  { title: '견적수량', key: 'estimateAmount', width:120 },
  { title: '견적단가', key: 'unitPriceOfEstimate' , width:150},
  { title: '합계액', key: 'sumPriceOfEstimate', width:180 },
  { title: '비고', key: 'description' , width:120},
]

const select=[
{ title: '수주일련번호',sortable: false, key: 'contractNo' , width:120},
  { title: '견적일련번호', key: 'estimateNo', width:150 },
  { title: '수주요청자', key: 'contractRequester', width:150 },
]

const fetchData = async () => {
try {
    const startDate=date.value
    const endDate=date1.value

    // 등록된 견적 조회
    await salesStore().GET_ESTIMATE_CONTRACT_INFO(startDate, endDate)
    const response = salesStore().estimateContractInfo

    console.log("gridRowJson:", response);

    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};


// 버튼 클릭 시 데이터 가져오기
const handleButtonClick = async () => {
  infodata.value = await fetchData();
}

const detailRow= async(item: any, row: any)=>{
  console.log("row",row)
  infodataDetail.value=row.item.estimateDetailTOList;

}

const handleUpdateData = (updatedInfodata: { map: (arg0: (item: any) => any) => never[]; }) => {
  infodata.value = updatedInfodata.map(item => ({ ...item }));
};

const registClick=async()=>{
    console.log("infodata",toRaw(infodata.value))
    const paramList=selectRow.value
    const contractDate = new Date().toISOString().split('T')[0];
    const targetObject = infodata.value?.filter(obj => paramList.includes(obj.estimateNo));

    console.log("targetObject",targetObject)
for (const param of paramList) {
  // infodata에서 해당 estimateNo를 가진 객체 찾기
  const targetObject = infodata.value.find(obj => obj.estimateNo === param);

  if (targetObject) {
    console.log("targetObject", targetObject);

    // 필요한 데이터 추출 및 검증
    const batchList = {
      contractRequester: targetObject.contractRequester,
      contractType: targetObject.contractStatus,
      customerCode: targetObject.customerCode,
      description: targetObject.description,
      estimateNo: targetObject.estimateNo
    };

    if (!batchList.contractRequester) {
      alert("수주요청자를 입력하세요");
      return;
    } else if (!batchList.contractType) {
      alert("수주유형을 선택하세요");
      return;
    }

    // 새로운 계약 객체 생성
    const newContractTO = {
      batchList: batchList,
      contractDate: contractDate,
      personCodeInCharge: "EMP-01",
      shipmentCompletionStatus: 'N',
      estimateDetail: targetObject.estimateDetailTOList
    };
    
    try {
      // 수주 등록 API 호출
      await salesStore().ADD_NEW_CONTRACT(newContractTO);
      addContractCompletion.value = true;
      console.log(`수주 등록 완료: `, salesStore().addContractStatus);
    } catch (error) {
      console.error(`Error registering contract for ${targetObject.estimateNo}:`, error);
      addContractCompletion.value = false;
      console.log(`수주 등록 중 오류가 발생했습니다: ${targetObject.estimateNo}`);
    }
  } else {
    alert(`해당 견적번호를 찾을 수 없습니다: ${param}`);
  }
}

selectRow.value=[];
infodataDetail.value=[];
date.value ="";
date1.value="";

if(addContractCompletion.value){
  alert(salesStore().addContractStatus);
  handleButtonClick();
}else{
  alert('수주 등록 중 오류가 발생했습니다');
}
}


watch(selectRow, () => {
  console.log("selectRow changed: ", selectRow.value);
})

watch(infodata, () => {
  console.log('부모창의 infodata', infodata.value);
})

const closeModal=()=>{
    isDialogVisible.value=false
}

const modifyCom=()=>{
   isDialogVisible.value=false
}
</script>

<template>
    <Vcard>
  <VRow>
  <VCol cols="12" md="6" class="d-flex gap-1">
    <AppDateTimePicker
      v-model="date"
      placeholder="YYYY-MM-DD"
      class="mr-2"
      style="width: 250px"
      prepend-icon="tabler-calendar-event"
    />
    <div class="divider">~</div>
    <AppDateTimePicker
      v-model="date1"
      placeholder="YYYY-MM-DD"
      class="mr-2"
      style="width: 200px"
    />  
    <VBtn
      color="primary"
      @click="handleButtonClick"
    >
      검색
    </VBtn>
    <registModal
        v-model="isDialogVisible"
        :infodata="infodata"
        :selectRow="selectRow"
        @closeModal="closeModal"
        @modifyCom="modifyCom"
        @updateData="handleUpdateData"
        />
    <VBtn
      color="primary"
      @click="registClick"
    >
      등록
    </VBtn>
  </VCol>
</VRow>

  <VDataTable
    :headers="headers"
    :items="infodata"
    :items-per-page="10"
    height="400"
    fixed-header
    show-select
    item-value="estimateNo"
    v-model="selectRow"
    @click:row="detailRow"
      >
  </VDataTable>
</Vcard>


<Vcard 
title="수주상세"
>
<VDataTable
    :headers="headers1"
    :items="infodataDetail"
    :items-per-page="10"
    height="200"
    fixed-header
  >
  </VDataTable>
</Vcard>
</template>


<style scoped>
/* 추가된 스타일 */
.d-flex {
  display: flex;
  align-items: center;
}

/* 테이블 스타일 추가 */
.v-data-table {
  margin-top: 50px; /* Add margin to the top of the table */
}

.vbtn{
  margin-left: auto;
}

.dd-flex{
  margin-top: 30px;
}

.vb-1{
  margin-right: 0.5rem;
}

.divider {
  font-size: 50px; /* 원하는 크기로 조절 */
  color: primary;  /* 원하는 색상으로 조절 */
  margin: 0 10px; /* 원하는 여백으로 조절 */
}

</style>