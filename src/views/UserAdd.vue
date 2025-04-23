<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- 修改用户名和网站字段 -->
      <div class="form-group">
        <label for="name">姓名：</label>
        <input v-model="formData.name" type="text" id="name" name="name">
      </div>
      <div class="form-group">
        <label for="web">网站：</label>
        <input v-model="formData.web" type="url" id="web" name="web">
      </div>
      <div class="form-group">
        <label for="date">日期：</label>
        <input v-model="formData.date" type="date" id="date" name="date">
      </div>
      <div class="form-group">
        <label for="avatar">头像：</label>
        <input type="file" id="avatar" name="avatar" @change="handleFileChange">
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
import { ElMessage } from 'element-plus';

const router = useRouter();
const formData = ref({
  name: '',
  web: '',
  date: '',
  address: ''
});
const selectedFile = ref(null);

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleSubmit = async () => {
  const form = new FormData();
  form.append('name', formData.value.name);
  form.append('web', formData.value.web);
  form.append('date', formData.value.date);
  form.append('address', formData.value.address);
  if (selectedFile.value) {
    form.append('avatar', selectedFile.value);
  }
  try {
    await axios.post('http://localhost:3000/api/uploads', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    ElMessage.success('用户添加成功');
    router.push('/user'); // 添加成功后跳转到用户列表
  } catch (error) {
    ElMessage.error('用户添加失败:', error);
  }
};
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