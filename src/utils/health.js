/**
 * 健康相关计算工具 (BMI, BMR)
 */

/**
 * 计算 BMI
 * @param {number} weight 体重 (kg)
 * @param {number} height 身高 (cm)
 */
export function calculateBMI(weight, height) {
  if (!weight || !height || weight <= 0 || height <= 0) return 0;
  const h = height / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
}

/**
 * 获取 BMI 分类
 */
export function getBMICategory(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * 计算 BMR (Mifflin-St Jeor 公式)
 */
export function calculateBMR(gender, age, weight, height) {
  if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) return 0;
  let result = (10 * weight) + (6.25 * height) - (5 * age);
  return Math.round(gender === 'male' ? result + 5 : result - 161);
}
