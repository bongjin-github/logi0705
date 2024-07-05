<script setup lang="ts">
import { ref,watch } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from 'axios';
import contractInfoModal1 from './contractInfoModal.vue'
import { salesStore } from '@/store/logi/sales';
import type { OnSelectedParams } from '@/types/logistic/base/types';


const infodata = ref([]);
const isDialogVisible = ref(false);
const customerData=ref('');
const textFieldValue=ref('');
const startDate = ref('');
const endDate = ref('');
const infodataDetail=ref([]);
const selectNum=ref('');
const textFieldValue1=ref('');

const headers = [
  { title: '수주일련번호',sortable: false, key: 'contractNo' , width:120},
  { title: '견적일련번호', key: 'estimateNo', width:150 },
  { title: '회사코드', key: 'customerCode', width:150 },
  { title: '수주유형분류', key: 'contractTypeName', width:170 },
  { title: '견적일자', key: 'estimateDate', width:120 },
  { title: '수주일자', key: 'contractDate', width:120 },
  { title: '수주요청자', key: 'contractRequester' , width:150},
  { title: '수주담당자', key: 'empNameInCharge', width:150 },
  { title: '납품완료여부', key: 'deliveryCompletionStatus' , width:150},
  { title: '비고', key: 'description' , width:120},
]

const headers1 = [
  { title: '수주상세일련번호',sortable: false, key: 'contractDetailNo' , width:180},
  { title: '취합발주번호', key: 'estimateNo', width:150 },
  { title: '품목명', key: 'itemName', width:200 },
  { title: '납기일', key: 'dueDateOfContract', width:170 },
  { title: '견적수량', key: 'estimateAmount', width:120 },
  { title: '재고사용량', key: 'stockAmountUse', width:150 },
  { title: '견적단가', key: 'unitPriceOfContract' , width:150},
  { title: '합계액', key: 'sumPriceOfContract', width:180 },
  { title: '납품가능여부', key: 'operationCompletedStatus' , width:200},
  { title: '납품완료여부', key: 'deliveryCompletionStatus' , width:200},
  { title: '비고', key: 'description' , width:120},
]

const select=[
{ title: '수주일련번호',sortable: false, key: 'contractNo' , width:120},
  { title: '견적일련번호', key: 'estimateNo', width:150 },
  { title: '수주요청자', key: 'contractRequester', width:150 },
]

const fetchData = async () => {
  console.log("textFieldValue",textFieldValue.value)
  try {
    
    const searchCondition = 'searchByDate';
    const customerCode='';

    // 수주 조회 API 호출
    await salesStore().SEARCH_CONTRACT(searchCondition,customerCode,startDate.value,endDate.value)

    return salesStore().contractInfo;

  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const cutomerSave=async()=>{
  try {
   
    const searchCondition = 'searchByCustomer';
    const customerCode=textFieldValue.value;

    // 수주 조회 API 호출
    await salesStore().SEARCH_CONTRACT(searchCondition,customerCode, startDate.value,endDate.value)
    infodata.value = salesStore().contractInfo

  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// 버튼 클릭 시 데이터 가져오기
const handleButtonClick = async () => {
  infodata.value = await fetchData();
  console.log("infodata",infodata.value)

}

const dialogClose=()=>{
    isDialogVisible.value=false;
}

const comInfoSave=()=>{
    textFieldValue.value = customerData.value.customerCode; 
    console.log(textFieldValue.value)
    isDialogVisible.value=false;
}

const onSelected=({ selected, a }: OnSelectedParams)=>{
    console.log("selected", selected);
  console.log("a", a.internalItem.columns)
  customerData.value=a.internalItem.columns
}

const detailRow= async(item: any, row: any)=>{
  console.log("row",row.internalItem.columns.contractNo)
  try {
    const contractNo=row.internalItem.columns.contractNo

    //수주 상세 조회
    await salesStore().SEARCH_CONTRACT_DETAIL(contractNo)
    infodataDetail.value = salesStore().contractDetailInfo

  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}


const sortedData = async () => {
  infodata.value = await fetchData()
  console.log("selectNum",selectNum)
  console.log("textFieldValue1",textFieldValue1.value)
  console.log("infodata",toRaw(infodata.value))


  if (textFieldValue1.value !== '') {
  const searchedData = infodata.value.filter((item) => {
    switch (selectNum.value.key) {
      case 'contractRequester':
        //console.log('contractRequester가 선택됨', item.contractRequester);
        if(item.contractRequester !== null)
          return item.contractRequester.includes(textFieldValue1.value);
      case 'contractNo':
        return item.contractNo.includes(textFieldValue1.value);
      case 'estimateNo':
        return item.estimateNo.includes(textFieldValue1.value);
      default:
        return '';
    }
  })
  
    //console.log("searchedData",searchedData)
    infodata.value = searchedData;
  }
};

const cutomerDelete=async()=>{
  textFieldValue.value=''
  infodata.value = await fetchData();
}

</script>

<template>
    <Vcard>
  <VRow>
  <VCol cols="12" md="6" class="d-flex gap-1">
    <AppDateTimePicker
      v-model="startDate"
      placeholder="YYYY-MM-DD"
      class="mr-2"
      style="width: 250px"
      prepend-icon="tabler-calendar-event"
    />
    <div class="divider">~</div>
    <AppDateTimePicker
      v-model="endDate"
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
  </VCol>
    
    <!-- 두 번째 VRow -->
    <VRow>
      <VCol cols="12" md="12" class="d-flex gap-1">
        <contractInfoModal1 
          :infodata="infodata"
          :textFieldValue="textFieldValue"
          v-model="isDialogVisible"
          @dialogClose="dialogClose"
          @comInfoSave="comInfoSave"
          @selected="onSelected"
          @cutomerSave="cutomerSave"
          @cutomerDelete="cutomerDelete"
        />
      </VCol>
    </VRow>
</VRow>

  <VRow>
    <VCol cols="12" md="2" offset-md="7">
<AppCombobox
v-model="selectNum"
:items="select"
placeholder="Search 조건"
clearable

/></VCol>
<VCol cols="12" md="2">
    <v-text-field
    @input="sortedData"
    v-model="textFieldValue1"
    placeholder="Search..."
    clearable
    ></v-text-field>
  </VCol>
  </VRow>

  <VDataTable
    :headers="headers"
    :items="infodata"
    :items-per-page="10"
    height="400"
    fixed-header
    @click:row="detailRow"
  >
  </VDataTable>
</Vcard>
<Vcard>
  
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