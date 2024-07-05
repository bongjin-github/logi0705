<script lang="ts" setup>
import { baseStore } from '@/store/logi/base';
import { outputStore } from '@/store/logi/output'

const props = defineProps(['selecteditem', 'contractDetailData'])
const emit = defineEmits(['search'])

const isDialogVisible = ref(false)
const contractNo = ref('')
const requestDate = ref('')
const dueDate = ref('')
const expectedArrivalDate = ref('')
const customerName = ref('')
const itemName = ref('')
const requestPerson = ref('')
const requestQuantity = ref('')
const standard = ref('')
const warehouseCode = ref('')
const inspection = ref('')
const wareInfo=ref([]);

watch(isDialogVisible, () => {
  console.log('11111111', props.contractDetailData[0].itemName)
  console.log('2222222222', props.selecteditem.contractNo)
  contractNo.value = props.selecteditem.contractNo
  customerName.value = props.selecteditem.customerName
  itemName.value = props.contractDetailData[0].itemName
  requestDate.value = props.selecteditem.requestDate
  dueDate.value = props.contractDetailData[0].dueDateOfContract
  expectedArrivalDate.value = ''
  standard.value = ''
  warehouseCode.value = ''
  requestPerson.value = ''
  requestQuantity.value = props.selecteditem.requestQuantity
  inspection.value = '검사'
})

const Add = async () => {
  console.log('123234', dueDate.value)
  const addData = {
    contractNo: contractNo.value,
    customerName: customerName.value,
    itemName: itemName.value,
    requestDate: requestDate.value,
    dueDate: dueDate.value,
    expectedArrivalDate: expectedArrivalDate.value,
    standard: standard.value,
    warehouseCode: warehouseCode.value,
    requestPerson: requestPerson.value,
    requestQuantity: requestQuantity.value,
    inspection: inspection.value,
  }

  console.log('addData', addData)

  await outputStore().ADD_OUTPUT_INFO(addData)

  emit('search')

  isDialogVisible.value = false
}


// 지점조회
const getWareHouseList=async()=>{
  await baseStore().GET_WAREHOUSE_LIST();
  const response = baseStore().getWarehouseList;
  wareInfo.value = response.map((item: any) => ({
      title: item.warehouseName, // UI에 표시됨
      value: item.warehouseCode, // 저장되는 값 (code)
    }));
  console.log("workplaceList.value!!!!" , wareInfo.value)
}

onMounted(async () => {
  await getWareHouseList();
});
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="600"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        style="margin-right: 10px;"
      >
        출고등록
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="출고 등록">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="contractNo"
              label="수주일련번호"
              disabled
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="customerName"
              label="거래처명"
              disabled
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="itemName"
              label="품목명"
              disabled
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="requestDate"
              type="date"
              label="등록일자"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="dueDate"
              type="date"
              label="납기일"
              disabled
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppSelect
              v-model="warehouseCode"
              :items="wareInfo"
              label="지점구분"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="requestPerson"
              label="출고담당자"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="requestQuantity"
              label="출고수량"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isDialogVisible = false"
        >
          Close
        </VBtn>
        <VBtn @click="Add">
          Add
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
