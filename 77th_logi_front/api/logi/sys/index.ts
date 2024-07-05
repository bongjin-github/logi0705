import { logiApi } from '@/api'

//URL 적는곳

//MPS 등록
const FIND_PAY_STEP_CODE_DETAIL_LIST = "/sys/findPayStepCodeDetailList";



// //MPS 등록
function getFindPayStepCodeDetailList(itemClassificationCondition : string) {
  return logiApi.get(`${FIND_PAY_STEP_CODE_DETAIL_LIST}`, {
    params: {
      itemClassificationCondition : itemClassificationCondition
    }
  })
  };

export {
  getFindPayStepCodeDetailList,
}
