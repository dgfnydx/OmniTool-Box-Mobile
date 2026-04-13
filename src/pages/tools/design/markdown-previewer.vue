<template>
  <ToolLayout :title="$t('tools.markdown-previewer.name')">
    <view class="workspace">
      <!-- 编辑区 -->
      <view class="card shadow-md mb-4 editor-section">
        <view class="label-row mb-2">
          <text class="label">{{ $t('tools.markdown-previewer.editor') }}</text>
          <text class="action-link delete" @tap="input = ''">{{ $t('common.actions.clear') }}</text>
        </view>
        <textarea 
          v-model="input" 
          class="markdown-input" 
          :placeholder="$t('tools.markdown-previewer.placeholder')"
          maxlength="-1"
        />
      </view>

      <!-- 预览区 -->
      <view class="card shadow-md mb-4 preview-section">
        <view class="label-row mb-2">
          <text class="label">{{ $t('tools.markdown-previewer.preview') }}</text>
          <text class="action-link" @tap="handleCopyHtml">{{ $t('tools.markdown-previewer.copyHtml') }}</text>
        </view>
        
        <view class="preview-area">
          <!-- #ifdef H5 -->
          <div class="markdown-body" v-html="htmlContent"></div>
          <!-- #endif -->
          
          <!-- #ifndef H5 -->
          <mp-html :content="htmlContent" markdown />
          <!-- #endif -->
        </view>
      </view>
    </view>
    
    <view class="info-card">
      <text class="info-text">💡 {{ $t('tools.markdown-previewer.markdownDesc') }}</text>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import { marked } from 'marked';

// #ifndef H5
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';
// #endif

const { t } = useI18n();

const input = ref('# Hello Markdown\n\n在此输入内容即可看到预览。\n\n- 列表项 1\n- 列表项 2\n\n**加粗文字** 和 *斜体*。\n\n```js\nconsole.log("Hello World");\n```');

const htmlContent = computed(() => {
  try {
    return marked.parse(input.value);
  } catch (e) {
    return 'Parsing error...';
  }
});

const handleCopyHtml = () => {
  uni.setClipboardData({
    data: htmlContent.value,
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
}

.label {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 700;
}

.action-link {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 600;
}

.action-link.delete {
  color: #ef4444;
}

.markdown-input {
  width: 100%;
  height: 400rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #1e293b;
  font-family: monospace;
  line-height: 1.6;
  box-sizing: border-box;
}

.preview-area {
  min-height: 400rpx;
  padding: 10rpx;
  background: #ffffff;
}

/* H5 基础样式补丁 */
.markdown-body {
  font-size: 28rpx;
  line-height: 1.6;
  color: #334155;
}

.info-card {
  padding: 30rpx;
  background: #f1f5f9;
  border-radius: 20rpx;
}

.info-text {
  font-size: 24rpx;
  color: #64748b;
}

.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.mb-2 { margin-bottom: 20rpx; }
.mb-4 { margin-bottom: 30rpx; }

@media (min-width: 768px) {
  .workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30rpx;
  }
  .markdown-input, .preview-area {
    height: 600rpx;
  }
}
</style>
