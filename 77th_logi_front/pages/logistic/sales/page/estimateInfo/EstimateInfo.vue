<template>
  <VRow>
    <!-- 견적조회 -->
    <VCol md="12">
      <VCard class="mb-6" title="견적 조회">
        <VCardText>
          <VRow align="center">
            <VCol cols="5" >
              <v-btn class="ma-3" @click="fetchData">견적 조회</v-btn>
              <EstimateModifyModal class="ma-3"
            :selectEstimate="selectEstimate"
            :responseEstimateList="responseEstimateList"
            />
            <v-btn class="ma-3" @click="deleteData">견적 삭제</v-btn>
            </VCol>
            
            <VCol cols="2" style="align-self: flex-end">
              <v-select
                v-model="selectedItem"
                class="mb-3"
                label="선택"
                :items="items"
                item-title="text"
                item-value="value"
                @input="updateSelectedItem"
              ></v-select>
            </VCol>
            <VCol cols="2">
              <AppDateTimePicker
                class="mb-3"
                v-model="startDate"
                label="시작일"
                placeholder="YYYY-MM-DD"
              />
            </VCol>
            <VCol cols="2">
              <AppDateTimePicker
                class="mb-3"
                v-model="endDate"
                label="종료일"
                placeholder="YYYY-MM-DD"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText>
          <VDataTable
            :headers="headers"
            @click:row="selectRow"
            :items="responseEstimateList"
            :items-per-page="5"
            show-select
            select-strategy="single"
            return-object
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- 견적 상세 -->
  <VRow>
    <VCol md="12">
      <VCard class="mb-6" title="견적 상세">
        <VCardText>
          <VDataTable
            :headers="detailheaders"
            :items="responseEstimateDetailList"
            :items-per-page="5"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { salesStore } from "@/store/logi/sales";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import EstimateModifyModal from './EstimateModifyModal.vue'

const responseEstimateDetailList = ref([]);
const responseEstimateList = ref([])

const selectedItem = ref(null);
const startDate = ref('');
const endDate = ref('');
const dateSearchCondition = ref([]);

//선택된 행
const selectEstimate = ref([]);

//행을 선택하면 견적상세 확인가능 및 자식창으로 값을 넘겨줌
const selectRow= async(item:any, row:any)=>{
  try{
  selectEstimate.value = toRaw(row.item);
  const estimateNo = selectEstimate.value.estimateNo
  console.log('선택된 행' , selectEstimate.value)
  console.log('선택된 행의 견적번호' , selectEstimate.value.estimateNo)
  
  //견적 상세 조회
    await salesStore().SEARCH_ESTIMATE_DETAIL(estimateNo)
    responseEstimateDetailList.value = salesStore().estimateDetailInfo




  }catch(error){
    console.error('Error fetching data:', error);
    return [];
  }
}

//선택된행 확인하기위함
// watch(selectEstimate, () => {
//   console.log('selectEstimate >>>>>>>>>>>>', selectEstimate);
// })


const updateSelectedItem = (value: any) => {
  selectedItem.value = value;
  console.log("select", selectedItem);
};



const headers = [
  { title: "견적일련번호", key: "estimateNo", align: "center" },
  { title: "거래처코드", key: "customerCode", align: "center" },
  { title: "견적일자", key: "estimateDate", align: "center" },
  { title: "수주여부", key: "contractStatus", align: "center" },
  { title: "견적요청자", key: "estimateRequester", align: "center" },
  { title: "유효일자", key: "effectiveDate", align: "center" },
  { title: "견적담당자코드", key: "personCodeInChange", align: "center" },
  { title: "비고", key: "description", align: "center" },
];

const detailheaders = [
  { title: "견적상세일련번호", key: "estimateDetailNo", align: "center" },
  { title: "품목코드", key: "itemCode", align: "center" },
  { title: "품목명", key: "itemName", align: "center" },
  { title: "단위", key: "unitOfEstimate", align: "center" },
  { title: "납기일", key: "dueDateOfEstimate", align: "center" },
  { title: "견적수량", key: "estimateAmount", align: "center" },
  { title: "견적단가", key: "unitPriceOfEstimate", align: "center" },
  { title: "합계액", key: "sumPriceOfEstimate", align: "center" },
  { title: "비고", key: "description", align: "center" },
  { title: "견적일련번호", key: "estimateNo", align: "center" },
];

const items = [
  { value: "estimateDate", text: "견적일자" },
  { value: "effectiveDate", text: "유효일자" },
];

//78th 수정(모듈화)
const fetchData = async () => {
  if (!startDate.value && !endDate.value && !selectedItem.value) {
    alert("시작일과 종료일을 선택하고, 선택도 해주세요!");
    return;
  }

  // 시작일과 종료일 모두 선택하지 않은 경우
  if (!startDate.value || !endDate.value) {
    alert("시작일과 종료일을 선택해주세요!");
    return;
  }

  // 드롭다운 선택을 하지 않은 경우
  if (!selectedItem.value) {
    alert("선택을 해주세요!");
    return;
  }
  
  try {
    await salesStore().SEARCH_ESTIMATES_LIST_URL(startDate.value, endDate.value, selectedItem.value)
    responseEstimateList.value = salesStore().SearchEstimatesList
    console.log("estimate", responseEstimateList);
    return responseEstimateList;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// const handleModifyCom = async () => {
//   await fetchData();
// }

//삭제
const deleteData = async () => {
  try {
    if (!selectEstimate.value) {
      console.log('삭제할selectEstimate', selectEstimate.value)
      console.warn('삭제할 항목을 선택하세요.')
      alert("삭제할 데이터를 선택해주세요!");

      return
    }

    const userConfirmed = window.confirm('삭제하시겠습니까?')

    if (userConfirmed) {
      const estimateNo = selectEstimate.value.estimateNo

      console.log('삭제할estimateNo', estimateNo)

      await salesStore().DELETE_ESTIMATE_URL(estimateNo)

      fetchData()

      alert('견적이 성공적으로 삭제되었습니다.')
    }
  }
  catch (error) {
    console.error('데이터 삭제 오류:', error)
    alert('견적 삭제에 실패했습니다.')
  }
}

//병합좀 되라!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!alkdfjslfdjlasfdjalkfdjaslfjalfjasfjladflskf시ㅓㅈ시저시ㅏㅈㅅ더ㅣㅏㅁㅈ덤ㅇㄹ


</script>
