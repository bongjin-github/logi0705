import { defineStore } from 'pinia'
import {
  getUnitPriceOfEstimate,
  addNewEstimates,
  getEstimateContractInfo,
  getEstimateDetail,
  addNewContract,
  getContract,
  getContractDetail,
  getSalesPlan,
  getDeliverableContractList,
  addDelivery,
  getSalesPlanByDate
} from '@/api/logi/sales'

export const salesStore = defineStore('salesStore', {
  state: () => ({
    unitPriceOfEstimate: 0 as number, 
    estimateContractInfo: [] as any, 
    estimateDetailInfo: [] as any,
    contractInfo: [] as any, 
    contractDetailInfo: [] as any, // 행사정보
    salesPlanInfo: [] as any,
    deliverableContractListInfo: [] as any,
    addDeliveryStatus: '' as string,
    salesPlanByDateList: [] as any,
    addContractStatus: '' as string
  }),
  actions: {
    // 제품 단가 조회
    async GET_UNITPRICE(itemCode: string) {
      try {
        const res = await getUnitPriceOfEstimate(itemCode)

        console.log('Response', res)
        console.log('Response.data', res.data)

        this.unitPriceOfEstimate = res.data.unitPriceOfEstimate
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    },
   // 견적 추가
   async ADD_NEW_ESTIMATE(newEstimateInfo: object) {
    try {
      const res = await addNewEstimates(newEstimateInfo)

      console.log('Response', res)
      console.log('Response.data', res.data)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

   // 판매계획 조회
   async GET_SALES_PLAN_BY_DATE(startDate: string, endDate: string) {
    try {
      console.log('GET_SALES_PLAN_BY_DATE:', startDate,endDate)
      const res = await getSalesPlanByDate(startDate,endDate)
      this.salesPlanByDateList = res.data.gridRowJson
      console.log('Response', res)
      console.log('Response.data', res.data)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

 

  // 등록된 견적 조회
  async GET_ESTIMATE_CONTRACT_INFO(startDate: string, endDate: string) {
    try {
      const res = await getEstimateContractInfo(startDate,endDate)

      console.log('Response', res)
      console.log('Response.data', res.data)

      this.estimateContractInfo = res.data.gridRowJson
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

   //견적 상세 조회
   async SEARCH_ESTIMATE_DETAIL(estimateNo: string) {
    try {
      const res = await getEstimateDetail(estimateNo)
      this.estimateDetailInfo = res.data.gridRowJson

      console.log('Response', res)
      console.log('Response.data', res.data)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

  // 수주 추가
  async ADD_NEW_CONTRACT(newContractTO: object) {
    try {
      const res = await addNewContract(newContractTO)
      this.addContractStatus = res.data.errorMsg
      // console.log('Response', res)
      // console.log('Response.data', res.data)
      console.log('Response.data.errorMsg???', res.data.errorMsg)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

  // 수주 조회
  async SEARCH_CONTRACT(searchCondition: string, customerCode: string, startDate: string, endDate: string) {
    try {
      const res = await getContract(searchCondition,customerCode, startDate, endDate)
      this.contractInfo = res.data.gridRowJson

      console.log('Response', res)
      console.log('Response.data', res.data)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

  // 수주 상세 조회
  async SEARCH_CONTRACT_DETAIL(contractNo: string) {
    try {
      const res = await getContractDetail(contractNo)
      this.contractDetailInfo = res.data.gridRowJson

      console.log('Response', res)
      console.log('Response.data', res.data)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

  //판매계획 조회
  async SEARCH_SALES_PLAN() {
    try {
      const res = await getSalesPlan()
      this.salesPlanInfo = res.data

      console.log('Response', res)
      console.log('Response.data', res.data)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

  //납품가능한 수주 리스트 조회
  async SEARCH_DELIVERABLE_CONTRACT_LIST(startDate: string, endDate: string, searchCondition: string, customerCode: string) {
    try {
      const res = await getDeliverableContractList(startDate, endDate, searchCondition, customerCode)
      this.deliverableContractListInfo = res.data.gridRowJson

      console.log('Response', res)
      console.log('Response.data', res.data)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  },

  //납품 추가
  async ADD_DELIVERY(contractDetailNo: object) {
    // console.log("ADD_DELIVERY contractDetailNo?????? ", contractDetailNo);
    try {
      const res = await addDelivery(contractDetailNo);

      console.log('Response', res)
      console.log('Response.data', res.data)

      const { errorMsg } = res.data;
      this.addDeliveryStatus = errorMsg;

    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  }


  },
})
function typeOf(contractDetailNo: string[]): any {
  throw new Error('Function not implemented.')
}

