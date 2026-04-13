<template>
  <ToolLayout :title="$t('tools.morse-converter.name')">
    <!-- 输入区 -->
    <view class="card shadow-md mb-4">
      <view class="label-row">
        <text class="label">{{ $t('tools.morse-converter.input') }}</text>
        <view class="actions">
          <text class="action-btn primary" @tap="handleToMorse">{{ $t('tools.morse-converter.toMorse') }}</text>
          <text class="action-btn primary" @tap="handleFromMorse">{{ $t('tools.morse-converter.fromMorse') }}</text>
          <text class="action-btn delete" @tap="handleClear">{{ $t('common.actions.clear') }}</text>
        </view>
      </view>
      <textarea 
        v-model="input" 
        class="tool-textarea"
        :placeholder="$t('tools.morse-converter.inputPlaceholder')"
        maxlength="-1"
      />
    </view>

    <!-- 输出区 -->
    <view class="card shadow-md mb-4">
      <view class="label-row">
        <text class="label">{{ $t('tools.morse-converter.output') }}</text>
        <text v-if="output" class="copy-link" @tap="handleCopy">{{ $t('common.actions.copy') }}</text>
      </view>
      <textarea 
        v-model="output" 
        class="tool-textarea readonly"
        :placeholder="$t('tools.morse-converter.outputPlaceholder')"
        maxlength="-1"
        disabled
      />
    </view>

    <!-- 摩斯对照参考 (简版) -->
    <view class="info-card">
      <text class="info-title">💡 摩斯电码小知识</text>
      <text class="info-desc">
        摩尔斯电码由点（.）和划（-）组成。本工具支持中英文，中文会自动转义为 Unicode 序列后再转换。
      </text>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import { textToMorse, morseToText } from '../../../utils/text';

const { t } = useI18n();
const input = ref('');
const output = ref('');

const handleToMorse = () => {
  if (!input.value) return;
  output.value = textToMorse(input.value);
};

const handleFromMorse = () => {
  if (!input.value) return;
  try {
    output.value = morseToText(input.value, t('tools.morse-converter.invalidMorse'));
  } catch (e) {
    uni.showToast({
      title: e.message,
      icon: 'none'
    });
  }
};

const handleClear = () => {
  input.value = '';
  output.value = '';
};

const handleCopy = () => {
  if (!output.value) return;
  uni.setClipboardData({
  data: output.value,
  success: () => {
    uni.showToast({ title: t('common.actions.copied'), icon: 'success' });
  }
  });
  };

</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.label {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  font-size: 24rpx;
  font-weight: 600;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.action-btn.primary {
  color: #6366f1;
  background: #eef2ff;
}

.action-btn.delete {
  color: #ef4444;
  background: #fef2f2;
}

.copy-link {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 600;
}

.tool-textarea {
  width: 100%;
  height: 240rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #1e293b;
  line-height: 1.6;
  box-sizing: border-box;
  font-family: monospace;
}

.tool-textarea.readonly {
  background: #f1f5f9;
}

.info-card {
  padding: 30rpx;
  background: #fffbeb;
  border-radius: 24rpx;
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

.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.mb-4 { margin-bottom: 30rpx; }
</style>
