<template>
  <VRow>
    <!-- 납품 -->
    <VCol md="12">
      <VCard class="mb-6" title="납품">
        <VCardText>
          <VRow align="center">
            <VCol cols="2">
              <AppDateTimePicker
                class="mb-3"
                v-model="startDate"
                placeholder="YYYY-MM-DD"
              />
            </VCol>
            <VCol cols="auto" style="font-size: 30px"> ~ </VCol>
            <VCol cols="2">
              <AppDateTimePicker
                class="mb-3"
                v-model="endDate"
                placeholder="YYYY-MM-DD"
              />
            </VCol>
            <VCol cols="auto">
              <VBtn class="ml-3" @click="searchDate">검색</VBtn>
            </VCol>
            <VForm @submit.prevent="() => {}">
              <VRow>
                <!-- 👉 고객사코드로 검색 -->
                <VCol cols="auto">
                  <VDialog v-model="iscodeDialogVisible" width="500">
                    <!-- 고객사코드로 검색 -->
                    <template #activator="{ props }">
                      <AppTextField
                        v-bind="props"
                        style="width: 150px"
                        placeholder="고객사코드"
                        :value="textFieldValue"
                        @input="textFieldValue = $event.target.value"
                        class="codelist"
                      />
                    </template>

                    <!-- 다이얼로그 닫기 버튼 -->
                    <DialogCloseBtn
                      @click="iscodeDialogVisible = !iscodeDialogVisible"
                    />

                    <!-- 고객사코드로 검색 다이얼로그 테이블 -->
                    <VCard title="고객사코드">
                      <VContainer>
                        <VDataTable
                          :headers="codeheaders"
                          :items="infodata2"
                          @click:row="selectRow1"
                        />
                      </VContainer>

                      <VCardText class="d-flex justify-end flex-wrap gap-3">
                        <VBtn
                          variant="tonal"
                          color="secondary"
                          @click="closeModal"
                        >
                          취소
                        </VBtn>
                        <VBtn @click="modifyCom"> 입력 </VBtn>
                      </VCardText>
                    </VCard>
                  </VDialog>
                </VCol>
                <VCol cols="auto">
                  <VBtn @click="searchDate1"> 고객사코드로 검색 </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VRow>
          <VCol cols="auto">
            <VBtn class="ml-3" @click="fetchData3">납품</VBtn>
          </VCol>
        </VCardText>
        <VCardText>
          <VDataTable
            v-model="selectData"
            :headers="headers"
            :items="infodata"
            @click:row="selectRow"
            :items-per-page="5"
            return-object
            show-select
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- 납품 수주 상세 -->
  <VRow>
    <VCol md="12">
      <VCard class="mb-6" title="납품 수주 상세">
        <VCardText>
          <VDataTable
            :headers="detailheaders"
            :items="infodata1"
            :items-per-page="5"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { companyStore } from "@/store/hr/company";
import { salesStore } from "@/store/logi/sales";
import type { ContractInfoTO } from "@/types/logistic/sales/sales";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";

// Dialog
const iscodeDialogVisible = ref(false);

const startDate = ref("");
const endDate = ref("");

const infodata = ref([]);
const infodata1 = ref([]);
const infodata2 = ref([]);
const selectData =ref([]);
const contractDetailNoList = ref<string[]>([])

const customerData = ref("");
const textFieldValue = ref("");
const contractDetail = ref("");
const contractDetailNo = ref("");

onMounted(async () => {
  infodata.value = await fetchData();
  infodata2.value = await fetchData2();
});

const closeModal = () => {
  iscodeDialogVisible.value = false;
};

const modifyCom = async () => {
  textFieldValue.value = customerData.value.customerCode;
  console.log("customerCode:", textFieldValue._rawValue);
  iscodeDialogVisible.value = false;
};

const codeheaders = [
  { title: "회사코드", key: "customerCode", align: "center" },
  { title: "고객사명", key: "customerName", align: "center" },
];

