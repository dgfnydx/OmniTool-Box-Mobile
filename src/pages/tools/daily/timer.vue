<template>
  <ToolLayout :title="t('tools.timer.name')">
    <view class="workspace">
      <!-- 倒计时展示环 -->
      <view class="timer-display">
        <view class="progress-container">
          <!-- 这里的圆环使用 view + border-radius 模拟，小程序 SVG 兼容性较复杂 -->
          <view class="ring-bg"></view>
          <view class="ring-active" :style="ringStyle"></view>
          
          <view class="time-content">
            <text class="time-text">{{ formattedTime }}</text>
          </view>
        </view>
      </view>

      <!-- 时间选择器 -->
      <view v-if="!isRunning && remainingSeconds === 0" class="timer-inputs">
        <view class="input-col">
          <input type="number" v-model.number="hours" class="time-input" maxlength="2" />
          <text class="input-label">{{ t('tools.timer.hours') }}</text>
        </view>
        <view class="input-divider">:</view>
        <view class="input-col">
          <input type="number" v-model.number="minutes" class="time-input" maxlength="2" />
          <text class="input-label">{{ t('tools.timer.minutes') }}</text>
        </view>
        <view class="input-divider">:</view>
        <view class="input-col">
          <input type="number" v-model.number="seconds" class="time-input" maxlength="2" />
          <text class="input-label">{{ t('tools.timer.seconds') }}</text>
        </view>
      </view>

      <!-- 控制按钮 -->
      <view class="timer-controls">
        <!-- 重置 -->
        <view class="btn-circle secondary" @tap="resetTimer">
          <text class="btn-emoji">🔄</text>
        </view>
        
        <!-- 开始/暂停 -->
        <view 
          v-if="!isRunning" 
          class="btn-circle primary main" 
          :class="{ disabled: !canStart }"
          @tap="startTimer"
        >
          <text class="btn-emoji">▶️</text>
        </view>
        <view 
          v-else 
          class="btn-circle warning main" 
          @tap="pauseTimer"
        >
          <text class="btn-emoji">⏸️</text>
        </view>

        <!-- 停止 -->
        <view class="btn-circle danger" @tap="stopTimer">
          <text class="btn-emoji">⏹️</text>
        </view>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const totalSeconds = ref(0);
const remainingSeconds = ref(0);
const isRunning = ref(false);
const intervalId = ref(null);

const canStart = computed(() => {
  return (hours.value > 0 || minutes.value > 0 || seconds.value > 0) || remainingSeconds.value > 0;
});

const progress = computed(() => {
  if (totalSeconds.value === 0) return 100;
  return (remainingSeconds.value / totalSeconds.value) * 100;
});

const ringStyle = computed(() => {
  // 简化的进度环：使用 conic-gradient
  return {
    background: `conic-gradient(#6366f1 ${progress.value * 3.6}deg, transparent 0deg)`
  };
});

const formattedTime = computed(() => {
  const h = Math.floor(remainingSeconds.value / 3600);
  const m = Math.floor((remainingSeconds.value % 3600) / 60);
  const s = remainingSeconds.value % 60;
  
  // 如果还没开始且没剩余，显示输入的初始状态
  if (!isRunning.value && remainingSeconds.value === 0) {
    return `${hours.value.toString().padStart(2, '0')}:${minutes.value.toString().padStart(2, '0')}:${seconds.value.toString().padStart(2, '0')}`;
  }
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const startTimer = () => {
  if (isRunning.value) return;
  
  if (remainingSeconds.value === 0) {
    totalSeconds.value = (hours.value || 0) * 3600 + (minutes.value || 0) * 60 + (seconds.value || 0);
    if (totalSeconds.value <= 0) return;
    remainingSeconds.value = totalSeconds.value;
  }
  
  isRunning.value = true;
  intervalId.value = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--;
    } else {
      stopTimer();
      uni.showModal({
        title: t('tools.timer.timesUp'),
        showCancel: false,
        confirmText: 'OK'
      });
      // 可以在这里调用 uni.vibrateLong() 增加震动提示
      uni.vibrateLong();
    }
  }, 1000);
};

const pauseTimer = () => {
  isRunning.value = false;
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

const stopTimer = () => {
  pauseTimer();
  remainingSeconds.value = 0;
  totalSeconds.value = 0;
};

const resetTimer = () => {
  stopTimer();
  hours.value = 0;
  minutes.value = 0;
  seconds.value = 0;
};

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value);
});
</script>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.timer-display {
  margin-bottom: 80rpx;
}

.progress-container {
  width: 400rpx;
  height: 400rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f1f5f9;
}

.ring-active {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: rotate(0deg);
  transition: background 0.3s linear;
}

/* 遮罩，形成空心环 */
.progress-container::after {
  content: '';
  position: absolute;
  width: 360rpx;
  height: 360rpx;
  background: #f8fafc; /* 与页面背景色一致 */
  border-radius: 50%;
}

.time-content {
  z-index: 10;
}

.time-text {
  font-size: 72rpx;
  font-weight: 800;
  color: #1e293b;
  font-family: monospace;
}

.timer-inputs {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 80rpx;
}

.input-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-input {
  width: 120rpx;
  height: 100rpx;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20rpx;
  text-align: center;
  font-size: 40rpx;
  font-weight: 700;
  color: #6366f1;
}

.input-label {
  font-size: 24rpx;
  color: #94a3b8;
  margin-top: 10rpx;
}

.input-divider {
  font-size: 40rpx;
  font-weight: 800;
  color: #cbd5e1;
  padding-bottom: 34rpx;
}

.timer-controls {
  display: flex;
  align-items: center;
  gap: 40rpx;
}

.btn-circle {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.btn-circle:active {
  transform: scale(0.9);
}

.btn-circle.main {
  width: 140rpx;
  height: 140rpx;
  box-shadow: 0 10rpx 30rpx rgba(99, 102, 241, 0.2);
}

.btn-circle.primary { background: #6366f1; }
.btn-circle.warning { background: #f59e0b; }
.btn-circle.danger { background: #ef4444; }
.btn-circle.secondary { background: #ffffff; }

.btn-emoji {
  font-size: 40rpx;
}

.main .btn-emoji {
  font-size: 60rpx;
}

.disabled {
  opacity: 0.5;
}
</style>
