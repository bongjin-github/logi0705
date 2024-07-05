
<script lang="ts" setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { defineEmits, defineProps, ref, watch } from 'vue'

import axios from 'axios'
import { companyStore } from '@/store/hr/company';
import { baseStore } from '@/store/logi/base';
import { salesStore } from '@/store/logi/sales';

//78th 추가 기능구현

const propz = defineProps(['responseEstimateList', 'selectEstimate','searchDate','fetchData'])
const emits = defineEmits(['modifyCom'])


const isDialogVisible = ref(false);
const showWarningAlert = ref(false);

const estimateNo = ref('')  //견적일련번호
const customerCode = ref('')  //거래처코드드
const estimateDate = ref('')  //견적일자
const estimateRequester = ref('') //견적요청자
const effectiveDate = ref('') //기존 유효기간
const newEffectiveDate = ref<string>('')  // 새로운유효기간
const newDescription = ref('') //비고
const unitOfEstimate = ref('')  //단위
const dueDateOfEstimate = ref('') //납기일
const itemCode = ref('')  //품목코드
const itemName = ref('')  //품목명
const newCustomer = ref('')
//견적 수량, 단가 및 합계액
const newEstimateAmount = ref(0);
const newUnitPriceOfEstimate = ref(0)
const newSumPriceOfEstimate = ref(0)


const selectData = ref([])
const selectDetailData =ref([])

//납기일
const newDueDate = ref<string>('')
//api로 불러온 거래처코드
const customerList = ref([])
//api로 불러온 품목코드
const detailCodes = ref([])
// //제품 코드 선택하면 자동으로 품목명 가져오기
const detailCodeList = ref([]);
const selectedCode = ref("");
const selectedName = ref("");

const estimateTO = ref({})
const modifyEstimate = ref([]);


//모달창 닫기
const closeModal = () => {
  isDialogVisible.value = false
}

//모달창 수정완료
const modifyCom = async() => {
  try{
    const userConfirmed = window.confirm('수정하시겠습니까?')
    if(userConfirmed){
  const estimateTO ={
    estimateNo: estimateNo.value, //견적일련번호
    newCustomer: newCustomer.value, //거래처코드
    estimateDate: estimateDate.value, //견적일자
    estimateRequester: estimateRequester.value, //견적요청자
    newEffectiveDate: newEffectiveDate.value, //유효일자
    newDescription: newDescription.value, //비고
    itemCode: selectedCode.value, //품목코드
    itemName: selectedName.value, //품목명
    unitOfEstimate: "EA", //단위
    contractStatus: 'N', //수주여부
    newDueDate: newDueDate.value, // 납기일
    newEstimateAmount: newEstimateAmount.value, //수량
    newUnitPriceOfEstimate: newSumPriceOfEstimate.value, //단가
    newSumPriceOfEstimate: newSumPriceOfEstimate.value, //합계
    
    }
    console.log('estimateTO 는 뭐야?????????', estimateTO)
    await salesStore().PUT_MODIFY_ESTIMATE_URL(estimateTO)
    alert('견적이 성공적으로 수정되었습니다.')
      //모달창 닫기
      isDialogVisible.value = false

      // propz.fetchData() 이렇게하며 ㄴ되야 하는거 아니냐고1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!왜 안돼냐고 tl qk
      //emits('modifyCom')  // 이벤트 발송
      
    }
  }catch (error) {
      console.error('데이터 가져오기 에러:', error);
      alert('견적 수정에 실패했습니다.')
    }
    
}

