// url적는곳
import { hrApi } from '@/api'

const SEARCH_CUSTOMER_LIST_URL = '/company/searchCustomer'



// 행사 조회
function getCustomerList(searchCondition: string, workplaceCode: string) {
  return hrApi.get(`${SEARCH_CUSTOMER_LIST_URL}`, {
    params: {
      searchCondition, workplaceCode
    },
  });
}


export {
  getCustomerList
}
