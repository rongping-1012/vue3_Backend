import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/product/attr';
import { defineStore } from 'pinia';
import type { CategoryResponseData } from '@/api/product/attr/type';
import type { CategoryState } from './type/type';

let useCategoryStore = defineStore('category', {
  state: (): CategoryState => {
    return {
      c1List: [],
      c2List: [],
      c3List: [],
      c1Id: '',
      c2Id: '',
      c3Id: '',
    }
  },
  actions: {
    async getCategory1List() {
      let result: CategoryResponseData = await reqCategory1()
      if (result.code === 200) {
        this.c1List = result.data
      }
    },
    async getCategory2List() {
      let result: CategoryResponseData = await reqCategory2(this.c1Id)
      if (result.code === 200) {
        this.c2List = result.data
      }
    },
    async getCategory3List() {
      let result: CategoryResponseData = await reqCategory3(this.c2Id)
      if (result.code === 200) {
        this.c3List = result.data
      }
    }

  }
  
})

export default useCategoryStore