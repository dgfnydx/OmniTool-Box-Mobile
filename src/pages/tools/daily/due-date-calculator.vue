<template>
  <ToolLayout :title="t('tools.due-date-calculator.name')">
    <view class="workspace">
      <!-- 输入区域 -->
      <view class="card shadow-md mb-4">
        <view class="form-group">
          <text class="label">{{ t('tools.due-date-calculator.lastPeriod') }}</text>
          <picker mode="date" :value="lastPeriodDate" @change="onDateChange">
            <view class="date-picker-box">
              <text class="date-text">{{ lastPeriodDate || t('tools.due-date-calculator.placeholder') }}</text>
              <text class="calendar-icon">📅</text>
            </view>
          </picker>
        </view>
        <view class="tip-box mt-4">
          <text class="tip-icon">💡</text>
          <text class="tip-text">{{ t('tools.due-date-calculator.tip') }}</text>
        </view>
      </view>

      <!-- 结果展示 -->
      <view v-if="results" class="result-section">
        <view class="stat-card edd mb-3">
          <view class="stat-icon-bg">
            <text class="stat-emoji">👶</text>
          </view>
          <view class="stat-info">
            <text class="stat-label">{{ t('tools.due-date-calculator.edd') }}</text>
            <text class="stat-value">{{ results.edd }}</text>
          </view>
        </view>

        <view class="stat-card age mb-4">
          <view class="stat-icon-bg blue">
            <text class="stat-emoji">🕒</text>
          </view>
          <view class="stat-info">
            <text class="stat-label">{{ t('tools.due-date-calculator.gestationalAge') }}</text>
            <text class="stat-value">{{ results.weeks }}{{ t('tools.due-date-calculator.weeks') }}{{ results.days }}{{ t('tools.due-date-calculator.days') }}</text>
          </view>
        </view>

        <!-- 进度条 -->
        <view class="card shadow-sm progress-card">
          <view class="progress-header">
            <text class="p-title">{{ t('tools.due-date-calculator.progress') }}</text>
            <text class="p-percent">{{ results.progress }}%</text>
          </view>
          <view class="progress-bg">
            <view class="progress-fill" :style="{ width: results.progress + '%' }">
              <view class="heart-icon">❤️</view>
            </view>
          </view>
          <view class="remaining-box">
            <text class="rem-text">{{ t('tools.due-date-calculator.remaining') }} </text>
            <text class="rem-value">{{ results.remainingDays }}</text>
            <text class="rem-text"> {{ t('tools.due-date-calculator.days') }}</text>
          </view>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const lastPeriodDate = ref(new Date().toISOString().split('T')[0]);

const onDateChange = (e) => {
  lastPeriodDate.value = e.detail.value;
};

const results = computed(() => {
  if (!lastPeriodDate.value) return null;

  const start = new Date(lastPeriodDate.value);
  const today = new Date();
  
  // 预产期: 末次月经 + 280天
  const edd = new Date(start);
  edd.setDate(start.getDate() + 280);
  
  // 当前已怀孕天数
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 孕周和天
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  
  // 剩余天数
  const remainingDays = Math.max(0, 280 - diffDays);
  
  // 进度百分比
  const progress = Math.min(100, Math.max(0, (diffDays / 280) * 100));

  return {
    edd: edd.toISOString().split('T')[0],
    weeks,
    days,
    remainingDays,
    progress: progress.toFixed(1),
    isOverdue: diffDays > 280
  };
});
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

.mb-3 { margin-bottom: 24rpx; }
.mb-4 { margin-bottom: 30rpx; }
.mt-4 { margin-top: 30rpx; }

.label {
  font-size: 28rpx;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 20rpx;
  display: block;
}

.date-picker-box {
  background: #f8fafc;
  border-radius: 16rpx;
  height: 100rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2e8f0;
}

.date-text {
  font-size: 34rpx;
  font-weight: 700;
  color: #1e293b;
}

.calendar-icon {
  font-size: 36rpx;
}

.tip-box {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  background: #f0fdf4;
  border-radius: 16rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #166534;
  line-height: 1.6;
  flex: 1;
}

.stat-card {
  background: #ffffff;
  border-radius: 32rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  gap: 30rpx;
  border: 1px solid #f1f5f9;
}

.stat-icon-bg {
  width: 100rpx;
  height: 100rpx;
  background: #fdf2f8;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-bg.blue {
  background: #eff6ff;
}

.stat-emoji {
  font-size: 48rpx;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #94a3b8;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 800;
  color: #1e293b;
}

.edd .stat-value {
  color: #db2777;
}

.age .stat-value {
  color: #2563eb;
}

.progress-card {
  padding: 40rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.p-title {
  font-size: 28rpx;
  color: #475569;
  font-weight: 600;
}

.p-percent {
  font-size: 28rpx;
  color: #ec4899;
  font-weight: 700;
}

.progress-bg {
  height: 16rpx;
  background: #f1f5f9;
  border-radius: 100rpx;
  position: relative;
  margin-bottom: 30rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ec4899, #f472b6);
  border-radius: 100rpx;
  position: relative;
  transition: width 0.5s ease;
}

.heart-icon {
  position: absolute;
  right: -10rpx;
  top: -10rpx;
  font-size: 24rpx;
  text-shadow: 0 0 10rpx rgba(236, 72, 153, 0.5);
}

.remaining-box {
  text-align: center;
}

.rem-text {
  font-size: 26rpx;
  color: #64748b;
}

.rem-value {
  font-size: 34rpx;
  font-weight: 800;
  color: #ec4899;
  margin: 0 8rpx;
}
</style>
