<template>
  <div>
    <el-form label-width="auto" label-position="left">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select placeholder="请选择" style="width: 250px;" v-model="SpuParams.tmId">
          <el-option v-for="(tm, index) in allTradeMark" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请输入内容" v-model="SpuParams.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- file-list : 存储上传的图片数据 -->
        <!-- list-type : 显示展示图片的方式 -->
        <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="图片获取失败" style="width: 100%;height: 100%;" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <!-- 下拉属性菜单 -->
        <el-select v-model="saleAtrIdAndValueName"
          :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'" style="width:180px">
          <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"
            :label="item.name" />
        </el-select>
        <el-button type="primary" icon="Plus" style="margin-left: 15px;"
          :disabled="saleAtrIdAndValueName ? false : true" @click="addSaleAttr()">添加销售属性</el-button>
        <!-- 销售属性列表 -->
        <el-table border style="margin-top: 15px;" :data="saleAttr">
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column label="属性名称" width="150" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <el-tag style="margin:0px 5px" @close="row.spuSaleAttrValueList.splice(index, 1)"
                v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" closable>
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input :ref="(vc: any) => inputArr[$index] = vc" @blur="toLook(row)" v-model="row.saleAttrValue"
                v-if="row.flag == true" placeholder="请你输入属性值" size="small" style="width:100px"></el-input>
              <el-button @click="toEdit(row, $index)" v-else type="primary" size="small" icon="Plus"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #="{ row, $index }">
              <el-button type="danger" size="small" icon="Delete" @click="saleAttr.splice($index, 1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="closeForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import type { SpuData, SaleAttrValue, HasSaleAttr, SaleAttr, SpuImg, Trademark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import { ElMessage, UploadProps } from 'element-plus';
import {  computed, nextTick, ref } from 'vue'


let $emit = defineEmits(["changeShow"])
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: "",//收集三级分类的ID
  spuName: "",//SPU的名字
  description: "",//SPU的描述
  tmId: '',//品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
});
//存储已有的SPU这些数据
let allTradeMark = ref<Trademark[]>([]);
//商品图片
let imgList = ref<SpuImg[]>([]);
//已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([]);
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);
let dialogVisible = ref(false)
let dialogImageUrl = ref<string|undefined>('')
// 子传父
 const closeForm = () => {
   $emit("changeShow", { flag: 0, params: 'update' })
}
// 4个请求
const getFormData = async(row: SpuData) => { 
  //存储已有的SPU对象,将来在模板中展示
  SpuParams.value = row;
  // //获取已有的SPU销售属性的数据
  // let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((row.id as number));
  // //获取整个项目全部SPU的销售属性
  // let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
  // // 获取某一个品牌旗下全部售卖商品的图片
  // let result1: SpuHasImg = await reqSpuImageList((row.id as number));
  // //获取全部品牌的数据
  // let result: AllTradeMark = await reqAllTradeMark();
  //获取已有的SPU销售属性的数据
  let result2: SaleAttrResponseData = {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 463,
        "createTime": null,
        "updateTime": null,
        "spuId": 579,
        "baseSaleAttrId": 1,
        "saleAttrName": "颜色",
        "spuSaleAttrValueList": [
          {
            "id": 633,
            "createTime": null,
            "updateTime": null,
            "spuId": 579,
            "baseSaleAttrId": 1,
            "saleAttrValueName": "蓝色",
            "saleAttrName": "颜色",
            "isChecked": null
          }
        ]
      }
    ],
    "ok": true
  }
  //获取整个项目全部SPU的销售属性
  let result3: HasSaleAttrResponseData = {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 1,
        "name": "颜色"
      },
      {
        "id": 2,
        "name": "版本"
      },
      {
        "id": 3,
        "name": "尺码"
      }
    ],
    "ok": true
  }
  // 获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImg = {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 498,
        "createTime": "2025-08-01 11:21:28",
        "updateTime": "2025-08-01 11:21:28",
        "spuId": 579,
        "imgName": "dot.png",
        "imgUrl": "blob:http://localhost:5173/da46c9f9-0191-443d-90fa-00fd58f78f4f"
      }
    ],
    "ok": true
  }
  //获取全部品牌的数据
  let result: AllTradeMark = {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 1,
        "tmName": "小米",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/03/D9/rBHu8mHmKC6AQ-j2AAAb72A3EO0942.jpg"
      },
      {
        "id": 2,
        "tmName": "苹果",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/03/D9/rBHu8mHmKHOADErHAAAQBezsFBo612.jpg"
      },
      {
        "id": 3,
        "tmName": "华为",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/03/D9/rBHu8mHmKF2AWpcKAADv98DWYRo516.jpg"
      },
      {
        "id": 4,
        "tmName": "尚硅谷",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/02/DA/rBHu8mGxObeAfL10AAAsPY94Hn8745.png"
      },
      {
        "id": 5,
        "tmName": "OPPO",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/02/DA/rBHu8mGxOciADR75AAE6kN74a-E289.png"
      }
    ],
    "ok": true
  }
  allTradeMark.value = result.data;
  //SPU对应商品图片
  imgList.value = result1.data.map(item => {
    // 这里el需要的图片数据格式:{name:   , url:   }
    // 接口提供的是{imgName:   , imgUrl:   }
    // 通过map方法将数据进行转换
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  //存储已有的SPU的销售属性
  saleAttr.value = result2.data;
  //存储全部的销售属性
  allSaleAttr.value = result3.data;
  // console.log("已有的SPU销售属性", saleAttr.value, "全部销售属性", allSaleAttr.value);
  
}
// 照片墙预览图片
const handlePictureCardPreview = (file:any) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}
//照片墙删除文件钩子
const handleRemove = () => { }
//上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  if (rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 > 10) {
      ElMessage.error('图片大小不能超过10M!')
      return false
    }
    return true
  } else {
    ElMessage.error('图片格式只能是jpg或png或gif!')
    return false
  }
}