const openModal = () => {
  if (!propz.selectEstimate || Object.keys(propz.selectEstimate).length === 0) {
    // 행을 선택하지 않았을 때
    showWarningAlert.value = true; // alert 보임 
    isDialogVisible.value = false; // Dialog를 감춤
  } else {
    try{
      showWarningAlert.value = false; // alert 감춤 
      isDialogVisible.value = true; // Dialog를 보임

      //부모로부터 받아온 견적정보
      console.log('selectEstimate', propz.selectEstimate.estimateNo)
      //부모로부터 받아온 견적들에 대한 정보
      // console.log('responseEstimateList', propz.responseEstimateList)

      //부모로부터 받아온 props를 통해 견적일련번호 뽑아옴
      const targetEstimateNo = propz.responseEstimateList.find((obj: { estimateNo: string }) => obj.estimateNo === propz.selectEstimate.estimateNo)
      console.log('targetEstimateNo는 뭐지?' , targetEstimateNo)

      selectData.value = targetEstimateNo
      selectDetailData.value = targetEstimateNo.estimateDetailTOList[0]

      estimateNo.value = selectData.value.estimateNo
      newCustomer.value = selectData.value.customerCode
      estimateDate.value = selectData.value.estimateDate
      estimateRequester.value = selectData.value.estimateRequester
      newEffectiveDate.value = selectData.value.effectiveDate
      newDescription.value = selectData.value.description
      unitOfEstimate.value = selectDetailData.value.unitOfEstimate
      newDueDate.value = selectDetailData.value.dueDateOfEstimate
      selectedCode.value = selectDetailData.value.itemCode
      selectedName.value = selectDetailData.value.itemName
      newEstimateAmount.value = selectDetailData.value.estimateAmount
      newUnitPriceOfEstimate.value = selectDetailData.value.unitPriceOfEstimate
      newSumPriceOfEstimate.value = selectDetailData.value.sumPriceOfEstimate    
    }catch{
      console.error('데이터 가져오기 에러:', Error);
      propz.responseEstimateList.value = [];
    }
  }
}



//유효기간 바꾸기
const onEffectiveDateChange = (newEffDate: string) => {
  console.log('새로운 유효기간~?:', newEffDate);
  return newEffectiveDate.value = newEffDate
};

//납기일 바꾸기
const onDueDateChange = (newDate: string) => {
  console.log('새로운 납기일~?:', newDate);
  return newDueDate.value = newDate
};

//견적수량 바꾸기
const onEstimateAmountChange = (newAmount: number) => {
  console.log('새로운 견적수량~?:', newAmount);
  return newEstimateAmount.value = newAmount
};

//거래처 바꾸기
const onEstimateDescriptionChange = (newCustomer: string) => {
  console.log('새로운 거래처~?:', newCustomer);
  return newCustomer = newCustomer
};

//비고 바꾸기
const onEstimateCustomerCodeChange = (newDescription: string) => {
  console.log('새로운 비고~?:', newDescription);
  return newDescription = newDescription
};


//유효기간 변경되는지 확인하기 위함
watch(newEffectiveDate, async (newValue, oldValue) => {
    console.log("새로운 유효기간 : " + newEffectiveDate.value);
  if (newValue !== oldValue) {
    await onEffectiveDateChange(newValue);
  }
})

//납기일 변경되는지 확인하기 위함
watch(newDueDate, async (newValue, oldValue) => {
    console.log("새로운 납기일 : " + newDueDate.value);
  if (newValue !== oldValue) {
    await onDueDateChange(newValue);
  }
})


//수량 변경되는지 확인하기위함
watch(newEstimateAmount, async (newValue, oldValue) => {
  // console.log('기존 견적 수량 oldValue', oldValue)
  // console.log('새로운 견적 수량 newValue', newValue)
    console.log("새로운 견적수량 : " + newEstimateAmount.value);
})

//품목코드 선택하면 품목명 변경되는지 확인하기 위함
watch(selectedCode, async (newValue, oldValue) => {
    console.log("selectedCode" + selectedCode.value);
    console.log("selectedCode-new" + newValue);
      // console.log("selectedCode-old" + oldValue);

    await getUnitPrice();
  if (newValue !== oldValue) {
    await onItemCodeChange();
  }
});

//합계액 변경되는지 확인하기 위함
watch([newEstimateAmount, newUnitPriceOfEstimate], () => {
  if(newEstimateAmount.value && newUnitPriceOfEstimate.value){
   newSumPriceOfEstimate.value = newEstimateAmount.value * newUnitPriceOfEstimate.value
  console.log('합계액 변하니?',newSumPriceOfEstimate)}
});

//거래처조회
const getCorrespondent = async () =>{
  try {
    const searchCondition = "ALL";
    const workplaceCode = "BRC-01";

    await companyStore().GET_CUSTOMER_LIST(searchCondition,workplaceCode)

    const response = companyStore().customerInfo
    
    const customerList = response.map((item: any) => ({
      title: item.customerName, // UI에 표시됨
      value: item.customerCode, // 저장되는 값 (code)
    }));

    console.log("거래처명:", customerList);

    return customerList;

  } catch (error) {
    console.error("거래처 불러오기 에러:", error);
    return [];
  }
}

