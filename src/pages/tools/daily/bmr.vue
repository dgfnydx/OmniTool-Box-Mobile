<template>
  <ToolLayout title="BMR 基础代谢率">
    <view class="card shadow-md mb-4">
      <view class="label mb-2">性别</view>
      <view class="gender-selector">
        <view class="gender-btn" :class="{ active: gender === 'male' }" @tap="gender = 'male'">
          <text class="g-icon">♂️</text>
          <text>男</text>
        </view>
        <view class="gender-btn" :class="{ active: gender === 'female' }" @tap="gender = 'female'">
          <text class="g-icon">♀️</text>
          <text>女</text>
        </view>
      </view>

      <view class="input-grid mt-4">
        <view class="input-item">
          <text class="label">年龄</text>
          <input type="number" v-model.number="age" class="mini-input" />
        </view>
        <view class="input-item">
          <text class="label">身高 (cm)</text>
          <input type="number" v-model.number="height" class="mini-input" />
        </view>
        <view class="input-item">
          <text class="label">体重 (kg)</text>
          <input type="number" v-model.number="weight" class="mini-input" />
        </view>
      </view>
    </view>

    <!-- 结果展示 -->
    <view class="card result-banner mb-4">
      <text class="res-label">您的每日基础代谢 (BMR)</text>
      <view class="res-main">
        <text class="res-value">{{ bmr }}</text>
        <text class="res-unit">千卡 (kcal)</text>
      </view>
    </view>

    <!-- 不同活动水平 -->
    <view class="card shadow-sm">
      <text class="card-title">根据活动水平估算</text>
      <view class="activity-list">
        <view v-for="item in activityLevels" :key="item.key" class="activity-row">
          <text class="a-label">{{ item.name }}</text>
          <text class="a-value">{{ Math.round(bmr * item.factor) }} kcal</text>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import ToolLayout from '@/components/common/ToolLayout.vue';
import { calculateBMR } from '@/utils/health';

const gender = ref('male');
const age = ref(25);
const weight = ref(70);
const height = ref(175);

const bmr = computed(() => calculateBMR(gender.value, age.value, weight.value, height.value));

const activityLevels = [
  { key: 'sedentary', name: '久坐 (办公室工作)', factor: 1.2 },
  { key: 'light', name: '轻度活动 (每周1-3天运动)', factor: 1.375 },
  { key: 'moderate', name: '中度活动 (每周3-5天运动)', factor: 1.55 },
  { key: 'active', name: '重度活动 (每周6-7天运动)', factor: 1.725 },
  { key: 'extra', name: '极重度 (运动员/体力劳动)', factor: 1.9 }
];
</script>

<style scoped>
.card { background: #fff; border-radius: 32rpx; padding: 30rpx; }
.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01); }
.mb-2 { margin-bottom: 20rpx; }
.mb-4 { margin-bottom: 30rpx; }
.mt-4 { margin-top: 40rpx; }

.label { font-size: 26rpx; color: #64748b; font-weight: 500; }

.gender-selector { display: flex; gap: 20rpx; }
.gender-btn {
  flex: 1; padding: 24rpx; border-radius: 20rpx; background: #f8fafc;
  display: flex; flex-direction: column; align-items: center; border: 2rpx solid transparent;
}
.gender-btn.active { background: #eef2ff; border-color: #6366f1; }
.g-icon { font-size: 40rpx; margin-bottom: 8rpx; }

.input-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20rpx; }
.mini-input {
  background: #f8fafc; border-radius: 12rpx; padding: 16rpx; text-align: center;
  font-size: 30rpx; font-weight: 700; color: #1e293b; margin-top: 8rpx;
}

.result-banner {
  background: linear-gradient(135deg, #10b981, #3b82f6); color: #fff; text-align: center;
}
.res-label { font-size: 24rpx; opacity: 0.8; }
.res-main { display: flex; align-items: baseline; justify-content: center; margin-top: 10rpx; }
.res-value { font-size: 72rpx; font-weight: 800; margin-right: 10rpx; }
.res-unit { font-size: 24rpx; }

.card-title { font-size: 28rpx; font-weight: 700; color: #1e293b; margin-bottom: 24rpx; }
.activity-row {
  display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1px solid #f1f5f9;
}
.activity-row:last-child { border-bottom: none; }
.a-label { font-size: 26rpx; color: #64748b; }
.a-value { font-size: 28rpx; font-weight: 700; color: #1e293b; }
</style>
