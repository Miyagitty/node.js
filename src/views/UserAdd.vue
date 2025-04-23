<template>
  <div class="login-container">
    <form action="http://localhost:3000/api/uploads" method="POST" enctype="multipart/form-data">
      <div class="form-group">
        <label for="username">用户名：</label>
        <input v-model="formData.username" type="text" id="username" name="username">
      </div>
      <div class="form-group">
        <label for="password">密码：</label>
        <input v-model="formData.password" type="password" id="password" name="password">
      </div>
      <div class="form-group">
        <label for="age">日期：</label>
        <input v-model="formData.date" type="date" id="age" name="age">
      </div>
      <div class="form-group">
        <label for="avatar">头像：</label>
        <input type="file" id="avatar" name="avatar">
      </div>
      <div class="form-group">
        <label for="address">地址：</label>
        <input type="text" id="address" v-model="formData.address" name="address">
      </div>
      <div class="form-group">
        <input type="submit" value="添加用户">
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const formData = ref({
  username: '',
  password: '',
  date: '',
  address: ''
});
const selectedFile = ref(null);

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleSubmit = async () => {
  const form = new FormData();
  form.append('username', formData.value.username);
  form.append('password', formData.value.password);
  form.append('date', formData.value.date);
  form.append('address', formData.value.address);
  console.log(form);// 添加地址数据
  if (selectedFile.value) {
    form.append('avatar', selectedFile.value);
  }
  try {
    await axios.post('http://localhost:3000/api/uploads', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('用户添加成功');
    // 可选：添加成功后跳转到用户列表或其他页面
    // router.push('/user-list');
  } catch (error) {
    console.error('用户添加失败:', error);
  }
};


const handleLogin = () => {
  // 这里可以添加实际的登录验证逻辑，例如调用 API 进行验证
  // 假设验证成功
  router.push('/');
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.form-group input[type="submit"] {
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.form-group input[type="submit"]:hover {
  background-color: #0056b3;
}
</style>