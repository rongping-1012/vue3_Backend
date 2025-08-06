import request from "@/utils/request";
import type { AttrResponseData, CategoryResponseData, Attr } from "./type";

enum API {
  GETCATEGORY1_URL = "/admin/product/getCategory1",
  GETCATEGORY2_URL = "/admin/product/getCategory2/",
  GETCATEGORY3_URL = "/admin/product/getCategory3/",
  GETCATEGORY_URL = "/admin/product/attrInfoList/",
  ADDORUPDATA_URL = "/admin/product/saveAttrInfo",
  DELETEATTR_URL = "/admin/product/deleteAttr/",
}

export const reqCategory1 = () => request.get<any, CategoryResponseData>(API.GETCATEGORY1_URL)
export const reqCategory2 = (category1Id: string | number) => request.get<any, CategoryResponseData>(API.GETCATEGORY2_URL + category1Id)
export const reqCategory3 = (category2Id: string | number) => request.get<any, CategoryResponseData>(API.GETCATEGORY3_URL + category2Id)

export const reqCategory = (category1Id: string | number, category2Id: string | number, category3Id: string | number) =>
  request.get<any, AttrResponseData>(API.GETCATEGORY_URL + `${category1Id}/${category2Id}/${category3Id}`)

export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATA_URL, data)

export const reqDeleteAttr = (attrId: number | string) => request.delete<any, any>(API.DELETEATTR_URL + attrId)