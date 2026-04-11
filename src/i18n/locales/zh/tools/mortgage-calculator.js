export default {
  name: '房贷计算器',
  description: '最新利率，支持等额本息、等额本金还款试算。',
  loanType: '贷款类型',
  types: {
    commercial: '商业贷款',
    fund: '公积金',
    combination: '组合贷款'
  },
  commercialAmount: '商业贷款金额',
  fundAmount: '公积金贷款金额',
  annualRate: '商贷利率 (%)',
  fundRate: '公积金利率 (%)',
  loanTerm: '贷款年限',
  year: '年',
  period: '期',
  repaymentMethod: '还款方式',
  methods: {
    equalLoan: '等额本息',
    equalLoanDesc: '每月还款额固定',
    equalPrincipal: '等额本金',
    equalPrincipalDesc: '每月还款额递减'
  },
  monthlyPayment: '每月还款',
  firstMonthPayment: '首月还款',
  decreasePerMonth: '每月递减',
  totalInterest: '总利息',
  totalPayment: '还款总额',
  principal: '本金',
  interest: '利息'
};
