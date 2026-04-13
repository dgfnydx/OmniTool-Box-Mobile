<template>
  <ToolLayout :title="$t('tools.font-viewer.name')">
    <view class="workspace">
      <!-- 控制面板 -->
      <view class="control-panel card shadow-md mb-4">
        <view class="section mb-4">
          <view class="label-row">
            <text class="label">{{ $t('tools.font-viewer.previewText') }}</text>
            <text class="action-link" @tap="resetText">{{ $t('tools.font-viewer.reset') }}</text>
          </view>
          <textarea v-model="previewText" class="tool-textarea" maxlength="-1" />
        </view>

        <view class="controls-grid mb-4">
          <view class="control-item">
            <view class="label-row">
              <text class="label">{{ $t('tools.font-viewer.fontSize') }}</text>
              <text class="value-text">{{ fontSize }}px</text>
            </view>
            <slider :value="fontSize" min="12" max="120" activeColor="#6366f1" @change="e => fontSize = e.detail.value" />
          </view>
          
          <view class="control-item">
            <view class="label-row">
              <text class="label">{{ $t('tools.font-viewer.lineHeight') }}</text>
              <text class="value-text">{{ lineHeight }}</text>
            </view>
            <slider :value="lineHeight * 10" min="5" max="30" activeColor="#6366f1" @change="e => lineHeight = e.detail.value / 10" />
          </view>

          <view class="control-item">
            <view class="label-row">
              <text class="label">{{ $t('tools.font-viewer.letterSpacing') }}</text>
              <text class="value-text">{{ letterSpacing }}px</text>
            </view>
            <slider :value="letterSpacing + 5" min="0" max="25" activeColor="#6366f1" @change="e => letterSpacing = e.detail.value - 5" />
          </view>
        </view>

        <view class="font-selection">
          <view class="font-list-section mb-4">
            <text class="group-label">{{ $t('tools.font-viewer.systemFonts') }}</text>
            <view class="font-chips">
              <view 
                v-for="font in systemFonts" 
                :key="font.value"
                class="font-chip"
                :class="{ active: selectedFont === font.value }"
                @tap="selectedFont = font.value"
                :style="{ fontFamily: font.value }"
              >
                <text>{{ font.name }}</text>
              </view>
            </view>
          </view>

          <view class="font-list-section mb-4" v-if="localFonts.length > 0">
            <text class="group-label">{{ $t('tools.font-viewer.localFonts') }}</text>
            <view class="font-chips">
              <view 
                v-for="font in localFonts" 
                :key="font.family"
                class="font-chip"
                :class="{ active: selectedFont === font.family }"
                @tap="selectedFont = font.family"
                :style="{ fontFamily: font.family }"
              >
                <text>{{ font.name }}</text>
              </view>
            </view>
          </view>

          <!-- 上传区域 (支持 H5 和 微信小程序) -->
          <view class="upload-area" @tap="handleFileUpload">
            <view class="upload-inner">
              <text class="upload-icon">📤</text>
              <text class="upload-text">{{ $t('tools.font-viewer.uploadTip') }}</text>
              <!-- #ifdef MP-WEIXIN -->
              <text class="upload-sub">微信内支持选择 TTF/OTF 文件</text>
              <!-- #endif -->
            </view>
          </view>
        </view>
      </view>

      <!-- 预览区 -->
      <view class="preview-panel card shadow-md mb-4">
        <view class="preview-header mb-4">
          <view class="font-badge">
            <text class="badge-icon">Aa</text>
            <text class="badge-text">{{ selectedFontName }}</text>
          </view>
          <view class="italic-toggle" :class="{ active: isItalic }" @tap="isItalic = !isItalic">
            <text class="italic-icon">I</text>
          </view>
        </view>
        <view class="preview-content-wrapper">
          <text 
            class="preview-content"
            :style="{
              fontFamily: selectedFont,
              fontSize: fontSize + 'px',
              lineHeight: lineHeight,
              letterSpacing: letterSpacing + 'px',
              fontWeight: fontWeight,
              fontStyle: isItalic ? 'italic' : 'normal'
            }"
          >
            {{ previewText }}
          </text>
        </view>
      </view>
      
      <view class="info-card">
        <text class="info-text">💡 支持加载 TTF, OTF, WOFF 等格式。小程序端请从聊天记录中选择字体文件。</text>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const previewText = ref('The quick brown fox jumps over the lazy dog. 1234567890 永恒的艺术，不朽的篇章。');
const fontSize = ref(36);
const lineHeight = ref(1.5);
const letterSpacing = ref(0);
const fontWeight = ref(400);
const isItalic = ref(false);
const selectedFont = ref('sans-serif');

