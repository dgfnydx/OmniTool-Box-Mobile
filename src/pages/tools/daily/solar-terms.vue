<template>
  <ToolLayout :title="t('tools.solar-terms.name')">
    <view class="workspace">
      <!-- 年份选择 -->
      <view class="header-controls">
        <view class="year-selector">
          <view class="icon-btn" @tap="changeYear(-1)">
            <text class="arrow">◀</text>
          </view>
          <view class="current-year">
            <text class="year-num">{{ currentYear }}</text>
            <text class="year-label">{{ t('tools.solar-terms.year') }}</text>
          </view>
          <view class="icon-btn" @tap="changeYear(1)">
            <text class="arrow">▶</text>
          </view>
        </view>
      </view>

      <!-- 节气网格 -->
      <view class="terms-grid">
        <view 
          v-for="(item, index) in solarTermsList" 
          :key="item.name"
          class="term-card"
          :class="getStatus(item.fullDate, index, solarTermsList)"
        >
          <view class="status-badge" v-if="getStatus(item.fullDate, index, solarTermsList)">
            <text class="badge-text">{{ t(`tools.solar-terms.${getStatus(item.fullDate, index, solarTermsList)}`) }}</text>
          </view>
          <view class="term-name-cn">{{ item.name }}</view>
          <view class="term-name-en">{{ t(`tools.solar-terms.terms.${item.key}`) }}</view>
          
          <view class="term-info">
            <view class="info-row">
              <text class="i-label">{{ t('tools.solar-terms.date') }}</text>
              <text class="i-value">{{ item.date }}</text>
            </view>
            <view class="info-row">
              <text class="i-label">{{ t('tools.solar-terms.time') }}</text>
              <text class="i-value">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="tip-box mt-4">
        <text class="tip-icon">💡</text>
        <text class="tip-text">{{ t('tools.solar-terms.tips') }}</text>
      </view>
    </view>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Solar } from 'lunar-javascript';
import ToolLayout from '../../../components/common/ToolLayout.vue';

const { t } = useI18n();

const currentYear = ref(new Date().getFullYear());
const now = new Date();

const termMap = {
  '立春': 'LI_CHUN', '雨水': 'YU_SHUI', '惊蛰': 'JING_ZHE', '春分': 'CHUN_FEN',
  '清明': 'QING_MING', '谷雨': 'GU_YU', '立夏': 'LI_XIA', '小满': 'XIAO_MAN',
  '芒种': 'MANG_ZHONG', '夏至': 'XIA_ZHI', '小暑': 'XIAO_SHU', '大暑': 'DA_SHU',
  '立秋': 'LI_QIU', '处暑': 'CHU_SHU', '白露': 'BAI_LU', '秋分': 'QIU_FEN',
  '寒露': 'HAN_LU', '霜降': 'SHUANG_JIANG', '立冬': 'LI_DONG', '小雪': 'XIAO_XUE',
  '大雪': 'DA_XUE', '冬至': 'DONG_ZHI', '小寒': 'XIAO_HAN', '大寒': 'DA_HAN'
};

const solarTermsList = computed(() => {
  const year = currentYear.value;
  const solar1 = Solar.fromYmd(year, 1, 1);
  const solar2 = Solar.fromYmd(year, 12, 31);
  
  const jq1 = solar1.getLunar().getJieQiTable();
  const jq2 = solar2.getLunar().getJieQiTable();
  
  const combined = { ...jq1, ...jq2 };
  
  const list = Object.keys(combined)
    .map(name => {
      const sDate = combined[name];
      const ymd = sDate.toYmd();
      const [y] = ymd.split('-').map(Number);
      
      if (y !== year) return null;
      
      return {
        name,
        date: ymd,
        time: sDate.toYmdHms().split(' ')[1].substring(0, 5),
        fullDate: new Date(sDate.toYmdHms().replace(/-/g, '/')),
        key: termMap[name] || name
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

  const unique = Array.from(new Map(list.map(item => [item.name, item])).values());
  return unique.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
});

const isCurrent = (termDate, nextTermDate) => {
  if (!nextTermDate) return now >= termDate;
  return now >= termDate && now < nextTermDate;
};

const getStatus = (termDate, idx, list) => {
  const nextTerm = list[idx + 1];
  if (isCurrent(termDate, nextTerm?.fullDate)) return 'current';
  if (now < termDate && (idx === 0 || now >= list[idx - 1].fullDate)) return 'next';
  return '';
};

const changeYear = (delta) => {
  currentYear.value += delta;
};
</script>

<style scoped>
.workspace {
  padding-bottom: 40rpx;
}

.header-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.year-selector {
  display: flex;
  align-items: center;
  gap: 30rpx;
  background: #ffffff;
  padding: 10rpx 30rpx;
  border-radius: 100rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.current-year {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.year-num {
  font-size: 40rpx;
  font-weight: 800;
  color: #6366f1;
}

.year-label {
  font-size: 28rpx;
  color: #94a3b8;
}

.icon-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow {
  font-size: 24rpx;
  color: #64748b;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.term-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 1px solid #f1f5f9;
  transition: all 0.3s;
}

.term-card.current {
  border: 2px solid #6366f1;
  background: #f5f3ff;
}

.term-card.next {
  border: 2px dashed #6366f1;
}

.status-badge {
  position: absolute;
  top: -16rpx;
  background: #6366f1;
  padding: 4rpx 16rpx;
  border-radius: 100rpx;
  box-shadow: 0 4rpx 10rpx rgba(99, 102, 241, 0.3);
}

.badge-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 700;
}

.term-name-cn {
  font-size: 36rpx;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4rpx;
}

.term-name-en {
  font-size: 20rpx;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 20rpx;
  height: 60rpx;
}

.term-info {
  width: 100%;
  border-top: 1px solid #f1f5f9;
  padding-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.i-label {
  font-size: 20rpx;
  color: #94a3b8;
}

.i-value {
  font-size: 22rpx;
  color: #475569;
  font-weight: 600;
}

.tip-box {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 16rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.6;
  flex: 1;
}

.mt-4 { margin-top: 40rpx; }
</style>
