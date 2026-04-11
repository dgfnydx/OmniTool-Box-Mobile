<template>
  <view class="tool-layout">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @tap="goBack" hover-class="btn-hover">
        <view class="back-arrow"></view>
        <text class="back-text">{{ $t('common.nav.back') }}</text>
      </view>
      <view class="nav-title">
        <text class="title-text">{{ title }}</text>
      </view>
      <view class="nav-right">
        <slot name="header-right"></slot>
      </view>
    </view>
    
    <!-- 内容区 -->
    <scroll-view scroll-y class="content-scroll">
      <view class="tool-content">
        <slot></slot>
      </view>
      <view class="footer-safe"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineProps({
  title: {
    type: String,
    default: ''
  }
});

const statusBarHeight = ref(20);

onMounted(() => {
  try {
    const windowInfo = uni.getWindowInfo();
    statusBarHeight.value = windowInfo.statusBarHeight || 20;
  } catch (e) {
    statusBarHeight.value = 20;
  }
});

const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.reLaunch({ url: '/pages/index/index' });
  }
};
</script>

<style scoped>
.tool-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fcfcfd;
  width: 100%;
}

.status-bar {
  width: 100%;
  background-color: #ffffff;
}

.nav-bar {
  height: 44px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  border-bottom: 1px solid #f1f5f9;
}

.nav-left {
  display: flex;
  align-items: center;
  height: 44px;
  min-width: 140rpx;
  transition: opacity 0.2s;
}

.btn-hover {
  opacity: 0.6;
}

.back-arrow {
  width: 18rpx;
  height: 18rpx;
  border-left: 4rpx solid #334155;
  border-bottom: 4rpx solid #334155;
  transform: rotate(45deg);
}

.back-text {
  font-size: 28rpx;
  color: #334155;
  margin-left: 14rpx;
  font-weight: 500;
}

.nav-title {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 20rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-right {
  min-width: 140rpx;
  display: flex;
  justify-content: flex-end;
}

.content-scroll {
  flex: 1;
  overflow: hidden;
}

.tool-content {
  padding: 30rpx;
}

.footer-safe {
  height: env(safe-area-inset-bottom);
  padding-bottom: 40rpx;
}
</style>
