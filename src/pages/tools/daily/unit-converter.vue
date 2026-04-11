<template>
  <ToolLayout title="单位换算">
    <!-- 分类横向滚动 -->
    <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
      <view class="category-list">
        <view 
          v-for="(cat, key) in UNIT_CATEGORIES" 
          :key="key" 
          class="cat-item" 
          :class="{ active: selectedCategory === key }"
          @tap="changeCategory(key)"
        >
          <text class="cat-name">{{ cat.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 换算区域 -->
    <view class="converter-box">
      <!-- 源单位 -->
      <view class="unit-card from-card">
        <picker :range="unitNames" @change="e => fromUnit = unitKeys[e.detail.value]">
          <view class="unit-selector">
            <text>{{ UNIT_CATEGORIES[selectedCategory].units[fromUnit].name }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <input 
          type="digit" 
          v-model="fromValue" 
          class="val-input" 
          placeholder="输入数值"
        />
      </view>

      <!-- 互换按钮 -->
      <view class="swap-row">
        <view class="swap-line"></view>
        <view class="swap-circle" @tap="handleSwap">
          <text class="swap-icon">⇅</text>
        </view>
        <view class="swap-line"></view>
      </view>

      <!-- 目标单位 -->
      <view class="unit-card to-card">
        <picker :range="unitNames" @change="e => toUnit = unitKeys[e.detail.value]">
          <view class="unit-selector">
            <text>{{ UNIT_CATEGORIES[selectedCategory].units[toUnit].name }}</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <view class="val-display">
          <text class="val-text">{{ formatResult(toValue) }}</text>
          <text class="copy-btn" @tap="handleCopy">复制</text>
        </view>
      </view>
    </view>

    <!-- 底部常用单位列表 (快速对比) -->
    <view class="card shadow-sm mt-4">
      <view class="card-title">快速对比</view>
      <view class="quick-grid">
        <view 
          v-for="unitKey in unitKeys" 
          :key="unitKey" 
          class="quick-item"
          v-show="unitKey !== fromUnit"
        >
          <text class="q-val">{{ formatResult(getQuickVal(unitKey)) }}</text>
          <text class="q-name">{{ UNIT_CATEGORIES[selectedCategory].units[unitKey].name }}</text>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ToolLayout from '@/components/common/ToolLayout.vue';
import { UNIT_CATEGORIES, convertUnit } from '@/utils/unit';

const selectedCategory = ref('length');
const fromUnit = ref('meters');
const toUnit = ref('kilometers');
const fromValue = ref(1);

const unitKeys = computed(() => Object.keys(UNIT_CATEGORIES[selectedCategory.value].units));
const unitNames = computed(() => unitKeys.value.map(key => UNIT_CATEGORIES[selectedCategory.value].units[key].name));

const toValue = computed(() => {
  return convertUnit(fromValue.value, fromUnit.value, toUnit.value, selectedCategory.value);
});

const changeCategory = (key) => {
  selectedCategory.value = key;
  const keys = Object.keys(UNIT_CATEGORIES[key].units);
  fromUnit.value = keys[0];
  toUnit.value = keys[1] || keys[0];
};

const handleSwap = () => {
  const tempUnit = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = tempUnit;
};

const getQuickVal = (targetKey) => {
  return convertUnit(fromValue.value, fromUnit.value, targetKey, selectedCategory.value);
};

const formatResult = (num) => {
  if (num === 0) return '0';
  const val = Number(num);
  if (val < 0.000001) return val.toExponential(4);
  return parseFloat(val.toFixed(6)).toString();
};

const handleCopy = () => {
  uni.setClipboardData({
    data: toValue.value.toString()
  });
};
</script>

<style scoped>
.category-scroll {
  white-space: nowrap;
  margin-bottom: 30rpx;
}

.category-list {
  display: flex;
  padding: 10rpx 0;
}

.cat-item {
  padding: 12rpx 32rpx;
  background: #fff;
  border-radius: 100rpx;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02);
  transition: all 0.3s;
}

.cat-item.active {
  background: #6366f1;
}

.cat-name {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 500;
}

.cat-item.active .cat-name {
  color: #fff;
}

.converter-box {
  display: flex;
  flex-direction: column;
}

.unit-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02);
}

.unit-selector {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #64748b;
  margin-bottom: 20rpx;
}

.arrow {
  font-size: 16rpx;
  margin-left: 10rpx;
  color: #cbd5e1;
}

.val-input {
  font-size: 56rpx;
  font-weight: 800;
  color: #1e293b;
  height: 80rpx;
}

.swap-row {
  display: flex;
  align-items: center;
  height: 100rpx;
  padding: 0 60rpx;
}

.swap-line {
  flex: 1;
  height: 2rpx;
  background: #f1f5f9;
}

.swap-circle {
  width: 70rpx;
  height: 70rpx;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
  z-index: 2;
}

.swap-icon {
  font-size: 36rpx;
  color: #6366f1;
}

.val-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.val-text {
  font-size: 56rpx;
  font-weight: 800;
  color: #6366f1;
  word-break: break-all;
  flex: 1;
}

.copy-btn {
  font-size: 24rpx;
  color: #6366f1;
  background: #eef2ff;
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  margin-left: 20rpx;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24rpx;
}

.quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.quick-item {
  background: #f8fafc;
  padding: 24rpx;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
}

.q-val {
  font-size: 32rpx;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4rpx;
  word-break: break-all;
}

.q-name {
  font-size: 20rpx;
  color: #94a3b8;
}

.mt-4 { margin-top: 30rpx; }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01); }
</style>
