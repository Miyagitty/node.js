<template>
  <div class="login-container">
    <el-card class="login-card">
      <!-- 标题区域 -->
      <div class="header">
        <div class="logo">
          <el-image src="/c.png" fit="cover" class="logo-image" />
          <h2 class="title">笔电商城</h2>
        </div>
        <h4 class="subtitle">欢迎回来，请登录您的账户</h4>
      </div>

      <!-- 登录表单 -->
      <el-form :model="form" :rules="rules" ref="loginForm" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" size="large" clearable />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large"
            show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" native-type="submit" :loading="loading" class="login-btn">
            立即登录
          </el-button>
        </el-form-item>

        <div class="extra-actions">
          <el-checkbox v-model="remember">记住密码</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码?</el-link>
        </div>
      </el-form>

      <!-- 快速入口 -->
      <div class="quick-access">
        <el-divider>其他登录方式</el-divider>
        <div class="auth-icons">
          <el-icon :size="28" class="icon">
            <ChromeFilled />
          </el-icon>
          <el-icon :size="28" class="icon">
            <Wechat />
          </el-icon>
          <el-icon :size="28" class="icon">
            <Alipay />
          </el-icon>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 16, message: '长度在4到16个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在6到18个字符', trigger: 'blur' }
  ]
}

const loading = ref(false)
const remember = ref(false)
const loginForm = ref(null) // 表单引用

// 登录逻辑
const handleLogin = () => {
  // 表单验证
  loginForm.value.validate((valid) => {
    if (valid) {
      // 验证通过，执行登录逻辑
      loading.value = true
      // 模拟登录流程
      setTimeout(() => {
        ElMessage.success('登录成功')
        router.push('/index')
        loading.value = false
      }, 1000)
    } else {
      // 验证不通过，提示错误
      ElMessage.error('请检查输入内容')
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 450px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.logo-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.title {
  font-size: 28px;
  color: #303133;
  margin: 0;
}

.subtitle {
  color: #909399;
  margin: 10px 0;
  font-weight: normal;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}

.extra-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.quick-access {
  margin-top: 30px;
}

.auth-icons {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 20px;
}

.icon {
  color: #606266;
  cursor: pointer;
  transition: color 0.3s;
}

.icon:hover {
  color: #409EFF;
}

:deep(.el-divider__text) {
  background-color: transparent;
  color: #909399;
  font-size: 14px;
}
</style>