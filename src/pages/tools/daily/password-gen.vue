<template>
  <ToolLayout :title="$t('tools.password-generator.name')">
    <!-- 结果展示区 -->
    <view class="card shadow-md mb-4 result-box">
      <view class="password-display">
        <text class="password-text">{{ password || '---' }}</text>
      </view>
      <view class="action-row">
        <view class="action-btn refresh" @tap="handleGenerate">
          <text class="btn-icon">🔄</text>
          <text>{{ $t('tools.password-generator.another') }}</text>
        </view>
        <view class="action-btn copy" @tap="handleCopy">
          <text class="btn-icon">📋</text>
          <text>{{ $t('tools.password-generator.copy') }}</text>
        </view>
      </view>
    </view>

    <!-- 强度指示 -->
    <view class="card shadow-sm mb-4 strength-section">
      <view class="strength-header">
        <text class="label">{{ $t('tools.password-generator.strength') }}</text>
        <text class="strength-text" :style="{ color: strengthColor }">{{ strengthText }}</text>
      </view>
      <view class="strength-bar-bg">
        <view class="strength-bar-fill" :style="{ width: (strengthScore / 5 * 100) + '%', background: strengthColor }"></view>
      </view>
    </view>

    <!-- 配置选项 -->
    <view class="card shadow-sm mb-4">
      <view class="option-group">
        <view class="label-row">
          <text class="label">{{ $t('tools.password-generator.length') }}</text>
          <text class="value-badge">{{ length }}</text>
        </view>
        <slider 
          :value="length" 
          @change="e => { length = e.detail.value; handleGenerate(); }" 
          min="4" 
          max="32" 
          activeColor="#6366f1"
        />
      </view>

      <view class="checkbox-grid border-t mt-4 pt-4">
        <view 
          v-for="opt in renderOptions" 
          :key="opt.key" 
          class="checkbox-item" 
          :class="{ active: config[opt.key] }"
          @tap="toggleOption(opt.key)"
        >
          <view class="check-box">
            <view v-if="config[opt.key]" class="check-inner"></view>
          </view>
          <text class="check-label">{{ opt.name }}</text>
        </view>
      </view>
    </view>

    <!-- 提示信息 -->
    <view class="info-card">
      <text class="info-title">💡 {{ $t('tools.password-generator.tips') }}</text>
      <text class="info-desc">{{ $t('tools.password-generator.tipsDesc') }}</text>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import { generateRandomPassword, evaluatePasswordStrength } from '../../../utils/text';

const { t } = useI18n();

const length = ref(16);
const config = ref({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true
});

const password = ref('');

const renderOptions = computed(() => [
  { key: 'uppercase', name: t('tools.password-generator.options.uppercase') },
  { key: 'lowercase', name: t('tools.password-generator.options.lowercase') },
  { key: 'numbers', name: t('tools.password-generator.options.numbers') },
  { key: 'symbols', name: t('tools.password-generator.options.symbols') }
]);

const strengthScore = computed(() => evaluatePasswordStrength(password.value));

const strengthText = computed(() => {
  const s = strengthScore.value;
  if (s <= 2) return t('tools.password-generator.weak');
  if (s <= 4) return t('tools.password-generator.medium');
  return t('tools.password-generator.strong');
});

const strengthColor = computed(() => {
  const s = strengthScore.value;
  if (s <= 2) return '#ef4444';
  if (s <= 4) return '#f59e0b';
  return '#10b981';
});

const handleGenerate = () => {
  password.value = generateRandomPassword({
    length: length.value,
    ...config.value
  });
};

const toggleOption = (key) => {
  config.value[key] = !config.value[key];
  handleGenerate();
};

const handleCopy = () => {
  if (!password.value) return;
  uni.setClipboardData({
    data: password.value,
    success: () => {
      uni.showToast({
        title: t('tools.password-generator.copied'),
        icon: 'success'
      });
    }
  });
};

onMounted(handleGenerate);
</script>

<style scoped>
.result-box {
  background: #ffffff;
  padding: 40rpx;
  text-align: center;
}

.password-display {
  background: #f8fafc;
  padding: 40rpx;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  border: 2rpx dashed #e2e8f0;
  min-height: 140rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 40rpx;
  font-weight: 800;
  color: #1e293b;
  word-break: break-all;
}

.action-row {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  transition: opacity 0.2s;
}

.action-btn:active { opacity: 0.7; }

.refresh {
  background: #f1f5f9;
  color: #64748b;
}

.copy {
  background: #6366f1;
  color: #ffffff;
}

.btn-icon {
  margin-right: 10rpx;
  font-size: 32rpx;
}

.strength-section {
  padding: 30rpx;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.label {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 500;
}

.strength-text {
  font-size: 26rpx;
  font-weight: 700;
}

.strength-bar-bg {
  height: 12rpx;
  background: #f1f5f9;
  border-radius: 6rpx;
  overflow: hidden;
}

.strength-bar-fill {
  height: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.option-group {
  margin-bottom: 30rpx;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.value-badge {
  background: #eef2ff;
  color: #6366f1;
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 100rpx;
  font-weight: 700;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
}

.checkbox-item.active {
  background: #ffffff;
  border-color: #6366f1;
}

.check-box {
  width: 36rpx;
  height: 36rpx;
  border: 3rpx solid #cbd5e1;
  border-radius: 8rpx;
  margin-right: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-item.active .check-box {
  border-color: #6366f1;
  background: #6366f1;
}

.check-inner {
  width: 16rpx;
  height: 16rpx;
  background: #ffffff;
  border-radius: 4rpx;
}

.check-label {
  font-size: 26rpx;
  color: #475569;
}

.info-card {
  padding: 30rpx;
  background: #fffbeb;
  border-radius: 20rpx;
  border: 1px solid #fef3c7;
}

.info-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 10rpx;
}

.info-desc {
  font-size: 24rpx;
  color: #b45309;
  line-height: 1.6;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
}
.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01); }
.mb-4 { margin-bottom: 30rpx; }
.border-t { border-top: 1px solid #f1f5f9; }
.mt-4 { margin-top: 30rpx; }
.pt-4 { padding-top: 30rpx; }
</style>
