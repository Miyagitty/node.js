<template>
  <el-card class="others-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <label>其他功能</label>
      <h5>更多服务与设置选项</h5>
    </div>

    <!-- 功能模块 -->
    <el-row :gutter="20" class="function-modules">
      <!-- 常见问题 -->
      <el-col :span="8">
        <el-card class="module-card">
          <div class="card-header">
            <el-icon :size="30" color="#409EFF">
              <QuestionFilled />
            </el-icon>
            <h3>常见问题</h3>
          </div>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="如何申请退货？" name="1">
              <div>进入订单详情页，点击"申请售后"按钮...</div>
            </el-collapse-item>
            <el-collapse-item title="优惠券如何使用？" name="2">
              <div>结算时选择可用优惠券...</div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>

      <!-- 系统设置 -->
      <el-col :span="8">
        <el-card class="module-card">
          <div class="card-header">
            <el-icon :size="30" color="#67C23A">
              <Tools />
            </el-icon>
            <h3>系统设置</h3>
          </div>
          <div class="settings">
            <el-form label-width="100px">
              <el-form-item label="消息通知">
                <el-switch v-model="settings.notification" />
              </el-form-item>
              <el-form-item label="主题颜色">
                <el-color-picker v-model="settings.themeColor" />
              </el-form-item>
              <el-form-item label="语言选择">
                <el-select v-model="settings.language">
                  <el-option label="中文" value="zh" />
                  <el-option label="English" value="en" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <!-- 关于我们 -->
      <el-col :span="8">
        <el-card class="module-card">
          <div class="card-header">
            <el-icon :size="30" color="#E6A23C">
              <InfoFilled />
            </el-icon>
            <h3>关于我们</h3>
          </div>
          <div class="about-content">
            <el-image src="/c.png" fit="cover" style="width:100px;height:100px;margin:10px auto;display:block">
            </el-image>
            <p>笔电商城 v1.0.0</p>
            <p>© 2025 笔电科技 版权所有</p>
            <el-button type="info" plain @click="checkUpdate">
              检查更新 <el-icon>
                <Refresh />
              </el-icon>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 技术支持 -->
    <el-card class="support-card">
      <div class="support-content">
        <el-icon :size="40" color="#909399">
          <Headset />
        </el-icon>
        <div class="support-info">
          <h4>7x24小时技术支持</h4>
          <p>服务热线：400-123-4567</p>
          <p>在线客服：工作日 9:00-21:00</p>
        </div>
      </div>
    </el-card>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import {
  QuestionFilled,
  Tools,
  InfoFilled,
  Refresh,
  Headset
} from '@element-plus/icons-vue'

const activeNames = ref(['1'])
const settings = ref({
  notification: true,
  themeColor: '#409EFF',
  language: 'zh'
})

const checkUpdate = () => {
  ElMessage.info('当前已是最新版本')
}
</script>

<style scoped>
.others-container {
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

.settings {
  padding: 0 15px;
}

.about-content {
  text-align: center;
  padding: 10px;
}

.about-content p {
  margin: 8px 0;
  color: #666;
}

.support-card {
  margin-top: 20px;
}

.support-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.support-info {
  margin-left: 20px;
}

.support-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.support-info p {
  margin: 5px 0;
  color: #666;
}
</style>