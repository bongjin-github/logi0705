import { defineStore } from "pinia";
import {
  getWorkOrderMrpList,
  getAddWorkOrderDialog,
  getActualWorkOrderButton,
  getWorkOrderListStatus, 
  putActualAmount,
  getWorkOrderCompletion,
  getWorkPerformanceManagement,
  getWorkPlace,
  getWorkPlaceLog,
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
} from "@/api/logi/production/index";
import type { SalesPlanTO } from "@/types/logistic/sales/sales";

export const productionStore = defineStore("productionStore", {
  state: () => ({
    WorkOrderMrpList: [] as any, //작업지시 필요항목 조회 
    AddWorkOrderDialog : [] as any, //작업지시 모의전개 
    ActualWorkOrderButton: [] as any, //실제 작업지시
    WorkOrderListStatus: [] as any, //작업지시현황 조회 
    ActualAmount: [] as any, //작업완료된 수량 입력
    WorkOrderCompletion: [] as any, //작업완료 등록
    WorkPerformanceManagement: [] as any, //생산실적 조회
    WorkSiteList: [] as any, // 작업장 리스트
    WorkSiteLogList: [] as any, // 작업장로그 리스트
    SearchContractAvailable: [] as any, //MPS 등록가능한 수주 조회
    contractToMps : [] as any, // 수주 -> MPS등록
    productionProcessList: [] as any, //작업지시 모의전개 모달창에서 작업장 조회
    workplaceList: [] as any, // //작업지시 모의전개 모달창에서 지점 조회
    searchMpsInfoData: [] as any, //소요량전개 페이지에서 수주 조회
    searchMrpGatheringData: [] as any, //소요량취합 결과 조회 페이지에서 소요량 취합 결과 조회 6/28
    getMrpListData: [] as any, //소요량전개 페이지에서 품목별 조달계획 탭 안에서 조달구분 6/28
    updateMpsData: [] as any, //소요량전개 페이지에서 MPS수정 6/28
    openMrpData: [] as any, //소요량전개 페이지에서 MRP 모의전개 6/28
    registerMrpData: [] as any, //소요량전개 페이지에서 MRP모의전개 모달창에서 등록하는 페이지 6/28
    getMrpGatheringListData: [] as any, //소요량전개 페이지에서 품목별 조달계획 탭 안에서 조달구분에서 소요량 취합 실행 6/28

  }),
  actions: {
    // 작업지시 필요항목 조회
    async FETCH_WORKORDER_MRP_LIST(startDate: string, endDate: string) {
      try {
        const response = await getWorkOrderMrpList(startDate, endDate);
        this.WorkOrderMrpList = response.data.gridRowJson;
      
      } catch (error: any) {
        console.error(error);
      }
    },
    
    // 작업지시 모의전개 
    async FETCH_ADD_WORKORDER_DIALOG(mrpNo:string, mrpGatheringNo:string) {
      try {
        const response = await getAddWorkOrderDialog(mrpNo, mrpGatheringNo);
        this.AddWorkOrderDialog = response.data.result;
        console.log("모의전개:", response.data.result);
      
      } catch (error: any) {
        console.error(error);
      }
    },

    // 실제 작업지시
    async FETCH_ACTUAL_WORKORDER_BUTTON(mrpGatheringNo: string, workPlaceCode: string, productionProcessCode: string ) {
      try {
        const response = await getActualWorkOrderButton(mrpGatheringNo, workPlaceCode, productionProcessCode );
        this.ActualWorkOrderButton = response.data;
        console.log("작업지시:", response.data );

      } catch (error: any) {
        console.error(error);
      }
    },

    //작업지시현황 조회 
    async FETCH_WORKORDER_LIST_STATUS() {
      try {
        const response = await getWorkOrderListStatus();
        this.WorkOrderListStatus = response.data;
        console.log("작업지시현황조회:", response.data );
      
      } catch (error: any) {
        console.error(error);
      }
    },  

    //작업완료된 수량 입력  
    async FETCH_EDIT_ACTUAL_AMOUNT({workOrderNo, actualCompletionAmount}: any) {
      try {
        const responsePut = await putActualAmount({workOrderNo, actualCompletionAmount});
        console.log("작업완료된수량:", responsePut.data );

        if (responsePut.data.errorCode !== 0) {
          console.log("작업완료된 수량에서 에러. 에러코드: " + responsePut.data.errorCode);
          return;  // 데이터 업데이트 중지
        }
        
        this.ActualAmount = responsePut.data;
      } catch (error: any) {
        console.error(error);
        // 에러가 발생한 경우에는 여기에서 함수를 종료시키고 데이터 업데이트를 하지 않도록 수정
        return;
      }
    },

    //작업완료 등록  
    async FETCH_WORKORDER_COMPLETION(workOrderNo:any, actualCompletionAmount:any) {
      try {
        const responseGet = await getWorkOrderCompletion(workOrderNo, actualCompletionAmount);
        console.log("작업완료등록:", responseGet.data );

        if (responseGet.data.errorCode !== 0) {
          console.log("작업완료 등록에서 에러. 에러코드: " + responseGet.data.errorCode);
          return;  // 데이터 업데이트 중지
        }

        this.WorkOrderCompletion = responseGet.data;
      } catch (error: any) {
        console.error(error);
        // 에러가 발생한 경우에는 여기에서 함수를 종료시키고 데이터 업데이트를 하지 않도록 수정
        return;
      }
    }, 

    //작업지시현황 조회 
    async FETCH_WORK_PERFORMANCE_MANAGEMENT() {
      try {
        const response = await getWorkPerformanceManagement();
        this.WorkPerformanceManagement = response.data;
        console.log("생산실적조회:", response.data );
      
      } catch (error: any) {
        console.error(error);
      }
    }, 

    // 작업장 조회
    async FETCH_WORKPLACE() {
      try {
        const response = await getWorkPlace();
        this.WorkSiteList = response.data.WorkSiteList;
      
      } catch (error: any) {
        console.error(error);
      }
    },

    // 작업장로그 조회
    async FETCH_WORKPLACE_LOG(productionProcessCode:string, workSiteName:string) {
      try {
        const response = await getWorkPlaceLog(productionProcessCode, workSiteName);
        this.WorkSiteLogList = response.data;
      
      } catch (error: any) {
        console.error(error);
      }
    },

    //MPS 등록가능한 수주 조회
    async SEARCH_CONTRACT_AVAILABLE(startDate : string, endDate : string, searchCondition : string) {
      try {
        const response = await getContractAvailable(startDate, endDate, searchCondition);
        this.SearchContractAvailable = response.data.gridRowJson;
        console.log(this.SearchContractAvailable, "productionStore.SearchContractAvailable")
        
      } catch (error: any) {
        console.error(error);
      }
    },

    //수주 -> MPS 등록
    async CONTRACT_TO_MPS(mpsData : any) {
      console.log('스토어에 옴');
      console.log('mpsData store, mpsData, ', mpsData);

      try {
        const response = await postContractToMps(mpsData);
        this.contractToMps = response.data;
        console.log(this.contractToMps, "productionStore.contractToMps")
        
      } catch (error: any) {
        console.error(error);
      }
    },
    //판매계획 -> MPS 등록
    async SALES_PLAN_TO_MPS(mpsData : SalesPlanTO) {
    try {
      console.log('store의 mps등록 ', mpsData);
      const response = await postSalesPlanToMps.call(this, mpsData);
    } catch (error: any) {
      console.error(error);
      }
    },
    //작업지시 모의전개 모달창에서 작업장 조회
    async GET_PRODUCTION_PROCESS_LIST() {
      try {
        const res = await getProductionProcessList()

  
        console.log('getProductionProcessList - res.data.gridRowJson', res.data.gridRowJson)

        this.productionProcessList = res.data.gridRowJson
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    },

// //작업지시 모의전개 모달창에서 지점 조회
        async GET_WORKPLACE_LIST() {
      try {
        const res = await getWorkplaceList()
        console.log('지점: ', res);
        
        console.log('getWorkplaceList - res.data.gridRowJson', res.data.gridRowJson)

        this.workplaceList = res.data.gridRowJson
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    },
        
    //소요량전개 페이지에서 수주 조회
    async SEARCH_MPS_INFO_URL(startDate : string, endDate : string, classification : string) {
      try {
        const response = await searchMpsInfo(startDate, endDate, classification);
        console.log('스토어에서 response', response)
        this.searchMpsInfoData = response
        
      } catch (error: any) {
        console.error(error);
      }
    },

    //소요량취합 결과 조회 페이지에서 소요량 취합 결과 조회 6/28
    async SEARCH_MRP_GATHERING_URL(startDate : string, endDate : string, searchDateCondition : string) {
      try {
        const response = await searchMrpGathering(startDate, endDate, searchDateCondition);
        console.log('스토어에서 response', response)
        this.searchMrpGatheringData = response
        
      } catch (error: any) {
        console.error(error);
      }
    },

    //소요량전개 페이지에서 품목별 조달계획 탭 안에서 조달구분 6/28
    async GET_MRP_LIST_URL(mrpGatheringStatusCondition : string) {
      try {
        const response = await getMrpList(mrpGatheringStatusCondition);
        console.log('스토어에서 response', response)
        this.getMrpListData = response
        
      } catch (error: any) {
        console.error(error);
      }
    },

    //소요량전개 페이지에서 MPS수정 6/28
    async UPDATE_MPS_URL(modifiedData : any) {
      console.log('스토어에 옴');
      console.log('mpsData store, mpsData, ', modifiedData);

      try {
        const response = await updateMps(modifiedData);
        this.updateMpsData = response
        console.log(this.contractToMps, "productionStore.updateMps")
        
      } catch (error: any) {
        console.error(error);
      }
    },

        //소요량전개 페이지에서 MRP 모의전개 6/28
    async OPEN_MRP_URL(mpsNo : string) {
      try {
        const response = await openMrp(mpsNo);
        console.log('스토어에서 response', response)
        this.openMrpData = response
        
      } catch (error: any) {
        console.error(error);
      }
    },

    //소요량전개 페이지에서 MRP모의전개 모달창에서 등록하는 페이지 6/28
    async REGISTER_MRP_URL(body : any) {
      console.log('스토어에 옴');
      console.log('mpsData store, body, ', body);

      try {
        const response = await registerMrp(body);
        this.registerMrpData = response
        console.log(this.contractToMps, "productionStore.registerMrp")
        
      } catch (error: any) {
        console.error(error);
      }
    },

    //소요량전개 페이지에서 품목별 조달계획 탭 안에서 조달구분에서 소요량 취합 실행 6/28
    //얘는 만들어놨는데 적용 못시켰다..
    async GET_MRP_GATHERING_URL(params: any) {
      console.log('스토어에 옴~~', params)
      console.log('스토어에서 params 타입???', typeof params)
      try {
        const response = await getMrpGatheringList(params);
        console.log('스토어에서 response', response)
        this.getMrpGatheringListData = response
        
      } catch (error: any) {
        console.error(error);
      }
    },


  }
})
