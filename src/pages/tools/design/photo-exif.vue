<template>
  <ToolLayout :title="$t('tools.photo-exif.name')">
    <view class="workspace">
      <!-- 上传预览区 -->
      <view class="card shadow-md mb-4 upload-section" @tap="handleChooseImage">
        <view v-if="!previewUrl" class="upload-placeholder">
          <text class="icon">📸</text>
          <text class="text">{{ $t('tools.photo-exif.uploadPlaceholder') }}</text>
        </view>
        <image v-else :src="previewUrl" mode="aspectFit" class="preview-img" />
        
        <view v-if="isLoading" class="loader-overlay">
          <view class="spinner"></view>
        </view>
      </view>

      <!-- 信息展示区 -->
      <view class="info-area">
        <view v-if="error" class="error-msg">{{ error }}</view>
        
        <!-- 基本信息 -->
        <view v-if="basicInfo" class="info-card mb-4">
          <view class="card-header">
            <text class="header-icon">📄</text>
            <text class="header-title">{{ $t('tools.photo-exif.basicInfo') }}</text>
          </view>
          <view class="info-grid">
            <view class="info-item">
              <text class="label">{{ $t('tools.photo-exif.filename') }}</text>
              <text class="value">{{ basicInfo.name }}</text>
            </view>
            <view class="info-item">
              <text class="label">{{ $t('tools.photo-exif.filesize') }}</text>
              <text class="value">{{ basicInfo.size }}</text>
            </view>
          </view>
        </view>

        <!-- EXIF 信息 -->
        <view v-if="metadata" class="info-card mb-4">
          <view class="card-header">
            <text class="header-icon">📷</text>
            <text class="header-title">{{ $t('tools.photo-exif.exifInfo') }}</text>
          </view>
          <view class="info-grid">
            <view class="info-item" v-if="metadata.Make || metadata.Model">
              <text class="label">{{ $t('tools.photo-exif.cameraModel') }}</text>
              <text class="value">{{ (metadata.Make || '') + ' ' + (metadata.Model || '') }}</text>
            </view>
            <view class="info-item" v-if="metadata.ExposureTime">
              <text class="label">{{ $t('tools.photo-exif.exposure') }}</text>
              <text class="value">1/{{ Math.round(1/metadata.ExposureTime) }}s</text>
            </view>
            <view class="info-item" v-if="metadata.ISO">
              <text class="label">{{ $t('tools.photo-exif.iso') }}</text>
              <text class="value">{{ metadata.ISO }}</text>
            </view>
            <view class="info-item" v-if="metadata.FocalLength">
              <text class="label">{{ $t('tools.photo-exif.focalLength') }}</text>
              <text class="value">{{ metadata.FocalLength }}mm</text>
            </view>
            <view class="info-item" v-if="metadata.DateTimeOriginal">
              <text class="label">{{ $t('tools.photo-exif.dateTime') }}</text>
              <text class="value">{{ formatDateTime(metadata.DateTimeOriginal) }}</text>
            </view>
          </view>
        </view>

        <!-- GPS 信息 -->
        <view v-if="hasGPS" class="info-card mb-4">
          <view class="card-header">
            <text class="header-icon">📍</text>
            <text class="header-title">{{ $t('tools.photo-exif.gpsInfo') }}</text>
          </view>
          <view class="info-grid">
            <view class="info-item">
              <text class="label">{{ $t('tools.photo-exif.latitude') }}</text>
              <text class="value">{{ metadata.latitude.toFixed(6) }}</text>
            </view>
            <view class="info-item">
              <text class="label">{{ $t('tools.photo-exif.longitude') }}</text>
              <text class="value">{{ metadata.longitude.toFixed(6) }}</text>
            </view>
          </view>
          <view class="map-link-container">
            <text class="map-link" @tap="openMap">{{ $t('tools.photo-exif.viewMap') }}</text>
          </view>
        </view>

        <view v-if="basicInfo && !metadata && !isLoading" class="no-exif">
          <text>{{ $t('tools.photo-exif.noExif') }}</text>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import exifr from 'exifr';

const { t } = useI18n();

const previewUrl = ref(null);
const metadata = ref(null);
const basicInfo = ref(null);
const isLoading = ref(false);
const error = ref('');

const hasGPS = computed(() => {
  return metadata.value && (metadata.value.latitude !== undefined && metadata.value.longitude !== undefined);
});

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString();
};

const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original'], // 获取原图 EXIF 信息
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFile = res.tempFiles[0];
      processImage(tempFile);
    }
  });
};

const processImage = async (file) => {
  isLoading.value = true;
  error.value = '';
  previewUrl.value = file.path;
  
  basicInfo.value = {
    name: file.name || 'Image',
    size: formatSize(file.size),
    type: file.type
  };

  try {
    let dataBuffer;
    
    // #ifdef H5
    dataBuffer = file; // H5 环境直接传 File 对象或 Blob
    // #endif
    
    // #ifndef H5
    // 小程序/App 环境需要读取为 ArrayBuffer
    dataBuffer = await new Promise((resolve, reject) => {
      uni.getFileSystemManager().readFile({
        filePath: file.path,
        success: (res) => resolve(res.data),
        fail: (err) => reject(err)
      });
    });
    // #endif

    const data = await exifr.parse(dataBuffer, {
      tiff: true,
      exif: true,
      gps: true,
      interop: true,
      ifd1: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      ihdr: true
    });

    metadata.value = data || null;
  } catch (e) {
    console.error('EXIF Error:', e);
    error.value = 'Failed to parse EXIF data.';
  } finally {
    isLoading.value = false;
  }
};

const openMap = () => {
  if (!hasGPS.value) return;
  
  // 使用 uni.openLocation 打开地图
  uni.openLocation({
    latitude: metadata.value.latitude,
    longitude: metadata.value.longitude,
    name: t('tools.photo-exif.gpsInfo'),
    success: () => {
      console.log('Location opened');
    }
  });
};
</script>

<style scoped>
.workspace {
  padding-bottom: 40rpx;
}

.upload-section {
  background: #ffffff;
  border-radius: 24rpx;
  height: 400rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border: 2rpx dashed #e2e8f0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-placeholder .icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.upload-placeholder .text {
  font-size: 28rpx;
  color: #64748b;
}

.preview-img {
  width: 100%;
  height: 100%;
}

.info-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 2rpx solid #f1f5f9;
}

.header-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.header-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
}

.info-grid {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f8fafc;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 26rpx;
  color: #64748b;
}

.value {
  font-size: 26rpx;
  color: #1e293b;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
  flex: 1;
  margin-left: 20rpx;
}

.map-link-container {
  margin-top: 20rpx;
  text-align: center;
}

.map-link {
  font-size: 26rpx;
  color: #6366f1;
  font-weight: 600;
}

.error-msg {
  background: #fef2f2;
  color: #ef4444;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  margin-bottom: 30rpx;
}

.no-exif {
  background: #f8fafc;
  padding: 40rpx;
  border-radius: 24rpx;
  text-align: center;
  color: #64748b;
  font-size: 26rpx;
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f1f5f9;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.mb-4 { margin-bottom: 30rpx; }
</style>
