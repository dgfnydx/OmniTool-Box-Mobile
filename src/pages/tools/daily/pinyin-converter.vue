<template>
  <ToolLayout :title="t('tools.pinyin-converter.name')">
    <view class="workspace">
      <!-- 模式切换 -->
      <view class="tab-container">
        <view 
          v-for="item in toneOptions" 
          :key="item.value"
          class="tab-item" 
          :class="{ active: toneType === item.value }" 
          @tap="toneType = item.value"
        >
          <text class="tab-text">{{ item.label }}</text>
        </view>
      </view>

      <view class="editor-section">
        <view class="label-row">
          <text class="label">{{ t('tools.pinyin-converter.input') }}</text>
          <button @click="clearAll" class="secondary-btn" size="mini">{{ t('common.actions.clear') }}</button>
        </view>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.pinyin-converter.placeholder')" 
          class="converter-textarea"
          maxlength="-1"
        ></textarea>
      </view>

      <view class="editor-section">
        <view class="label-row">
          <text class="label">{{ t('tools.pinyin-converter.output') }}</text>
          <button v-if="output" @click="copyOutput" class="text-btn" size="mini">{{ t('common.actions.copy') }}</button>
        </view>
        <textarea 
          v-model="output" 
          disabled 
          :placeholder="t('tools.pinyin-converter.outputPlaceholder')" 
          class="converter-textarea result"
          maxlength="-1"
        ></textarea>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import { pinyin } from 'pinyin-pro';

const { t } = useI18n();
const input = ref('');
const output = ref('');
const toneType = ref('tone');

const toneOptions = computed(() => [
  { label: t('tools.pinyin-converter.tone'), value: 'tone' },
  { label: t('tools.pinyin-converter.noTone'), value: 'none' },
  { label: t('tools.pinyin-converter.firstLetter'), value: 'first' }
]);

const handleConvert = () => {
  if (!input.value) {
    output.value = '';
    return;
  }
  
  const options = {
    toneType: toneType.value === 'none' ? 'none' : 'symbol',
    pattern: toneType.value === 'first' ? 'first' : 'pinyin'
  };

  output.value = pinyin(input.value, options);
};

// 实时转换
watch([input, toneType], () => {
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
  font-size: 26rpx;
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
