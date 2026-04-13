<template>
  <ToolLayout :title="$t('tools.image-cropper.name')">
    <!-- 上传/选择图片 -->
    <view v-if="!imagePath" class="upload-box card shadow-md" @tap="handleChooseImage">
      <view class="upload-icon">✂️</view>
      <text class="upload-text">{{ $t('tools.image-cropper.uploadTip') }}</text>
      <button class="upload-btn">{{ $t('tools.image-color-picker.uploadBtn') }}</button>
    </view>

    <view v-else class="cropper-outer">
      <!-- 裁剪主舞台 -->
      <view class="stage card shadow-md" :style="{ height: stageHeight + 'px' }">
        <view class="image-container" :style="{ width: imgDisplayWidth + 'px', height: imgDisplayHeight + 'px' }">
          <image 
            class="base-img" 
            :src="imagePath" 
            mode="aspectFit" 
            @load="onImageLoad"
            :style="{ width: imgDisplayWidth + 'px', height: imgDisplayHeight + 'px' }"
          />
          
          <!-- 动态裁剪框 -->
          <view 
            class="crop-box" 
            :style="{ 
              left: crop.left + 'px', 
              top: crop.top + 'px', 
              width: crop.width + 'px', 
              height: crop.height + 'px' 
            }"
            @touchstart="handleTouchStart($event, 'move')"
            @touchmove.stop.prevent="handleTouchMove"
          >
            <!-- 内部参考线 -->
            <view class="grid-v v1"></view><view class="grid-v v2"></view>
            <view class="grid-h h1"></view><view class="grid-h h2"></view>
            
            <!-- 四角把手 -->
            <view class="handle tl" @touchstart.stop="handleTouchStart($event, 'tl')"></view>
            <view class="handle tr" @touchstart.stop="handleTouchStart($event, 'tr')"></view>
            <view class="handle bl" @touchstart.stop="handleTouchStart($event, 'bl')"></view>
            <view class="handle br" @touchstart.stop="handleTouchStart($event, 'br')"></view>
          </view>
          
          <!-- 周边遮罩 -->
          <view class="mask top" :style="{ height: crop.top + 'px' }"></view>
          <view class="mask bottom" :style="{ top: (crop.top + crop.height) + 'px', height: (imgDisplayHeight - crop.top - crop.height) + 'px' }"></view>
          <view class="mask left" :style="{ top: crop.top + 'px', height: crop.height + 'px', width: crop.left + 'px' }"></view>
          <view class="mask right" :style="{ top: crop.top + 'px', height: crop.height + 'px', left: (crop.left + crop.width) + 'px', width: (imgDisplayWidth - crop.left - crop.width) + 'px' }"></view>
        </view>
      </view>

      <!-- 工具栏 -->
      <view class="toolbar card shadow-sm mt-4">
        <view class="ratio-bar mb-4">
          <text class="label">{{ $t('tools.image-cropper.aspectRatio') }}</text>
          <scroll-view scroll-x class="ratio-scroll">
            <view class="ratio-list">
              <view 
                v-for="r in ratios" 
                :key="r.label" 
                class="ratio-item" 
                :class="{ active: currentRatioLabel === r.label }"
                @tap="setRatio(r)"
              >{{ r.label }}</view>
            </view>
          </scroll-view>
        </view>

        <view class="btn-group">
          <view class="action-btn" @tap="resetCrop">{{ $t('tools.image-cropper.reset') }}</view>
          <view class="action-btn delete" @tap="imagePath = ''">{{ $t('common.actions.clear') }}</view>
        </view>
      </view>

      <button class="confirm-btn" @tap="handleConfirm">{{ $t('tools.image-cropper.download') }}</button>
      
      <!-- 隐藏绘制层 -->
      <canvas canvas-id="crop-canvas" class="hidden-canvas" :style="{ width: exportW + 'px', height: exportH + 'px' }"></canvas>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();
const { proxy } = getCurrentInstance();

const imagePath = ref('');
const stageHeight = ref(450);
const imgOriginalWidth = ref(0);
const imgOriginalHeight = ref(0);
const imgDisplayWidth = ref(0);
const imgDisplayHeight = ref(0);

// 裁剪框状态
const crop = reactive({
  left: 50,
  top: 50,
  width: 200,
  height: 200
});

// 导出尺寸
const exportW = ref(200);
const exportH = ref(200);

// 触摸状态
let touchType = ''; // 'move', 'tl', 'tr', 'bl', 'br'
let startX = 0;
let startY = 0;
let startCrop = { ...crop };

const currentRatioLabel = ref('1:1');
const ratios = [
  { label: 'Free', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '3:4', value: 3/4 }
];

