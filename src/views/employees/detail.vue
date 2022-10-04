<template>
  <div class="app-container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <!-- 放置表单 -->
          <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
            <el-form-item prop="username" label="姓名:">
              <el-input v-model="userInfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item prop="password2" label="新密码:">
              <el-input v-model="userInfo.password2" style="width:300px" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUserInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <!-- 动态组件 :is属性值可以为一个变量， 也可以直接为对应组件的组件名称-->
          <component :is="'UserInfo'" />
          <!-- <user-info /> -->
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <component :is="'JobInfo'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'

export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id, // 动态路由传参 获取params的id
      userInfo: {
        username: '',
        password2: '' // 接口中读取的是后端的密文，我们并不能解密，所以当我们没有任何修改就保存时，会校验失败，因为密文超过了规定的12位长度
        // 此处设置一个临时password2 用户修改完密码后再把password2替换为传给后端加密的password
      }, // 用户名和密码 表单对象
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 页面创建先请求回原来的用户名和密码
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 填写完毕 更新用户名和密码
    async saveUserInfo() {
      try {
        // 校验表单
        await this.$refs.userInfo.validate()
        // 调用接口
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        // 提示消息
        this.$message.success('保存成功')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style  scoped>

</style>
