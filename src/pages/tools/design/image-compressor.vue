<template>
  <ToolLayout :title="$t('tools.image-compressor.name')">
    <view class="workspace">
      <!-- 选择图片 -->
      <view v-if="!originalUrl" class="upload-area shadow-sm" @tap="handleChooseImage">
        <text class="upload-icon">📸</text>
        <text class="upload-text">{{ $t('tools.image-compressor.uploadTip') }}</text>
      </view>

      <view v-else class="process-section">
        <!-- 控制面板 -->
        <view class="card shadow-md mb-4">
          <view class="control-group">
            <view class="label-row">
              <text class="label">{{ $t('tools.image-compressor.quality') }}</text>
              <text class="value">{{ quality }}%</text>
            </view>
            <slider :value="quality" @change="e => { quality = e.detail.value; debounceCompress(); }" min="10" max="100" activeColor="#6366f1" block-size="20" />
          </view>

          <view class="control-group mt-4">
            <view class="label-row">
              <text class="label">{{ $t('tools.image-compressor.scale') }}</text>
              <text class="value">{{ Math.round(scale * 100) }}%</text>
            </view>
            <slider :value="scale * 100" @change="e => { scale = e.detail.value / 100; debounceCompress(); }" min="10" max="100" activeColor="#10b981" block-size="20" />
          </view>

          <view class="action-buttons mt-4">
            <button class="primary-btn" @tap="handleSaveImage" :disabled="isProcessing">
              <text class="btn-icon">💾</text>
              <text>{{ $t('tools.image-compressor.download') }}</text>
            </button>
            <button class="secondary-btn" @tap="clearAll">
              <text class="btn-icon">🗑️</text>
            </button>
          </view>
        </view>

        <!-- 对比视图 -->
        <view class="comparison-grid">
          <view class="comparison-card">
            <view class="c-header">
              <text class="c-label">{{ $t('tools.image-compressor.original') }}</text>
              <text class="c-size">{{ formatSize(originalSize) }}</text>
            </view>
            <image :src="originalUrl" mode="aspectFit" class="preview-img"></image>
          </view>

          <view class="comparison-divider" v-if="compressedSize">
            <view class="reduction-badge" :class="{ 'plus': compressedSize > originalSize }">
              {{ compressedSize > originalSize ? '+' : '-' }}{{ reduction }}%
            </view>
            <text class="arrow">↓</text>
          </view>

          <view class="comparison-card">
            <view class="c-header">
              <text class="c-label">{{ $t('tools.image-compressor.compressed') }}</text>
              <text class="c-size active">{{ formatSize(compressedSize) }}</text>
            </view>
            <view class="img-wrapper">
              <view v-if="isProcessing" class="loading-box">
                <text class="loading-spin">⌛</text>
              </view>
              <image :src="compressedUrl" mode="aspectFit" class="preview-img"></image>
            </view>
          </view>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const originalUrl = ref('');
const compressedUrl = ref('');
const originalSize = ref(0);
const compressedSize = ref(0);
const quality = ref(80);
const scale = ref(1.0);
const isProcessing = ref(false);

let compressTimer = null;

const reduction = computed(() => {
  if (!originalSize.value || !compressedSize.value) return 0;
  return Math.abs(Math.round((1 - compressedSize.value / originalSize.value) * 100));
});

const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const path = res.tempFilePaths[0];
      originalUrl.value = path;
      originalSize.value = res.tempFiles[0].size;
      compressImage();
    }
  });
};

const debounceCompress = () => {
  if (compressTimer) clearTimeout(compressTimer);
  compressTimer = setTimeout(compressImage, 500);
};

