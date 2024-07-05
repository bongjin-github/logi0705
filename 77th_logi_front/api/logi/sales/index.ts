// url적는곳
import { logiApi } from '@/api'

const UNIT_PRICE_OF_ESTIMATE_URL = '/sales/getUnitPriceOfEstimate'
const ADD_NEW_ESTIMATE_URL = '/sales/addNewEstimates'
const SEARCH_ESTIMATE_CONTACT_INFO_URL = '/sales/searchEstimateInContractAvailable'
const SEARCH_ESTIMATE_DETAIL_URL = '/sales/searchEstimateDetail'
const ADD_NEW_CONTRACT_URL = '/sales/addNewContract'
const SEARCH_CONTRACT_URL = 'sales/searchContract'
const SEARCH_CONTRACT_DETAIL_URL = '/sales/searchContractDetail'
const SEARCH_SALES_PLAN_URL = '/sales/jpasalesplan'
const SEARCH_SALES_PLAN_BY_DATE = '/sales/searchSalesPlanByDate'

const SEARCH_DELIVERABLE_CONTRACT_LIST_URL = '/sales/searchDeliverableContractList'
const ADD_DELIVERY_URL = '/sales/delivery'
//견적조회 6/27
const SEARCH_ESTIMATES_LIST_URL = '/sales/searchEstimates'
//견적삭제 6/27
const DELETE_ESTIMATE_URL = '/sales/deleteEstimate'
//견적수정 6/27
const PUT_MODIFY_ESTIMATE_URL = '/sales/updateEstimates'
//판매계획 추가 6/27
const ADD_SALESPLAN_URL = '/sales/jpasalesplansave'
//판매계획 수정 6/27
const UPDATE_SALESPLAN_URL = '/sales/jpaupdatesalesplan'
//수주삭제 6/27
const DELETE_CONTRACT_URL = '/sales/deleteContract'
//판매계획 삭제 6/27
const DELETE_SALESPLAN_URL = '/sales/deletesalesplan'

// 제품 단가 조회
function getUnitPriceOfEstimate(itemCode: string) {
  return logiApi.get(`${UNIT_PRICE_OF_ESTIMATE_URL}`, {
    params: {
        itemCode,
    },
  });
}

function getSalesPlanByDate(startDate: string, endDate: string) {
  return logiApi.get(`${SEARCH_SALES_PLAN_BY_DATE}`, {
    params: {
      startDate,
      endDate
    },
  });
}

// 견적 추가
function addNewEstimates(newEstimateInfo: object) {
return logiApi.post(`${ADD_NEW_ESTIMATE_URL}`, {newEstimateInfo}) ;
}

// 등록된 견적 조회
function getEstimateContractInfo(startDate: string, endDate: string) {
  return logiApi.get(`${SEARCH_ESTIMATE_CONTACT_INFO_URL}`, {
    params: {
       startDate,
       endDate
    }, 
  });
}

// 견적 상세 조회
function getEstimateDetail(estimateNo: string) {
  return logiApi.get(`${SEARCH_ESTIMATE_DETAIL_URL}`, {
    params: {
      estimateNo
    },
  });
}

// 수주 추가
function addNewContract(newContractTO: object) {
  return logiApi.post(`${ADD_NEW_CONTRACT_URL}`, newContractTO);
  }


//수주 조회
function getContract(searchCondition: string, customerCode: string, startDate: string, endDate: string) {
  return logiApi.get(`${SEARCH_CONTRACT_URL}`, {
    params: {
      searchCondition,
      customerCode,
      startDate,
      endDate,
    },
  });
}

//수주 상세 조회
function getContractDetail(contractNo: string) {
  return logiApi.get(`${SEARCH_CONTRACT_DETAIL_URL}`, {
    params: {
      contractNo
    },
  });
}

//판매계획 조회
function getSalesPlan() {
  return logiApi.get(`${SEARCH_SALES_PLAN_URL}`);
}

// 납품 가능한 수주 리스트 조회
function getDeliverableContractList(startDate: string, endDate: string, searchCondition: string, customerCode: string) {
  return logiApi.get(`${SEARCH_DELIVERABLE_CONTRACT_LIST_URL}`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      searchCondition: searchCondition,
      customerCode: customerCode
    },
  });
}

// 납품 추가
function addDelivery(contractDetailNo: object) {
  console.log("addDelivery-contractDetailNo: ", contractDetailNo);
  return logiApi.post(`${ADD_DELIVERY_URL}`, contractDetailNo)
}

//견적조회 6/27
function getSearchEstimatesList(startDate: string, endDate: string, selectedItem: any) {
  return logiApi.get(`${SEARCH_ESTIMATES_LIST_URL}`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      dateSearchCondition: selectedItem,
    },
  });
}

// 견적 삭제 6/27
function deleteEstimate(estimateNo: string) {
  return logiApi.delete(`${DELETE_ESTIMATE_URL}`, {
    params: {
      estimateNo,
    },
  })
}

// 견적 수정 6/27
function putModifyEstimate(estimateTO: object) {
  return logiApi.put(`${PUT_MODIFY_ESTIMATE_URL}`, estimateTO);
}

// 판매계획 추가 6/27
function addSalesPlan(addData: object) {
  console.log("addSalesPlan: ", addData);
  return logiApi.post(`${ADD_SALESPLAN_URL}`, addData)
}

// 판매계획 수정 6/27
function updateSalesPlan(updateData: object) {
  console.log("updateSalesPlan: ", updateData);
  return logiApi.post(`${UPDATE_SALESPLAN_URL}`, updateData)
}

// 수주 삭제
function deleteContract(contractNo: string) {
  console.log('api에서의 contractNo : ' , contractNo)
  return logiApi.delete(`${DELETE_CONTRACT_URL}`, {
    params: {
      contractNo,
    },
  })
}

// 판매계획 삭제 6/27
function deleteSalesPlan(salesPlanNo: string) {
  console.log('api에서 판매계획번호', salesPlanNo)
  return logiApi.delete(`${DELETE_SALESPLAN_URL}`, {
    params: {
      salesPlanNo,
    },
  })
}



export {
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
}


