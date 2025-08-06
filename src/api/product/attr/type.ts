export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number|string,
  name: string,
  category1Id?: number,
  category2Id?: number,
}

export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

//属性与属性值的ts类型
//1.属性值对象的ts类型
export interface AttrValue {
  id?: number,
  valueName: string,
  attrId?: number,
  isEdit?: boolean
}

//2.存储每一个属性值的数组类型
export type AttrValueList = AttrValue[];

//3.属性对象
export interface Attr {
  id?: number,
  attrName: string,
  categoryId: number | string,
  categoryLevel: number,
  attrValueList: AttrValueList
}

//4.存储每一个属性对象的数组ts类型
export type AttrList = Attr[]

//5.属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}