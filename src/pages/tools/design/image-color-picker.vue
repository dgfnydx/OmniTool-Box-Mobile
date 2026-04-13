<template>
  <ToolLayout :title="$t('tools.image-color-picker.name')">
    <!-- 上传区 -->
    <view v-if="!imagePath" class="upload-box card shadow-md" @tap="handleChooseImage">
      <view class="upload-icon">📸</view>
      <text class="upload-text">{{ $t('tools.image-color-picker.uploadTip') }}</text>
      <button class="upload-btn">{{ $t('tools.image-color-picker.uploadBtn') }}</button>
    </view>

    <!-- 取色区 -->
    <view v-else class="picker-container">
      <view class="image-section card shadow-md mb-4">
        <view class="image-wrapper" @tap="handleImageClick">
          <image 
            id="source-image"
            class="preview-image" 
            :src="imagePath" 
            mode="widthFix"
            @load="onImageLoad"
          />
          <!-- 用于取色的隐藏 Canvas -->
          <canvas 
            canvas-id="picker-canvas" 
            id="picker-canvas"
            class="hidden-canvas"
            :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
          ></canvas>
        </view>
        <view class="image-footer">
          <text class="tip">💡 点击图片任意位置取色</text>
          <text class="action-link delete" @tap="handleReset">{{ $t('common.actions.clear') }}</text>
        </view>
      </view>

      <!-- 结果面板 -->
      <view class="result-panel card shadow-md mb-4">
        <view class="picked-header">
          <view class="color-preview" :style="{ backgroundColor: pickedColor }"></view>
          <view class="picked-info">
            <text class="label">{{ $t('tools.image-color-picker.pickedColor') }}</text>
            <text class="value">{{ pickedColor.toUpperCase() }}</text>
          </view>
        </view>
        
        <view class="format-list border-t mt-4 pt-4">
          <view v-for="fmt in colorFormats" :key="fmt.label" class="format-item">
            <text class="fmt-label">{{ fmt.label }}</text>
            <text class="fmt-value">{{ fmt.value }}</text>
            <text class="copy-icon" @tap="handleCopy(fmt.value)">📋</text>
          </view>
        </view>
      </view>

      <!-- 历史记录 -->
      <view v-if="history.length > 0" class="history-section card shadow-sm">
        <text class="label mb-2">{{ $t('tools.image-color-picker.history') }}</text>
        <view class="history-grid">
          <view 
            v-for="color in history" 
            :key="color" 
            class="history-item"
            :style="{ backgroundColor: color }"
            @tap="pickedColor = color"
          ></view>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import { colord } from 'colord';

const { t } = useI18n();
const { proxy } = getCurrentInstance();

const imagePath = ref('');
const pickedColor = ref('#6366f1');
const history = ref([]);
const canvasWidth = ref(300);
const canvasHeight = ref(300);
const imgOriginalWidth = ref(0);
const imgOriginalHeight = ref(0);

const colorFormats = computed(() => {
  const c = colord(pickedColor.value);
  return [
    { label: 'HEX', value: c.toHex().toUpperCase() },
    { label: 'RGB', value: c.toRgbString() },
    { label: 'HSL', value: c.toHslString() }
  ];
});

const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      imagePath.value = res.tempFilePaths[0];
      uni.getImageInfo({
        src: imagePath.value,
        success: (info) => {
          imgOriginalWidth.value = info.width;
          imgOriginalHeight.value = info.height;
        }
      });
    }
  });
};

const onImageLoad = (e) => {
  // 根据显示宽度动态调整 Canvas 尺寸
  const query = uni.createSelectorQuery().in(proxy);
  query.select('.preview-image').boundingClientRect(data => {
    if (data) {
      canvasWidth.value = data.width;
      canvasHeight.value = data.height;
      
      // 在 Canvas 上绘制图片以便取色
      const ctx = uni.createCanvasContext('picker-canvas', proxy);
      ctx.drawImage(imagePath.value, 0, 0, data.width, data.height);
      ctx.draw();
    }
  }).exec();
};

