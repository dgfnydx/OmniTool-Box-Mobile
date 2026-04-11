<template>
  <ToolLayout :title="t('tools.base64-converter.name')">
    <view class="workspace">
      <!-- 输入区域 -->
      <view class="editor-section">
        <view class="label-row">
          <text class="label">{{ t('tools.base64-converter.input') }}</text>
          <view class="actions">
            <button @tap="encodeBase64" class="primary-btn" size="mini">{{ t('tools.base64-converter.encode') }}</button>
            <button @tap="decodeBase64" class="primary-btn" size="mini">{{ t('tools.base64-converter.decode') }}</button>
            <button @tap="clearAll" class="secondary-btn" size="mini">{{ t('common.actions.clear') }}</button>
          </view>
        </view>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.base64-converter.inputPlaceholder')" 
          class="base64-textarea"
          maxlength="-1"
        ></textarea>
      </view>

      <!-- 输出区域 -->
      <view class="editor-section mt-4">
        <view class="label-row">
          <text class="label">{{ t('tools.base64-converter.output') }}</text>
          <button v-if="output" @tap="copyOutput" class="text-btn" size="mini">{{ t('common.actions.copy') }}</button>
        </view>
        <view v-if="error" class="error-msg">{{ error }}</view>
        
        <textarea 
          v-model="output" 
          disabled 
          :placeholder="t('tools.base64-converter.outputPlaceholder')" 
          class="base64-textarea result"
          maxlength="-1"
        ></textarea>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Base64 } from 'js-base64';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();
const input = ref('');
const output = ref('');
const error = ref('');

const encodeBase64 = () => {
  try {
    error.value = '';
    if (!input.value) {
      output.value = '';
      return;
    }
    output.value = Base64.encode(input.value);
  } catch (e) {
    error.value = t('tools.base64-converter.encodeError') + ': ' + e.message;
  }
};

const decodeBase64 = () => {
  try {
    error.value = '';
    if (!input.value) {
      output.value = '';
      return;
    }
    output.value = Base64.decode(input.value);
  } catch (e) {
    error.value = t('tools.base64-converter.decodeError') + ': ' + e.message;
  }
};

const clearAll = () => {
  input.value = '';
  output.value = '';
  error.value = '';
};

const copyOutput = () => {
  if (output.value) {
    uni.setClipboardData({
      data: output.value,
      success: () => {
        uni.showToast({ title: t('common.actions.copied'), icon: 'success' });
      }
    });
  }
};
</script>

<style scoped>
.workspace {
  padding-bottom: 40rpx;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.label {
  font-weight: 700;
  color: #1e293b;
  font-size: 28rpx;
}

.base64-textarea {
  width: 100%;
  height: 360rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #1e293b;
  font-family: monospace;
  font-size: 28rpx;
  box-sizing: border-box;
}

.base64-textarea.result {
  background: #f8fafc;
}

.error-msg {
  color: #ef4444;
  font-size: 24rpx;
  margin-bottom: 10rpx;
}

.actions {
  display: flex;
  gap: 12rpx;
}

.primary-btn {
  background: #6366f1;
  color: white;
  margin: 0;
  padding: 0 20rpx;
}

.secondary-btn {
  background: #f1f5f9;
  color: #475569;
  margin: 0;
}

.text-btn {
  background: transparent;
  color: #6366f1;
  font-weight: 700;
  margin: 0;
  padding: 0;
}
.text-btn::after { border: none; }

.mt-4 { margin-top: 40rpx; }
</style>
