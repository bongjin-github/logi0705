import { defineStore } from 'pinia'
import {
  getCustomerList
} from '@/api/hr/company'

export const companyStore = defineStore('companyStore', {
  state: () => ({
    customerInfo: [] as any, // 거래처 리스트
  }),
  actions: {
    // 거래처 리스트 조회
    async GET_CUSTOMER_LIST(searchCondition: string, workplaceCode: string) {
      try {
        const res = await getCustomerList(searchCondition, workplaceCode)

        console.log('Response', res)
        console.log('Response.data', res.data)

        this.customerInfo = res.data.customerList
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    },

  },
})
