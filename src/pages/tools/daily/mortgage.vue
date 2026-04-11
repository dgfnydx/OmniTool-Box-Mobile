<template>
  <ToolLayout :title="$t('tools.mortgage-calculator.name')">
    <view class="tool-container">
      <!-- 贷款类型选择 -->
      <view class="card shadow-sm mb-4">
        <view class="card-title">{{ $t('tools.mortgage-calculator.loanType') }}</view>
        <view class="type-selector">
          <view 
            v-for="item in renderTypes" 
            :key="item.id" 
            class="type-btn" 
            :class="{ active: loanType === item.id }"
            @tap="loanType = item.id"
          >
            {{ item.name }}
          </view>
        </view>
      </view>

      <!-- 输入区域 -->
      <view class="card shadow-sm mb-4">
        <!-- 商业贷款 -->
        <view v-if="loanType !== 'fund'" class="input-group">
          <view class="label-row">
            <text class="label">{{ $t('tools.mortgage-calculator.commercialAmount') }}</text>
            <text class="value-highlight">{{ loanAmount }} {{ $t('common.actions.unitTenThousand') || '万' }}</text>
          </view>
          <slider 
            :value="loanAmount" 
            @change="e => loanAmount = e.detail.value" 
            min="10" 
            max="1000" 
            step="5" 
            activeColor="#6366f1"
          />
          <view class="label-row mt-2">
            <text class="label">{{ $t('tools.mortgage-calculator.annualRate') }}</text>
            <input type="digit" v-model="annualRate" class="mini-input" />
          </view>
        </view>

        <!-- 公积金贷款 -->
        <view v-if="loanType !== 'commercial'" class="input-group" :class="{ 'border-t': loanType === 'combination' }">
          <view class="label-row">
            <text class="label">{{ $t('tools.mortgage-calculator.fundAmount') }}</text>
            <text class="value-highlight">{{ fundAmount }} {{ $t('common.actions.unitTenThousand') || '万' }}</text>
          </view>
          <slider 
            :value="fundAmount" 
            @change="e => fundAmount = e.detail.value" 
            min="5" 
            max="200" 
            step="1" 
            activeColor="#10b981"
          />
          <view class="label-row mt-2">
            <text class="label">{{ $t('tools.mortgage-calculator.fundRate') }}</text>
            <input type="digit" v-model="fundRate" class="mini-input" />
          </view>
        </view>

        <!-- 贷款年限 -->
        <view class="input-group border-t">
          <view class="label-row">
            <text class="label">{{ $t('tools.mortgage-calculator.loanTerm') }}</text>
            <text class="value-highlight">{{ loanYears }} {{ $t('tools.mortgage-calculator.year') }}</text>
          </view>
          <picker :range="yearOptionsLabels" @change="e => loanYears = yearOptions[e.detail.value]">
            <view class="picker-box">
              <text>{{ loanYears }} {{ $t('tools.mortgage-calculator.year') }} ({{ loanYears * 12 }} {{ $t('tools.mortgage-calculator.period') }})</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 还款方式 -->
      <view class="card shadow-sm mb-4">
        <view class="card-title">{{ $t('tools.mortgage-calculator.repaymentMethod') }}</view>
        <view class="method-selector">
          <view 
            class="method-btn" 
            :class="{ active: repaymentMethod === 'equalLoan' }"
            @tap="repaymentMethod = 'equalLoan'"
          >
            <text class="m-title">{{ $t('tools.mortgage-calculator.methods.equalLoan') }}</text>
            <text class="m-desc">{{ $t('tools.mortgage-calculator.methods.equalLoanDesc') }}</text>
          </view>
          <view 
            class="method-btn" 
            :class="{ active: repaymentMethod === 'equalPrincipal' }"
            @tap="repaymentMethod = 'equalPrincipal'"
          >
            <text class="m-title">{{ $t('tools.mortgage-calculator.methods.equalPrincipal') }}</text>
            <text class="m-desc">{{ $t('tools.mortgage-calculator.methods.equalPrincipalDesc') }}</text>
          </view>
        </view>
      </view>

      <!-- 结果面板 -->
      <view class="result-card" v-if="results">
        <view class="result-header">
          <text class="result-label">
            {{ repaymentMethod === 'equalLoan' ? $t('tools.mortgage-calculator.monthlyPayment') : $t('tools.mortgage-calculator.firstMonthPayment') }}
          </text>
          <view class="result-main">
            <text class="currency">¥</text>
            <text class="amount">{{ formatNumber(results.monthlyPayment) }}</text>
          </view>
          <text v-if="repaymentMethod === 'equalPrincipal'" class="result-sub">
            {{ $t('tools.mortgage-calculator.decreasePerMonth') }} ¥{{ formatNumber(results.decreasePerMonth) }}
          </text>
        </view>

        <view class="result-grid">
          <view class="grid-item">
            <text class="g-label">{{ $t('tools.mortgage-calculator.totalInterest') }}</text>
            <text class="g-value">¥{{ formatNumber(results.totalInterest / 10000, 2) }}{{ $t('common.actions.unitTenThousand') || '万' }}</text>
          </view>
          <view class="grid-item">
            <text class="g-label">{{ $t('tools.mortgage-calculator.totalPayment') }}</text>
            <text class="g-value">¥{{ formatNumber(results.totalRepayment / 10000, 2) }}{{ $t('common.actions.unitTenThousand') || '万' }}</text>
          </view>
        </view>

        <view class="progress-container">
          <view class="progress-labels">
            <text>{{ $t('tools.mortgage-calculator.principal') }} {{ ((results.totalLoan*10000) / (results.totalRepayment || 1) * 100).toFixed(1) }}%</text>
            <text>{{ $t('tools.mortgage-calculator.interest') }} {{ (results.totalInterest / (results.totalRepayment || 1) * 100).toFixed(1) }}%</text>
          </view>
          <view class="progress-bar-bg">
            <view class="progress-bar-fill" :style="{ width: ((results.totalLoan*10000) / (results.totalRepayment || 1) * 100) + '%' }"></view>
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
import { calculateRepayment } from '../../../utils/finance';

