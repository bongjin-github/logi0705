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
  getSalesPlanByDate,
  getSearchEstimatesList,
  deleteEstimate,
  putModifyEstimate,
  addSalesPlan,
  updateSalesPlan,
  deleteContract,
  deleteSalesPlan,
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
    addContractStatus: '' as string,
    SearchEstimatesList: [] as any, //견적조회
    deleteEstimate: [] as any, //견적삭제
    addSalesPlanData: [] as any, //판매계획 추가
    updateSalesPlanData: [] as any, //판매계획 수정
    deleteContract: [] as any, //수주삭제
    deleteSalesPlanData: [] as any, //판매계획 삭제
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
    },
  
      //견적조회
    async SEARCH_ESTIMATES_LIST_URL(startDate: string, endDate: string, selectedItem: any) {
    try {
      const res = await getSearchEstimatesList(startDate, endDate, selectedItem)
      this.SearchEstimatesList = res.data.gridRowJson

      console.log('SearchEstimatesList Response', res.data.gridRowJson)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
    },

    // 견적 삭제
    async DELETE_ESTIMATE_URL(estimateNo: string) {
      try {
        const res = await deleteEstimate(estimateNo)

        console.log('견적삭제 : ', res)
        console.log('견적삭제 : ', res.data)

        this.deleteEstimate = res.data.estimateNo
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    },

      // 견적수정
  async PUT_MODIFY_ESTIMATE_URL(estimateTO: object) {
    try {
      const res = await putModifyEstimate(estimateTO)

      console.log('Response', res)
      console.log('Response.data', res.data)
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
    },
  
    //판매계획 추가 6/27
  async ADD_SALESPLAN_URL(addData: object) {
    try {
      const res = await addSalesPlan(addData);

      console.log('Response', res)
      // console.log('Response.data', res)
      this.addSalesPlanData = res;

    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
    },
  
      //판매계획 수정 6/27
  async UPDATE_SALESPLAN_URL(updateData: object) {
    try {
      const res = await updateSalesPlan(updateData);

      console.log('Response', res)
      this.updateSalesPlanData = res;

    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
    },
  
        // 수주삭제 6/27
    async DELETE_CONTRACT_URL(contractNo: string) {
      try {
        const res = await deleteContract(contractNo)

        console.log('수주삭제 : ', res)
        console.log('수주삭제 : ', res.data)

        this.deleteContract = res.deleteContract.contractNo
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    },

      // 판매계획 삭제 6/27
    async DELETE_SALESPLAN_URL(salesPlanNo: string) {
      try {
        const res = await deleteSalesPlan(salesPlanNo)

        console.log('수주삭제 : ', res)
        console.log('수주삭제 : ', res.data)

        this.deleteSalesPlanData = res
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    },


  },
})
function typeOf(contractDetailNo: string[]): any {
  throw new Error('Function not implemented.')
}

