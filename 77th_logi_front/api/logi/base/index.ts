// url적는곳
import { logiApi } from '@/api'

const COMPANY_URL = '/base/getcompanyInfo'
const WORKPLACE_URL = '/base/workplaceList'
const GET_CODELIST_URL = '/base/codeList'
const WORKPLACEDETAIL_URL = '/base/workplaceInfo'
const ADDWORKPLACE_URL = '/base/workplace'
const UPDATEWORKPLACE_URL = '/base/workplaceupdate'
const DELETEWORKPLACE_URL = '/base/workplaceCode'
const DEPT_URL = '/base/getdeptInfo'
const GENERAL_CLIENT_URL = '/base/searchClientList'
const ADD_GENERAL_CLIENT_URL = '/base/insertClient'
const UPDATE_GENERAL_CLIENT_URL = '/base/updateClient'
const DELETE_GENERAL_CLIENT_URL = '/base/deleteClient'
const GET_FINANCE_CLIENT_INFO = '/base/searchFinanceList'
const ADD_FINANCE_CLIENT_INFO = '/base/insertFinance'
const UPDATE_FINANCE_CLIENT_INFO = '/base/updateFinance'
const DELETE_FINANCE_CLIENT_INFO = '/base/deleteFinance'
//창고조회 78th추가
const GET_WAREHOUSE_LIST = '/base/warehouseInfo'
//금융거래처 상세조회 78th추가
const GET_FINANCE_DETAIL_INFO = '/base/searchFinanceDetailList'
// 일반거래처 상세조회 6/27
const SEARCH_CLIENT_DETAIL_URL = '/base/searchClientDetailList'
//창고추가 78th추가 6/27
const ADD_WAREHOUSE_LIST = '/base/warehousebatchListProcess'
//창고삭제 78th추가 6/27
const DELETE_WAREHOUSE_LIST = '/base/warehousebatchListProcess'

// 회사정보 조회
function getCompanyInfo() {
  return logiApi.get(`${COMPANY_URL}`)
}

//////////////////////////////////////

// 사업장 조회
function getWorkplaceList() {
  return logiApi.get(`${WORKPLACE_URL}`)
}

// 품목코드 리스트
function getCodeList(divisionCode: string) {
   return logiApi.get(`${GET_CODELIST_URL}`, {
    params: {
      divisionCode
    },
  })
}


// 한 행 클릭 시 사업장 상세정보 조회
function getWorkplaceDetail(workplaceCode: string) {
  return logiApi.get(`${WORKPLACEDETAIL_URL}`, {
    params: {
      workplaceCode,
    },
  })
}

// 사업장 추가
function addWorkplace(menudata: any) {
  return logiApi.post(`${ADDWORKPLACE_URL}`, menudata)
}

// 사업장 수정
function updateWorkplace(updateDataList: any) {
  return logiApi.put(`${UPDATEWORKPLACE_URL}`, updateDataList)
}

// 사업장 삭제
function deleteWorkplace(workplaceCode: string) {
  return logiApi.delete(`${DELETEWORKPLACE_URL}`, {
    params: {
      workplaceCode,
    },
  })
}

/////////////////////////////////////////

// 부서 조회
function getDeptInfo() {
  return logiApi.get(`${DEPT_URL}`)
}

/////////////////////////////////////////

// 일반거래처 조회
function getGeneralClient() {
  return logiApi.get(`${GENERAL_CLIENT_URL}`)
}

// 일반거래처 추가
function addGeneralClient(clientdata: any) {
  return logiApi.post(`${ADD_GENERAL_CLIENT_URL}`, clientdata)
}

// 일반거래처 수정
function updateGeneralClient(updateDataList: any) {
  return logiApi.put(`${UPDATE_GENERAL_CLIENT_URL}`, updateDataList)
}

// 일반거래처 삭제
function deleteGeneralClient(customerCode: string) {
  return logiApi.delete(`${DELETE_GENERAL_CLIENT_URL}/${customerCode}`)
}

/////////////////////////////////////////

// 금융거래처 조회
function getFinanceClient() {
  return logiApi.get(`${GET_FINANCE_CLIENT_INFO}`)
}

// 금융거래처 추가
function addFinanceClient(clientdata: any) {
  return logiApi.post(`${ADD_FINANCE_CLIENT_INFO}`, clientdata)
}

// 금융거래처 수정
function updateFinanceClient(updateDataList: any) {
  return logiApi.put(`${UPDATE_FINANCE_CLIENT_INFO}`, updateDataList)
}

// 금융거래처 삭제
function deleteFinanceClient(accountAssociatesCode: string) {
  return logiApi.delete(
    `${DELETE_FINANCE_CLIENT_INFO}/${accountAssociatesCode}`,
  )
}
// 창고목록조회 78th추가
function getWarehouseList() {
  return logiApi.get(`${GET_WAREHOUSE_LIST}`)
}

// 금융거래처 상세조회
function getFinanceDetail(code:string) {
  return logiApi.get(`${GET_FINANCE_DETAIL_INFO}`, {
    params: {
      code,
    },
  })
}

// 일반거래처 상세조회 6/27
function searchClientDetailList(customerCodes: string) {
  return logiApi.get(`${SEARCH_CLIENT_DETAIL_URL}`, {
    params: {
      customerCodes,
    },
  })
}

// 창고추가 78th추가 6/27
function addWarehouseList(batchList: any) {
  return logiApi.post(`${ADD_WAREHOUSE_LIST}`,batchList)
}

// 창고삭제 78th추가 6/27
function deleteWarehouseList(deleteList: any) {
  return logiApi.post(`${DELETE_WAREHOUSE_LIST}`,deleteList)
}

export {
  getCompanyInfo,
  getWorkplaceList,
  getWorkplaceDetail,
  getDeptInfo,
  addWorkplace,
  updateWorkplace,
  deleteWorkplace,
  getGeneralClient,
  addGeneralClient,
  updateGeneralClient,
  deleteGeneralClient,
  getFinanceClient,
  addFinanceClient,
  updateFinanceClient,
  deleteFinanceClient,
  getCodeList,
  getWarehouseList,
  getFinanceDetail,
  searchClientDetailList,
  addWarehouseList,
  deleteWarehouseList,
}