// 품목코드 리스트 가져오기
const getProductionList = async () => {
  try {
    //api로 불러온 제품리스트
    const divisionCode = "IT-_I"
    await baseStore().GET_CODELIST(divisionCode)
    detailCodeList.value = baseStore().detailCodeList
    console.log('detailCodeList>>>>>>>>>>', detailCodeList.value)

    const response = baseStore().detailCodeList
    detailCodes.value = response.map((item: any) => item.detailCode);

    console.log("품목코드 목록:", detailCodes.value);

    return detailCodes.value;
  } catch (error) {
    console.error("품목코드 리스트 가져오기 에러:", error);
    return [];
  }
};

// 품목코드를 선택하면 해당 데이터의 품목명이 품목명에 나오게 하기
//78th
//처음엔 bind익셉션이 터져서 익셉션이 안뜨게끔만 막아놓은 상태
//처음 selectedItem가 undefined 이다.
//품목코드를 선택하면 단가가 들어오기 때문에 처음 모달창이 뜰때 null값이 들어온다.....
const onItemCodeChange = () => {
    const selectedItem = detailCodeList.value.find(
      (item: { detailCode: string; }) =>
        // console.log('for문안에 있는 item: ', item)
      item.detailCode=== selectedCode.value
    );
    console.log("selectedItem:", selectedItem);

    if (selectedItem) {
      selectedName.value = selectedItem.detailCodeName;
      console.log("선택된 품목명:", selectedItem.detailCodeName);
    } else {
      console.log("해당 품목을 찾을 수 없음");
      selectedName.value = ""; // 품목명 초기화
    }
};

//제품단가 가져오기
const getUnitPrice = async () => {
  try{
  await salesStore().GET_UNITPRICE(selectedCode.value)
  newUnitPriceOfEstimate.value = salesStore().unitPriceOfEstimate;
  }catch (error) {
    console.error("제품단가 가져오기 에러:", error);
  }
}

onMounted(async () => {
  customerList.value = await getCorrespondent()

  detailCodes.value = await getProductionList()
})


</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="600"
    persistent
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        @click="openModal"
      >
        견적 수정
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard title="견적 수정">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectData.estimateNo"
              label="견적 일련번호"
              placeholder="견적 일련번호"
              disabled
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppSelect
            :items="customerList"
              v-model="newCustomer"
              label="거래처코드"
              placeholder='거래처코드'
            />
          </VCol>
        </VRow>

        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectData.estimateDate"
              label="견적일자"
              disabled
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="estimateRequester"
              label="견적요청자"
              placeholder="견적요청자"
              disabled
            />
          </VCol>
        </VRow>

        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppDateTimePicker
              v-model="newEffectiveDate"
              label="유효일자"
              placeholder="유효일자"
              clearable
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="newDescription"
              label="비고"
              placeholder="비고"
              clearable
            />
          </VCol>
        </VRow>

                <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppSelect
            :items="detailCodes"
              v-model="selectedCode"
              @change="onItemCodeChange"
              label="품목코드"
              placeholder="품목코드"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectedName"
              label="품목명"
              placeholder="품목명"
              disabled
            />
          </VCol>
        </VRow>

                <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectDetailData.unitOfEstimate"
              label="단위"
              placeholder="단위"
              disabled
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppDateTimePicker
              v-model="newDueDate"
              label="납기일"
              placeholder="납기일"
            />
          </VCol>
        </VRow>

                <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="newEstimateAmount"
              label="견적수량"
              placeholder="견적수량"
              clearable
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="newUnitPriceOfEstimate"
              label="견적단가"
              placeholder="견적단가"
            />
          </VCol>
        </VRow>

                <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="newSumPriceOfEstimate"
              label="합게액"
              placeholder="합게액"
              disabled
            />
          </VCol>
        </VRow>

      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="closeModal"
        >
          취소
        </VBtn>
        <VBtn @click="modifyCom">
          수정 완료
        </VBtn>
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
