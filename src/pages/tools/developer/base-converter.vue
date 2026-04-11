<template>
  <ToolLayout :title="$t('tools.base-converter.name')">
    <view class="workspace">
      <!-- 源进制与输入 -->
      <view class="card shadow-md mb-4">
        <view class="label-row">
          <text class="label">{{ $t('tools.base-converter.fromBase') }} (2-36)</text>
          <view class="quick-bases">
            <view 
              v-for="b in commonBases" 
              :key="'from'+b.value"
              class="base-pill"
              :class="{ active: fromBase === b.value }"
              @tap="fromBase = b.value"
            >
              {{ b.value }}
            </view>
          </view>
        </view>
        
        <view class="input-row mt-2">
          <input type="number" v-model.number="fromBase" class="base-input" min="2" max="36" />
          <input 
            type="text" 
            v-model="input" 
            :placeholder="$t('tools.base-converter.input')" 
            class="value-input"
          />
        </view>
      </view>

      <!-- 交换按钮 -->
      <view class="divider-action">
        <view class="swap-btn" @tap="swapBases">
          <text class="swap-icon">🔄</text>
        </view>
      </view>

      <!-- 目标进制与结果 -->
      <view class="card shadow-md mb-4">
        <view class="label-row">
          <text class="label">{{ $t('tools.base-converter.toBase') }} (2-36)</text>
          <view class="quick-bases">
            <view 
              v-for="b in commonBases" 
              :key="'to'+b.value"
              class="base-pill"
              :class="{ active: toBase === b.value }"
              @tap="toBase = b.value"
            >
              {{ b.value }}
            </view>
          </view>
        </view>
        
        <view class="input-row mt-2">
          <input type="number" v-model.number="toBase" class="base-input" min="2" max="36" />
          <view class="result-box" :class="{ error: !!error }">
            <text class="result-text">{{ error || result || '---' }}</text>
          </view>
        </view>
      </view>

      <!-- 底部操作 -->
      <view class="footer-actions">
        <button class="secondary-btn" size="mini" @tap="clearAll">{{ $t('common.actions.clear') }}</button>
        <button class="primary-btn" size="mini" :disabled="!result || !!error" @tap="handleCopy">{{ $t('common.actions.copy') }}</button>
      </view>

      <!-- 提示 -->
      <view class="info-card mt-4">
        <text class="info-text">💡 {{ $t('tools.base-converter.tip') }}</text>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const input = ref('10');
const fromBase = ref(10);
const toBase = ref(2);
const result = ref('');
const error = ref('');

const commonBases = [
  { value: 2 },
  { value: 8 },
  { value: 10 },
  { value: 16 }
];

const convert = () => {
  error.value = '';
  if (!input.value.toString().trim()) {
    result.value = '';
    return;
  }

  try {
    const decimalValue = parseInt(input.value.toString(), fromBase.value);
    if (isNaN(decimalValue)) {
      throw new Error('Invalid');
    }
    result.value = decimalValue.toString(toBase.value).toUpperCase();
  } catch (e) {
    result.value = '';
    error.value = t('tools.base-converter.invalidInput');
  }
};

const swapBases = () => {
  const temp = fromBase.value;
  fromBase.value = toBase.value;
  toBase.value = temp;
  if (result.value && !error.value) {
    input.value = result.value;
  }
};

const clearAll = () => {
  input.value = '';
  result.value = '';
  error.value = '';
};

const handleCopy = () => {
  if (result.value) {
    uni.setClipboardData({
      data: result.value,
      success: () => {
        uni.showToast({ title: t('common.actions.copied'), icon: 'success' });
      }
    });
  }
};

watch([input, fromBase, toBase], convert, { immediate: true });
</script>

<style scoped>
.workspace {
  padding-bottom: 40rpx;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 24rpx;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

.quick-bases {
  display: flex;
  gap: 10rpx;
}

.base-pill {
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  background: #f1f5f9;
  border-radius: 100rpx;
  color: #64748b;
  font-weight: 700;
}

.base-pill.active {
  background: #6366f1;
  color: #ffffff;
}

.input-row {
  display: flex;
  gap: 20rpx;
}

.base-input {
  width: 100rpx;
  height: 90rpx;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 800;
  color: #1e293b;
}

.value-input, .result-box {
  flex: 1;
  height: 90rpx;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.result-box {
  background: #f8fafc;
}

.result-box.error {
  border-color: #fecaca;
}

.result-text {
  word-break: break-all;
}

.error .result-text {
  color: #ef4444;
  font-size: 24rpx;
}

.divider-action {
  display: flex;
  justify-content: center;
  position: relative;
  height: 60rpx;
  align-items: center;
  margin: 10rpx 0;
}

.divider-action::before {
  content: '';
  position: absolute;
  left: 40rpx;
  right: 40rpx;
  height: 2rpx;
  background: #f1f5f9;
}

.swap-btn {
  width: 60rpx;
  height: 60rpx;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.05);
}

.swap-icon {
  font-size: 30rpx;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  margin-top: 30rpx;
}

.primary-btn { background: #6366f1; color: #fff; margin: 0; }
.secondary-btn { background: #f1f5f9; color: #475569; margin: 0; }

.info-card {
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 16rpx;
}

.info-text {
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.6;
}

.mt-2 { margin-top: 20rpx; }
.mt-4 { margin-top: 40rpx; }
.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
</style>
