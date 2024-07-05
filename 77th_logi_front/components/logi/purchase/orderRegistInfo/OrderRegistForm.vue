<script lang="ts" setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { ref } from 'vue';
import { purchaseStore } from '@/store/logi/purchase'
import OptionOrderModal from './modal/OptionOrderModal.vue'
import GetOrderDialogModal from './modal/GetOrderDialogModal.vue'

const startDate = ref("");
const endDate = ref("");
const infodata = ref([]);
const selectData = ref([]);

const getOrderListHeaders = [
  { title: '소요량취합번호', sortable: false, key: 'mrpGatheringNo', width: 180 },
  { title: '품목코드', key: 'itemCode', width: 100 },
  { title: '품목명', key: 'itemName', width: 150 },
  { title: '단위', key: 'unitOfMrp', width: 100 },
  { title: '필요수량', key: 'requiredAmount', width: 100 },
  { title: '현재고량', key: 'stockAmount', width: 100 },
  { title: '발주기한', key: 'orderDate', width: 150 },
  { title: '입고기한', key: 'requiredDate', width: 150 },
]


//재고처리 및 발주조회      
const getOrderListClick = async () => {
  try {
    // 날짜가 입력되지 않았을 경우
    if (!startDate.value || !endDate.value) {
    alert('시작일과 종료일을 입력해주세요.');
    return;
    }

    await purchaseStore().FETCH_SEARCH_ORDERLIST( startDate.value , endDate.value );    
    infodata.value = purchaseStore().SearchOrderList;
  
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const initializeInfodata = () => {
  startDate.value = '';
  endDate.value = '';
  infodata.value = [];
}

</script>

<template>
  <VCard>
    <VCardText>
      <div class="button-container">

        <!-- 모의재고처리 및 취합발주 버튼 -->
        <GetOrderDialogModal 
          :selectData="selectData"
          @initializeInfodata = "initializeInfodata"
        />

        <!-- 임의발주 버튼 -->
        <OptionOrderModal 
          :selectData="selectData"
        />

        <div class="date-picker-container">
          <VCol cols="6">
            <AppDateTimePicker 
              v-model="startDate" 
              class="mb-5" 
              label="시작일" 
              placeholder="YYYY-MM-DD" 
            />
          </VCol>
        
          <VCol cols="6">
            <AppDateTimePicker 
              v-model="endDate" 
              class="mb-5"  
              label="종료일" 
              placeholder="YYYY-MM-DD"
            />
          </VCol>

          <!-- 재고처리/발주필요 목록조회 -->
          <VBtn 
            class="button2"
            color="primary" 
            @click="getOrderListClick"
          >
            재고/발주목록 조회 
          </VBtn>
        </div>
      </div>
      
      <VDataTable
        v-model="selectData"
        :headers="getOrderListHeaders" 
        :items="infodata" 
        :items-per-page="10"
        item-value="mrpGatheringNo"
        return-object
        show-select 
      />
    </VCardText>
  </VCard>
</template>

<style scoped>
.button-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.date-picker-container {
  display: flex;
  gap: 20px;
}

.button2 {
  margin-top: 25px;
}

.mb-5 {
  margin-bottom: 30px;
}

.mb-3 {
  margin-bottom: 15px;
}
</style>