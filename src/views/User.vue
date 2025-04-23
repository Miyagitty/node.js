<template>
  <el-config-provider :locale="locale">
    <div class="top">
      <label>用户管理</label>
    </div>
    <el-button type="success" class="add" @click="add">添加用户</el-button>
    <el-table :data="data.arr" border style="width: 80%; margin: 10px auto;" stripe>
      <el-table-column prop="id" label="编号" width="80" header-align="center" align="center" />
      <el-table-column prop="name" label="姓名" header-align="center" align="center" />
      <el-table-column label="头像" width="120" align="center">
        <template #default="scope">
          <div class="avatar-cell">
            <img v-if="scope.row.avatar" :src="scope.row.avatar" class="avatar-image">
            <span v-else class="avatar-placeholder">暂无头像</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="web" label="网站" width="300" header-align="center" align="center" />
      <el-table-column prop="address" label="地址" header-align="center" align="center" />
      <el-table-column prop="date" label="日期" header-align="center" align="center" />
      <el-table-column label="操作" width="150" header-align="center" align="center">
        <template #default="scope">
          <!-- 修改编辑按钮 -->
          <el-button size="small" type="primary" @click="openEdit(scope.row)" class="action-button">
            编辑
          </el-button>
          <!-- 修改后 -->
          <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="30%">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <!-- 新增头像管理 -->
        <el-form-item label="头像">
          <div class="avatar-manager">
            <input type="file" ref="avatarInput" accept="image/*" @change="handleAvatarChange" style="display: none;">
            <el-button type="primary" @click="$refs.avatarInput.click()">
              {{ tempAvatar ? '更换头像' : '上传头像' }}
            </el-button>

            <div class="preview-area">
              <img v-if="tempAvatar || editForm.avatar" :src="tempAvatar || editForm.avatar" class="avatar-preview">
              <el-button v-if="tempAvatar || editForm.avatar" type="danger" size="mini" @click="removeTempAvatar">
                移除
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="网站">
          <el-input v-model="editForm.web" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.address" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="editForm.date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize"
      @current-change="handlePageChange" />
  </el-config-provider>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElConfigProvider } from 'element-plus';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import axios from 'axios';

const router = useRouter();
const locale = zhCn;

const add = () => {
  router.push('add');
};

const data = ref({
  arr: []
});

const pageSize = ref(8);
const total = ref(0);
const currentPage = ref(1);

// 获取用户数据
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    data.value.arr = response.data;
  } catch (error) {
    ElMessage.error('数据加载失败');
    console.error(error);
  }
});

const handlePageChange = async (page) => {
  currentPage.value = page;
  try {
    const response = await axios.get('/api/users', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    });
    data.value.arr = response.data.users;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const del = (id) => {
  ElMessageBox.confirm('确认删除？', '警告', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      // 修改前：未传递 ID
      // await axios.delete(`http://localhost:3000/api/users`);

      // 修改后：将 ID 加入 URL
      await axios.delete(`http://localhost:3000/api/users/${id}`);  // ✅
      data.value.arr = data.value.arr.filter((item) => item.id !== id);
      ElMessage.success('删除成功');
    } catch (error) {
      ElMessage.error('删除失败');
      console.error(error);
    }
  }).catch(() => { });
};

const dialogVisible = ref(false)
const editForm = ref({
  id: '',
  name: '',
  web: '',
  address: '',
  date: ''
})

// 新增响应式数据
const tempAvatar = ref(null)  // 暂存头像文件
const avatarFile = ref(null)  // 暂存文件对象

// 打开编辑时初始化
const openEdit = (row) => {
  editForm.value = { ...row }
  tempAvatar.value = null
  avatarFile.value = null
  dialogVisible.value = true
}

// 处理头像选择
const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // 文件验证
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过2MB')
    return
  }

  // 生成预览
  tempAvatar.value = URL.createObjectURL(file)
  avatarFile.value = file
}

// 移除暂存头像
const removeTempAvatar = () => {
  tempAvatar.value = null
  avatarFile.value = null
}

// 修改保存方法
const saveEdit = async () => {
  const saveEdit = async () => {
    try {
      const formData = new FormData()

      // 1. 添加基础字段（确保字段名与后端一致）
      const fields = ['name', 'web', 'address', 'date']
      fields.forEach(field => {
        formData.append(field, editForm.value[field])
      })
      formData.append('id', editForm.value.id)

      // 2. 优化文件处理逻辑
      if (avatarFile.value) {
        formData.append('avatar', avatarFile.value, avatarFile.value.name) // 添加文件名
      } else if (editForm.value.avatar === null) {
        formData.append('removeAvatar', 'true')
      }

      // 3. 添加调试日志
      console.log('FormData内容：')
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `${value.name} (${value.type})` : value)
      }

      // 4. 发送请求（配置withCredentials）
      const res = await axios.put(
        `http://localhost:3000/api/users/${editForm.value.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      )

      // ...后续处理不变...
    } catch (error) {
      // 增强错误提示
      if (error.response?.data?.error) {
        ElMessage.error(`后端错误：${error.response.data.error}`)
      } else {
        ElMessage.error(`请求失败：${error.message}`)
      }
    }
  }
  try {
    const formData = new FormData()

    // 1. 显式添加字段（保持与后端一致）
    formData.append('name', editForm.value.name)
    formData.append('web', editForm.value.web)
    formData.append('address', editForm.value.address)
    formData.append('date', editForm.value.date)

    // 2. 头像处理逻辑优化
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value)
    } else if (!editForm.value.avatar) {
      formData.append('removeAvatar', 'true')
    }

    // 3. 发送请求（使用完整路径）
    const res = await axios.put(
      `http://localhost:3000/api/users/${editForm.value.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    // 4. 响应处理
    if (!res.data?.data?.avatar) {
      throw new Error('头像更新失败')
    }

    // 5. 更新本地数据
    const index = data.value.arr.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      data.value.arr[index] = {
        ...data.value.arr[index],
        ...res.data.data,
        avatar: res.data.data.avatar || null
      }
    }

    ElMessage.success('修改成功')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error(`操作失败: ${error.message}`)
  }
}

// 错误解析函数
const parseError = (error) => {
  if (error.code === 'ECONNABORTED') return '请求超时'
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return error.response.data?.error || '参数错误'
      case 413:
        return '文件大小超过限制'
      case 415:
        return '不支持的文件类型'
      default:
        return `服务器错误（${error.response.status}）`
    }
  }
  return error.message
}

// 错误处理函数
const getErrorMessage = (error) => {
  if (error.response) {
    const status = error.response.status
    switch (status) {
      case 400:
        return '请求参数错误：' + JSON.stringify(error.response.data.errors)
      case 413:
        return '文件大小超过限制'
      case 415:
        return '不支持的媒体类型'
      default:
        return `服务器错误（${status}）`
    }
  }
  return error.message
}
</script>

<style scoped>
.top {
  margin: 10px;
  justify-self: center;
}

.top label {
  font-weight: bold;
  font-size: 40px;
  letter-spacing: 5px;
}

.add {
  margin: 10px 150px;
}

.pagination {
  justify-content: center;
  margin: 20px;
}

.action-button {
  margin: 2px;
}

.el-table {
  font-size: 14px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: bold;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fafafa;
}

.avatar-cell {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.avatar-placeholder {
  color: #909399;
  font-size: 12px;
}

.avatar-manager {
  display: flex;
  gap: 15px;
  align-items: center;
}

.preview-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #ebeef5;
}
</style>