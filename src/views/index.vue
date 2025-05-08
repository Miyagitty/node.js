<template>
  <el-card class="container">
    <div class="title">
      <h3><img src="/c.png" style="width: 50px;height: 50px;margin: 5px;">欢迎来到笔电商城</h3>
      <div class="login">
        <img src="/lsg_r.png">
        <el-button type="primary" @click="zhuxiao">注销</el-button>
      </div>
    </div>

    <!-- 轮播图 -->
    <el-carousel :interval="5000" arrow="hover" :autoplay="true" :height="bannerHeight + 'px'"
      indicator-position="outside">
      <el-carousel-item v-for="(item, index) in images" :key="index">
        <el-image :src="item" fit="cover" style="width:100%;height:100%"></el-image>
      </el-carousel-item>
    </el-carousel>

    <el-row :gutter="24" class="main-modules">
      <!-- 新增公告模块 -->
      <el-col :span="8">
        <el-card class="notice-module">
          <div class="module-header">
            <el-icon :size="28" color="#409EFF">
              <Bell />
            </el-icon>
            <h3>最新公告</h3>
          </div>
          <el-collapse accordion>
            <el-collapse-item v-for="(notice, index) in notices" :key="index" :title="notice.title">
              {{ notice.content }}
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>

      <!-- 新增服务保障模块 -->
      <el-col :span="16">
        <el-card class="service-module">
          <div class="module-header">
            <el-icon :size="28" color="#67C23A">
              <Checked />
            </el-icon>
            <h3>服务保障</h3>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" v-for="(service, index) in services" :key="index">
              <div class="service-item">
                <el-icon :size="40" :color="service.color">
                  <component :is="service.icon" />
                </el-icon>
                <p class="title">{{ service.title }} {{ service.desc }}</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品推荐 -->
    <el-col :span="24">
      <el-card class="goods-module">
        <div class="module-header">
          <el-icon :size="28" color="#E6A23C">
            <Goods />
          </el-icon>
          <h3>商品推荐</h3>
        </div>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="(item, index) in 12" :key="index">
            <el-card shadow="hover" class="goods-card" @click="viewDetail(item)">
              <el-image src="/天选5pro.jpg" fit="cover" class="product-image" />
              <div class="product-info">
                <h4>天选5pro {{ index + 1 }}</h4>
                <el-text type="danger" class="price">¥{{ 4999 + index * 100 }}</el-text>
                <el-button type="danger" size="small" class="cart-btn" @click.stop="addToCart(item)">
                  加入购物车
                </el-button>
              </div>
            </el-card>
          </el-col>
          <!-- 页脚区域 -->
          <el-button type="danger" @click="goToShopping" class="more-btn" style="margin: auto;">
            探索更多商品 <el-icon>
              <ArrowRight />
            </el-icon>
          </el-button>
        </el-row>
      </el-card>
    </el-col>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElRow, ElCol, ElButton } from 'element-plus';
import { User, Goods, Bell, Checked, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const zhuxiao = () => {
  router.push('/login').then(() => {
    //注销token
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.scrollTo(0, 0); // 滚动到页面顶部
  });
};

const goToShopping = () => {
  router.push('/shopping').then(() => {
    window.scrollTo(0, 0); // 滚动到页面顶部
  });
};

const images = ref([
  'https://file.firebat.com.cn/FuYb6Vqio_alwpS4f4C-F8DPJ4R-',
  'https://p4.lefile.cn/fes/cms/2025/04/11/8x5cnc1seq3axz6goyalai4z9w3jcq445893.jpg',
  'http://www.hasee.com/storage/images/2022/07/19/T8%E6%96%B0%E5%93%81banner.jpg'
])

const screenWidth = ref(window.innerWidth)
const bannerHeight = ref(500 / 1500 * window.innerWidth)

const updateBannerHeight = () => {
  screenWidth.value = window.innerWidth
  bannerHeight.value = 500 / 1500 * screenWidth.value
}

const debounce = (fn, delay) => {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
  }
}

onMounted(() => {
  // 首次加载时,初始化高度
  updateBannerHeight()

  // 窗口大小发生改变时更新高度
  window.addEventListener('resize', debounce(updateBannerHeight, 100))
})

onUnmounted(() => {
  // 组件卸载时移除事件监听器
  window.removeEventListener('resize', debounce(updateBannerHeight, 100))
})

const notices = ref([
  { title: '超值补贴', content: '全场20%优惠，更多优惠等你来拿...' },
  { title: '新品预售', content: 'ROG幻16 2025款即将开启预售' }
])

const services = ref([
  { icon: 'Van', title: '极速物流', desc: '当日发货', color: '#409EFF' },
  { icon: 'Clock', title: '超长保修', desc: '3年质保', color: '#67C23A' },
  { icon: 'Medal', title: '正品保障', desc: '官方授权', color: '#E6A23C' },
  { icon: 'Refresh', title: '无忧退换', desc: '7天无理由', color: '#F56C6C' }
])

</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  /* 修改为上下排列 */
  margin-right: 20px;
}

.container {
  margin: 20px;
  border-radius: 12px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title h3 {
  display: flex;
  align-items: center;
}

.el-carousel {
  padding: 10px 0 10px 20px;
}

/* 切换按钮容器（方形大范围） */
:deep(.el-carousel__arrow) {
  width: 60px;
  /* 按钮宽度 */
  height: 100px;
  /* 按钮高度 */
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  /* 圆角控制方形程度 */
  transition: all 0.3s;
  margin-top: -50px;
  /* 垂直居中 */
}

/* 调整按钮位置 */
:deep(.el-carousel__arrow--left) {
  left: 0;
  border-radius: 0px;
  /* 左侧按钮左直角 */
}

:deep(.el-carousel__arrow--right) {
  right: 0;
  border-radius: 0px;
  /* 右侧按钮右直角 */
}

/* 按钮图标 */
:deep(.el-carousel__arrow i) {
  color: white;
  font-size: 30px;
  /* 放大图标 */
}

/* 统一模块头部样式 */
.module-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.module-header h3 {
  margin-left: 10px;
  font-size: 20px;
}

/* 商品卡片样式 */
.goods-card {
  transition: transform 0.3s;
  cursor: pointer;
  margin-bottom: 20px;
}

.goods-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 180px;
  border-radius: 8px;
}

.product-info {
  padding: 10px;
  text-align: center;
}

.price {
  font-size: 18px;
  margin: 8px 0;
}

.cart-btn {
  width: 100%;
}

/* 服务保障模块 */
.service-item {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background: #f8f8f8;
}

.service-item .title {
  justify-content: center;
  margin: 10px auto;
  font-weight: bold;
}

.service-item .desc {
  color: #666;
  font-size: 12px;
}
</style>