const headers = [
  { title: "수주일련번호", key: "contractNo", align: "center" },
  { title: "견적일련번호", key: "estimateNo", align: "center" },
  { title: "수주유형분류", key: "contractTypeName", align: "center" },
  { title: "거래처명", key: "customerName", align: "center" },
  { title: "견적일자", key: "estimateDate", align: "center" },
  { title: "수주일자", key: "contractDate", align: "center" },
  { title: "수주요청자", key: "contractRequester", align: "center" },
  { title: "수주담당자명", key: "empNameInCharge", align: "center" },
  { title: "비고", key: "description", align: "center" },
];

const detailheaders = [
  {
    title: "수주상세일련번호",
    key: "contractDetailNo",
    width: 200,
    align: "center",
  },
  { title: "수주일련번호", key: "contractNo", width: 200, align: "center" },
  { title: "품목코드", key: "itemCode", width: 200, align: "center" },
  { title: "품목명", key: "itemName", width: 200, align: "center" },
  { title: "단위", key: "unitOfContract", width: 200, align: "center" },
  { title: "납기일", key: "dueDateOfContract", width: 200, align: "center" },
  { title: "견적수량", key: "estimateAmount", width: 200, align: "center" },
  { title: "재고사용량", key: "stockAmountUse", width: 200, align: "center" },
  {
    title: "필요제작수량",
    key: "productionRequirement",
    width: 200,
    align: "center",
  },
  { title: "합계액", key: "sumPriceOfContract", width: 200, align: "center" },
  { title: "처리상태", key: "processingStatus", width: 200, align: "center" },
  {
    title: "작업완료여부",
    key: "operationCompletedStatus",
    width: 200,
    align: "center",
  },
  {
    title: "납품완료여부",
    key: "deliveryCompletionStatus",
    width: 200,
    align: "center",
  },
  { title: "비고", key: "description", width: 200, align: "center" },
];


const selectRow = async (item: any, row: any | any[]) => {
  // row가 배열인지 단일 객체인지 체크하여 배열로 변환
  const rows = Array.isArray(row) ? row : [row];

  console.log("Selected Row(s):", rows.map(r => r?.internalItem?.columns));
  rows.forEach(row => {
    console.log("Selected Row Index:", row.internalItem.index);
  });

  try {
    await Promise.all(rows.map(async (row) => {
      const selectedContractNo = row?.internalItem?.columns.contractNo;
      
      // Vue에서의 상태 관리 예시
      contractDetail.value = row.internalItem.columns;
      // selectData.value = row?.internalItem?.columns;

      // 선택된 contractNo에 해당하는 상세 정보 불러오기
      infodata1.value = await fetchData1(selectedContractNo);
    }));
  } catch (error) {
    console.error("Error selecting rows:", error);
  }
};


const fetchData = async () => {
  try {
    const searchCondition = "searchByDate";
    const customerCode = "no";

    //납품 가능한 수주 리스트 조회
    await salesStore().SEARCH_DELIVERABLE_CONTRACT_LIST(startDate.value, endDate.value, searchCondition, customerCode)

    return salesStore().deliverableContractListInfo;
  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
    return [];
  }
};

const fetchData4 = async () => {
  console.log("textFieldValue", textFieldValue._rawValue);
  try {
    const searchCondition = "searchByCustomer";
    const customerCode = textFieldValue._rawValue;
    //납품 가능한 수주 리스트 조회
    await salesStore().SEARCH_DELIVERABLE_CONTRACT_LIST(startDate.value, endDate.value, searchCondition, customerCode)

    return salesStore().deliverableContractListInfo;
  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
    return [];
  }
};

const fetchData1 = async (selectedContractNo: string) => {
  try {
    await salesStore().SEARCH_CONTRACT_DETAIL(selectedContractNo);
  
    infodata1.value = salesStore().contractDetailInfo;

    return salesStore().contractDetailInfo;
    
  } catch (error) {
    console.log("데이터 불러오기 에러:", error);
    return [];
  }
};

const fetchData2 = async () => {
  try {
    const searchCondition = "ALL";
    const workplaceCode = "";

    await companyStore().GET_CUSTOMER_LIST(searchCondition, workplaceCode);
   
    return  companyStore().customerInfo;
  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
    return [];
  }
};