const { t, locale } = useI18n();

const renderTypes = computed(() => [
  { id: 'commercial', name: t('tools.mortgage-calculator.types.commercial') },
  { id: 'fund', name: t('tools.mortgage-calculator.types.fund') },
  { id: 'combination', name: t('tools.mortgage-calculator.types.combination') }
]);

const loanType = ref('commercial');
const loanAmount = ref(100); 
const fundAmount = ref(50); 
const loanYears = ref(30);
const annualRate = ref(3.85);
const fundRate = ref(2.85);
const repaymentMethod = ref('equalLoan');

const yearOptions = Array.from({ length: 30 }, (_, i) => i + 1);
const yearOptionsLabels = computed(() => yearOptions.map(y => `${y} ${t('tools.mortgage-calculator.year')}`));

const results = computed(() => {
  try {
    let mainPart = { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };
    let fundPart = { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };

    if (loanType.value === 'commercial') {
      mainPart = calculateRepayment(loanAmount.value * 10000, Number(annualRate.value), loanYears.value, repaymentMethod.value);
    } else if (loanType.value === 'fund') {
      mainPart = calculateRepayment(fundAmount.value * 10000, Number(fundRate.value), loanYears.value, repaymentMethod.value);
    } else {
      mainPart = calculateRepayment(loanAmount.value * 10000, Number(annualRate.value), loanYears.value, repaymentMethod.value);
      fundPart = calculateRepayment(fundAmount.value * 10000, Number(fundRate.value), loanYears.value, repaymentMethod.value);
    }

    const totalLoan = loanType.value === 'combination' ? (loanAmount.value + fundAmount.value) : (loanType.value === 'fund' ? fundAmount.value : loanAmount.value);

    return {
      monthlyPayment: mainPart.monthly + fundPart.monthly,
      decreasePerMonth: mainPart.decrease + fundPart.decrease,
      totalInterest: mainPart.interest + fundPart.interest,
      totalRepayment: mainPart.total + fundPart.total,
      totalLoan
    };
  } catch (e) {
    console.error('Calculation error:', e);
    return null;
  }
});

const formatNumber = (num, decimals = 0) => {
  if (isNaN(num)) return '0';
  return Number(num).toLocaleString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};
</script>

<style scoped>
.tool-container {
  padding-bottom: 40rpx;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.shadow-sm {
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02);
}

.mb-4 { margin-bottom: 30rpx; }
.mt-2 { margin-top: 20rpx; }
.border-t { border-top: 1px solid #f1f5f9; padding-top: 30rpx; margin-top: 30rpx; }

.card-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24rpx;
}

.type-selector {
  display: flex;
  background: #f1f5f9;
  padding: 8rpx;
  border-radius: 16rpx;
}

.type-btn {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 26rpx;
  color: #64748b;
  border-radius: 12rpx;
  transition: all 0.2s;
}

.type-btn.active {
  background: #fff;
  color: #6366f1;
  font-weight: 700;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.label {
  font-size: 26rpx;
  color: #64748b;
}

.value-highlight {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
}

.mini-input {
  width: 140rpx;
  height: 60rpx;
  text-align: right;
  font-size: 28rpx;
  font-weight: 700;
  color: #6366f1;
  background: #f8fafc;
  border-radius: 8rpx;
  padding: 0 10rpx;
}

.picker-box {
  background: #f8fafc;
  padding: 20rpx 30rpx;
  border-radius: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  color: #1e293b;
  margin-top: 10rpx;
}

.picker-arrow {
  font-size: 20rpx;
  color: #94a3b8;
}

.method-selector {
  display: flex;
  gap: 20rpx;
}

.method-btn {
  flex: 1;
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 20rpx;
  border: 2rpx solid transparent;
  display: flex;
  flex-direction: column;
}

.method-btn.active {
  background: #eef2ff;
  border-color: #6366f1;
}

.m-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4rpx;
}

.m-desc {
  font-size: 20rpx;
  color: #94a3b8;
}

.result-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 32rpx;
  padding: 40rpx;
  color: #fff;
}

.result-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.result-label {
  font-size: 24rpx;
  color: rgba(255,255,255,0.6);
}

.result-main {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin: 10rpx 0;
}

.currency {
  font-size: 36rpx;
  margin-right: 8rpx;
}

.amount {
  font-size: 64rpx;
  font-weight: 800;
}

.result-sub {
  font-size: 24rpx;
  color: #10b981;
}

.result-grid {
  display: flex;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 30rpx;
  margin-bottom: 30rpx;
}

.grid-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.g-label {
  font-size: 22rpx;
  color: rgba(255,255,255,0.5);
  margin-bottom: 6rpx;
}

.g-value {
  font-size: 30rpx;
  font-weight: 700;
}

.progress-container {
  margin-top: 20rpx;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 20rpx;
  color: rgba(255,255,255,0.4);
  margin-bottom: 10rpx;
}

.progress-bar-bg {
  height: 8rpx;
  background: rgba(255,255,255,0.1);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #6366f1;
  border-radius: 4rpx;
}
</style>
