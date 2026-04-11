<template>
  <view class="page-wrapper">
    <!-- 背景层 (弥散渐变) -->
    <view class="bg-decoration"></view>
    
    <!-- 动态状态栏占位 -->
    <view :style="{ height: statusBarHeight + 'px' }"></view>
    
    <scroll-view scroll-y class="main-scroll" :show-scrollbar="false">
      <!-- 欢迎区域 (动态对齐胶囊) -->
      <view class="header-section" :style="{ minHeight: navBarHeight + 'px', paddingRight: capsuleRightOffset + 'px' }">
        <!-- 正常状态 -->
        <view v-if="!isSearching" class="welcome-text">
          <text class="greet">{{ $t('home.greet') }}</text>
          <text class="sub-greet">{{ $t('home.subGreet') }}</text>
        </view>
        
        <!-- 搜索状态 -->
        <view v-else class="search-bar-active">
          <icon type="search" size="16" color="#6366f1" class="s-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="$t('home.search')" 
            class="s-input" 
            focus
            @blur="onSearchBlur"
          />
          <text class="cancel-text" @click="clearSearch">{{ $t('common.actions.clear') }}</text>
        </view>

        <view v-if="!isSearching" class="header-actions">
          <view class="lang-btn" hover-class="btn-hover-scale" @click="toggleLang">
            <text class="lang-text">{{ currentLang === 'zh' ? 'EN' : '中' }}</text>
          </view>
          <view class="search-btn" hover-class="btn-hover-scale" @click="isSearching = true">
            <icon type="search" size="18" color="#333" />
          </view>
        </view>
      </view>

      <!-- 快捷分类 (胶囊式) -->
      <view class="category-wrapper" v-if="!isSearching">
        <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
          <view class="category-flex">
            <view 
              v-for="cat in categories" 
              :key="cat.id" 
              class="cat-capsule" 
              :class="{ active: activeCategory === cat.id }"
              @click="activeCategory = cat.id"
            >
              <text class="cat-label">{{ $t(cat.nameKey) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 推荐工具 (Banner 样式) -->
      <view class="featured-section" v-if="!isSearching">
        <view class="featured-card" hover-class="card-hover" @click="openTool({ id: 'mortgage-calc', path: '/pages/tools/daily/mortgage' })">
          <view class="featured-info">
            <text class="f-tag">{{ $t('home.featured') }}</text>
            <text class="f-title">{{ $t('tools.mortgage-calculator.name') }}</text>
            <text class="f-desc">{{ $t('tools.mortgage-calculator.description') }}</text>
          </view>
          <view class="f-icon-box">
            <text class="f-emoji">🏠</text>
          </view>
        </view>
      </view>

      <!-- 工具网格 -->
      <view class="tools-section">
        <view class="section-title-row" v-if="!isSearching">
          <text class="section-h">{{ $t('home.allTools') }}</text>
          <text class="section-more">{{ $t('home.more') }}</text>
        </view>
        <view class="section-title-row" v-else>
          <text class="section-h">Search Results</text>
        </view>
        
        <view class="tool-list">
          <view 
            v-for="(tool, index) in filteredTools" 
            :key="tool.id" 
            class="new-tool-card" 
            :style="{ '--delay': index * 0.05 + 's' }"
            hover-class="card-hover-mini"
            @click="openTool(tool)"
          >
            <view class="tool-top">
              <view class="tool-icon-bg" :style="{ background: tool.grad }">
                <text class="tool-emoji">{{ tool.emoji }}</text>
              </view>
              <view class="tool-meta">
                <text class="t-name">{{ $t(tool.nameKey) }}</text>
                <text class="t-category">{{ $t('home.categories.' + tool.category) }}</text>
              </view>
            </view>
            <view class="tool-bottom">
              <text class="t-desc">{{ $t(tool.descKey) }}</text>
            </view>
          </view>
          
          <view v-if="filteredTools.length === 0" class="empty-state">
            <text class="empty-text">No tools found</text>
          </view>
        </view>
      </view>
      
      <view class="footer-safe"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { CATEGORIES, getToolsByCategory } from '../../registry/index';

const { t, locale } = useI18n();
const currentLang = computed(() => locale.value);

const categories = CATEGORIES;
const activeCategory = ref('all');
const isSearching = ref(false);
const searchQuery = ref('');

// 适配小程序胶囊
const statusBarHeight = ref(20);
const navBarHeight = ref(44);
const capsuleRightOffset = ref(0);

onMounted(() => {
  try {
    const windowInfo = uni.getWindowInfo();
    statusBarHeight.value = windowInfo.statusBarHeight || 20;

    // #ifdef MP-WEIXIN
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    const customNavBarHeight = (menuButtonInfo.top - windowInfo.statusBarHeight) * 2 + menuButtonInfo.height;
    navBarHeight.value = customNavBarHeight;
    capsuleRightOffset.value = windowInfo.screenWidth - menuButtonInfo.left + 10;
    // #endif
  } catch (e) {
    console.warn('System info error:', e);
  }
});

const filteredTools = computed(() => {
  let tools = getToolsByCategory(activeCategory.value);
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    tools = tools.filter(tool => {
      const name = t(tool.nameKey).toLowerCase();
      const desc = t(tool.descKey).toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }
  
  return tools;
});

const onSearchBlur = () => {
  if (!searchQuery.value) isSearching.value = false;
};

const clearSearch = () => {
  searchQuery.value = '';
  isSearching.value = false;
};

const openTool = (tool) => {
  if (tool.path) {
    uni.navigateTo({ url: tool.path });
  } else {
    uni.showToast({ title: 'Coming Soon...', icon: 'none' });
  }
};

const toggleLang = () => {
  const next = locale.value === 'zh' ? 'en' : 'zh';
  locale.value = next;
  uni.setStorageSync('app_locale', next);
  uni.showToast({
    title: next === 'zh' ? '已切换至中文' : 'Switched to English',
    icon: 'none'
  });
};
</script>

<style scoped>
.page-wrapper {
  background-color: #fcfcfd;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  top: -100rpx;
  right: -100rpx;
  width: 400rpx;
  height: 400rpx;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}

.header-section {
  padding: 60rpx 40rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text {
  display: flex;
  flex-direction: column;
}

.greet {
  font-size: 44rpx;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -1px;
}

.sub-greet {
  font-size: 26rpx;
  color: #94a3b8;
  margin-top: 8rpx;
}

.header-actions {
  display: flex;
  gap: 20rpx;
}

.lang-btn, .search-btn {
  width: 80rpx;
  height: 80rpx;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.04);
}

.lang-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #6366f1;
}

.search-bar-active {
  flex: 1;
  height: 80rpx;
  background: #f1f5f9;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  margin-right: 20rpx;
  animation: fadeIn 0.3s ease;
}

.s-icon {
  margin-right: 16rpx;
}

.s-input {
  flex: 1;
  font-size: 28rpx;
  color: #1e293b;
}

.cancel-text {
  font-size: 26rpx;
  color: #64748b;
  margin-left: 20rpx;
  padding: 10rpx;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(20rpx); }
  to { opacity: 1; transform: translateX(0); }
}

.category-wrapper {
  padding-bottom: 30rpx;
}

.category-flex {
  display: flex;
  padding: 0 40rpx;
}

.cat-capsule {
  padding: 16rpx 40rpx;
  background: #f1f5f9;
  border-radius: 100rpx;
  margin-right: 20rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.cat-capsule.active {
  background: #1a1a1a;
  transform: scale(1.05);
}

.cat-label {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 500;
}

.cat-capsule.active .cat-label {
  color: #ffffff;
}

.featured-section {
  padding: 20rpx 40rpx 40rpx;
}

.featured-card {
  height: 200rpx;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 40rpx;
  padding: 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20rpx 40rpx rgba(0,0,0,0.1);
}

.featured-info {
  z-index: 2;
  flex: 1;
  padding-right: 20rpx;
}

.f-tag {
  font-size: 20rpx;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.f-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  display: block;
  margin-top: 8rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.f-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.4);
  margin-top: 4rpx;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.f-icon-box {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255,255,255,0.1);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.f-emoji {
  font-size: 50rpx;
}

.tools-section {
  padding: 20rpx 40rpx;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-h {
  font-size: 32rpx;
  font-weight: 800;
  color: #1a1a1a;
}

.section-more {
  font-size: 24rpx;
  color: #6366f1;
}

.tool-list {
  display: flex;
  flex-direction: column;
}

.new-tool-card {
  background: #ffffff;
  border-radius: 32rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02);
  border: 1px solid #f1f5f9;
  animation: slideIn 0.5s ease backwards;
  animation-delay: var(--delay);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.tool-top {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.tool-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.tool-emoji {
  font-size: 32rpx;
  color: #fff;
  font-weight: 800;
}

.tool-meta {
  display: flex;
  flex-direction: column;
}

.t-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.t-category {
  font-size: 20rpx;
  color: #94a3b8;
  text-transform: uppercase;
}

.tool-bottom {
  border-top: 1px solid #f8fafc;
  padding-top: 20rpx;
}

.t-desc {
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.5;
}

.empty-state {
  padding: 100rpx 0;
  text-align: center;
}

.empty-text {
  color: #94a3b8;
  font-size: 28rpx;
}

.card-hover {
  transform: scale(0.98);
  opacity: 0.9;
}

.card-hover-mini {
  background-color: #f8fafc;
  transform: translateX(10rpx);
}

.footer-safe {
  height: 100rpx;
}

.btn-hover-scale {
  transform: scale(0.9);
  transition: transform 0.1s;
}
</style>
