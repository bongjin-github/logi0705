import { logiApi } from "@/api";
import type { SalesPlanTO } from "@/types/logistic/sales/sales";

const WORKORDER_MRP_LIST_URL = "/production/getWorkOrderableMrpList";
const ADD_WORKORDER_DIALOG_URL = "/production/showWorkOrderDialog";
const ACTUAL_WORKORDER_BUTTON_URL = "/production/workOrder";
const WORKORDER_LIST_STATUS_URL = "/production/getWorkOrderInfoListStatus";
const EDIT_ACTUAL_AMOUNT_URL = "production/editActualAmount";
const WORKORDER_COMPLETION_URL = "production/workOrderCompletion";
const WORK_PERFORMANCE_MANAGEMENT_URL = "production/getProductionPerformanceInfoList";
const WORKPLACE_URL = "/production/getWorkSiteList";
const SEARCH_CONTRACT_AVAILABLE_URL = "production/searchContractDetailInMpsAvailable";

//MPS 등록가능한 수주 조회
const WORKPLACE_LOG_URL = "/production/getProductionProcessCode";
//수주 -> MPS 등록
const CONTRACT_TO_MPS_URL = "/production/convertContractDetailToMps";
//판매계획 -> MPS 등록
const SALES_PLAN_TO_MPS_URL = "/production/convertSalesPlanToMps";

// //작업지시 모의전개 모달창에서 작업장 조회
const GET_PRODUCTION_PROCESS_LIST = "/production/ProductionProcessList";
// //작업지시 모의전개 모달창에서 지점 조회
const GET_WORKPLACE_LIST = "/production/WorkplaceList";
//소요량전개 페이지에서 수주 조회/판매계획 6/28
const SEARCH_MPS_INFO_URL = '/logistics/production/searchMpsInfo'
//소요량취합 결과 조회 페이지에서 소요량 취합 결과 조회 6/28
const SEARCH_MRP_GATHERING_URL = '/logistics/production/mrpGathering/searchMrpGathering'
//소요량전개 페이지에서 품목별 조달계획 탭 안에서 조달구분 6/28
const GET_MRP_LIST_URL = '/logistics/production/mrpGathering/getMrpList'
//소요량전개 페이지에서 MPS수정 6/28
const UPDATE_MPS_URL = '/logistics/production/updateMps'
//소요량전개 페이지에서 MRP 모의전개 6/28
const OPEN_MRP_URL = '/logistics/production/openMrp'
//소요량전개 페이지에서 MRP모의전개 모달창에서 등록하는 페이지 6/28
const REGISTER_MRP_URL = '/logistics/production/registerMrp'
//소요량전개 페이지에서 품목별 조달계획 탭 안에서 조달구분에서 소요량 취합 실행 6/28
const GET_MRP_GATHERING_URL = '/logistics/production/mrpGathering/getMrpGatheringList'


//작업지시 필요항목 조회
function getWorkOrderMrpList(startDate: string, endDate: string) {
  return logiApi.get(`${WORKORDER_MRP_LIST_URL}`, {
    params: {
      startDate,
      endDate
    },
  });
}

//작업지시 모의전개
function getAddWorkOrderDialog(mrpNo:string, mrpGatheringNo:string) {
  return logiApi.get(`${ADD_WORKORDER_DIALOG_URL}`, {
    params: {
      mrpNo,
      mrpGatheringNo,
    },
  });
}

//실제 작업지시
function getActualWorkOrderButton( mrpGatheringNo: string, workPlaceCode: string, productionProcessCode: string ) {
  return logiApi.get(`${ACTUAL_WORKORDER_BUTTON_URL}`, {
    params: {
      mrpGatheringNo, 
      workPlaceCode, 
      productionProcessCode,
    },
  });
}

//작업지시현황 조회 
function getWorkOrderListStatus() {
  return logiApi.get(`${WORKORDER_LIST_STATUS_URL}`);
}

//작업완료된 수량 입력
function putActualAmount(workOrderInfoTO: any) {
  return logiApi.put(`${EDIT_ACTUAL_AMOUNT_URL}`, workOrderInfoTO);
}

//작업완료 등록
function getWorkOrderCompletion(workOrderNo:string, actualCompletionAmount:any ) {
  return logiApi.get(`${WORKORDER_COMPLETION_URL}`, {
    params: {
      workOrderNo, 
      actualCompletionAmount, 
    },
  });
}

//생산실적 조회 
function getWorkPerformanceManagement() {
  return logiApi.get(`${WORK_PERFORMANCE_MANAGEMENT_URL}`);
}

//작업장 조회
function getWorkPlace() {
  return logiApi.get(`${WORKPLACE_URL}`);
}

//작업장로그 조회
function getWorkPlaceLog(productionProcessCode:string, workSiteName:string) {
  return logiApi.get(`${WORKPLACE_LOG_URL}`, {
    params: {
      productionProcessCode,
      workSiteName,
    },
  });
}

