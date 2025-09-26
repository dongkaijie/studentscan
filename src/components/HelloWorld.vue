<template>
  <el-form :model="personForm" :rules="rules" ref="stuForm" label-width="100px" v-loading="loading" element-loading-text="加载中..." element-loading-background="rgba(0, 0, 0, 0.7)">
      <el-form-item label="所属部门:" prop="departNo">
        <el-select v-model="personForm.departNo" placeholder="请选择所属部门">
          <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item label="姓名:" prop="personName">
        <el-input v-model="personForm.personName" placeholder="请输入姓名" maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <el-input v-model="personForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item label="性别:" prop="sex">
        <el-radio-group v-model="personForm.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button type="primary" :loading="loading" @click="submitHandle()">确定</el-button>
    </el-form>
</template>
<script setup>
import { reactive, ref,onMounted } from 'vue'
import { post,get } from '@/utils/request.js'
import { ElMessage } from 'element-plus'

defineProps({
  msg: String,
})
const personForm = reactive({
    personName: '',
    departNo: '',
    phone: '',
    sex: ''
})

const stuForm = ref(null)
const rules= {
    departNo: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
    ],
    personName: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    sex: [
      { required: true, message: '请选择性别', trigger: 'change' }
    ]
  }
const personParams = {
    //当前页
    pageNum: 1,
    //每页显示条数
    pageSize: 10,
  }

  const departmentOptions = ref([])
  const deviceSerialNumbers = ref([])

  const loading = ref(false)

  onMounted(()=>{
    getInnitData(personParams)
  })
  
  function getInnitData(personParams){
    if(departmentOptions.value && departmentOptions.value.length == []){

      loading.value = true
      get(`/api/queryDeptsHkList?pageNum=${personParams.pageNum}&pageSize=${personParams.pageSize}`).then(res=>{
        console.log('res',res)
  
        departmentOptions.value = res && res.length&& res.map(item=>{
            return {
              value: item.departNo,
              label: item.departName
            }
          }) || []
      }).catch(err=>{

      }).finally(()=>{loading.value = false})
    }else{

    }

  }

  /*
  海康返回的不正规，成功的话 返回 "CY041813210"，不成功的话后端返回 “{"msg":"该手机号成员已存在","code":150101}”，
  我为了区分，一般手段行，就出此下策
  */ 
  function handleResponse(response) {
  // 先尝试解析为JSON
  try {
    const parsed = JSON.parse(response);
    
    // 如果解析成功，并且包含错误字段，说明是失败情况
    if (parsed && typeof parsed === 'object' && parsed.msg !== undefined) {
      // console.log('失败:', parsed.msg, '错误码:', parsed.code);
      ElMessage.error(parsed.msg)
      return { success: false, error: parsed };
    }
  } catch (error) {
    // 如果JSON解析失败，说明是成功的字符串编码
    // console.log('成功，返回编码:', response);
    ElMessage.success('新增成功')
    return { success: true, data: response };
  }
}
// 获取数据
const submitHandle =  ()=>{
  stuForm.value.validate((valid) => {
    if (valid) {
      // 调用后端接口进行提交
      console.log('参数',{...personForm})
      post('api/addPersonsHk',{...personForm}).then(res=>{
        loading.value = true
        handleResponse(res)
      }).catch(err=>{

      }).finally(()=>{
        loading.value = false
      })
    } else {
      console.log('表单验证失败');
      return false;
    }
  });
}

// 新增人员
function submitToBackend() {
  // const formData = {
  //   departNo: this.personForm.departNo,
  //   personName: this.personForm.personName,
  //   phone: this.personForm.phone,
  //   sex: this.personForm.sex
  // };
  // this.loading = true
  //     this.request(addPersons, formData,this, data => {
  //       console.log('新增人员的data',data)
  //       if(data){
  //         // this.addPersonDialogVisible = false;
  //         this.getPersonDataList(this.currenDeptNum,1,10)
  //         this.closeAddPersonDialog()
  //         this.loading = false
  //       }
  //     })
}
const count = ref(0)
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
