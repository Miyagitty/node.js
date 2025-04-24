<template>
  <el-card class="shopping-container">
    <div class="top">
      <label>商品中心</label>
      <h5>笔电商城郑重承诺贵必赔，假必赔</h5>
    </div>

    <el-form-item>
      <el-button type="success" @click="openAddDialog">
        <el-icon>
          <Plus />
        </el-icon>新增商品
      </el-button>
    </el-form-item>

    <el-dialog v-model="dialogVisible" :title="isEditMode ? '编辑商品' : '新增商品'" width="600px">
      <el-form ref="formRef" :model="formModel" label-width="80px" :rules="formRules">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="当前价格" prop="price">
          <el-input-number v-model="formModel.price" :precision="2" :min="0" />
        </el-form-item>

        <el-form-item label="原价">
          <el-input-number v-model="formModel.originalPrice" :precision="2" :min="0" />
        </el-form-item>

        <el-form-item label="库存量" prop="stock">
          <el-input-number v-model="formModel.stock" :min="0" />
        </el-form-item>

        <!-- 修改el-form-item部分 -->
        <el-form-item label="商品图片">
          <div class="image-uploader">
            <el-upload :show-file-list="false" :auto-upload="false" :on-change="handleImageSelect">
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">建议尺寸 800x800px，支持JPG/PNG格式，大小不超过2MB</div>
              </template>
            </el-upload>

            <!-- 添加预览区域 -->
            <div class="preview-container" v-if="tempImage || formModel.image">
              <el-image :src="tempImage || `http://localhost:3001${formModel.image}`" class="preview-image"
                fit="cover" />
              <div class="preview-actions">
                <el-button type="danger" size="small" @click="clearTempImage" :icon="Delete" circle />
                <span class="preview-text">{{ tempImage ? '新上传' : '当前' }}图片</span>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="是否热销">
          <el-switch v-model="formModel.isHot" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>


    <!-- 商品筛选 -->
    <el-card class="filter-card">
      <el-form :inline="true" class="filter-form">
        <el-form-item label="价格范围">
          <el-input-number v-model="filter.minPrice" :precision="2" :min="0" />
          <span class="price-separator">-</span>
          <el-input-number v-model="filter.maxPrice" :precision="2" :min="0" />
        </el-form-item>

        <el-form-item label="排序方式">
          <el-select v-model="filter.sortBy" placeholder="请选择" style="width: 200px">
            <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>查询
          </el-button>
        </el-form-item>

        <el-form-item label="商品搜索">
          <el-input v-model="filter.keyword" placeholder="请输入商品名称" clearable @keyup.enter="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 新增搜索按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSearch" style="margin-left: 10px;">
            <el-icon>
              <Search />
            </el-icon>搜索
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- 分类导航 -->
    <el-tabs class="category-tabs">
      <el-row :gutter="20" class="product-list">
        <el-col class="product-col" :span="4.8" v-for="(product, index) in filteredProducts" :key="index">

          <el-card class="product-card" :body-style="{ padding: '0px' }" shadow="hover">
            <div class="tag-container">
              <el-tag v-if="product.isHot" type="danger" effect="dark">热销</el-tag>
              <el-tag v-if="product.stock < 10" type="warning" effect="plain">仅剩{{ product.stock }}件</el-tag>
            </div>

            <!-- 修改el-image组件 -->
            <el-image :src="`http://localhost:3001${product.image}`" fit="cover" class="product-image"
              :preview-src-list="[`http://localhost:3001${product.image}`]" />

            <!-- 修改后 -->
            <el-button v-if="tempImage || (isEditMode && formModel.image)" @click="clearTempImage">
              移除图片
            </el-button>

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
                <el-button type="primary" circle @click="openEditDialog(product)">
                  <el-icon>
                    <Edit />
                  </el-icon>
                </el-button>
                <el-button type="danger" circle @click="deleteProduct(product.id)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页组件 -->
      <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize"
        :current-page="currentPage" @current-change="handlePageChange" />
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ShoppingCart, ZoomIn, SoldOut, Refresh } from '@element-plus/icons-vue'
import { Plus, Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 添加分页相关变量
const pageSize = ref(10);
const total = ref(0);
const currentPage = ref(1);

// 新增临时存储变量
const tempImage = ref(null) // 存储预览图URL
const tempImageFile = ref(null) // 存储文件对象

// 在 setup 作用域顶部定义方法
const clearTempImage = () => {
  tempImage.value = null
  tempImageFile.value = null
}
const formRef = ref(null)

// 商品数据
const products = ref([])

// 修改后的获取商品方法
const getData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/products', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        sortBy: filter.value.sortBy,
        minPrice: filter.value.minPrice,
        maxPrice: filter.value.maxPrice,
        keyword: filter.value.keyword
      }
    });
    products.value = response.data.products;
    total.value = response.data.total;
  } catch (error) {
    ElMessage.error('获取商品数据失败');
  }
};

