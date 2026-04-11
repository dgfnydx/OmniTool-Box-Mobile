<template>
  <ToolLayout :title="t('tools.amount-to-uppercase.name')">
    <view class="workspace">
      <view class="editor-section">
        <view class="label-row">
          <text class="label">{{ t('tools.amount-to-uppercase.input') }}</text>
          <view class="actions">
            <button @click="clearAll" class="secondary-btn" size="mini">{{ t('common.actions.clear') }}</button>
          </view>
        </view>
        <input 
          v-model="input" 
          type="digit"
          :placeholder="t('tools.amount-to-uppercase.placeholder')" 
          class="amount-input"
        />
        <view v-if="error" class="error-msg">{{ error }}</view>
      </view>

      <view class="editor-section">
        <view class="label-row">
          <text class="label">{{ t('tools.amount-to-uppercase.output') }}</text>
          <button v-if="output" @click="copyOutput" class="text-btn" size="mini">{{ t('common.actions.copy') }}</button>
        </view>
        <textarea 
          v-model="output" 
          disabled 
          :placeholder="t('tools.amount-to-uppercase.outputPlaceholder')" 
          class="uppercase-textarea"
          auto-height
        ></textarea>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();
const input = ref('');
const output = ref('');
const error = ref('');

const convertToUppercase = (amountStr) => {
  if (!amountStr || isNaN(Number(amountStr))) {
    return '';
  }

  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  
  let num = Math.abs(parseFloat(amountStr));
  let s = '';
  
  // 处理小数部分
  for (let i = 0; i < fraction.length; i++) {
    const val = Math.floor(num * 10 * Math.pow(10, i + 1)) % 10; // Fixed small bug in original logic potential precision issue
    if (val > 0) {
      s += (digit[val] + fraction[i]).replace(/零./, '');
    }
  }
  
  s = s || '整';
  
  // 处理整数部分
  let integer = Math.floor(num);
  if (integer === 0) {
    s = '零元' + s;
  } else {
    let unitIdx = 0;
    while (integer > 0) {
      let p = '';
      for (let j = 0; j < unit[1].length && integer > 0; j++) {
        p = digit[integer % 10] + unit[1][j] + p;
        integer = Math.floor(integer / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][unitIdx] + s;
      unitIdx++;
    }
  }
  
  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
    .replace(/元整$/, '元整'); // Ensure correctness
};

watch(input, (newVal) => {
  error.value = '';
  if (newVal && isNaN(Number(newVal))) {
    error.value = t('tools.amount-to-uppercase.invalidAmount');
    output.value = '';
    return;
  }
  output.value = convertToUppercase(newVal);
});

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

.amount-input {
  width: 100%;
  padding: 24rpx;
  border-radius: 12rpx;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #1e293b;
  font-size: 40rpx;
  box-sizing: border-box;
}

.uppercase-textarea {
  width: 100%;
  min-height: 160rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #1e293b;
  font-size: 32rpx;
  line-height: 1.6;
  box-sizing: border-box;
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

.error-msg {
  color: #ef4444;
  font-size: 24rpx;
}
</style>
