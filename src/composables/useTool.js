import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 基础工具 Composable
 * 提供通用的输入输出状态管理、剪贴板操作和提示逻辑
 */
export function useTool() {
  const { t } = useI18n();
  const input = ref('');
  const output = ref('');
  const error = ref('');

  const clear = () => {
    input.value = '';
    output.value = '';
    error.value = '';
  };

  const copy = (text) => {
    const targetText = text || output.value;
    if (!targetText) return;

    uni.setClipboardData({
      data: targetText.toString(),
      success: () => {
        uni.showToast({
          title: t('common.actions.copied'),
          icon: 'success'
        });
      }
    });
  };

  const showToast = (title, icon = 'none') => {
    uni.showToast({ title, icon });
  };

  return {
    input,
    output,
    error,
    clear,
    copy,
    showToast,
    t
  };
}
