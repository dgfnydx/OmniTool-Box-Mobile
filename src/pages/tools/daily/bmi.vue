<template>
  <ToolLayout title="BMI 计算器">
    <view class="card shadow-md mb-4 input-card">
      <view class="input-group">
        <view class="label-row">
          <text class="label">体重 (kg)</text>
          <text class="value-highlight">{{ weight }} kg</text>
        </view>
        <slider :value="weight" @change="e => weight = e.detail.value" min="20" max="200" step="0.5" activeColor="#6366f1" />
      </view>

      <view class="input-group border-t mt-4 pt-4">
        <view class="label-row">
          <text class="label">身高 (cm)</text>
          <text class="value-highlight">{{ height }} cm</text>
        </view>
        <slider :value="height" @change="e => height = e.detail.value" min="100" max="250" activeColor="#6366f1" />
      </view>
    </view>

    <!-- 结果圆环 -->
    <view class="card shadow-sm mb-4 result-box">
      <view class="bmi-circle" :style="{ borderColor: categoryColor }">
        <text class="bmi-label">您的 BMI</text>
        <text class="bmi-value">{{ bmi }}</text>
      </view>
      <view class="category-badge" :style="{ backgroundColor: categoryColor }">
        {{ categoryText }}
      </view>
    </view>

    <!-- 刻度表 -->
    <view class="card shadow-sm mb-4">
      <view class="scale-list">
        <view v-for="item in scales" :key="item.label" class="scale-item" :class="{ active: currentCategory === item.id }">
          <view class="scale-bar" :style="{ backgroundColor: item.color }"></view>
          <text class="scale-name">{{ item.name }}</text>
          <text class="scale-range">{{ item.range }}</text>
        </view>
      </view>
    </view>

    <view class="info-card">
      <text class="info-desc">💡 BMI (身体质量指数) 是通过体重和身高衡量的常用指标，适用于成年人。由于肌肉密度大，运动员的 BMI 可能会偏高。</text>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import ToolLayout from '@/components/common/ToolLayout.vue';
import { calculateBMI, getBMICategory } from '@/utils/health';

const weight = ref(70);
const height = ref(175);

const bmi = computed(() => calculateBMI(weight.value, height.value));
const currentCategory = computed(() => getBMICategory(bmi.value));

const scales = [
  { id: 'underweight', name: '偏瘦', range: '<18.5', color: '#3b82f6' },
  { id: 'normal', name: '正常', range: '18.5-25', color: '#10b981' },
  { id: 'overweight', name: '超重', range: '25-30', color: '#f59e0b' },
  { id: 'obese', name: '肥胖', range: '>30', color: '#ef4444' }
];

const categoryText = computed(() => scales.find(s => s.id === currentCategory.value)?.name || '--');
const categoryColor = computed(() => scales.find(s => s.id === currentCategory.value)?.color || '#94a3b8');
</script>

<style scoped>
.card { background: #fff; border-radius: 32rpx; padding: 30rpx; }
.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01); }
.mb-4 { margin-bottom: 30rpx; }
.mt-4 { margin-top: 40rpx; }
.pt-4 { padding-top: 40rpx; }
.border-t { border-top: 1px solid #f1f5f9; }

.label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10rpx; }
.label { font-size: 26rpx; color: #64748b; }
.value-highlight { font-size: 32rpx; font-weight: 700; color: #1e293b; }

.result-box { display: flex; flex-direction: column; align-items: center; padding: 50rpx 0; }
.bmi-circle {
  width: 240rpx; height: 240rpx; border-radius: 50%; border: 12rpx solid;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  margin-bottom: 20rpx; transition: border-color 0.4s;
}
.bmi-label { font-size: 22rpx; color: #94a3b8; }
.bmi-value { font-size: 64rpx; font-weight: 800; color: #1e293b; }

.category-badge {
  padding: 8rpx 30rpx; border-radius: 100rpx; color: #fff; font-size: 28rpx; font-weight: 700;
}

.scale-list { display: flex; justify-content: space-between; gap: 10rpx; }
.scale-item { flex: 1; display: flex; flex-direction: column; align-items: center; opacity: 0.4; transition: all 0.3s; }
.scale-item.active { opacity: 1; transform: translateY(-4rpx); }
.scale-bar { width: 100%; height: 10rpx; border-radius: 5rpx; margin-bottom: 10rpx; }
.scale-name { font-size: 22rpx; font-weight: 600; color: #1e293b; }
.scale-range { font-size: 18rpx; color: #94a3b8; }

.info-card { padding: 30rpx; background: #f8fafc; border-radius: 20rpx; }
.info-desc { font-size: 24rpx; color: #64748b; line-height: 1.6; }
</style>
