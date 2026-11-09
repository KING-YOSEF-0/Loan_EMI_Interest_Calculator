// script.js – Pakistan Loan / EMI / Interest Calculator
// by KING_YOSEF_

(function() {
  // DOM elements
  const principalInput = document.getElementById('principal');
  const rateInput = document.getElementById('rate');
  const tenureInput = document.getElementById('tenure');
  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const emiResult = document.getElementById('emiResult');
  const interestResult = document.getElementById('interestResult');
  const totalResult = document.getElementById('totalResult');
  const breakdownText = document.getElementById('breakdownText');

  // Format currency in Pakistani Rupees (PKR)
  const formatCurrency = (value) => {
    if (!isFinite(value) || isNaN(value)) return '—';
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Main calculation function
  function calculateLoan() {
    const principal = parseFloat(principalInput.value);
    const annualRate = parseFloat(rateInput.value);
    const tenureMonths = parseInt(tenureInput.value, 10);

    // Validation
    if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureMonths)) {
      alert('Please enter valid numbers in all fields.');
      return;
    }
    if (principal <= 0) {
      alert('Loan amount must be greater than 0.');
      return;
    }
    if (annualRate < 0) {
      alert('Interest rate cannot be negative.');
      return;
    }
    if (tenureMonths <= 0) {
      alert('Tenure must be at least 1 month.');
      return;
    }

    // Monthly interest rate
    const monthlyRate = annualRate / 12 / 100;

    let emi, totalPayment, totalInterest;

    if (monthlyRate === 0) {
      // Zero-interest case (e.g., Islamic financing / Qarz-e-Hasana)
      emi = principal / tenureMonths;
      totalPayment = principal;
      totalInterest = 0;
    } else {
      // Standard EMI formula
      const factor = Math.pow(1 + monthlyRate, tenureMonths);
      emi = principal * monthlyRate * factor / (factor - 1);
      totalPayment = emi * tenureMonths;
      totalInterest = totalPayment - principal;
    }

    // Update results
    emiResult.textContent = formatCurrency(emi);
    interestResult.textContent = formatCurrency(totalInterest);
    totalResult.textContent = formatCurrency(totalPayment);

    // Breakdown summary
    const principalFormatted = formatCurrency(principal);
    const interestFormatted = formatCurrency(totalInterest);
    breakdownText.textContent = `${principalFormatted} loan at ${annualRate}% for ${tenureMonths} months → interest ${interestFormatted}`;
  }

  // Reset to Pakistani defaults
  function resetForm() {
    principalInput.value = '1000000';   // PKR 10 Lakh
    rateInput.value = '12';             // 12% (typical bank rate in PK)
    tenureInput.value = '60';           // 5 years

    emiResult.textContent = '—';
    interestResult.textContent = '—';
    totalResult.textContent = '—';
    breakdownText.textContent = 'Enter values and click Calculate';

    principalInput.focus();
  }

  // Event listeners
  calculateBtn.addEventListener('click', calculateLoan);
  resetBtn.addEventListener('click', resetForm);

  // Press Enter to calculate
  [principalInput, rateInput, tenureInput].forEach((input) => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculateLoan();
      }
    });
  });

  // Auto-calculate on load
  window.addEventListener('load', calculateLoan);
})();