const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      imagePath.value = res.tempFilePaths[0];
    }
  });
};

const onImageLoad = (e) => {
  const { width, height } = e.detail;
  imgOriginalWidth.value = width;
  imgOriginalHeight.value = height;
  
  // 获取舞台宽度
  const sys = uni.getSystemInfoSync();
  const screenW = sys.windowWidth - 30; // 减去 padding
  const screenH = stageHeight.value;
  
  const ratio = width / height;
  if (ratio > screenW / screenH) {
    imgDisplayWidth.value = screenW;
    imgDisplayHeight.value = screenW / ratio;
  } else {
    imgDisplayHeight.value = screenH;
    imgDisplayWidth.value = screenH * ratio;
  }
  
  resetCrop();
};

const resetCrop = () => {
  crop.width = Math.min(imgDisplayWidth.value, imgDisplayHeight.value) * 0.8;
  crop.height = currentRatioLabel.value === 'Free' ? crop.width : (crop.width / (getRatiosValue(currentRatioLabel.value) || 1));
  
  // 校验高度是否溢出
  if (crop.height > imgDisplayHeight.value * 0.9) {
    crop.height = imgDisplayHeight.value * 0.8;
    if (currentRatioLabel.value !== 'Free') {
       crop.width = crop.height * getRatiosValue(currentRatioLabel.value);
    }
  }

  crop.left = (imgDisplayWidth.value - crop.width) / 2;
  crop.top = (imgDisplayHeight.value - crop.height) / 2;
};

const getRatiosValue = (label) => ratios.find(r => r.label === label)?.value;

const setRatio = (r) => {
  currentRatioLabel.value = r.label;
  resetCrop();
};

// 触摸开始
const handleTouchStart = (e, type) => {
  touchType = type;
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  startCrop = { ...crop };
};

// 触摸移动 (核心逻辑)
const handleTouchMove = (e) => {
  if (!touchType) return;
  const touch = e.touches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  
  const minSize = 40;

  if (touchType === 'move') {
    let nextLeft = startCrop.left + dx;
    let nextTop = startCrop.top + dy;
    
    // 边界检测
    nextLeft = Math.max(0, Math.min(nextLeft, imgDisplayWidth.value - crop.width));
    nextTop = Math.max(0, Math.min(nextTop, imgDisplayHeight.value - crop.height));
    
    crop.left = nextLeft;
    crop.top = nextTop;
  } else {
    // 缩放逻辑
    let newW = startCrop.width;
    let newH = startCrop.height;
    let newL = startCrop.left;
    let newT = startCrop.top;
    
    const ratio = getRatiosValue(currentRatioLabel.value);

    if (touchType === 'br') {
      newW = Math.max(minSize, startCrop.width + dx);
      newH = ratio ? newW / ratio : Math.max(minSize, startCrop.height + dy);
    } else if (touchType === 'tl') {
      const delta = Math.min(dx, dy); // 简化比例缩放
      newW = Math.max(minSize, startCrop.width - dx);
      newL = startCrop.left + (startCrop.width - newW);
      newH = ratio ? newW / ratio : Math.max(minSize, startCrop.height - dy);
      newT = startCrop.top + (startCrop.height - newH);
    } else if (touchType === 'tr') {
      newW = Math.max(minSize, startCrop.width + dx);
      newH = ratio ? newW / ratio : Math.max(minSize, startCrop.height - dy);
      newT = startCrop.top + (startCrop.height - newH);
    } else if (touchType === 'bl') {
      newW = Math.max(minSize, startCrop.width - dx);
      newL = startCrop.left + (startCrop.width - newW);
      newH = ratio ? newW / ratio : Math.max(minSize, startCrop.height + dy);
    }

    // 边界约束与二次校验
    if (newL < 0) { newW += newL; newL = 0; if(ratio) newH = newW / ratio; }
    if (newT < 0) { newH += newT; newT = 0; if(ratio) newW = newH * ratio; }
    if (newL + newW > imgDisplayWidth.value) { newW = imgDisplayWidth.value - newL; if(ratio) newH = newW / ratio; }
    if (newT + newH > imgDisplayHeight.value) { newH = imgDisplayHeight.value - newT; if(ratio) newW = newH * ratio; }

    crop.width = newW;
    crop.height = newH;
    crop.left = newL;
    crop.top = newT;
  }
};

