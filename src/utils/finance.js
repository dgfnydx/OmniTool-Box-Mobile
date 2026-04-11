/**
 * 计算还款数据 (同步自 gemini)
 * @param {number} P 本金
 * @param {number} rate 年利率 (%)
 * @param {number} years 期限 (年)
 * @param {string} method 还款方式 ('equalLoan' | 'equalPrincipal')
 */
export function calculateRepayment(P, rate, years, method) {
  const i = rate / 100 / 12; // 月利率
  const n = years * 12;      // 总月份
  
  if (!P || P <= 0 || !n || n <= 0) {
    return { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };
  }

  if (method === 'equalLoan') {
    // 等额本息
    const monthly = i === 0 ? P / n : (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = monthly * n;
    return { 
      monthly, 
      interest: total - P, 
      total, 
      first: monthly, 
      decrease: 0 
    };
  } else {
    // 等额本金
    const monthlyPrincipal = P / n;
    const first = monthlyPrincipal + P * i;
    const last = monthlyPrincipal + (P - (n - 1) * monthlyPrincipal) * i;
    const total = (first + last) * n / 2;
    const decrease = (P / n) * i;
    return { 
      monthly: first, 
      interest: total - P, 
      total, 
      first, 
      decrease 
    };
  }
}

/**
 * 计算 ROI (投资回报率)
 */
export function calculateROI(invested, returned, periodValue, periodUnit) {
  const profit = returned - invested;
  const roi = invested === 0 ? 0 : (profit / invested) * 100;
  
  // 年化收益率
  let annualizedRoi = 0;
  if (invested > 0 && periodValue > 0) {
    let years = periodValue;
    if (periodUnit === 'days') years = periodValue / 365;
    if (periodUnit === 'months') years = periodValue / 12;
    
    const ratio = returned / invested;
    if (ratio > 0) {
      annualizedRoi = (Math.pow(ratio, 1 / years) - 1) * 100;
    } else {
      annualizedRoi = -100;
    }
  }
  
  return { profit, roi, annualizedRoi };
}
