<template>
  <ToolLayout :title="$t('tools.timestamp-converter.name')">
    <view class="workspace">
      <!-- 当前时间 Banner -->
      <view class="current-time-banner shadow-md">
        <text class="time-label">{{ $t('tools.timestamp-converter.currentTs') }}</text>
        <view class="time-value-row" @tap="handleCopy(currentTimestamp)">
          <text class="time-value">{{ currentTimestamp }}</text>
          <text class="copy-icon">📋</text>
        </view>
      </view>

      <!-- 时间戳转日期 -->
      <view class="card shadow-md mb-4">
        <text class="label">{{ $t('tools.timestamp-converter.tsToDate') }}</text>
        <view class="input-group mt-2">
          <input type="number" v-model="tsInput" class="tool-input" placeholder="1711872000" />
          <text class="unit-tag">{{ $t('tools.timestamp-converter.unitSeconds') }}</text>
        </view>
        <view class="result-display mt-3">
          <text class="res-label">{{ $t('tools.timestamp-converter.resultDate') }}</text>
          <view class="res-value-row" @tap="handleCopy(dateResult)">
            <text class="res-value">{{ dateResult }}</text>
            <text class="res-copy">📋</text>
          </view>
        </view>
      </view>

      <!-- 日期转时间戳 -->
      <view class="card shadow-md mb-4">
        <text class="label">{{ $t('tools.timestamp-converter.dateToTs') }}</text>
        <view class="input-group mt-2">
          <input type="text" v-model="dateInput" class="tool-input" placeholder="2026-03-31 09:00:00" />
        </view>
        <view class="result-display mt-3">
          <text class="res-label">{{ $t('tools.timestamp-converter.resultTs') }}</text>
          <view class="res-value-row" @tap="handleCopy(tsResult)">
            <text class="res-value">{{ tsResult }}</text>
            <text class="res-copy">📋</text>
          </view>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';
import { formatTimestamp, parseDateToTimestamp, getCurrentDateTimeString } from '../../../utils/date';

const { t } = useI18n();

const currentTimestamp = ref(Math.floor(Date.now() / 1000));
let timer = null;

const tsInput = ref(currentTimestamp.value.toString());
const dateResult = ref('');

const dateInput = ref(getCurrentDateTimeString());
const tsResult = ref('');

const updateCurrentTime = () => {
  currentTimestamp.value = Math.floor(Date.now() / 1000);
};

const convertTsToDate = () => {
  const result = formatTimestamp(tsInput.value);
  dateResult.value = result || t('tools.timestamp-converter.invalidTs');
};

const convertDateToTs = () => {
  const result = parseDateToTimestamp(dateInput.value);
  tsResult.value = result !== null ? result.toString() : t('tools.timestamp-converter.invalidDate');
};

const handleCopy = (val) => {
  if (!val || val.includes('无效') || val.includes('Invalid')) return;
  uni.setClipboardData({
    data: val.toString(),
    success: () => {
      uni.showToast({ title: t('common.actions.copied'), icon: 'success' });
    }
  });
};

watch(tsInput, convertTsToDate);
watch(dateInput, convertDateToTs);

onMounted(() => {
  convertTsToDate();
  convertDateToTs();
  timer = setInterval(updateCurrentTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.workspace {
  padding-bottom: 40rpx;
}

.current-time-banner {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 40rpx;
  border-radius: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
  color: #ffffff;
}

.time-label {
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 10rpx;
}

.time-value-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.time-value {
  font-size: 56rpx;
  font-weight: 800;
  font-family: monospace;
}

.copy-icon {
  font-size: 32rpx;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.label {
  font-size: 24rpx;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.tool-input {
  width: 100%;
  height: 90rpx;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 32rpx;
  font-family: monospace;
  color: #1e293b;
}

.unit-tag {
  position: absolute;
  right: 24rpx;
  font-size: 22rpx;
  color: #94a3b8;
}

.result-display {
  background: #f1f5f9;
  padding: 24rpx;
  border-radius: 16rpx;
}

.res-label {
  font-size: 20rpx;
  color: #64748b;
  display: block;
  margin-bottom: 8rpx;
}

.res-value-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.res-value {
  font-size: 30rpx;
  font-weight: 700;
  color: #1e293b;
  font-family: monospace;
  word-break: break-all;
}

.res-copy {
  font-size: 28rpx;
  color: #6366f1;
}

.mt-2 { margin-top: 20rpx; }
.mt-3 { margin-top: 30rpx; }
.mb-4 { margin-bottom: 30rpx; }
.shadow-md { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03); }
</style>
