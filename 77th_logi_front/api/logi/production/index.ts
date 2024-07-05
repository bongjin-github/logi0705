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

// //작업지시 모의전개 모달창에서 작업장 조회
function getProductionProcessList() {
  console.log('logiApi.get(`${GET_PRODUCTION_PROCESS_LIST}`)   ', logiApi.get(`${GET_PRODUCTION_PROCESS_LIST}`));
  return logiApi.get(`${GET_PRODUCTION_PROCESS_LIST}`);
}

// //작업지시 모의전개 모달창에서 지점 조회
function getWorkplaceList() {
  console.log('logiApi.get(`${GET_WORKPLACE_LIST}`)   ', logiApi.get(`${GET_WORKPLACE_LIST}`));

  return logiApi.get(`${GET_WORKPLACE_LIST}`);
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
  postSalesPlanToMps
}
