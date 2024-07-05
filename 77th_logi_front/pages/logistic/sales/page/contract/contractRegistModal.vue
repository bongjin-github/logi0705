<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue'

const propz = defineProps(['isDialogVisible', 'infodata', 'selectRow'])
const emits = defineEmits(['closeModal', 'modifyCom', 'updateData'])
const selectData = ref([])

const select = [
  { title: 'CT-01|수주일반', sortable: false, key: 'CT-01' },
  { title: 'CT-02|긴급수주', key: 'CT-02' },
]

// select all
watch(() => propz.infodata, (newValue, oldValue) => {
  console.log("propz.infodata changed: ", newValue);
});


watch(selectData, () => {
    console.log('selectData', selectData);
    console.log('selectData-length', selectData.length);
    })

const selectStatus = ref('')
const requester = ref('')

const closeModal = () => {
  emits('closeModal')
}

const openModal = () => {
  console.log('selectRow', propz.selectRow[0])

  const targetWarehouseCodes = propz.selectRow;

  console.log('selectRow', targetWarehouseCodes);
  console.log('infodata- length ', propz.infodata.length);

  // 배열을 사용하여 모든 선택된 행들을 필터링합니다.
  const targetObjects = propz.infodata.filter(obj => targetWarehouseCodes.includes(obj.estimateNo));

  console.log('modalselectRow', targetObjects);

  selectData.value = targetObjects
}

const modifyCom = () => {
  console.log('selectStatus', selectStatus)
  console.log('selectStatus.value.key:', selectStatus.value.key);
  console.log('requester', requester)

  // _rawValue를 사용하지 않고 key 값을 추출
  const Status = selectStatus.value.key;
  console.log("Status", Status);

  selectData.value.forEach(item => {
    item.contractStatus = Status;
    item.contractRequester = requester.value;
  });

  emits('modifyCom')

  const updatedInfodata = propz.infodata.map(data => {
  const matchingItem = selectData.value.find(item => item.estimateNo === data.estimateNo);
  if (matchingItem) {
    return {
      ...data,
      contractStatus: matchingItem.contractStatus,
      contractRequester: matchingItem.contractRequester,
      // 필요한 경우 다른 속성도 업데이트
    };
  }
  return data;
});

// propz.infodata를 업데이트된 배열로 교체
console.log('matchingItem ' , updatedInfodata);

emits('updateData', updatedInfodata);

// 변경 사항을 반영하기 위해 이벤트를 emit합니다.
emits('modifyCom');

}
</script>

<template>
  <VDialog
    v-model="propz.isDialogVisible"
    max-width="600"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        @click="openModal"
      >
        수주 수정
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard title="수주 수정">
      <VCardText>
        <VRow>
          <VCol
          v-if="selectData.length < 2"
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectData[0].estimateNo"
              label="견적 일련번호"
              placeholder="창고 코드"
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
            <AppCombobox
              v-model="selectStatus"
              :items="select"
              label="수주유형"
              clearable
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
          v-if="selectData.length < 2"
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectData[0].customerCode"
              label="거래처명"
              persistent-hint
              placeholder="거래처명"
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
            <div />
            <AppTextField
              v-model="requester"
              label="* 수주요청자"
              persistent-hint
              placeholder="수주요청자"
              clearable
            />
          </VCol>
        </VRow>

        <VRow>
          <VCol
          v-if="selectData.length < 2"
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectData[0].estimateDate"
              label="견적일자"
              persistent-hint
              placeholder="견적일자"
              disabled
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
          v-if="selectData.length < 2"
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectData[0].effectiveDate"
              label="유효일자"
              persistent-hint
              placeholder="유효일자"
              disabled
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
          v-if="selectData.length < 2"
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectData[0].estimateRequester"
              label="견적담당자명"
              persistent-hint
              placeholder="견적담당자명"
              disabled
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
          v-if="selectData.length < 2"
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="selectData[0].description"
              label="비고"
              persistent-hint
              placeholder="비고"
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
</template>
