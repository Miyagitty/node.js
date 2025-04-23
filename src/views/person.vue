<template>
  <el-card class="person-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <label>个人空间</label>
      <h5>欢迎回来，超级管理员</h5>
    </div>
    <!-- 个人信息 -->
    <el-card class="profile-card">
      <div class="profile-header">
        <el-avatar :size="80" src="/lsg_r.png" />
        <div class="profile-info">
          <h3>超级管理员</h3>
          <el-tag type="danger">VIP 会员</el-tag>
        </div>
      </div>

      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <div class="stat-item">
            <el-icon :size="30" color="#E6A23C">
              <Coin />
            </el-icon>
            <div>
              <h4>{{ jf }}</h4>
              <p>账户积分</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <el-icon :size="30" color="#F56C6C">
              <Discount />
            </el-icon>
            <div>
              <h4>{{ cupon }}</h4>
              <p>可用优惠券</p>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <el-icon :size="30" color="#409EFF">
              <Box />
            </el-icon>
            <div>
              <h4>{{ orderCount }}</h4>
              <p>待处理订单</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <h2 style="margin: 0px;">购物车</h2>
    <div class="shoppingcart">
      <el-card :body-style="{ padding: '0px' }">
        <el-row :gutter="20">
          <el-col :offset="1" :xs="10" :sm="8" :md="6" :lg="4" v-for="(item, index) in 4" :key="index">
            <el-card shadow="hover" class="goods-card" @click="viewDetail(item)">
              <el-image src="/天选5pro.jpg" fit="cover" class="product-image" />
              <div class="product-info">
                <h4>天选5pro {{ index + 1 }}</h4>
                <el-text type="danger" class="price">¥{{ 4999 + index * 100 }}</el-text>
                <el-button type="danger" size="small" class="cart-btn" @click.stop="addToCart(item)">
                  立即购买
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <div class="end">
      <h2>维权专区</h2>
      <el-button type="danger"><el-icon>
          <User />
        </el-icon>联系客服 >
      </el-button>
    </div>

    <!-- 主要功能 -->
    <el-row :gutter="24" class="function-modules">
      <!-- 订单管理 -->
      <el-col :span="10">
        <el-card class="module-card">
          <div class="card-header">
            <el-icon :size="30" color="#409EFF">
              <List />
            </el-icon>
            <h3>订单管理</h3>
          </div>
          <el-tabs type="border-card">
            <el-tab-pane label="最近订单">
              <el-table :data="orders" height="250">
                <el-table-column prop="id" label="订单号" width="120" />
                <el-table-column label="商品">
                  <template #default="{ row }">
                    <el-image :src="row.image" style="width:50px;height:50px" />
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="金额" width="100" />
                <el-table-column label="状态" width="120">
                  <template #default="{ row }">
                    <el-tag :type="statusType[row.status]">
                      {{ statusText[row.status] }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="{ row }">
                    <el-button size="small" @click="viewOrder(row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

      <!-- 账户安全 -->
      <el-col :span="6">
        <el-card class="module-card">
          <div class="card-header">
            <el-icon :size="30" color="#67C23A">
              <Lock />
            </el-icon>
            <h3>账户安全</h3>
          </div>
          <div class="security-list">
            <div class="security-item">
              <el-icon>
                <Phone />
              </el-icon>
              <span>绑定手机：178****1234</span>
              <el-button type="text">修改</el-button>
            </div>
            <div class="security-item">
              <el-icon>
                <Message />
              </el-icon>
              <span>绑定邮箱：user***@example.com</span>
              <el-button type="text">验证</el-button>
            </div>
            <div class="security-item">
              <el-icon>
                <Key />
              </el-icon>
              <span>登录密码</span>
              <el-button type="text">修改</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 收货地址 -->
      <el-col :span="6">
        <el-card class="module-card" style="margin-top:20px">
          <div class="card-header">
            <el-icon :size="30" color="#E6A23C">
              <Location />
            </el-icon>
            <h3>收货地址</h3>
          </div>
          <el-collapse v-model="activeAddress">
            <el-collapse-item v-for="(addr, index) in addresses" :key="index" :title="addr.name + ' ' + addr.phone"
              :name="index">
              <p>{{ addr.province }} {{ addr.city }} {{ addr.district }}</p>
              <p>{{ addr.detail }}</p>
              <div class="address-actions">
                <el-button type="text">设为默认</el-button>
                <el-button type="text">编辑</el-button>
                <el-button type="text" style="color:#F56C6C">删除</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-button type="primary" plain style="margin-top:10px">
            <el-icon>
              <CirclePlus />
            </el-icon>新增地址
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
const cupon = ref(99)
const jf = ref(9999)
const orderCount = ref(3)
const activeAddress = ref([0])

const statusType = {
  0: 'warning',
  1: 'success',
  2: 'info'
}

const statusText = {
  0: '待付款',
  1: '已发货',
  2: '已完成'
}


const orders = ref([
  { id: '20240520001', image: '/天选5pro.jpg', amount: '7999.00', status: 0 },
  { id: '20240519002', image: 'https://img13.360buyimg.com/n7/jfs/t1/271675/11/20300/178305/67fc8481F577f4ca1/9fb55b7baffa90e8.jpg', amount: '7999.20', status: 1 },
  { id: '20240518003', image: '/天选5pro.jpg', amount: '7999.00', status: 2 }
])

const addresses = ref([
  {
    name: '张三',
    phone: '178****1234',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园路123号'
  },
  {
    name: '李四',
    phone: '139****5678',
    province: '北京市',
    city: '朝阳区',
    district: '望京街道',
    detail: '国际大厦A座'
  }
])

const viewOrder = (order) => {
  ElMessage.info(`查看订单 ${order.id}`)
}
</script>

<style scoped>
.person-container {
  margin: 20px;
}

.page-header label {
  font-weight: bold;
  font-size: 40px;
  letter-spacing: 5px;
  margin-left: 10px;
}

.page-header h5 {
  color: #999;
  margin: 10px 0 20px 15px;
}

.profile-card {
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 15px;
}

.profile-info {
  margin-left: 20px;
}

.profile-info h3 {
  margin: 0 0 5px 0;
}

.stats-row {
  margin-top: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-item h4 {
  margin: 0 0 0 10px;
  font-size: 24px;
}

.stat-item p {
  margin: 5px 0 0 10px;
  color: #666;
}

.shoppingcart {
  margin: 5px;
}

.goods-card {
  transition: transform 0.3s;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;
}

.goods-card:hover {
  transform: translateY(-5px);
}

.el-col {
  border-radius: 4px;
  margin-right: 20px;
}

.cart-btn {
  margin-left: 30px;
  width: 50%;
}

.end {
  margin: 10px 0 10px;
}

.function-modules {
  margin: 20px 0;
}

.module-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.module-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin-left: 10px;
}

.security-list {
  padding: 10px;
}

.security-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.security-item:last-child {
  border-bottom: none;
}

.security-item span {
  flex: 1;
  margin-left: 10px;
}

.address-actions {
  margin-top: 10px;
  text-align: right;
}
</style>