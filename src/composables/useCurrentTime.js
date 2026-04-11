import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 时间管理 Composable
 * 提供全局统一的当前时间戳和更新逻辑
 */
export function useCurrentTime() {
  const currentTimestamp = ref(Math.floor(Date.now() / 1000));
  let timer = null;

  const update = () => {
    currentTimestamp.value = Math.floor(Date.now() / 1000);
  };

  onMounted(() => {
    timer = setInterval(update, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    currentTimestamp,
    update
  };
}