//将来收集还未选择的销售属性的id与属性的名字
const saleAtrIdAndValueName = ref('')

//计算出当前spu还未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  const unSelectArr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

//添加销售属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAtrIdAndValueName.value.split(':')
  //准备一个新的销售属性对象，将来带给服务器
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  //追加到数组中
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAtrIdAndValueName.value = ''
}

//准备一个数组，将来存储对应的组件实例el-input
const inputArr = ref<any>([])
// 查看模式
const toLook = (row: SaleAttr) => { 
  //整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row;
  //整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: (saleAttrValue as string)
  }

  //非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage.error('属性值不能为空')
    return;
  }
  //判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName == saleAttrValue;
  })

  if (repeat) {
    ElMessage.error('属性值重复')
    return;
  }

  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  //切换为查看模式
  row.flag = false;
}

// 编辑模式
const toEdit = (row: SaleAttr, index: number) => { 
  //点击按钮的时候,input组件不就不出来->编辑模式
  row.flag = true;
  row.saleAttrValue = ''
  nextTick(() => {
    //获取焦点
    inputArr.value[index].focus()
  })
}

const save = async() => { 
  //1:照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,//图片的名字
      imgUrl: (item.response && item.response.data) || item.url
    }
  });
  //2:整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value;

  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code === 200) {
    ElMessage.success(SpuParams.value.id ? '更新成功' : '添加成功')
    //通知父组件切换场景为0
    $emit('changeShow', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' });
  } else {
    ElMessage.error(SpuParams.value.id ? '更新失败' : '添加失败')
  }
  
}

const initAddSpu = (c3Id: number | string) => {
  //清空数据
  Object.assign(SpuParams.value, {
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  });
  //清空照片
  imgList.value = [];
  //清空销售属性
  saleAttr.value = [];
  saleAtrIdAndValueName.value = '';
  //存储三级分类的ID
  SpuParams.value.category3Id = c3Id;
  //获取全部品牌的数据
  let result: AllTradeMark = {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 1,
        "tmName": "小米",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/03/D9/rBHu8mHmKC6AQ-j2AAAb72A3EO0942.jpg"
      },
      {
        "id": 2,
        "tmName": "苹果",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/03/D9/rBHu8mHmKHOADErHAAAQBezsFBo612.jpg"
      },
      {
        "id": 3,
        "tmName": "华为",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/03/D9/rBHu8mHmKF2AWpcKAADv98DWYRo516.jpg"
      },
      {
        "id": 4,
        "tmName": "尚硅谷",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/02/DA/rBHu8mGxObeAfL10AAAsPY94Hn8745.png"
      },
      {
        "id": 5,
        "tmName": "OPPO",
        "logoUrl": "http://47.93.148.192:8080/group1/M00/02/DA/rBHu8mGxOciADR75AAE6kN74a-E289.png"
      }
    ],
    "ok": true
  }
  //获取整个项目全部SPU的销售属性
  let result1: HasSaleAttrResponseData = {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 1,
        "name": "颜色"
      },
      {
        "id": 2,
        "name": "版本"
      },
      {
        "id": 3,
        "name": "尺码"
      }
    ],
    "ok": true
  }
  //存储数据
  allTradeMark.value = result.data;
  allSaleAttr.value = result1.data;
}


// setup 语法糖父亲获取子组件方法要对外暴露
defineExpose({
  getFormData
})
</script>

<style scoped></style>
