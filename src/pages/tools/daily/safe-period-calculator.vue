<template>
  <ToolLayout :title="t('tools.safe-period-calculator.name')">
    <view class="workspace">
      <!-- 输入区域 -->
      <view class="card shadow-md mb-4">
        <view class="form-group mb-4">
          <text class="label">{{ t('tools.safe-period-calculator.lastPeriod') }}</text>
          <picker mode="date" :value="lastDate" @change="onDateChange">
            <view class="date-picker-box">
              <text class="date-text">{{ lastDate }}</text>
              <text class="calendar-icon">📅</text>
            </view>
          </picker>
        </view>
        
        <view class="form-row">
          <view class="form-group">
            <text class="label">{{ t('tools.safe-period-calculator.cycleLength') }}</text>
            <view class="number-input-wrapper">
              <input type="number" v-model.number="cycleLength" min="20" max="45" class="mini-input" />
              <text class="unit">{{ t('tools.safe-period-calculator.days') }}</text>
            </view>
          </view>
          
          <view class="form-group">
            <text class="label">{{ t('tools.safe-period-calculator.periodLength') }}</text>
            <view class="number-input-wrapper">
              <input type="number" v-model.number="periodLength" min="2" max="14" class="mini-input" />
              <text class="unit">{{ t('tools.safe-period-calculator.days') }}</text>
            </view>
          </view>
        </view>

        <view class="tip-box mt-4">
          <text class="tip-icon">💡</text>
          <text class="tip-text">{{ t('tools.safe-period-calculator.tip') }}</text>
        </view>
      </view>

      <!-- 结果卡片 -->
      <view v-if="results" class="result-list">
        <view class="res-card period">
          <view class="res-icon">📅</view>
          <view class="res-info">
            <text class="res-label">{{ t('tools.safe-period-calculator.nextPeriod') }}</text>
            <text class="res-value">{{ results.nextPeriod }}</text>
          </view>
        </view>

        <view class="res-card ovulation">
          <view class="res-icon">🥚</view>
          <view class="res-info">
            <text class="res-label">{{ t('tools.safe-period-calculator.ovulationDay') }}</text>
            <text class="res-value">{{ results.ovulationDay }}</text>
          </view>
        </view>

        <view class="res-card fertile">
          <view class="res-icon">🌟</view>
          <view class="res-info">
            <text class="res-label">{{ t('tools.safe-period-calculator.fertileWindow') }}</text>
            <text class="res-value">{{ results.fertileStart }} ~ {{ results.fertileEnd }}</text>
          </view>
        </view>

        <view class="res-card safe">
          <view class="res-icon">🛡️</view>
          <view class="res-info">
            <text class="res-label">{{ t('tools.safe-period-calculator.safeWindow') }}</text>
            <view class="safe-dates">
              <text class="res-value">{{ results.safe1Start }} ~ {{ results.safe1End }}</text>
              <text class="res-value">{{ results.safe2Start }} ~ {{ results.safe2End }}</text>
            </view>
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

const lastDate = ref(new Date().toISOString().split('T')[0]);
const cycleLength = ref(28);
const periodLength = ref(5);

const onDateChange = (e) => {
  lastDate.value = e.detail.value;
};

const formatDate = (date) => date.toISOString().split('T')[0];

const results = computed(() => {
  if (!lastDate.value || cycleLength.value < 20 || cycleLength.value > 45) return null;

  const start = new Date(lastDate.value);
  
  // 下次月经
  const nextPeriod = new Date(start);
  nextPeriod.setDate(start.getDate() + cycleLength.value);
  
  // 排卵日 (下次月经前14天)
  const ovulation = new Date(nextPeriod);
  ovulation.setDate(nextPeriod.getDate() - 14);
  
  // 易孕期 (排卵日前5后4)
  const fertileStart = new Date(ovulation);
  fertileStart.setDate(ovulation.getDate() - 5);
  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(ovulation.getDate() + 4);
  
  // 前安全期 (月经结束到易孕期开始)
  const safe1Start = new Date(start);
  safe1Start.setDate(start.getDate() + periodLength.value);
  const safe1End = new Date(fertileStart);
  safe1End.setDate(fertileStart.getDate() - 1);
  
  // 后安全期 (易孕期结束到下次月经)
  const safe2Start = new Date(fertileEnd);
  safe2Start.setDate(fertileEnd.getDate() + 1);
  const safe2End = new Date(nextPeriod);
  safe2End.setDate(nextPeriod.getDate() - 1);

  return {
    nextPeriod: formatDate(nextPeriod),
    ovulationDay: formatDate(ovulation),
    fertileStart: formatDate(fertileStart),
    fertileEnd: formatDate(fertileEnd),
    safe1Start: formatDate(safe1Start),
    safe1End: formatDate(safe1End),
    safe2Start: formatDate(safe2Start),
    safe2End: formatDate(safe2End)
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

.mb-4 { margin-bottom: 30rpx; }
.mt-4 { margin-top: 30rpx; }

.label {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 16rpx;
  display: block;
}

.date-picker-box {
  background: #f8fafc;
  border-radius: 16rpx;
  height: 90rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2e8f0;
}

.date-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #1e293b;
}

.form-row {
  display: flex;
  gap: 20rpx;
}

.form-row .form-group {
  flex: 1;
}

.number-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.mini-input {
  width: 100%;
  background: #f8fafc;
  border-radius: 16rpx;
  height: 90rpx;
  padding: 0 24rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.unit {
  position: absolute;
  right: 24rpx;
  font-size: 24rpx;
  color: #94a3b8;
}

.tip-box {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  background: #fff7ed;
  border-radius: 16rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #c2410c;
  line-height: 1.6;
  flex: 1;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.res-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 30rpx;
  background: #ffffff;
  border-radius: 24rpx;
  border-left: 8rpx solid #e2e8f0;
}

.res-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}

.res-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
}

.res-label {
  font-size: 24rpx;
  color: #94a3b8;
}

.res-value {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
}

.safe-dates {
  display: flex;
  flex-direction: column;
}

/* Colors */
.period { border-left-color: #ef4444; }
.period .res-icon { background: #fee2e2; }

.ovulation { border-left-color: #ca8a04; }
.ovulation .res-icon { background: #fef9c3; }

.fertile { border-left-color: #22c55e; }
.fertile .res-icon { background: #dcfce7; }

.safe { border-left-color: #3b82f6; }
.safe .res-icon { background: #dbeafe; }
</style>
