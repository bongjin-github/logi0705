<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import axios from "axios";
import MrpGatherResultModal from "./MrpGatherResultModal.vue";
import { productionStore } from "@/store/logi/production";

const item = ref([]);
const mpsNoList = ref([]);

const headers = ref([
  { title: "MRP번호", key: "mrpNo" },
  { title: "품목분류", key: "itemClassification" },
  { title: "품목코드", key: "itemCode" },
  { title: "품목명", key: "itemName" },
  { title: "요청일자", key: "orderDate" },
  { title: "소요일자", key: "requiredDate" },
  { title: "필요수량", key: "requiredAmount" },
  { title: "취합 적용상태", key: "ZmrpGatheringStatus" },
]);

const getMrpGatherList = async () => {
  const mrpGatheringStatusCondition = ''
//   const url =
//     "http://localhost:8282/logi/logistics/production/mrpGathering/getMrpList";
//   const params = { mrpGatheringStatusCondition: "" };

//   const res = await axios.get(url, { params: params });

  await productionStore().GET_MRP_LIST_URL(mrpGatheringStatusCondition)
  const res = productionStore().getMrpListData

  console.log(res.data.gridRowJson);
  const data = res.data.gridRowJson;
  const filteredList = data.filter(
    (item) => item.itemClassification === "원재료"
  );
  console.log(filteredList);
  item.value = filteredList;
};

getMrpGatherList();

watch([item], () => {
  const list = [];

  for (let i = 0; i < item.value.length; i++) {
    console.log(item.value[i].mrpNo);
    list.push(item.value[i].mrpNo);
    mpsNoList.value = list;
  }

  console.log("mpsNoList.value is : ", toRaw(mpsNoList.value));
});
console.log("mpsNoList.value is : ", toRaw(mpsNoList.value));

provide("mrpList", item);
provide("mpsNoList", mpsNoList);
</script>

<template>
  <div>
    <div class="header_wrap">
      <p style="font-weight: bold">
        품목구분이 <span class="span">원재료</span>인 경우 필요수량은
        <span class="span">구매(발주)</span>하여야 합니다.
      </p>
      <MrpGatherResultModal selectedTab="구매" @get-mrp-gather-list="getMrpGatherList"  />
      <p></p>
    </div>
    <VDataTable
      :hover="true"
      :headers="headers"
      :items="item"
      :items-per-page="5"
    >
    </VDataTable>
  </div>
</template>

<style scoped>
.header_wrap {
  position: relative;
}
.span {
  color: green;
}
</style>
