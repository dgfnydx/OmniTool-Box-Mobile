<template>
  <ToolLayout :title="$t('tools.word-frequency.name')">
    <!-- 设置区 -->
    <view class="card shadow-md mb-4">
      <view class="settings-header" @tap="showSettings = !showSettings">
        <text class="label">{{ $t('tools.word-frequency.settingsTitle') }}</text>
        <text class="toggle-icon">{{ showSettings ? '🔼' : '🔽' }}</text>
      </view>
      
      <view v-if="showSettings" class="settings-grid mt-2">
        <view class="setting-item" @tap="ignoreCase = !ignoreCase">
          <view class="checkbox" :class="{ active: ignoreCase }">
            <view v-if="ignoreCase" class="check-inner"></view>
          </view>
          <text class="setting-text">{{ $t('tools.word-frequency.ignoreCase') }}</text>
        </view>
        
        <view class="setting-item" @tap="ignorePunctuation = !ignorePunctuation">
          <view class="checkbox" :class="{ active: ignorePunctuation }">
            <view v-if="ignorePunctuation" class="check-inner"></view>
          </view>
          <text class="setting-text">{{ $t('tools.word-frequency.ignorePunctuation') }}</text>
        </view>
        
        <view class="setting-item" @tap="filterStopWords = !filterStopWords">
          <view class="checkbox" :class="{ active: filterStopWords }">
            <view v-if="filterStopWords" class="check-inner"></view>
          </view>
          <text class="setting-text">{{ $t('tools.word-frequency.filterStopWords') }}</text>
        </view>
        
        <view class="setting-item no-click">
          <text class="setting-text mr-2">{{ $t('tools.word-frequency.minFrequency') }}</text>
          <input type="number" v-model.number="minFrequency" class="mini-input" min="1" />
        </view>
      </view>
    </view>

    <!-- 输入区 -->
    <view class="card shadow-md mb-4">
      <view class="label-row">
        <text class="label">{{ $t('tools.word-frequency.inputPlaceholder') }}</text>
        <text class="action-link delete" @tap="handleClear">{{ $t('common.actions.clear') }}</text>
      </view>
      <textarea 
        v-model="text" 
        class="tool-textarea"
        :placeholder="$t('tools.word-frequency.inputPlaceholder')"
        maxlength="-1"
      />
    </view>

    <!-- 结果统计 -->
    <view v-if="frequencyData.length > 0" class="card shadow-md mb-4">
      <view class="label-row mb-2">
        <text class="label">{{ $t('tools.word-frequency.name') }}</text>
        <!-- #ifdef H5 -->
        <text class="action-link" @tap="handleExport">{{ $t('tools.word-frequency.export') }}</text>
        <!-- #endif -->
      </view>
      
      <view class="table-header">
        <text class="th word">{{ $t('tools.word-frequency.word') }}</text>
        <text class="th count">{{ $t('tools.word-frequency.count') }}</text>
        <text class="th percent">{{ $t('tools.word-frequency.percentage') }}</text>
      </view>
      
      <scroll-view scroll-y class="table-body">
        <view v-for="item in frequencyData" :key="item.word" class="table-row">
          <text class="td word">{{ item.word }}</text>
          <text class="td count">{{ item.count }}</text>
          <view class="td percent">
            <view class="progress-box">
              <view class="progress-bar" :style="{ width: item.percentage + '%' }"></view>
              <text class="progress-text">{{ item.percentage }}%</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <view v-else class="empty-box">
      <text class="empty-icon">📊</text>
      <text class="empty-text">{{ $t('tools.word-frequency.noData') }}</text>
    </view>

  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import { getWordFrequency } from '../../../utils/text';

const { t } = useI18n();

const text = ref('');
const showSettings = ref(false);
const ignoreCase = ref(true);
const ignorePunctuation = ref(true);
const filterStopWords = ref(false);
const minFrequency = ref(1);

const stopWords = [
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'this', 'but', 'not', 'or', 'if'
];

const frequencyData = computed(() => {
  return getWordFrequency(text.value, {
    ignoreCase: ignoreCase.value,
    ignorePunctuation: ignorePunctuation.value,
    filterStopWords: filterStopWords.value,
    minFrequency: minFrequency.value,
    stopWords
  });
});

const handleClear = () => {
  text.value = '';
};

const handleExport = () => {
  if (frequencyData.value.length === 0) return;
  
  const headers = [t('tools.word-frequency.word'), t('tools.word-frequency.count'), t('tools.word-frequency.percentage')];
  const rows = frequencyData.value.map(item => [item.word, item.count, item.percentage + '%']);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // #ifdef H5
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `word_frequency_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  // #endif
};
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-icon {
  font-size: 24rpx;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.setting-item.no-click {
  cursor: default;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid #cbd5e1;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox.active {
  background: #6366f1;
  border-color: #6366f1;
}

.check-inner {
  width: 14rpx;
  height: 14rpx;
  background: #ffffff;
  border-radius: 2rpx;
}

.setting-text {
  font-size: 24rpx;
  color: #475569;
}

.mini-input {
  width: 80rpx;
  height: 40rpx;
  background: #f1f5f9;
  border-radius: 4rpx;
  font-size: 24rpx;
  padding: 0 10rpx;
  text-align: center;
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

.action-link {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 600;
}

.action-link.delete {
  color: #ef4444;
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
}

.table-header {
  display: flex;
  background: #f1f5f9;
  padding: 16rpx 20rpx;
  border-radius: 12rpx;
}

.th {
  font-size: 24rpx;
  font-weight: 700;
  color: #64748b;
}

.table-body {
  max-height: 600rpx;
}

.table-row {
  display: flex;
  padding: 20rpx;
  border-bottom: 2rpx solid #f1f5f9;
}

.td {
  font-size: 26rpx;
  color: #1e293b;
}

.word { flex: 1; font-weight: 600; }
.count { width: 100rpx; text-align: center; }
.percent { width: 220rpx; padding-left: 20rpx; }

.progress-box {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background: #6366f1;
  border-radius: 4rpx;
  opacity: 0.2;
}

.progress-text {
  font-size: 22rpx;
  color: #94a3b8;
  width: 70rpx;
  text-align: right;
}

.empty-box {
  padding: 100rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.empty-icon {
  font-size: 80rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 26rpx;
  color: #94a3b8;
}

.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.mb-2 { margin-bottom: 20rpx; }
.mb-4 { margin-bottom: 30rpx; }
.mt-2 { margin-top: 20rpx; }
.mr-2 { margin-right: 16rpx; }
</style>
