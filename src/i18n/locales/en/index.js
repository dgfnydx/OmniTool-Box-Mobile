import common from './common';
import amountToUppercase from './tools/amount-to-uppercase';
import chineseConverter from './tools/chinese-converter';
import pinyinConverter from './tools/pinyin-converter';
import dueDateCalculator from './tools/due-date-calculator';
import safePeriodCalculator from './tools/safe-period-calculator';
import solarTerms from './tools/solar-terms';
import timer from './tools/timer';
import qrGenerator from './tools/qr-generator';
import colorPalette from './tools/color-palette';
import jsonFormatter from './tools/json-formatter';
import base64Converter from './tools/base64-converter';
import baseConverter from './tools/base-converter';
import timestampConverter from './tools/timestamp-converter';
import mortgageCalculator from './tools/mortgage-calculator';
import unitConverter from './tools/unit-converter';
import passwordGenerator from './tools/password-generator';
import bmiCalculator from './tools/bmi-calculator';
import bmrCalculator from './tools/bmr-calculator';
import roiCalculator from './tools/roi-calculator';

export default {
  ...common,
  tools: {
    'amount-to-uppercase': amountToUppercase,
    'chinese-converter': chineseConverter,
    'pinyin-converter': pinyinConverter,
    'due-date-calculator': dueDateCalculator,
    'safe-period-calculator': safePeriodCalculator,
    'solar-terms': solarTerms,
    'timer': timer,
    'qr-generator': qrGenerator,
    'color-palette': colorPalette,
    'json-formatter': jsonFormatter,
    'base64-converter': base64Converter,
    'base-converter': baseConverter,
    'timestamp-converter': timestampConverter,
    'mortgage-calculator': mortgageCalculator,
    'unit-converter': unitConverter,
    'password-generator': passwordGenerator,
    'bmi-calculator': bmiCalculator,
    'bmr-calculator': bmrCalculator,
    'roi-calculator': roiCalculator
  }
};
