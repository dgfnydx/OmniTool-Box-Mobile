<template>
  <ToolLayout :title="$t('tools.word-counter.name')">
    <!-- 输入区 -->
    <view class="card shadow-md mb-4">
      <view class="editor-header">
        <text class="label">{{ $t('tools.word-counter.placeholder') }}</text>
        <view class="actions">
          <text class="action-link" @tap="handleUppercase">{{ $t('tools.word-counter.uppercase') }}</text>
          <text class="divider">|</text>
          <text class="action-link" @tap="handleLowercase">{{ $t('tools.word-counter.lowercase') }}</text>
          <text class="divider">|</text>
          <text class="action-link delete" @tap="handleClear">{{ $t('common.actions.clear') }}</text>
        </view>
      </view>
      <textarea 
        v-model="input" 
        class="tool-textarea"
        :placeholder="$t('tools.word-counter.placeholder')"
        maxlength="-1"
      />
      <view class="editor-footer">
        <text>{{ stats.charsNoSpaces }} {{ $t('tools.word-counter.charsNoSpaces') }}</text>
      </view>
    </view>

    <!-- 统计结果 -->
    <view class="stats-grid">
      <view v-for="item in statItems" :key="item.key" class="stat-card shadow-sm">
        <view class="stat-icon-box">
          <text class="stat-emoji">{{ item.emoji }}</text>
        </view>
        <view class="stat-info">
          <text class="stat-value">{{ stats[item.key] }}{{ item.unit || '' }}</text>
          <text class="stat-label">{{ $t('tools.word-counter.' + (item.key === 'charsWithSpaces' ? 'chars' : item.key)) }}</text>
        </view>
      </view>
    </view>

    <!-- 统计规则说明 -->
    <view class="info-card mt-4">
      <text class="info-title">💡 {{ $t('tools.word-counter.definitions.title') }}</text>
      <view class="info-list">
        <view v-for="key in ['words', 'chars', 'lines', 'sentences', 'readingTime']" :key="key" class="info-item">
          <text class="bullet">•</text>
          <text class="info-text">{{ $t('tools.word-counter.definitions.' + key) }}</text>
        </view>
      </view>
    </view>
    
    <!-- 悬浮复制按钮 -->
    <view class="fab-btn" @tap="handleCopy">
      <text class="fab-icon">📋</text>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import { analyzeText } from '../../../utils/text';

const { t } = useI18n();
const input = ref('');

const stats = computed(() => analyzeText(input.value));

const statItems = [
  { key: 'words', emoji: '📝' },
  { key: 'charsWithSpaces', emoji: '#️⃣' },
  { key: 'lines', emoji: '📏' },
  { key: 'sentences', emoji: '💬' },
  { key: 'readingTime', emoji: '⏱️', unit: 'm' }
];

const handleUppercase = () => {
  if (!input.value) return;
  input.value = input.value.toUpperCase();
  uni.showToast({ title: t('tools.word-counter.converted'), icon: 'none' });
};

const handleLowercase = () => {
  if (!input.value) return;
  input.value = input.value.toLowerCase();
  uni.showToast({ title: t('tools.word-counter.converted'), icon: 'none' });
};

const handleClear = () => {
  input.value = '';
};

const handleCopy = () => {
  if (!input.value) return;
  uni.setClipboardData({
    data: input.value,
    success: () => {
      uni.showToast({ title: t('common.copied'), icon: 'success' });
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

.editor-header {
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
  align-items: center;
}

.action-link {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 600;
}

.action-link.delete {
  color: #ef4444;
}

.divider {
  font-size: 20rpx;
  color: #e2e8f0;
  margin: 0 16rpx;
}

.tool-textarea {
  width: 100%;
  height: 300rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #1e293b;
  line-height: 1.6;
  box-sizing: border-box;
}

.editor-footer {
  margin-top: 16rpx;
  text-align: right;
  font-size: 24rpx;
  color: #94a3b8;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.stat-card {
  background: #ffffff;
  padding: 24rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.stat-icon-box {
  width: 72rpx;
  height: 72rpx;
  background: #f1f5f9;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-emoji {
  font-size: 36rpx;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 22rpx;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 4rpx;
}

.info-card {
  padding: 30rpx;
  background: #f8fafc;
  border-radius: 24rpx;
  border: 2rpx dashed #e2e8f0;
}

.info-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #334155;
  margin-bottom: 20rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-item {
  display: flex;
  gap: 12rpx;
}

.bullet {
  color: #6366f1;
  font-weight: bold;
}

.info-text {
  flex: 1;
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.5;
}

.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 60rpx;
  width: 100rpx;
  height: 100rpx;
  background: #6366f1;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.4);
  z-index: 100;
}

.fab-icon {
  font-size: 40rpx;
}

.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02); }
.mb-4 { margin-bottom: 30rpx; }
.mt-4 { margin-top: 30rpx; }
</style>
