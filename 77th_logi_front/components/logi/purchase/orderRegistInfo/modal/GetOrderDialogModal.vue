<script lang="ts" setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { purchaseStore } from '@/store/logi/purchase'
import { defineProps, defineEmits, ref, toRaw } from "vue";
import axios from 'axios';
import { companyStore } from '@/store/hr/company';

const isDialogVisible = ref(false);
const number = ref('');
const infodata = ref([]);
const clientdata = ref([]);
const selectedCustomer = ref("");


//부모 컴포넌트에서 받아온 데이터, 
const propz = defineProps(['selectData']);
const emits = defineEmits(['initializeInfodata']);


watch(selectedCustomer, () => {
  console.log("selectedCustomer - child: " , selectedCustomer);
})
// selectData가 변경될 때마다 감지
watchEffect(() => {
//   const mrpGatheringNoList = toRaw(propz.selectData).map(item => item.mrpGatheringNo);
  const mrpGatheringNoList = toRaw(propz.selectData).map((item: { mrpGatheringNo: string }) => item.mrpGatheringNo);
  const mrpNoList = mrpGatheringNoList.join(',');
  console.log("selectData 변경:", mrpNoList);
});

const getOrderDialogHeaders = [
  { title: '품목코드', key: 'itemCode'},
  { title: '품목명', key: 'itemName'},
  { title: '단위', key: 'unitOfMrp' },
  { title: '총발주필요량', key: 'requiredAmount' },
  { title: '사용가능재고량', key: 'stockAmount' },
  { title: '실제발주필요량', key: 'calculatedRequiredAmount' },
  { title: '단가', key: 'standardUnitPrice' },
  { title: '합계금액', key: 'sumPrice' },
]

const initializeInfodata = () => {
  emits('initializeInfodata');
};

const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// 거래처명 리스트 가져오기
// 고객 데이터를 가져오는 기존 fetchData 함수
const fetchData = async () => {
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

    clientdata.value = customerList;

    return customerList;

  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
    return [];
  }
};

// 선택된 거래처명 변경 시 호출되는 함수
const onSelectedCustomerChange = (newValue: string) => {
  selectedCustomer.value = newValue;
};

onMounted(async () => {
  clientdata.value = await fetchData();
});

//모의재고처리 및 취합발주 클릭 
const showOrderDialogClick = async () => {
    const selectData = toRaw(propz.selectData);

    if (!selectData || selectData.length === 0) {
        // mrpNoList가 비어있을 때 알림창 띄우기
        alert("취합발주 할 행을 선택해주세요!");
        isDialogVisible.value = false;
        return;
    }

    // 부모 데이터에서 mrpNoList 객체 뽑기
    // const mrpGatheringNoList = selectData.map(item => item.mrpGatheringNo);
    const mrpGatheringNoList = toRaw(propz.selectData).map((item: { mrpGatheringNo: string }) => item.mrpGatheringNo);
    const mrpNoList = mrpGatheringNoList.join(',');
    console.log("들어오니?", mrpNoList);

    isDialogVisible.value = true;
    number.value = getCurrentDate(); // 현재일자를 가져와서 실행

    try {
        await purchaseStore().FETCH_SHOW_ORDER_DIALOG(mrpNoList);
        infodata.value = [];
        infodata.value = purchaseStore().ShowOrderDialog;

    } catch (error) {
        console.error('데이터 가져오기 에러:', error);
        return [];
    }
};


//현재 전개된 결과 발주 및 재고처리 클릭 
const orderAndInvBtnClick = async () => {
    try {
       //부모 데이터에서 mrpNoList 객체 뽑기
       //const mrpGatheringNoList = toRaw(propz.selectData).map(item => item.mrpGatheringNo);
       const mrpGatheringNoList = toRaw(propz.selectData).map((item: { mrpGatheringNo: string }) => item.mrpGatheringNo);
       const mrpNoList = mrpGatheringNoList.join(',');
       console.log("mrpNoList: ", mrpNoList);
       console.log("mrpGatheringNoList: ", mrpGatheringNoList);
       console.log("됬나 안됬나 !!");
       await purchaseStore().FETCH_ORDER_AND_INV(mrpNoList);
       
       const res = await axios.post("http://localhost:8282/logi/purchase/getInfoForSlip", mrpGatheringNoList);
       //const data = res.data;  // Assuming the response data is in `res.data`
       const orderSlipTOList = res.data.orderSlipTOList;
       const customerCode = selectedCustomer.value;
      //  const response = await axios.post("http://localhost:8282/hr/server/webclient/order", 
      //   {
      //       orderSlipTOList,
      //       customerCode
      //   });

        const response = await axios.post("http://localhost:8282/hr/server/rest/order", 
        {
            orderSlipTOList,
            customerCode
        });


       //console.log(data);  // Logs the entire array of objects

      // If you want to inspect each object individually
       res.data.orderSlipTOList.forEach((item: any, index: number) => {
          console.log(`Object ${index + 1}:`, item);
       });

       console.log("restTemplate결과: " + response.data.errorMsg);
      infodata.value = purchaseStore().OrderAndInv;

       // VDataTable 갱신
       const newMrpGatheringNoList = toRaw(propz.selectData).map((item: { mrpGatheringNo: string }) => item.mrpGatheringNo);
       const newMrpNoList = newMrpGatheringNoList.join(',');

       await purchaseStore().FETCH_SHOW_ORDER_DIALOG(newMrpNoList);
       infodata.value = purchaseStore().ShowOrderDialog;
       
     
       // 발주 성공 혹은 실패 alert 띄우기
       alert(response.data.errorMsg);

      // 발주 후 데이터 모두 초기화
       initializeInfodata();
       selectedCustomer.value = "";
       infodata.value = [];
       
       // 다이얼로그 창 닫기
       isDialogVisible.value = false;       
        
        } catch (error) {
        console.error('데이터 가져오기 에러:', error);
        return [];
     }
};


</script>

<template>
    <VDialog v-model="isDialogVisible" width="1100">
        <!-- Activator -->
        <template #activator="{ props }">
            <VBtn 
                v-bind="props"
                class="button"
                color="primary" 
                @click="showOrderDialogClick" 
                >모의재고처리 및 취합발주 
            </VBtn>
           
        </template>

        <!-- Dialog Content -->
      
        <VCard>
            <VCardTitle>모의재고처리 및 취합발주</VCardTitle>
            
            <VCardText>
              <VRow>
            <VCol cols="12" sm="6" md="2">
                    <AppSelect
                      class="mb-3"
                      label="거래처명"
                      :items="clientdata"
                      v-model="selectedCustomer"
                      item-text="title"
                      item-value="value"
                      variant="outlined"
                      @change="onSelectedCustomerChange"
                    />
                  </VCol>
                </VRow>
                <VRow>
                 <VCol cols="12" sm="6" md="2">
                    <VTextField 
                        v-model="number" 
                        label="발주등록일자" 
                        readonly
                        />
                    </VCol>
                    

                    <VCol cols="12" sm="6" md="10">
                        <VBtn 
                            color="primary" 
                            @click="orderAndInvBtnClick"
                            >현재 전개된 결과 발주 및 재고처리 
                        </VBtn>
                    </VCol>

                </VRow>
                

                <VSpacer></VSpacer>

                <VDataTable 
                  :headers="getOrderDialogHeaders"
                  :items="infodata" 
                  :items-per-page="10"
                   style="margin-top: 20px;"
                />

           </VCardText>
        </VCard>
    </VDialog>
</template>

<style>
.button{
 margin-right:20px;
}
</style>