const handleImageClick = (e) => {
  // 获取点击坐标 (相对于图片的坐标)
  // 在 H5 端可以直接从 event 获取偏移，在小程序端通常需要结合 boundingClientRect
  const query = uni.createSelectorQuery().in(proxy);
  query.select('.preview-image').boundingClientRect(data => {
    if (data) {
      // #ifdef MP-WEIXIN
      const x = Math.floor(e.detail.x - data.left);
      const y = Math.floor(e.detail.y - data.top);
      // #endif
      
      // #ifdef H5
      const x = Math.floor(e.detail.x - data.left);
      const y = Math.floor(e.detail.y - data.top);
      // #endif
      
      // 如果点击在图片外，不处理 (通常由于 padding/gap)
      if (x < 0 || y < 0 || x > data.width || y > data.height) return;

      uni.canvasGetImageData({
        canvasId: 'picker-canvas',
        x: x,
        y: y,
        width: 1,
        height: 1,
        success: (res) => {
          const [r, g, b, a] = res.data;
          const hex = colord({ r, g, b, a: a / 255 }).toHex();
          pickedColor.value = hex;
          
          if (!history.value.includes(hex)) {
            history.value.unshift(hex);
            if (history.value.length > 10) history.value.pop();
          }
        },
        fail: (err) => {
          console.error('取色失败:', err);
          uni.showToast({ title: t('tools.image-color-picker.canvasError'), icon: 'none' });
        }
      }, proxy);
    }
  }).exec();
};

const handleCopy = (val) => {
  uni.setClipboardData({
    data: val,
    success: () => {
      uni.showToast({ title: t('tools.image-color-picker.copySuccess'), icon: 'success' });
    }
  });
};

const handleReset = () => {
  imagePath.value = '';
};
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  border: 4rpx dashed #e2e8f0;
}

.upload-icon {
  font-size: 80rpx;
  margin-bottom: 30rpx;
}

.upload-text {
  font-size: 28rpx;
  color: #64748b;
  margin-bottom: 40rpx;
}

.upload-btn {
  background: #6366f1;
  color: white;
  border-radius: 100rpx;
  padding: 0 60rpx;
  font-size: 28rpx;
}

.picker-container {
  display: flex;
  flex-direction: column;
}

.image-section {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12rpx;
  background: #f1f5f9;
  display: flex;
  justify-content: center;
}

.preview-image {
  width: 100%;
  display: block;
}

.hidden-canvas {
  position: absolute;
  left: -9999px;
  top: -9999px;
  visibility: hidden;
}

.image-footer {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tip {
  font-size: 24rpx;
  color: #94a3b8;
}

.action-link {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 600;
}

.action-link.delete {
  color: #ef4444;
}

.result-panel {
  padding: 40rpx;
}

.picked-header {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.color-preview {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  border: 4rpx solid #f1f5f9;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.picked-info {
  display: flex;
  flex-direction: column;
}

.picked-info .label {
  font-size: 24rpx;
  color: #94a3b8;
  margin-bottom: 8rpx;
}

.picked-info .value {
  font-size: 40rpx;
  font-weight: 800;
  color: #1e293b;
  font-family: monospace;
}

.format-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.format-item {
  display: flex;
  align-items: center;
  background: #f8fafc;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
}

.fmt-label {
  width: 80rpx;
  font-size: 22rpx;
  font-weight: 800;
  color: #64748b;
}

.fmt-value {
  flex: 1;
  font-size: 26rpx;
  color: #475569;
  font-family: monospace;
}

.copy-icon {
  font-size: 32rpx;
  padding-left: 20rpx;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60rpx, 1fr));
  gap: 16rpx;
}

.history-item {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  border: 2rpx solid #f1f5f9;
}

.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02); }
.mb-4 { margin-bottom: 30rpx; }
.mt-4 { margin-top: 30rpx; }
.pt-4 { padding-top: 30rpx; }
.border-t { border-top: 2rpx solid #f1f5f9; }
</style>
