export default {
  name: 'Mortgage Calculator',
  description: 'Calculate monthly payments, interest, and total cost.',
  loanType: 'Loan Type',
  types: {
    commercial: 'Commercial',
    fund: 'Fund',
    combination: 'Combined'
  },
  commercialAmount: 'Commercial Amount',
  fundAmount: 'Fund Amount',
  annualRate: 'Commercial Rate (%)',
  fundRate: 'Fund Rate (%)',
  loanTerm: 'Loan Term',
  year: 'Yrs',
  period: 'Periods',
  repaymentMethod: 'Repayment Method',
  methods: {
    equalLoan: 'Equal Loan',
    equalLoanDesc: 'Fixed monthly payment',
    equalPrincipal: 'Equal Principal',
    equalPrincipalDesc: 'Decreasing payment'
  },
  monthlyPayment: 'Monthly',
  firstMonthPayment: '1st Month',
  decreasePerMonth: 'Monthly Decrease',
  totalInterest: 'Total Interest',
  totalPayment: 'Total Payment',
  principal: 'Principal',
  interest: 'Interest'
};
