<template>
  <ToolLayout :title="t('tools.qr-generator.name')">
    <view class="workspace">
      <!-- 输入区域 -->
      <view class="card shadow-md mb-4">
        <text class="label">{{ t('tools.qr-generator.content') }}</text>
        <textarea 
          v-model="text" 
          :placeholder="t('tools.qr-generator.placeholder')" 
          class="content-textarea"
          maxlength="-1"
        ></textarea>
        
        <view class="settings-grid mt-4">
          <view class="setting-item">
            <text class="s-label">{{ t('tools.qr-generator.size') }} ({{ size }}px)</text>
            <slider :value="size" @change="e => size = e.detail.value" min="128" max="512" step="16" activeColor="#6366f1" />
          </view>
          
          <view class="setting-item">
            <text class="s-label">{{ t('tools.qr-generator.fgColor') }}</text>
            <view class="color-picker-mock" @tap="pickColor('fg')">
              <view class="color-preview" :style="{ backgroundColor: fgColor }"></view>
              <text class="color-text">{{ fgColor.toUpperCase() }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 预览和下载 -->
      <view class="preview-section card shadow-sm">
        <view class="qr-wrapper">
          <!-- 实际显示的图片 -->
          <image v-if="qrDataUrl" :src="qrDataUrl" class="qr-image" mode="aspectFit"></image>
          <view v-else class="qr-placeholder">
            <text>等待输入内容...</text>
          </view>
          
          <!-- 隐藏的绘制 Canvas -->
          <canvas 
            canvas-id="qrcodeCanvas" 
            id="qrcodeCanvas"
            :style="{ width: size + 'px', height: size + 'px', position: 'absolute', left: '-9999px', top: '-9999px' }"
          ></canvas>
        </view>
        
        <button 
          class="download-btn mt-4" 
          :disabled="!qrDataUrl"
          @tap="handleSave"
        >
          <text class="btn-icon">💾</text>
          <text>{{ t('tools.qr-generator.download') }}</text>
        </button>
      </view>
    </view>
    
    <!-- 简易颜色选择器 -->
    <view v-if="showColorPicker" class="color-modal" @tap="showColorPicker = false">
      <view class="color-content" @tap.stop>
        <view 
          v-for="c in presetColors" 
          :key="c" 
          class="color-option" 
          :style="{ backgroundColor: c }"
          @tap="selectColor(c)"
        ></view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import UQRCode from 'uqrcodejs';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const text = ref('https://omni-tool-box.arbays.com/');
const size = ref(256);
const fgColor = ref('#000000');
const bgColor = ref('#ffffff');
const qrDataUrl = ref('');

const showColorPicker = ref(false);
const pickingTarget = ref('fg');
const presetColors = ['#000000', '#6366f1', '#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#475569'];

const updateQR = () => {
  if (!text.value) {
    qrDataUrl.value = '';
    return;
  }
  
  nextTick(() => {
    try {
      const ctx = uni.createCanvasContext('qrcodeCanvas');
      const qr = new UQRCode();
      qr.data = text.value;
      qr.size = size.value;
      qr.margin = 10;
      qr.backgroundColor = bgColor.value;
      qr.foregroundColor = fgColor.value;
      qr.make();
      
      qr.canvasContext = ctx;
      qr.drawCanvas();
      
      setTimeout(() => {
        uni.canvasToTempFilePath({
          canvasId: 'qrcodeCanvas',
          success: (res) => {
            qrDataUrl.value = res.tempFilePath;
          },
          fail: (err) => {
            console.error('CanvasToTempFilePath Error:', err);
          }
        });
      }, 200);
    } catch (err) {
      console.error('QR Generate Error:', err);
    }
  });
};

const handleSave = () => {
  if (!qrDataUrl.value) return;
  
  // #ifdef H5
  const link = document.createElement('a');
  link.download = `qrcode-${Date.now()}.png`;
  link.href = qrDataUrl.value;
  link.click();
  // #endif
  
  // #ifndef H5
  uni.saveImageToPhotosAlbum({
    filePath: qrDataUrl.value,
    success: () => {
      uni.showToast({ title: '已保存到相册', icon: 'success' });
    },
    fail: () => {
      uni.showToast({ title: '保存失败', icon: 'none' });
    }
  });
  // #endif
};

const pickColor = (target) => {
  pickingTarget.value = target;
  showColorPicker.value = true;
};

const selectColor = (color) => {
  if (pickingTarget.value === 'fg') fgColor.value = color;
  else bgColor.value = color;
  showColorPicker.value = false;
};

watch([text, size, fgColor, bgColor], updateQR);
onMounted(updateQR);
</script>

<style scoped>
.workspace {
  padding-bottom: 40rpx;
}

.card {
  background: #ffffff;
  border-radius: 32rpx;
  padding: 40rpx;
}

.shadow-md {
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03);
}

.shadow-sm {
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01);
}

.label {
  font-size: 26rpx;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 20rpx;
  display: block;
}

.content-textarea {
  width: 100%;
  height: 160rpx;
  background: #f8fafc;
  border-radius: 20rpx;
  padding: 24rpx;
  font-size: 30rpx;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.s-label {
  font-size: 24rpx;
  color: #64748b;
  margin-bottom: 10rpx;
  display: block;
}

.color-picker-mock {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: #f8fafc;
  padding: 16rpx 24rpx;
  border-radius: 16rpx;
  border: 1px solid #e2e8f0;
}

.color-preview {
  width: 40rpx;
  height: 40rpx;
  border-radius: 8rpx;
  border: 1px solid #cbd5e1;
}

.color-text {
  font-size: 26rpx;
  color: #475569;
  font-family: monospace;
}

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
}

.qr-wrapper {
  width: 400rpx;
  height: 400rpx;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.qr-image {
  width: 90%;
  height: 90%;
}

.qr-placeholder {
  font-size: 24rpx;
  color: #94a3b8;
}

.download-btn {
  width: 100%;
  height: 90rpx;
  background: #6366f1;
  color: #ffffff;
  border-radius: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 700;
  gap: 16rpx;
}

.download-btn[disabled] {
  background: #cbd5e1;
}

.color-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.color-content {
  width: 100%;
  background: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 60rpx 40rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40rpx;
}

.color-option {
  aspect-ratio: 1;
  border-radius: 20rpx;
  border: 4rpx solid #f1f5f9;
}

.mt-4 { margin-top: 40rpx; }
</style>
