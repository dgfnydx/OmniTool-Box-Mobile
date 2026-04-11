import { createI18n } from 'vue-i18n';
import en from './locales/en/index';
import zh from './locales/zh/index';

const savedLocale = uni.getStorageSync('app_locale');
const systemLocale = uni.getSystemInfoSync().language.indexOf('zh') !== -1 ? 'zh' : 'en';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLocale || systemLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
});

export default i18n;
