import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'

enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  UPDATA_URL = '/admin/product/baseTrademark/update',
  ADD_URL = '/admin/product/baseTrademark/save',
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}

export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

export const reqAddOrUpdataTrademark = (data: TradeMark) => {
  if (data.id) {
    // 携带id就是修改
    return request.put<any, any>(API.UPDATA_URL, data)
  } else {
    // 新增数据不携带id, 因为是自增的
    return request.post<any, any>(API.ADD_URL, data)
  }
}

export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
