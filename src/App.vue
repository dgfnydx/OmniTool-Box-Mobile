<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/* 全局样式规范 (防止屎山的第一步) */
:root {
  --primary-color: #6366f1;
  --secondary-color: #10b981;
  --bg-main: #fcfcfd;
  --bg-card: #ffffff;
  --text-main: #1a1a1a;
  --text-sub: #64748b;
  --border-color: #f1f5f9;
  --radius-lg: 32rpx;
  --radius-md: 20rpx;
}

/* 重置基础样式 */
view, text {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

page {
  background-color: var(--bg-main);
  color: var(--text-main);
}

/* 常用原子类 */
.shadow-sm { box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02); }
.shadow-md { box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05); }

.flex-row { display: flex; flex-direction: row; align-items: center; }
.flex-col { display: flex; flex-direction: column; }

.mt-1 { margin-top: 10rpx; }
.mt-2 { margin-top: 20rpx; }
.mb-1 { margin-bottom: 10rpx; }
.mb-2 { margin-bottom: 20rpx; }

/* 响应式适配 (H5端) */
@media screen and (min-width: 768px) {
  .page-wrapper {
    max-width: 600px;
    margin: 0 auto;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
}
</style>
