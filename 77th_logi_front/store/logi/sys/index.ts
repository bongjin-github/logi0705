//78th추가
import { defineStore } from "pinia";
import {
  getFindPayStepCodeDetailList, //자재명세서에서 붐폼분류 불러오는 Api
} from '@/api/logi/sys'

export const sysStore = defineStore('sysStore', {
  state: () => ({
    getFindPayStepCodeDetailList: [] as any //자재명세서에서 붐폼분류 불러오는 Api
  }),
  actions: {
    //자재명세서에서 붐폼분류 불러오는 Api
    async FIND_PAY_STEP_CODE_DETAIL_LIST(itemClassificationCondition : string) {
      try {
        const response = await getFindPayStepCodeDetailList(itemClassificationCondition);
        this.getFindPayStepCodeDetailList = response.data;
        console.log(this.getFindPayStepCodeDetailList, 'getFindPayStepCodeDetailList 알려줘')
        
      } catch (error: any) {
        console.error(error);
      }
    },




  }
})
