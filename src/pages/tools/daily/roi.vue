<template>
  <ToolLayout title="投资回报率 (ROI)">
    <view class="card shadow-md mb-4">
      <view class="input-group">
        <text class="label">投资本金 (元)</text>
        <input type="digit" v-model.number="invested" class="full-input" />
      </view>
      <view class="input-group mt-4">
        <text class="label">最终回收 (元)</text>
        <input type="digit" v-model.number="returned" class="full-input" />
      </view>
      <view class="input-group mt-4">
        <text class="label">持有时间</text>
        <view class="period-input">
          <input type="number" v-model.number="periodValue" class="mini-input flex-1" />
          <picker :range="periodUnits" :value="unitIndex" @change="e => unitIndex = e.detail.value">
            <view class="unit-picker">{{ periodUnits[unitIndex] }}</view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 结果卡片 -->
    <view class="card result-card shadow-sm mb-4" :class="isProfit ? 'profit' : 'loss'">
      <view class="res-item main">
        <text class="res-label">{{ isProfit ? '总盈利' : '总亏损' }}</text>
        <text class="res-value">¥ {{ Math.abs(profit).toLocaleString() }}</text>
      </view>
      <view class="res-grid">
        <view class="res-item">
          <text class="res-label">总回报率</text>
          <text class="res-sub-value">{{ isProfit ? '+' : '' }}{{ roi.toFixed(2) }}%</text>
        </view>
        <view class="res-item">
          <text class="res-label">年化收益率</text>
          <text class="res-sub-value">{{ annualizedRoi >= 0 ? '+' : '' }}{{ annualizedRoi.toFixed(2) }}%</text>
        </view>
      </view>
    </view>

    <view class="info-card">
      <text class="info-desc">💡 年化收益率是指把当前收益率换算成一年的收益率，它是衡量投资表现的重要指标。计算公式：[(回收/本金)^(1/年) - 1] * 100%</text>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import ToolLayout from '@/components/common/ToolLayout.vue';
import { calculateROI } from '@/utils/finance';

const invested = ref(10000);
const returned = ref(12000);
const periodValue = ref(1);
const periodUnits = ['年', '月', '日'];
const unitIndex = ref(0);

const profitData = computed(() => {
  const units = ['years', 'months', 'days'];
  return calculateROI(invested.value, returned.value, periodValue.value, units[unitIndex.value]);
});

const profit = computed(() => profitData.value.profit);
const roi = computed(() => profitData.value.roi);
const annualizedRoi = computed(() => profitData.value.annualizedRoi);
const isProfit = computed(() => profit.value >= 0);
</script>

<style scoped>
.card { background: #fff; border-radius: 32rpx; padding: 40rpx; }
.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01); }
.mb-4 { margin-bottom: 30rpx; }
.mt-4 { margin-top: 30rpx; }

.label { font-size: 26rpx; color: #64748b; font-weight: 700; margin-bottom: 16rpx; display: block; }
.full-input {
  background: #f8fafc; border-radius: 16rpx; height: 100rpx; padding: 0 30rpx;
  font-size: 36rpx; font-weight: 700; color: #1e293b;
}

.period-input { display: flex; gap: 20rpx; }
.mini-input {
  background: #f8fafc; border-radius: 16rpx; height: 100rpx; padding: 0 30rpx;
  font-size: 36rpx; font-weight: 700;
}
.unit-picker {
  background: #f1f5f9; border-radius: 16rpx; height: 100rpx; width: 140rpx;
  display: flex; align-items: center; justify-content: center; font-size: 28rpx; color: #475569;
}

.result-card { transition: all 0.3s; }
.result-card.profit { background: #ecfdf5; border: 2rpx solid #10b981; }
.result-card.loss { background: #fef2f2; border: 2rpx solid #ef4444; }

.main { text-align: center; margin-bottom: 40rpx; }
.main .res-value { font-size: 64rpx; font-weight: 800; color: #1e293b; }

.res-grid { display: flex; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 30rpx; }
.res-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.res-label { font-size: 22rpx; color: #64748b; margin-bottom: 8rpx; }
.res-sub-value { font-size: 36rpx; font-weight: 700; color: #1e293b; }

.profit .res-sub-value { color: #059669; }
.loss .res-sub-value { color: #dc2626; }

.info-card { padding: 30rpx; background: #f8fafc; border-radius: 20rpx; }
.info-desc { font-size: 24rpx; color: #64748b; line-height: 1.6; }
</style>
