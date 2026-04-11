<template>
  <ToolLayout :title="t('tools.json-formatter.name')">
    <view class="workspace">
      <!-- 输入区域 -->
      <view class="editor-section">
        <view class="label-row">
          <text class="label">{{ t('tools.json-formatter.input') }}</text>
          <view class="actions">
            <button @tap="formatJson" class="primary-btn" size="mini">{{ t('common.actions.format') }}</button>
            <button @tap="clearAll" class="secondary-btn" size="mini">{{ t('common.actions.clear') }}</button>
          </view>
        </view>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.json-formatter.inputPlaceholder')" 
          class="json-textarea"
          maxlength="-1"
        ></textarea>
      </view>

      <!-- 输出区域 -->
      <view class="editor-section mt-4">
        <view class="label-row">
          <text class="label">{{ t('tools.json-formatter.output') }}</text>
          <button v-if="output" @tap="copyOutput" class="text-btn" size="mini">{{ t('common.actions.copy') }}</button>
        </view>
        <view v-if="error" class="error-msg">{{ error }}</view>
        
        <scroll-view scroll-x scroll-y class="output-wrapper">
          <rich-text v-if="highlightedCode" :nodes="highlightedCode" class="prism-code"></rich-text>
          <view v-if="!output && !error" class="placeholder-text">
            {{ t('tools.json-formatter.outputPlaceholder') }}
          </view>
        </scroll-view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();
const input = ref('');
const output = ref('');
const error = ref('');
const highlightedCode = ref('');

const formatJson = () => {
  try {
    error.value = '';
    if (!input.value.trim()) {
      output.value = '';
      highlightedCode.value = '';
      return;
    }
    const parsed = JSON.parse(input.value);
    const formatted = JSON.stringify(parsed, null, 2);
    output.value = formatted;
    
    // 使用 Prism 进行高亮并转换为 HTML
    const html = Prism.highlight(formatted, Prism.languages.json, 'json');
    // 处理换行，rich-text 需要 <br/> 或者包装在 <pre> 中
    highlightedCode.value = `<pre class="language-json" style="margin:0; padding:0; background:transparent;">${html}</pre>`;
  } catch (e) {
    error.value = t('tools.json-formatter.invalidJson') + ': ' + e.message;
    output.value = '';
    highlightedCode.value = '';
  }
};

const clearAll = () => {
  input.value = '';
  output.value = '';
  error.value = '';
  highlightedCode.value = '';
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

.json-textarea {
  width: 100%;
  height: 400rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #1e293b;
  font-family: monospace;
  font-size: 26rpx;
  box-sizing: border-box;
}

.output-wrapper {
  width: 100%;
  height: 600rpx;
  border-radius: 16rpx;
  border: 1px solid #e2e8f0;
  background: #2d2d2d; /* Prism Tomorrow 背景色 */
  padding: 24rpx;
  box-sizing: border-box;
  position: relative;
}

.prism-code {
  font-family: monospace;
  font-size: 26rpx;
  line-height: 1.5;
}

/* 简易 Prism Tomorrow 主题补丁，适配 rich-text */
:deep(.token.property) { color: #99cc99; }
:deep(.token.string) { color: #ce9178; }
:deep(.token.number) { color: #f08d49; }
:deep(.token.boolean) { color: #f08d49; }
:deep(.token.operator) { color: #67cdcc; }
:deep(.token.punctuation) { color: #ccc; }

.placeholder-text {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  color: #666;
  font-size: 26rpx;
}

.error-msg {
  color: #ef4444;
  font-size: 24rpx;
  margin-bottom: 10rpx;
}

.actions {
  display: flex;
  gap: 16rpx;
}

.primary-btn {
  background: #6366f1;
  color: white;
  margin: 0;
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
