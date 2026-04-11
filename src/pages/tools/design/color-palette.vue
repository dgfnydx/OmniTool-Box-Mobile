<template>
  <ToolLayout :title="$t('tools.color-palette.name')">
    <view class="workspace">
      <!-- 主预览区 -->
      <view class="card shadow-md mb-4 picker-card">
        <view class="preview-box" :style="{ backgroundColor: color }">
          <text class="preview-label" :style="{ color: isDark ? '#ffffff' : '#000000' }">
            {{ color.toUpperCase() }}
          </text>
        </view>
        
        <!-- RGB 调色滑块 (替代原生 picker) -->
        <view class="rgb-sliders mt-4">
          <view class="slider-item">
            <text class="s-label">R</text>
            <slider :value="rgb.r" @change="e => updateRGB('r', e.detail.value)" min="0" max="255" activeColor="#ef4444" block-size="20" />
            <text class="s-value">{{ rgb.r }}</text>
          </view>
          <view class="slider-item">
            <text class="s-label">G</text>
            <slider :value="rgb.g" @change="e => updateRGB('g', e.detail.value)" min="0" max="255" activeColor="#10b981" block-size="20" />
            <text class="s-value">{{ rgb.g }}</text>
          </view>
          <view class="slider-item">
            <text class="s-label">B</text>
            <slider :value="rgb.b" @change="e => updateRGB('b', e.detail.value)" min="0" max="255" activeColor="#3b82f6" block-size="20" />
            <text class="s-value">{{ rgb.b }}</text>
          </view>
        </view>

        <button class="primary-btn mt-4" @tap="generateRandom">
          <text class="btn-icon">🎲</text>
          <text>{{ $t('tools.color-palette.random') }}</text>
        </button>
      </view>

      <!-- 格式列表 -->
      <view class="card shadow-sm mb-4">
        <view class="format-list">
          <view v-for="(val, key) in formats" :key="key" class="format-item">
            <view class="f-header">
              <text class="f-label">{{ $t('tools.color-palette.formats.' + key) }}</text>
              <text class="f-copy" @tap="copy(val)">{{ $t('common.actions.copy') }}</text>
            </view>
            <view class="f-value-box">
              <text class="f-value">{{ val }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 分析与建议 -->
      <view class="card shadow-sm mb-4">
        <text class="label mb-3">{{ $t('tools.color-palette.analysis') }}</text>
        
        <view class="contrast-row">
          <view class="contrast-main">
            <text class="c-value" :style="{ color: contrastLevel.color }">{{ contrastRatio.toFixed(2) }}</text>
            <view class="c-badge" :style="{ backgroundColor: contrastLevel.color }">{{ contrastLevel.label }}</view>
          </view>
          <text class="c-desc">{{ $t('tools.color-palette.wcag') }}</text>
        </view>

        <view class="access-previews mt-4">
          <view class="access-item" :style="{ backgroundColor: color, color: '#ffffff' }">
            {{ $t('tools.color-palette.whiteText') }}
          </view>
          <view class="access-item mt-2" :style="{ backgroundColor: color, color: '#000000' }">
            {{ $t('tools.color-palette.blackText') }}
          </view>
        </view>

        <!-- 渐变色阶 -->
        <view class="shades-row mt-4">
          <view 
            v-for="shade in scheme" 
            :key="shade" 
            class="shade-block" 
            :style="{ backgroundColor: shade }"
            @tap="updateColor(shade)"
          ></view>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import { useTool } from '../../../composables/useTool';
import ToolLayout from '../../../components/common/ToolLayout.vue';

extend([a11yPlugin]);

const { copy, t } = useTool();

const color = ref('#6366f1');
const rgb = ref({ r: 99, g: 102, b: 241 });

const isDark = computed(() => colord(color.value).isDark());

const formats = computed(() => {
  const c = colord(color.value);
  return {
    hex: c.toHex().toUpperCase(),
    rgb: c.toRgbString(),
    hsl: c.toHslString()
  };
});

const contrastRatio = computed(() => colord(color.value).contrast());

const contrastLevel = computed(() => {
  const ratio = contrastRatio.value;
  if (ratio >= 7) return { label: 'AAA', color: '#10b981' };
  if (ratio >= 4.5) return { label: 'AA', color: '#6366f1' };
  return { label: t('tools.color-palette.fail'), color: '#ef4444' };
});

const scheme = computed(() => {
  const c = colord(color.value);
  return [
    c.lighten(0.2).toHex(),
    c.lighten(0.1).toHex(),
    c.toHex(),
    c.darken(0.1).toHex(),
    c.darken(0.2).toHex()
  ];
});

const updateColor = (hex) => {
  color.value = hex;
  const c = colord(hex).toRgb();
  rgb.value = { r: c.r, g: c.g, b: c.b };
};

const updateRGB = (channel, val) => {
  rgb.value[channel] = val;
  color.value = colord(rgb.value).toHex();
};

const generateRandom = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  rgb.value = { r, g, b };
  color.value = colord(rgb.value).toHex();
};

// 初始化
onMounted(() => {
  updateColor(color.value);
});
</script>

<style scoped>
.workspace {
  padding-bottom: 40rpx;
}

.card {
  background: #ffffff;
  border-radius: 32rpx;
  padding: 40rpx;
}

.preview-box {
  height: 240rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 40rpx rgba(0,0,0,0.05);
}

.preview-label {
  font-size: 48rpx;
  font-weight: 800;
  font-family: monospace;
  letter-spacing: 2rpx;
}

.rgb-sliders {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.slider-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.s-label {
  width: 30rpx;
  font-size: 24rpx;
  font-weight: 800;
  color: #94a3b8;
}

slider {
  flex: 1;
  margin: 0;
}

.s-value {
  width: 60rpx;
  text-align: right;
  font-size: 24rpx;
  font-family: monospace;
  font-weight: 700;
  color: #1e293b;
}

.format-item {
  margin-bottom: 30rpx;
}
.format-item:last-child { margin-bottom: 0; }

.f-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.f-label {
  font-size: 22rpx;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
}

.f-copy {
  font-size: 22rpx;
  color: #6366f1;
  font-weight: 700;
}

.f-value-box {
  background: #f8fafc;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  border: 1px solid #e2e8f0;
}

.f-value {
  font-family: monospace;
  font-size: 28rpx;
  color: #1e293b;
  font-weight: 600;
}

.contrast-row {
  background: #f8fafc;
  padding: 30rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.contrast-main {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.c-value {
  font-size: 56rpx;
  font-weight: 800;
}

.c-badge {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 800;
}

.c-desc {
  font-size: 22rpx;
  color: #94a3b8;
}

.access-item {
  padding: 24rpx;
  border-radius: 16rpx;
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
}

.shades-row {
  display: flex;
  height: 80rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.shade-block {
  flex: 1;
}

.label {
  font-size: 24rpx;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  display: block;
}

.primary-btn {
  background: #6366f1;
  color: #ffffff;
  border-radius: 100rpx;
  font-weight: 700;
}

.btn-icon { margin-right: 10rpx; }

.mt-2 { margin-top: 20rpx; }
.mt-3 { margin-top: 30rpx; }
.mt-4 { margin-top: 40rpx; }
.mb-3 { margin-bottom: 24rpx; }
.mb-4 { margin-bottom: 30rpx; }
.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01); }
</style>