const handleConfirm = () => {
  uni.showLoading({ title: '正在处理...' });
  
  // 计算原始比例坐标
  const scale = imgOriginalWidth.value / imgDisplayWidth.value;
  const sX = crop.left * scale;
  const sY = crop.top * scale;
  const sW = crop.width * scale;
  const sH = crop.height * scale;
  
  // 设置 Canvas 尺寸为裁剪大小
  exportW.value = sW;
  exportH.value = sH;
  
  const ctx = uni.createCanvasContext('crop-canvas', proxy);
  
  // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  ctx.drawImage(imagePath.value, sX, sY, sW, sH, 0, 0, sW, sH);
  
  ctx.draw(false, () => {
    setTimeout(() => {
      uni.canvasToTempFilePath({
        canvasId: 'crop-canvas',
        destWidth: sW,
        destHeight: sH,
        success: (res) => {
          uni.hideLoading();
          // #ifdef H5
          const link = document.createElement('a');
          link.href = res.tempFilePath;
          link.download = `crop_${Date.now()}.png`;
          link.click();
          // #endif
          
          // #ifndef H5
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => uni.showToast({ title: '已保存到相册' }),
            fail: () => uni.showToast({ title: '保存失败', icon: 'none' })
          });
          // #endif
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({ title: '裁剪失败', icon: 'none' });
        }
      }, proxy);
    }, 300);
  });
};
</script>

<style scoped>
.card { background: #ffffff; border-radius: 24rpx; padding: 30rpx; }
.upload-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120rpx 40rpx; border: 4rpx dashed #e2e8f0; }
.upload-icon { font-size: 100rpx; margin-bottom: 30rpx; }
.upload-text { font-size: 28rpx; color: #64748b; margin-bottom: 40rpx; }
.upload-btn { background: #6366f1; color: white; border-radius: 100rpx; padding: 0 80rpx; font-size: 28rpx; height: 80rpx; line-height: 80rpx; }

.stage { background: #0f172a; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; padding: 0 !important; }
.image-container { position: relative; }
.base-img { display: block; }

/* 裁剪框 */
.crop-box {
  position: absolute;
  border: 2rpx solid #ffffff;
  z-index: 100;
  box-sizing: border-box;
}

/* 遮罩层 */
.mask { position: absolute; background: rgba(0, 0, 0, 0.6); z-index: 50; pointer-events: none; width: 100%; }
.mask.left, .mask.right { width: auto; }
.mask.top { top: 0; left: 0; }
.mask.bottom { left: 0; bottom: 0; }

/* 内部线 */
.grid-v, .grid-h { position: absolute; background: rgba(255, 255, 255, 0.3); pointer-events: none; }
.v1 { left: 33.3%; top: 0; width: 1px; height: 100%; }
.v2 { left: 66.6%; top: 0; width: 1px; height: 100%; }
.h1 { top: 33.3%; left: 0; height: 1px; width: 100%; }
.h2 { top: 66.6%; left: 0; height: 1px; width: 100%; }

/* 把手 */
.handle {
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  background: transparent;
  z-index: 110;
}
.handle::after {
  content: '';
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  background: #6366f1;
  border: 4rpx solid #ffffff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tl { top: -22rpx; left: -22rpx; cursor: nw-resize; }
.tr { top: -22rpx; right: -22rpx; cursor: ne-resize; }
.bl { bottom: -22rpx; left: -22rpx; cursor: sw-resize; }
.br { bottom: -22rpx; right: -22rpx; cursor: se-resize; }

.toolbar { padding: 30rpx; }
.ratio-bar { display: flex; flex-direction: column; gap: 20rpx; }
.label { font-size: 24rpx; color: #94a3b8; font-weight: 700; }
.ratio-list { display: flex; gap: 16rpx; padding-bottom: 10rpx; }
.ratio-item {
  padding: 10rpx 30rpx;
  background: #f1f5f9;
  border-radius: 100rpx;
  font-size: 24rpx;
  color: #64748b;
  white-space: nowrap;
}
.ratio-item.active { background: #6366f1; color: white; }

.btn-group { display: flex; gap: 20rpx; }
.action-btn { flex: 1; height: 80rpx; background: #f8fafc; border: 2rpx solid #e2e8f0; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; font-size: 26rpx; font-weight: 600; }
.action-btn.delete { color: #ef4444; border-color: #fee2e2; }

.confirm-btn { width: 100%; height: 100rpx; background: #6366f1; color: white; border-radius: 20rpx; font-size: 32rpx; font-weight: 700; margin-top: 30rpx; display: flex; align-items: center; justify-content: center; box-shadow: 0 10rpx 20rpx rgba(99, 102, 241, 0.2); }

.hidden-canvas { position: fixed; left: -9999px; visibility: hidden; }
.mt-4 { margin-top: 30rpx; }
.mb-4 { margin-bottom: 30rpx; }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02); }
</style>
