<template>
  <ToolLayout :title="$t('tools.doc-comparator.name')">
    <template #header-right>
      <text class="clear-btn" @tap="clearAll">{{ $t('common.actions.clear') }}</text>
    </template>

    <view class="tool-container">
      <!-- 控制区域：仅保留比对精度切换，隐藏视图模式切换 -->
      <view class="card shadow-sm mb-4">
        <view class="control-row">
          <view class="label">{{ $t('tools.doc-comparator.mode') }}</view>
          <view class="toggle-group">
            <view 
              v-for="m in ['chars', 'words', 'lines']" 
              :key="m"
              class="toggle-item"
              :class="{ active: mode === m }"
              @tap="mode = m"
            >
              {{ $t(`tools.doc-comparator.mode${m.charAt(0).toUpperCase() + m.slice(1)}`) }}
            </view>
          </view>
        </view>
      </view>

      <!-- 输入区域 -->
      <view class="input-grid mb-4">
        <view class="card shadow-sm input-box">
          <view class="header-row mb-2">
            <view class="card-title">{{ $t('tools.doc-comparator.original') }}</view>
            <text class="paste-btn" @tap="pasteText('original')">📋</text>
          </view>
          <textarea 
            v-model="originalText" 
            :placeholder="$t('tools.doc-comparator.placeholder1')"
            class="diff-textarea"
            maxlength="-1"
          />
        </view>
        <view class="card shadow-sm input-box">
          <view class="header-row mb-2">
            <view class="card-title">{{ $t('tools.doc-comparator.modified') }}</view>
            <text class="paste-btn" @tap="pasteText('modified')">📋</text>
          </view>
          <textarea 
            v-model="modifiedText" 
            :placeholder="$t('tools.doc-comparator.placeholder2')"
            class="diff-textarea"
            maxlength="-1"
          />
        </view>
      </view>

      <!-- 结果展示 -->
      <view class="result-section card shadow-sm">
        <view class="result-header">
          <view class="card-title">{{ $t('tools.doc-comparator.diffResult') }}</view>
          <view class="legend">
            <view class="legend-item">
              <view class="legend-box added"></view>
              <text>{{ $t('tools.doc-comparator.legend.added') }}</text>
            </view>
            <view class="legend-item">
              <view class="legend-box removed"></view>
              <text>{{ $t('tools.doc-comparator.legend.removed') }}</text>
            </view>
          </view>
        </view>

        <view class="diff-content" v-if="originalText || modifiedText">
          <!-- 恢复为第一版的行内视图 (Inline/Unified) -->
          <view class="unified-view">
            <text 
              v-for="(part, index) in diffResult" 
              :key="index"
              class="diff-part"
              :class="{ 
                'added': part.added, 
                'removed': part.removed,
                'unchanged': !part.added && !part.removed 
              }"
            >{{ part.value }}</text>
          </view>
        </view>
        <view v-else class="empty-state">
          <text class="empty-icon">ℹ️</text>
          <text class="empty-text">{{ $t('tools.doc-comparator.diffResult') }}将会在这里显示</text>
        </view>
      </view>

      <view class="action-bar mt-4" v-if="originalText || modifiedText">
        <button class="primary-btn" @tap="copyResult">
          {{ $t('common.actions.copy') }}{{ $t('tools.doc-comparator.diffResult') }}
        </button>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import * as Diff from 'diff';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const originalText = ref('');
const modifiedText = ref('');
const mode = ref('lines'); // 'chars' | 'words' | 'lines'

// 计算统一差异
const diffResult = computed(() => {
  if (!originalText.value && !modifiedText.value) return [];
  if (mode.value === 'chars') {
    return Diff.diffChars(originalText.value, modifiedText.value);
  } else if (mode.value === 'words') {
    return Diff.diffWords(originalText.value, modifiedText.value);
  } else {
    return Diff.diffLines(originalText.value, modifiedText.value);
  }
});

const clearAll = () => {
  originalText.value = '';
  modifiedText.value = '';
};

const pasteText = (target) => {
  uni.getClipboardData({
    success: (res) => {
      if (target === 'original') originalText.value = res.data;
      else modifiedText.value = res.data;
    }
  });
};

const copyResult = () => {
  const resultText = diffResult.value
    .map(part => {
      const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
      return part.value.split('\n').map(line => line ? prefix + line : line).join('\n');
    })
    .join('');
  
  uni.setClipboardData({
    data: resultText,
    success: () => {
      uni.showToast({
        title: t('common.actions.copied'),
        icon: 'success'
      });
    }
  });
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
.mt-4 { margin-top: 40rpx; }

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-size: 26rpx;
  font-weight: 600;
  color: #1e293b;
}

.toggle-group {
  display: flex;
  background: #f1f5f9;
  padding: 6rpx;
  border-radius: 12rpx;
}

.toggle-item {
  padding: 10rpx 20rpx;
  font-size: 24rpx;
  color: #64748b;
  border-radius: 8rpx;
  transition: all 0.2s;
}

.toggle-item.active {
  background: #fff;
  color: #6366f1;
  font-weight: 700;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.input-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
}

.paste-btn {
  font-size: 32rpx;
}

.diff-textarea {
  width: 100%;
  height: 180rpx;
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: #334155;
  font-family: monospace;
}

.primary-btn {
  background: #6366f1;
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 16rpx;
  border: none;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30rpx;
}

.legend {
  display: flex;
  gap: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-box {
  width: 16rpx;
  height: 16rpx;
  border-radius: 4rpx;
}

.legend-box.added { background: #dcfce7; border: 1px solid #22c55e; }
.legend-box.removed { background: #fee2e2; border: 1px solid #ef4444; }

.legend-item text {
  font-size: 22rpx;
  color: #64748b;
}

.diff-content {
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 20rpx;
  min-height: 300rpx;
}

.unified-view {
  display: block;
  word-break: break-all;
}

.diff-part {
  font-family: monospace;
  font-size: 26rpx;
  line-height: 1.6;
  white-space: pre-wrap;
}

.diff-part.added {
  background: rgba(34, 197, 94, 0.2);
  color: #16a34a;
}

.diff-part.removed {
  background: rgba(239, 68, 68, 0.2);
  color: #dc2626;
  text-decoration: line-through;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
}

.empty-icon {
  font-size: 48rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 26rpx;
  color: #94a3b8;
}
</style>