//MPS 등록가능한 수주 조회
function getContractAvailable(startDate : string, endDate : string, searchCondition : string) {
  return logiApi.get(`${SEARCH_CONTRACT_AVAILABLE_URL}`, {
    params: {
      startDate,
      endDate,
      searchCondition,
    },
  });
}

// 수주 -> MPS 등록
function postContractToMps(mpsData : any) {
  console.log('mpsData api, mpsData, ', mpsData);

  return logiApi.post(`${CONTRACT_TO_MPS_URL}`, mpsData);
}

// 판매계획 -> MPS 등록
function postSalesPlanToMps(to : SalesPlanTO) {
  console.log('판매계획 -> MPS api로 옴');
  console.log('판매계획 -> MPS 등록 ', to);
  return logiApi.post(`${SALES_PLAN_TO_MPS_URL}`, to);
}

//작업지시 모의전개 모달창에서 작업장 조회
function getProductionProcessList() {
  console.log('logiApi.get(`${GET_PRODUCTION_PROCESS_LIST}`)   ', logiApi.get(`${GET_PRODUCTION_PROCESS_LIST}`));
  return logiApi.get(`${GET_PRODUCTION_PROCESS_LIST}`);
}

//작업지시 모의전개 모달창에서 지점 조회
function getWorkplaceList() {
  console.log('logiApi.get(`${GET_WORKPLACE_LIST}`)   ', logiApi.get(`${GET_WORKPLACE_LIST}`));

  return logiApi.get(`${GET_WORKPLACE_LIST}`);
}

//소요량전개 페이지에서 수주 조회(수주로 MPS 등록 건)
function searchMpsInfo(startDate: string, endDate: string, classification: string) {
  console.log('api에서 startDate', startDate)
  console.log('api에서 endDate', endDate)
  console.log('api에서 classification', classification)
  return logiApi.get(`${SEARCH_MPS_INFO_URL}`, {
    params: {
      startDate,
      endDate,
      classification,
    },
  });
}

//소요량취합 결과 조회 페이지에서 소요량 취합 결과 조회 6/28
function searchMrpGathering(startDate: string, endDate: string, selectedOption: string) {
  console.log('api에서 startDate', startDate)
  console.log('api에서 endDate', endDate)
  console.log('api에서 selectedOption', selectedOption)
  return logiApi.get(`${SEARCH_MRP_GATHERING_URL}`, {
    params: {
      startDate,
      endDate,
      searchDateCondition : selectedOption,
    },
  });
}

//소요량전개 페이지에서 품목별 조달계획 탭 안에서 조달구분 6/28
function getMrpList(mrpGatheringStatusCondition: string) {
  console.log('api에서 mrpGatheringStatusCondition', mrpGatheringStatusCondition)
  return logiApi.get(`${GET_MRP_LIST_URL}`, {
    params: {
      mrpGatheringStatusCondition,
    },
  });
}

//소요량전개 페이지에서 MPS수정 6/28
function updateMps(modifiedData : any) {
  console.log('mpsData api, mpsData, ', modifiedData);

  return logiApi.post(`${UPDATE_MPS_URL}`, modifiedData);
}

//소요량전개 페이지에서 MRP 모의전개 6/28
function openMrp(mpsNo: string) {
  console.log('api에서 mpsNo', mpsNo)
  return logiApi.get(`${OPEN_MRP_URL}`, {
    params: {
      mpsNo,
    },
  });
}

//소요량전개 페이지에서 MRP모의전개 모달창에서 등록하는 페이지 6/28
function registerMrp(body : any) {
  console.log('mpsData api, body, ', body);

  return logiApi.put(`${REGISTER_MRP_URL}`, body);
}

//소요량전개 페이지에서 품목별 조달계획 탭 안에서 조달구분에서 소요량 취합 실행 6/28
//얘는 만들어놨는데 적용 못시켰다..
function getMrpGatheringList(params: any) {
  console.log('api에서 params 타입???', typeof params)
  console.log('api에서 params', params)
  return logiApi.get(`${GET_MRP_GATHERING_URL}`, {
    params: {
      params,
    },
  });
}




export {
  getWorkPlace,
  getWorkPlaceLog,
  getWorkOrderMrpList,
  getAddWorkOrderDialog,
  getActualWorkOrderButton,
  getWorkOrderListStatus,
  putActualAmount,
  getWorkOrderCompletion,
  getWorkPerformanceManagement,
  getContractAvailable,
  postContractToMps,
  getProductionProcessList,
  getWorkplaceList,
  postSalesPlanToMps,
  searchMpsInfo,
  searchMrpGathering,
  getMrpList,
  updateMps,
  openMrp,
  registerMrp,
  getMrpGatheringList,
}