// 查询功能
const handleSearch = () => {
  currentPage.value = 1; // 搜索时重置到第一页
  getData();
};

// 筛选功能

const filter = ref({
  minPrice: 0,
  maxPrice: 110000,
  sortBy: 'sales',
  keyword: '',
})

const sortOptions = ref([
  { label: '销量排序', value: 'sales' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' },
  { label: '评分排序', value: 'rating' }
])

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // 模糊搜索商品名称
    const keyword = filter.value.keyword.toLowerCase()
    return product.name.toLowerCase().includes(keyword)
  }).sort((a, b) => {
    switch (filter.value.sortBy) {
      case 'sales': return b.sales - a.sales
      case 'price_asc': return a.price - b.price
      case 'price_desc': return b.price - a.price
      case 'rating': return b.rating - a.rating
      default: return 0
    }
  })
})

// 在组件挂载时获取数据
onMounted(() => {
  getData()
})



const handlePageChange = (page) => {
  currentPage.value = page;  // 新增页码更新
  getData();           // 新增数据重新获取
  console.log('当前页码:', page)
}

const addToCart = (product) => {
  ElMessage.success(`已添加 ${product.name} 到购物车`)
}

const quickView = (product) => {
  ElMessage.info(`快速查看 ${product.name}`)
}

const dialogVisible = ref(false)
const isEditMode = ref(false)
const formModel = ref({
  name: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  image: '',
  isHot: false
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
  price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
  stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }]
}

// 打开新增对话框
const openAddDialog = () => {
  isEditMode.value = false
  formModel.value = {
    name: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    image: '',
    isHot: false
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (product) => {
  isEditMode.value = true
  formModel.value = { ...product }
  dialogVisible.value = true
}


const submitForm = async () => {
  try {
    // 添加表单验证检查
    const valid = await formRef.value.validate()
    if (!valid) return // 验证不通过时中止
    const formData = new FormData()

    // 调试日志
    console.log('编辑模式:', isEditMode.value)
    console.log('表单数据:', formModel.value)

    // 基础字段
    formData.append('name', formModel.value.name)
    formData.append('price', String(formModel.value.price))
    formData.append('originalPrice', String(formModel.value.originalPrice))
    formData.append('stock', String(formModel.value.stock))
    formData.append('isHot', formModel.value.isHot ? 'true' : 'false')

    // 图片处理
    if (tempImageFile.value) {
      formData.append('image', tempImageFile.value)
    } else if (isEditMode.value && formModel.value.image) {
      formData.append('image', formModel.value.image)
    }

    // 请求配置
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }

    const url = isEditMode.value
      ? `http://localhost:3001/api/products/${formModel.value.id}`
      : 'http://localhost:3001/api/products'

    const method = isEditMode.value ? 'put' : 'post'

    const response = await axios[method](url, formData, config)
    console.log('完整响应:', response)
    console.log('响应数据:', response.data)

    if (response.data) {
      ElMessage.success(isEditMode.value ? '修改成功' : '新增成功')
      await getData()
      clearTempImage()
      dialogVisible.value = false
    }
  } catch (error) {
    console.error('完整错误对象:', error)
    ElMessage.error(`操作失败: ${error.response?.data?.message || error.message}`)
  }
}
// 删除商品
const deleteProduct = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', { type: 'warning' })
    await axios.delete(`http://localhost:3001/api/products/${id}`)
    ElMessage.success('删除成功')
    getData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}


// 新增文件选择处理
const handleImageSelect = (file) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.raw.type)) {
    ElMessage.error('只支持 JPG/PNG/WEBP 格式')
    return
  }
  if (file.raw.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过2MB')
    return
  }
  tempImage.value = URL.createObjectURL(file.raw)
  tempImageFile.value = file.raw
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

/* 添加栅格系统响应式 */
.product-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.product-col {
  width: 20%;
  /* 5列布局 (100% / 5 = 20%) */
  padding: 0 10px;
  box-sizing: border-box;
}

/* 移除Element默认的span设置 */
.product-col {
  max-width: 20%;
  flex: 0 0 20%;
}

/* 新增样式 */
.image-uploader {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.preview-container {
  position: relative;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
}

.preview-image {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 4px;
}

.preview-actions {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 5px;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
}

.preview-text {
  color: white;
  font-size: 12px;
}
</style>