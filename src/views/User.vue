<template>
  <el-config-provider :locale="locale">
    <div class="top">
      <label>用户管理</label>
    </div>
    <el-button type="success" class="add" @click="add">添加用户</el-button>
    <el-table :data="data.arr" border style="width: 80%; margin: 10px auto;" stripe>
      <el-table-column prop="id" label="编号" width="80" header-align="center" align="center" />
      <el-table-column prop="name" label="姓名" header-align="center" align="center" />
      <el-table-column prop="web" label="网站" width="300" header-align="center" align="center" />
      <el-table-column prop="address" label="地址" header-align="center" align="center" />
      <el-table-column prop="date" label="日期" header-align="center" align="center" />
      <el-table-column label="操作" width="150" header-align="center" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="saveEdit(scope.row)" class="action-button">
            编辑
          </el-button>
          <!-- 修改后 -->
          <el-button @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

const saveEdit = async () => {
  try {
    await axios.put(`http://localhost:3000/api/users/${editForm.value.id}`, editForm.value);
    const index = data.value.arr.findIndex((item) => item.id === editForm.value.id);
    if (index !== -1) {
      data.value.arr[index] = { ...editForm.value };
    }
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error('保存失败');
    console.error(error);
  }
};
</script>

<style scoped>
/* 样式保持不变 */
</style>
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
</style>