const systemFonts = [
  { name: 'Sans-serif', value: 'sans-serif' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'PingFang SC', value: '"PingFang SC", sans-serif' },
  { name: 'Microsoft YaHei', value: '"Microsoft YaHei", sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' }
];

const localFonts = ref([]);

const selectedFontName = computed(() => {
  const sys = systemFonts.find(f => f.value === selectedFont.value);
  if (sys) return sys.name;
  const loc = localFonts.value.find(f => f.family === selectedFont.value);
  return loc ? loc.name : selectedFont.value;
});

// 核心加载逻辑
const loadFont = (name, path) => {
  const family = `font-${Date.now()}`;
  uni.showLoading({ title: '加载中...' });
  
  uni.loadFontFace({
    family: family,
    source: `url("${path}")`,
    global: true,
    success: () => {
      localFonts.value.push({ name, family, url: path });
      selectedFont.value = family;
      uni.hideLoading();
      uni.showToast({ title: '字体加载成功', icon: 'success' });
    },
    fail: (err) => {
      console.error('Font load error:', err);
      uni.hideLoading();
      uni.showToast({ title: '加载失败，请检查格式', icon: 'none' });
    }
  });
};

const handleFileUpload = () => {
  // #ifdef H5
  uni.chooseFile({
    count: 1,
    success: (res) => {
      const file = res.tempFiles[0];
      const name = file.name.split('.')[0];
      const url = file.path || URL.createObjectURL(file);
      loadFont(name, url);
    }
  });
  // #endif
  
  // #ifdef MP-WEIXIN
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    extension: ['ttf', 'otf', 'woff', 'woff2'],
    success: (res) => {
      const file = res.tempFiles[0];
      const name = file.name.split('.')[0];
      loadFont(name, file.path);
    },
    fail: () => {
      uni.showToast({ title: '取消选择', icon: 'none' });
    }
  });
  // #endif

  // #ifndef H5 || MP-WEIXIN
  uni.showToast({ title: '当前平台暂不支持上传字体', icon: 'none' });
  // #endif
};

const resetText = () => {
  previewText.value = 'The quick brown fox jumps over the lazy dog. 1234567890 永恒的艺术，不朽的篇章。';
};

onUnmounted(() => {
  // 释放资源
  // #ifdef H5
  localFonts.value.forEach(font => {
    if (font.url.startsWith('blob:')) {
      URL.revokeObjectURL(font.url);
    }
  });
  // #endif
});
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
  margin-bottom: 16rpx;
}

.label {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 600;
}

.value-text {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 700;
}

.action-link {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 600;
}

.tool-textarea {
  width: 100%;
  height: 160rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #1e293b;
  box-sizing: border-box;
}

.controls-grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.group-label {
  font-size: 22rpx;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 16rpx;
  display: block;
}

.font-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.font-chip {
  padding: 10rpx 24rpx;
  background: #f1f5f9;
  border-radius: 100rpx;
  font-size: 24rpx;
  color: #475569;
  border: 2rpx solid transparent;
}

.font-chip.active {
  background: #eef2ff;
  color: #6366f1;
  border-color: #6366f1;
}

.upload-area {
  margin-top: 20rpx;
}

.upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  border: 2rpx dashed #e2e8f0;
  border-radius: 16rpx;
  background: #f8fafc;
}

.upload-icon { font-size: 40rpx; margin-bottom: 10rpx; }
.upload-text { font-size: 24rpx; color: #94a3b8; font-weight: 600; }
.upload-sub { font-size: 20rpx; color: #cbd5e1; margin-top: 8rpx; }

.preview-panel {
  min-height: 400rpx;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.font-badge {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 20rpx;
  background: #f1f5f9;
  border-radius: 100rpx;
}

.badge-icon { font-size: 24rpx; font-weight: bold; color: #6366f1; }
.badge-text { font-size: 22rpx; color: #64748b; font-weight: 600; }

.italic-toggle {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 12rpx;
  font-style: italic;
  font-family: serif;
  font-weight: bold;
  color: #64748b;
}

.italic-toggle.active {
  background: #6366f1;
  color: #ffffff;
}

.preview-content-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.preview-content {
  text-align: center;
  word-break: break-all;
}

.info-card {
  padding: 30rpx;
  background: #fffbeb;
  border-radius: 20rpx;
  border: 1px solid #fef3c7;
}

.info-text {
  font-size: 24rpx;
  color: #b45309;
  line-height: 1.6;
}

.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.mb-4 { margin-bottom: 30rpx; }
</style>
