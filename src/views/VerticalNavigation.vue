<template>
  <div class="layout-container">
    <div class="nav-container">
      <el-menu router background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">

        <el-menu-item index="index">
          <template #title>
            <el-icon>
              <Search />
            </el-icon>
            <span>首页</span>
          </template>
        </el-menu-item>
        <el-menu-item index="person">
          <el-icon>
            <Edit />
          </el-icon>
          <template #title>用户中心</template>
        </el-menu-item>
        <el-menu-item index="shopping">
          <template #title>
            <el-icon>
              <Search />
            </el-icon>
            <span>商品中心</span>
          </template>
        </el-menu-item>
        <el-menu-item index="others">
          <el-icon>
            <Setting />
          </el-icon>
          <template #title>其他</template>
        </el-menu-item>
        <el-menu-item index="user">
          <el-icon>
            <Setting />
          </el-icon>
          <template #title>用户管理（后端）</template>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="content-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Search, Edit, Setting } from '@element-plus/icons-vue';


</script>

<style scoped>
.layout-container {
  display: flex;
  height: 90%;
}

.nav-container {
  width: 200px;
  background-color: #545c64;
}

.content-container {
  flex: 1;
}
</style>