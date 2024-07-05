<script setup lang="ts">
import { productionStore } from "@/store/logi/production";
import { salesStore } from "@/store/logi/sales";
import type { SalesPlanTO } from "@/types/logistic/sales/sales";
import axios from "axios";
import { VDataTable } from "vuetify/labs/VDataTable";

const startDate = ref("");
const endDate = ref("");
const item =ref([]);
const selectedItem = ref<SalesPlanTO>();

const headers = ref([
  { title: "판매계획번호", key: "salesPlanNo" },
  { title: "품목코드", key: "itemCode" },
  { title: "품목명", key: "itemName" },
  { title: "판매계획수량", key: "salesAmount" },
  { title: "계획단가 ", key: "unitPriceOfSales" },
  { title: "합계액", key: "sumPriceOfSales" },
  { title: "판매계획일", key: "salesPlanDate" },
  { title: "판매계획마감일", key: "dueDateOfSales" },
  { title: "MPS 계획일", key: "mpsPlanDate" },
  { title: "출하예정일", key: "scheduledEndDate" },
  { title: "MPS 적용", key: "mpsApplyStatus" },
  { title: "비고", key: "description" },
]);

watch([startDate, endDate], () => {
  console.log(startDate.value, endDate.value);
});


const getSalesPlanData = async () => {
  console.log('getSalesPlanData 메서드 안으로 들어옴.')
  if (startDate.value === "" || endDate.value === "") {
    alert("시작일 혹은 종료일을 선택해 주세요");
    return;
  }
   //선택된 데이터를 초기화 한다.
   selectedItem.value = undefined;
  try {
    salesStore().GET_SALES_PLAN_BY_DATE(startDate.value, endDate.value);
    console.log("salesPlan??? ", salesStore().salesPlanByDateList);
    item.value = salesStore().salesPlanByDateList;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log('item.value  ', item);
  
};

watch(item, () => {
  console.log('item ', item.value);
})

const isValid = (mpsData: any) => {
  console.log(mpsData);
  if (mpsData.mpsPlanDate === null) {
    alert("MPS 계획일자를 선택해 주세요");
    return false;
  } else if (mpsData.scheduledEndDate === null) {
    alert("출하 예정일을 선택해 주세요");
    return false;
  } else if (mpsData === "") {
    alert("수주 항목을 선택해 주세요");
    return false;
  }
  return true;
};

const saveSalesPlanMps = async () => {
  const mpsData = selectedItem.value;

  console.log("mpsData ", mpsData);
  const bool = confirm('등록하시겠습니까?')
  if(!bool)return;

  if (!isValid(mpsData)) return;

  // 선택된 데이터를 초기화 한다.
  selectedItem.value = undefined;
  try{
    console.log('SALES_PLAN_TO_MPS 전의 mpsData ', mpsData);
    if(mpsData){
    await productionStore().SALES_PLAN_TO_MPS(mpsData);
    }
  } catch (error) {
    console.error('err occurred at saveMpsData:', error);
  }
  
startDate.value = "";
endDate.value = "";
item.value = [];
console.log("contractToMps item.value!!!!" , item.value)
  
};

const selectedRow = (value, item) => {
  console.log(item.item, "item.item 가 머고");
  selectedItem.value = item.item;
  console.log("selectedItem.value는 또 먼데!!!!!!!!", selectedItem.value)
  
};

</script>

<template>
  <div class="gap"></div>
  <div class="page_wrapper">
    <div class="header_wrap">
      <div>
          <label class="startDate">판매계획 일자 선택 </label>
          <label class="endDate">  판매계획 마감일자 선택</label>
        </div>
      <input class="date" type="date" v-model="startDate" />
      <input class="date" type="date" v-model="endDate" />
      <v-btn class="btn_search" @click="getSalesPlanData"
        >MPS 등록가능 판매계획 조회</v-btn
      >
      <v-btn class="btn_insert" @click="saveSalesPlanMps">MPS 등록</v-btn>
    </div>

    <div class="gap"></div>
    <VDataTable
      :headers="headers"
      :items="item"
      :items-per-page="5"
      @click:row="selectedRow"
    >
      <template #item.mpsPlanDate="{ item }">
        <AppDateTimePicker
          v-model="item.mpsPlanDate"
          placeholder="MPS 계획일"
        />
      </template>

      <template #item.scheduledEndDate="{ item }">
        <AppDateTimePicker
          v-model="item.scheduledEndDate"
          placeholder="출하예정일"
        />
      </template>
    </VDataTable>
  </div>
</template>

<style scoped>
.page_wrapper {
  /* border: 1px solid red; */
}

.header_wrap {
  position: relative;
  width: auto;
  /* border: 3px solid orange; */
  height: fit-content;

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

.btn_search {
  border: none;
  width: 210px;
  height: 40px;
  border-radius: 3px;
}

.btn_insert {
  position: absolute;
  margin-left: 400px;
  right: 0px;
  border: none;
  width: 180px;
  height: 40px;
  border-radius: 3px;
}

.gap {
  height: 50px;
}

.endDate {
  margin-left: 40px;
}
</style>
