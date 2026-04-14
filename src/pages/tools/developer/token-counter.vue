<template>
  <ToolLayout :title="$t('tools.token-counter.name')">
    <template #header-right>
      <text class="clear-btn" @tap="clearInput">{{ $t('common.actions.clear') }}</text>
    </template>

    <view class="tool-container">
      <!-- 统计数值 -->
      <view class="stats-grid mb-4">
        <view class="stat-card accent shadow-sm">
          <text class="stat-value">{{ tokenCount }}</text>
          <text class="stat-label">{{ $t('tools.token-counter.tokens') }}</text>
        </view>
        <view class="stat-card shadow-sm">
          <text class="stat-value">{{ characterCount }}</text>
          <text class="stat-label">{{ $t('tools.token-counter.characters') }}</text>
        </view>
      </view>

      <!-- 模型选择 -->
      <view class="card shadow-sm mb-4">
        <view class="label-row mb-2">
          <text class="label">{{ $t('tools.token-counter.model') }}</text>
        </view>
        <picker :range="modelOptions" range-key="label" @change="onModelChange">
          <view class="picker-box">
            <text>{{ currentModelLabel }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>

      <!-- 输入区域 -->
      <view class="card shadow-sm mb-4">
        <view class="header-row mb-2">
          <text class="card-title">{{ $t('tools.token-counter.input') }}</text>
          <text class="copy-link" @tap="copyInput">{{ $t('common.actions.copy') }}</text>
        </view>
        <textarea 
          v-model="input" 
          :placeholder="$t('tools.token-counter.placeholder')" 
          class="token-textarea"
          maxlength="-1"
        />
      </view>

      <!-- 提示信息 -->
      <view class="info-card">
        <text class="info-icon">💡</text>
        <text class="info-text">{{ modelInfo }}</text>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getEncoding } from 'js-tiktoken';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const input = ref('');
const model = ref('cl100k_base');

const modelOptions = [
  { value: 'cl100k_base', label: 'cl100k_base (GPT-4 / GPT-3.5)' },
  { value: 'p50k_base', label: 'p50k_base (GPT-3 / Codex)' },
  { value: 'r50k_base', label: 'r50k_base (GPT-2 / Older)' },
  { value: 'chinese_general', label: 'Chinese General (Qwen, GLM, etc.)' }
];

const currentModelLabel = computed(() => {
  const option = modelOptions.find(o => o.value === model.value);
  return option ? option.label : model.value;
});

const modelInfo = computed(() => {
  return t(`tools.token-counter.models.${model.value}`);
});

const onModelChange = (e) => {
  model.value = modelOptions[e.detail.value].value;
};

const tokenCount = computed(() => {
  if (!input.value) return 0;
  
  if (model.value === 'chinese_general') {
    const chineseChars = (input.value.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = input.value.length - chineseChars;
    return Math.ceil(chineseChars * 1.2 + (otherChars / 4) * 1.1);
  }

  try {
    const enc = getEncoding(model.value);
    const tokens = enc.encode(input.value);
    return tokens.length;
  } catch (e) {
    console.error('Encoding error:', e);
    return 0;
  }
});

const characterCount = computed(() => input.value.length);

const clearInput = () => {
  input.value = '';
};

const copyInput = () => {
  if (input.value) {
    uni.setClipboardData({
      data: input.value,
      success: () => {
        uni.showToast({
          title: t('common.actions.copied'),
          icon: 'success'
        });
      }
    });
  }
};
</script>

<style scoped>
.tool-container {
  padding-bottom: 40rpx;
}

.clear-btn {
  font-size: 26rpx;
  color: #6366f1;
  font-weight: 500;
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
.mb-2 { margin-bottom: 20rpx; }

.stats-grid {
  display: flex;
  gap: 20rpx;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2rpx solid transparent;
}

.stat-card.accent {
  border-color: #6366f1;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%);
}

.stat-value {
  font-size: 48rpx;
  font-weight: 800;
  color: #1e293b;
}

.stat-card.accent .stat-value {
  color: #6366f1;
}

.stat-label {
  font-size: 22rpx;
  color: #64748b;
  margin-top: 8rpx;
  text-transform: uppercase;
  letter-spacing: 2rpx;
}

.label-row, .header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label, .card-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #1e293b;
}

.copy-link {
  font-size: 24rpx;
  color: #6366f1;
}

.picker-box {
  background: #f8fafc;
  padding: 24rpx 30rpx;
  border-radius: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  color: #1e293b;
}

.picker-arrow {
  font-size: 20rpx;
  color: #94a3b8;
}

.token-textarea {
  width: 100%;
  height: 400rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #334155;
  font-family: monospace;
}

.info-card {
  display: flex;
  padding: 24rpx;
  background: #f1f5f9;
  border-radius: 16rpx;
  align-items: flex-start;
}

.info-icon {
  margin-right: 16rpx;
  font-size: 28rpx;
}

.info-text {
  flex: 1;
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.5;
}
</style>
