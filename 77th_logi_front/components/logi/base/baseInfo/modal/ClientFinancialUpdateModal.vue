<script lang="ts" setup>
import axios from 'axios'
import { defineProps, ref, watch } from 'vue'
import { baseStore } from '@/store/logi/base'

const props = defineProps(['isUpdateDialogVisible', 'selecteditem', 'search'])
const emit = defineEmits(['closeUpdateModal', 'saveUpdateClient'])

const accountAssociatesCode = ref('')
const workplaceCode = ref('')
const accountAssociatesName = ref('')
const accountAssociatesType = ref('')
const accountNumber = ref('')
const accountOpenPlace = ref('')
const cardNumber = ref('')
const cardType = ref('')
const cardMemberName = ref('')
const cardOpenPlace = ref('')
const businessLicenseNumber = ref('')
const financialInstituteCode = ref('')
const financialInstituteName = ref('')
const divisionCodeNo = ref('')

const closeUpdateModal = () => {
  emit('closeUpdateModal')
}

const fetchData = async (code: string) => {
  console.log('1111111', code)

  await baseStore().GET_FINANCE_DETAIL_INFO(code)
  const res = baseStore().FinanceDetailInfo

  console.log('FinanceDetailInfo', res)

  accountAssociatesCode.value = res.accountAssociatesCode
  workplaceCode.value = res.workplaceCode
  accountAssociatesName.value = res.accountAssociatesName
  accountAssociatesType.value = res.accountAssociatesType
  accountNumber.value = res.accountNumber
  accountOpenPlace.value = res.accountOpenPlace
  cardNumber.value = res.cardNumber
  cardType.value = res.cardType
  cardMemberName.value = res.cardMemberName
  cardOpenPlace.value = res.cardOpenPlace
  businessLicenseNumber.value = res.businessLicenseNumber
  financialInstituteCode.value = res.financialInstituteCode
  financialInstituteName.value = res.financialInstituteName
  divisionCodeNo.value = res.divisionCodeNo
}

watch(() => props.selecteditem, async () => {
  console.log('ttttttttttttttttttttttt')
  await fetchData(props.selecteditem)
},
)

// 수정 로직
const saveUpdateClient = async () => {
  try {
    const clientdata
    = {
      accountAssociatesCode: accountAssociatesCode.value,
      workplaceCode: workplaceCode.value,
      accountAssociatesName: accountAssociatesName.value,
      accountAssociatesType: accountAssociatesType.value,
      accountNumber: accountNumber.value,
      accountOpenPlace: accountOpenPlace.value,
      cardNumber: cardNumber.value,
      cardType: cardType.value,
      cardMemberName: cardMemberName.value,
      cardOpenPlace: cardOpenPlace.value,
      businessLicenseNumber: businessLicenseNumber.value,
      financialInstituteCode: financialInstituteCode.value,
      financialInstituteName: financialInstituteName.value,
      divisionCodeNo: divisionCodeNo.value,
    }

    await baseStore().UPDATE_FINANCE_CLIENT_INFO(clientdata)

    props.search()

    closeUpdateModal()
  }
  catch (error) {
    console.error('데이터 수정 오류:', error)
  }
}
</script>

<template>
  <VDialog
    v-model="props.isUpdateDialogVisible"
    max-width="600"
  >
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        style="margin-right: 20px;"
      >
        금융거래처 수정
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard title="금융거래처 수정">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="accountAssociatesCode"
              label="금융거래처코드"
              disabled
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="workplaceCode"
              label="사업장코드"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="accountAssociatesName"
              label="금융거래처명"
              persistent-hint
            />
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="accountAssociatesType"
              label="금융거래처유형"
            />
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="accountNumber"
              label="계좌번호"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="accountOpenPlace"
              label="계좌개설점"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="cardNumber"
              label="카드번호"
            />
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="cardType"
              label="카드구분"
            />
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="cardMemberName"
              label="카드회원명"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="cardOpenPlace"
              label="카드가맹점번호"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="businessLicenseNumber"
              label="사업자등록번호"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="financialInstituteCode"
              label="금융기관코드"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="financialInstituteName"
              label="금융기관명"
            />
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="divisionCodeNo"
              label="구분"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="closeUpdateModal"
        >
          Close
        </VBtn>
        <VBtn @click="saveUpdateClient">
          Save
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
