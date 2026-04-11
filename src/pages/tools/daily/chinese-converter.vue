<template>
  <ToolLayout :title="t('tools.chinese-converter.name')">
    <view class="workspace">
      <!-- 模式切换 -->
      <view class="tab-container">
        <view 
          class="tab-item" 
          :class="{ active: mode === 's2t' }" 
          @tap="mode = 's2t'"
        >
          <text class="tab-text">{{ t('tools.chinese-converter.toTraditional') }}</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: mode === 't2s' }" 
          @tap="mode = 't2s'"
        >
          <text class="tab-text">{{ t('tools.chinese-converter.toSimplified') }}</text>
        </view>
      </view>

      <view class="editor-section">
        <view class="label-row">
          <text class="label">{{ t('tools.chinese-converter.input') }}</text>
          <button @click="clearAll" class="secondary-btn" size="mini">{{ t('common.actions.clear') }}</button>
        </view>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.chinese-converter.placeholder')" 
          class="converter-textarea"
          maxlength="-1"
        ></textarea>
      </view>

      <view class="editor-section">
        <view class="label-row">
          <text class="label">{{ t('tools.chinese-converter.output') }}</text>
          <button v-if="output" @click="copyOutput" class="text-btn" size="mini">{{ t('common.actions.copy') }}</button>
        </view>
        <textarea 
          v-model="output" 
          disabled 
          :placeholder="t('tools.chinese-converter.outputPlaceholder')" 
          class="converter-textarea result"
          maxlength="-1"
        ></textarea>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import * as OpenCC from 'opencc-js';

const { t } = useI18n();
const input = ref('');
const output = ref('');
const mode = ref('s2t');

// 简转繁转换器
const s2tConverter = OpenCC.Converter({ from: 'cn', to: 'tw' });
// 繁转简转换器
const t2sConverter = OpenCC.Converter({ from: 'tw', to: 'cn' });

const handleConvert = () => {
  if (!input.value) {
    output.value = '';
    return;
  }
  
  if (mode.value === 's2t') {
    output.value = s2tConverter(input.value);
  } else {
    output.value = t2sConverter(input.value);
  }
};

// 实时转换
watch([input, mode], () => {
  handleConvert();
});

const clearAll = () => {
  input.value = '';
  output.value = '';
};

const copyOutput = () => {
  if (output.value) {
    uni.setClipboardData({
      data: output.value,
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
.workspace {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.tab-container {
  display: flex;
  background: #f1f5f9;
  padding: 8rpx;
  border-radius: 16rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 12rpx;
  transition: all 0.3s;
}

.tab-item.active {
  background: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.tab-text {
  font-size: 28rpx;
  color: #64748b;
  font-weight: 500;
}

.tab-item.active .tab-text {
  color: #6366f1;
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
}

.label {
  font-weight: 600;
  font-size: 28rpx;
  color: #334155;
}

.converter-textarea {
  width: 100%;
  height: 300rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #1e293b;
  font-size: 30rpx;
  line-height: 1.6;
  box-sizing: border-box;
}

.converter-textarea.result {
  background: #f8fafc;
}

.secondary-btn {
  margin: 0;
  background: #f1f5f9;
  color: #475569;
}

.text-btn {
  margin: 0;
  background: transparent;
  color: #6366f1;
  border: none;
  font-weight: 500;
}

.text-btn::after {
  border: none;
}
</style>
