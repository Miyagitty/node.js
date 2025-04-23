<template>
  <el-card class="shopping-container">
    <div class="top">
      <label>商品中心</label>
      <h5>笔电商城郑重承诺贵必赔，假必赔</h5>
    </div>

    <!-- 分类导航 -->
    <el-tabs v-model="activeCategory" class="category-tabs">
      <el-row :gutter="20" class="product-list">
        <el-col :span="6" v-for="(product, index) in filteredProducts" :key="index" class="product-col">
          <el-card class="product-card" :body-style="{ padding: '0px' }" shadow="hover">
            <div class="tag-container">
              <el-tag v-if="product.isHot" type="danger" effect="dark">热销</el-tag>
              <el-tag v-if="product.stock < 10" type="warning" effect="plain">仅剩{{ product.stock }}件</el-tag>
            </div>

            <el-image :src="product.image" fit="cover" class="product-image" :preview-src-list="[product.image]" />

            <div class="product-info">
              <h4 class="product-title">{{ product.name }}</h4>

              <div class="price-section">
                <span class="current-price">¥{{ product.price }}</span>
                <span class="original-price">¥{{ product.originalPrice }}</span>
              </div>

              <div class="stats">
                <span class="sales">
                  <el-icon>
                    <SoldOut />
                  </el-icon>
                  销量 {{ product.sales }}
                </span>
                <el-rate v-model="product.rating" disabled show-score text-color="#ff9900" score-template="{value}分" />
              </div>

              <div class="actions">
                <el-button type="danger" plain @click="addToCart(product)">
                  <el-icon>
                    <ShoppingCart />
                  </el-icon>加入购物车
                </el-button>
                <el-button type="info" circle @click="quickView(product)">
                  <el-icon>
                    <ZoomIn />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-pagination class="pagination" background layout="prev, pager, next" :total="100" :page-size="8"
        @current-change="handlePageChange" />
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ShoppingCart, ZoomIn, SoldOut } from '@element-plus/icons-vue'

// 商品数据
const products = ref(Array(8).fill().map((_, i) => ({
  id: i + 1,
  name: '天选5pro',
  price: 5999.00,
  originalPrice: 8999.00,
  image: '/天选5pro.jpg',
  sales: Math.floor(Math.random() * 1000),
  rating: Number((Math.random() * 3 + 2).toFixed(1)),
  stock: Math.floor(Math.random() * 50),
  isHot: Math.random() > 0.5
})))

const filter = ref({
  minPrice: 0,
  maxPrice: 10000,
  sortBy: 'sales'
})

const filteredProducts = computed(() => {
  return [...products.value].sort((a, b) => {
    switch (filter.value.sortBy) {
      case 'sales': return b.sales - a.sales
      case 'price_asc': return a.price - b.price
      case 'price_desc': return b.price - a.price
      case 'rating': return b.rating - a.rating
      default: return 0
    }
  })
})

const handlePageChange = (page) => {
  console.log('当前页码:', page)
}

const addToCart = (product) => {
  ElMessage.success(`已添加 ${product.name} 到购物车`)
}

const quickView = (product) => {
  ElMessage.info(`快速查看 ${product.name}`)
}
</script>

<style scoped>
.top {
  padding: 10px 20px 10px;
}

.top label {
  font-weight: bold;
  font-size: 40px;
  letter-spacing: 5px;
  margin: 0 0 0 10px;
}

.top h5 {
  margin: 0;
}

.shopping-container {
  margin: 20px;
}

.category-tabs {
  margin-top: 20px;
}

.product-col {
  margin-bottom: 20px;
}

.product-card {
  position: relative;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.tag-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}

.product-image {
  width: 100%;
  height: 200px;
}

.product-info {
  padding: 15px;
}

.product-title {
  margin: 0 0 10px;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-section {
  margin-bottom: 10px;
}

.current-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}

.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.pagination {
  margin: 20px 0;
  justify-content: center;
}

.el-col {
  border-radius: 4px;
  margin-bottom: 5px;
}
</style>