const compressImage = () => {
  if (!originalUrl.value) return;
  isProcessing.value = true;

  // 获取原图信息以计算缩放后的尺寸
  uni.getImageInfo({
    src: originalUrl.value,
    success: (info) => {
      uni.compressImage({
        src: originalUrl.value,
        quality: quality.value,
        compressedWidth: Math.round(info.width * scale.value),
        compressedHeight: Math.round(info.height * scale.value),
        success: (res) => {
          compressedUrl.value = res.tempFilePath;
          // 获取压缩后的大小
          // #ifdef H5
          // H5 端近似估算
          compressedSize.value = Math.round(originalSize.value * (quality.value / 100) * (scale.value * scale.value));
          // #endif
          
          // #ifndef H5
          uni.getFileInfo({
            filePath: res.tempFilePath,
            success: (infoRes) => {
              compressedSize.value = infoRes.size;
            }
          });
          // #endif
        },
        complete: () => {
          isProcessing.value = false;
        }
      });
    }
  });
};

const handleSaveImage = () => {
  if (!compressedUrl.value) return;
  
  uni.saveImageToPhotosAlbum({
    filePath: compressedUrl.value,
    success: () => {
      uni.showToast({ title: t('common.actions.copied'), icon: 'success' });
    },
    fail: (err) => {
      // #ifdef H5
      // H5 下载逻辑
      const link = document.createElement('a');
      link.href = compressedUrl.value;
      link.download = `compressed-${Date.now()}.jpg`;
      link.click();
      // #endif
    }
  });
};

const clearAll = () => {
  originalUrl.value = '';
  compressedUrl.value = '';
  originalSize.value = 0;
  compressedSize.value = 0;
};

const formatSize = (bytes) => {
  if (!bytes) return '0 KB';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

onUnmounted(() => {
  if (compressTimer) clearTimeout(compressTimer);
});
</script>

<style scoped>
.workspace { padding-bottom: 40rpx; }
.upload-area { height: 400rpx; background: #ffffff; border: 4rpx dashed #e2e8f0; border-radius: 32rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20rpx; }
.upload-icon { font-size: 80rpx; }
.upload-text { font-size: 28rpx; color: #64748b; font-weight: 600; }
.card { background: #ffffff; border-radius: 32rpx; padding: 40rpx; }
.control-group .label-row { display: flex; justify-content: space-between; margin-bottom: 10rpx; }
.label { font-size: 24rpx; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
.value { font-size: 24rpx; font-weight: 800; color: #6366f1; }
.action-buttons { display: flex; gap: 20rpx; }
.primary-btn { flex: 1; background: #6366f1; color: #fff; border-radius: 20rpx; font-weight: 700; }
.secondary-btn { width: 100rpx; background: #f1f5f9; color: #475569; border-radius: 20rpx; }
.comparison-grid { display: flex; flex-direction: column; gap: 20rpx; }
.comparison-card { background: #ffffff; border-radius: 24rpx; overflow: hidden; border: 1px solid #f1f5f9; }
.c-header { padding: 20rpx 30rpx; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; }
.c-label { font-size: 22rpx; font-weight: 700; color: #64748b; }
.c-size { font-size: 22rpx; font-weight: 800; color: #94a3b8; }
.c-size.active { color: #6366f1; }
.preview-img { width: 100%; height: 400rpx; background: #f1f5f9; }
.img-wrapper { position: relative; }
.loading-box { position: absolute; inset: 0; background: rgba(255,255,255,0.6); display: flex; align-items: center; justify-content: center; z-index: 10; }
.loading-spin { font-size: 60rpx; animation: rotate 2s infinite linear; }
.comparison-divider { display: flex; flex-direction: column; align-items: center; padding: 10rpx 0; }
.reduction-badge { background: #ecfdf5; color: #10b981; font-size: 24rpx; font-weight: 800; padding: 4rpx 20rpx; border-radius: 100rpx; }
.reduction-badge.plus { background: #fef2f2; color: #ef4444; }
.arrow { color: #cbd5e1; font-weight: 800; margin-top: 4rpx; }
@keyframes rotate { from { transform: rotate(0); } to { transform: rotate(360deg); } }
.mt-4 { margin-top: 40rpx; }
.mb-4 { margin-bottom: 30rpx; }
.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01); }
</style>