const selectRow1 = (selected: any, row: { item: any; internalItem: { columns: string; }; }) => {
  try {
    console.log(selected);
    console.log(row.item);
    console.log("selected", selected);
    console.log("row", row.internalItem.columns);
    customerData.value = row.internalItem.columns;
  } catch (error) {
    console.error("Error selecting row:", error);
  }
};

const searchDate = async () => {
  // 시작일과 종료일 모두 선택하지 않은 경우
  if (!startDate.value || !endDate.value) {
    alert("시작일과 종료일을 선택해주세요!");
    return;
  }

  try {
    const response = await fetchData();
    infodata.value = response;
  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
  }
};

const searchDate1 = async () => {
  // 시작일과 종료일 모두 선택하지 않은 경우
  if (!startDate.value || !endDate.value) {
    alert("시작일과 종료일을 선택해주세요!");
    return;
  }

  // 고객사코드를 선택하지 않은 경우
  if (!textFieldValue.value) {
    alert("고객사코드를 선택해주세요!");
    return;
  }

  try {
    const response = await fetchData4();
    infodata.value = response;
  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
  }
};

watch(contractDetail, () => {
  console.log('contractDetail.value ', toRaw(contractDetail.value));
  console.log('contractDetail.value.contractDetailNo ', contractDetail.value.contractDetailNo);
})

watch(contractDetailNoList, () => {
  console.log('contractDetailNoList.value>>>> ', contractDetailNoList.value);})

                                                                                                             
watch(selectData, () => {
  console.log('selectData.value>>>> ', selectData.value)})

onMounted(() => {
  console.log('onMounted - contractDetail.value ', contractDetail.value.contractDetailNo);
  if(contractDetail.value == ""){
    console.log('null이당');
  }
})

const fetchData3 = async () => {
  console.log('infodata1.value>>>> ', infodata1.value);
  console.log('selectData.value>>>> ', selectData.value);
  

  selectData.value.map((item: ContractInfoTO) => {
  console.log("item", item);
  console.log("item.contractDetailTOList.length", item.contractDetailTOList.length > 0)
  // 각 객체의 contractDetailTOList 배열에서 첫 번째 객체의 contractDetailNo를 추출하여 반환
  if (item.contractDetailTOList.length > 0) {
    const contractDetailNo = item.contractDetailTOList[0].contractDetailNo;
    console.log("item.contractDetailTOList[0].contractDetailNo ", contractDetailNo);
    if (contractDetailNo !== undefined) {  // contractDetailNo가 undefined가 아닌지 확인
      contractDetailNoList.value.push(contractDetailNo);
    }
  }
});

console.log('contractDetailNoList.value>>>> ', typeof contractDetailNoList);
console.log('contractDetailNoList.value.length>>>> ', contractDetailNoList.value.length);

 
  try {
    if (contractDetailNoList.value.length < 1) {
      alert("납품할 수주 상세를 선택해주세요.");
      return;
    }
  
    await salesStore().ADD_DELIVERY(contractDetailNoList.value)
    const resMsg = salesStore().addDeliveryStatus
    //const { errorMsg } = response.data;

    if (resMsg === "SUCCESS") {
      alert("납품 성공하였습니다!");
      try {
        const response = await fetchData();
        infodata.value = response;
      } catch (error) {
        console.error("데이터 불러오기 에러:", error);
      }
    } else {
      alert(`납품 요청 실패:
      ${resMsg}`);
    }
    
  } catch (error) {
    console.error("납품 요청 에러:", error);
    alert(`납품 요청 에러: ${error.message}`);
  }
  selectData.value = [];
  infodata.value = [];
  contractDetailNoList.value = [];

};

const selectRow2 = (selected, row) => {
  try {
    console.log(selected);
    console.log(row.item);
    console.log("selected1", selected);
    console.log("row1", row.internalItem.columns);
    contractDetail.value = row.internalItem.columns;
    console.log("detail:", contractDetail);
  } catch (error) {
    console.error("Error selecting row:", error);
  }
};
</script>