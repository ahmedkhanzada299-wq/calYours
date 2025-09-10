document.addEventListener("DOMContentLoaded", () => {
  const loanAmount = document.getElementById("loanAmount");
  const interestRate = document.getElementById("interestRate");
  const loanTenure = document.getElementById("loanTenure");
  const currency = document.getElementById("currency");
  const calculateBtn = document.getElementById("calculateBtn");
  const resultBox = document.getElementById("resultBox");
  const emiResult = document.getElementById("emiResult");
  const calcHistory = document.getElementById("calcHistory");
    const currencyDropdown = document.getElementById("currency");


  // Load history from localStorage
  let history = JSON.parse(localStorage.getItem("emiHistory")) || [];

  function renderHistory() {
    calcHistory.innerHTML = "";
    history.slice(-3).reverse().forEach(item => {
      let li = document.createElement("li");
      li.textContent = `Loan: ${item.P}, Rate: ${item.R}%, Tenure: ${item.N} months → EMI:  ${item.currency}${item.EMI}`;
      calcHistory.appendChild(li);
    });
  }

  renderHistory();

  calculateBtn.addEventListener("click", () => {
    const P = parseFloat(loanAmount.value);
    const annualRate = parseFloat(interestRate.value);
    const N = parseInt(loanTenure.value);
    const selectedCurrency = currency.value;

    if (!P || !annualRate || !N) {
      alert("Please fill all fields correctly!");
      return;
    }

    const R = annualRate / 12 / 100; // Monthly rate
    const EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);

    emiResult.textContent = `Your Monthly EMI:  ${selectedCurrency}${EMI.toFixed(2)}`;
    resultBox.classList.remove("hidden");
    

    // Save to history
    history.push({ P, R: annualRate, N, EMI: EMI.toFixed(2), currency: selectedCurrency });
    if (history.length > 3) history = history.slice(-3);
    localStorage.setItem("emiHistory " , JSON.stringify(history));
    renderHistory();
  });
});





/* =======================
   Mortgage Calculator page Styling
   ======================= */


document.addEventListener("DOMContentLoaded", () => {
  const calcType = document.getElementById("calcType");
  const formContainer = document.getElementById("formContainer");
  const calcBtn = document.getElementById("calcBtn");
  const resultBox = document.getElementById("result");
  const historyList = document.getElementById("history");
  const currency = document.getElementById("currency");

  // Load history from localStorage
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

  // Render form based on type
  function renderForm(type) {
    if (type === "emi") {
      formContainer.innerHTML = `
        <label>Loan Amount</label>
        <input type="number" id="loan" placeholder="Enter loan amount" required>

        <label>Annual Interest Rate (%)</label>
        <input type="number" id="rate" placeholder="e.g. 10" step="0.01" required>

        <label>Tenure</label>
        <input type="number" id="tenure" placeholder="Enter tenure" required>

        <label>Tenure Type</label>
        <select id="tenureType">
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      `;
    } else {
      formContainer.innerHTML = `
        <label>Loan Amount</label>
        <input type="number" id="loan" placeholder="Enter loan amount" required>

        <label>Annual Interest Rate (%)</label>
        <input type="number" id="rate" placeholder="e.g. 7.5" step="0.01" required>

        <label>Loan Term (Years)</label>
        <input type="number" id="years" placeholder="e.g. 20" required>
      `;
    }
  }

  renderForm(calcType.value);
  calcType.addEventListener("change", () => renderForm(calcType.value));

  // Update history UI
  function updateHistoryUI() {
    historyList.innerHTML = "";
    history.slice(-3).reverse().forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.type.toUpperCase()} → ${item.currency}${item.monthly} | Loan: ${item.amount}, Rate: ${item.rate}%`;
      historyList.appendChild(li);
    });
  }
  updateHistoryUI();

  // Calculate button
  calcBtn.addEventListener("click", () => {
    const type = calcType.value;
    const loan = parseFloat(document.getElementById("loan").value);
    const annualRate = parseFloat(document.getElementById("rate").value) / 100;
    const r = annualRate / 12;
    let n, monthlyPayment, totalPayment, totalInterest;

    if (type === "emi") {
      let tenure = parseFloat(document.getElementById("tenure").value);
      let tenureType = document.getElementById("tenureType").value;
      if (tenureType === "years") tenure *= 12;
      n = tenure;
    } else {
      let years = parseFloat(document.getElementById("years").value);
      n = years * 12;
    }

    if (isNaN(loan) || isNaN(annualRate) || isNaN(n) || n <= 0) {
      resultBox.style.display = "block";
      resultBox.style.color = "red";
      resultBox.textContent = "⚠️ Please enter valid inputs!";
      return;
    }

    monthlyPayment = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = monthlyPayment * n;
    totalInterest = totalPayment - loan;

    // Show Result
    resultBox.style.display = "block";
    resultBox.style.color = "#27ae60";
    resultBox.innerHTML = `
      <h3>Result</h3>
      <p><strong>Monthly Payment:</strong> ${currency.value}${monthlyPayment.toFixed(2)}</p>
      <p><strong>Total Payment:</strong> ${currency.value}${totalPayment.toFixed(2)}</p>
      <p><strong>Total Interest:</strong> ${currency.value}${totalInterest.toFixed(2)}</p>
      <button class="copy-btn" onclick="copyResult()">📋 Copy Result</button>
    `;

    // Save to history
    history.push({
      type,
      monthly: monthlyPayment.toFixed(2),
      amount: loan,
      rate: (annualRate * 100).toFixed(2),
      currency: currency.value
    });
    if (history.length > 3) history = history.slice(-3);
    localStorage.setItem("calcHistory", JSON.stringify(history));
    updateHistoryUI();
  });

  // Copy to clipboard function
  window.copyResult = function () {
    const text = resultBox.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Result copied to clipboard!");
    });
  };
});



// Compound



document.addEventListener("DOMContentLoaded", () => {
  const principal = document.getElementById("principal");
  const rate = document.getElementById("rate");
  const compounds = document.getElementById("compounds");
  const time = document.getElementById("time");
  const currency = document.getElementById("currency");
  const resultBox = document.getElementById("result");
  const calcBtn = document.getElementById("calcBtn");
  const historyList = document.getElementById("history");

  // Load history
  let history = JSON.parse(localStorage.getItem("compoundHistory")) || [];

  // Update history UI
  const updateHistoryUI = () => {
    historyList.innerHTML = "";
    history.slice(-3).reverse().forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.currency}${item.amount}</strong> → 
        Final: <strong>${item.currency}${item.final}</strong> 
        <br><small>Rate: ${item.rate}% | ${item.n}×/year | ${item.time} yrs</small>
      `;
      historyList.appendChild(li);
    });
  };

  updateHistoryUI();

  // Calculate button
  calcBtn.addEventListener("click", () => {
    const P = parseFloat(principal.value);
    const r = parseFloat(rate.value) / 100;
    const n = parseInt(compounds.value);
    const t = parseInt(time.value);

    if (isNaN(P) || isNaN(r) || isNaN(n) || isNaN(t) || n <= 0 || t <= 0) {
      resultBox.style.display = "block";
      resultBox.style.color = "red";
      resultBox.innerHTML = "<p>⚠️ Please enter valid inputs!</p>";
      return;
    }

    const A = P * Math.pow(1 + r / n, n * t);
    const interest = A - P;

    // Show result
    resultBox.style.display = "block";
    resultBox.style.color = "#333";
    resultBox.innerHTML = `
      <h3>📊 Compound Interest Result</h3>
      <p><strong>Principal:</strong> ${currency.value}${P.toFixed(2)}</p>
      <p><strong>Final Amount:</strong> ${currency.value}${A.toFixed(2)}</p>
      <p><strong>Total Interest:</strong> ${currency.value}${interest.toFixed(2)}</p>
      <p><small>(${n} times/year for ${t} years @ ${rate.value}%)</small></p>
      <button class="copy-btn" onclick="copyCompoundResult()">📋 Copy Result</button>
    `;

    // Save to history
    history.push({
      amount: P.toFixed(2),
      rate: (r * 100).toFixed(2),
      n,
      time: t,
      final: A.toFixed(2),
      currency: currency.value
    });

    if (history.length > 3) history = history.slice(-3);

    localStorage.setItem("compoundHistory", JSON.stringify(history));
    updateHistoryUI();
  });

  // Copy function
  window.copyCompoundResult = function () {
    const text = resultBox.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Result copied to clipboard!");
    });
  };
});

// SIP 

document.addEventListener("DOMContentLoaded", () => {
  // Input elements
  const targetWealth = document.getElementById("targetWealth");
  const annualReturn = document.getElementById("annualReturn");
  const durationYears = document.getElementById("durationYears");
  const currency = document.getElementById("currency");

  // Result elements
  const resultBox = document.getElementById("resultBox");
  const resultText = document.getElementById("sipResult");

  // Button and history
  const calcBtn = document.getElementById("calculateSIPBtn");
  const historyList = document.getElementById("calcHistory");

  // Load history from localStorage
  let history = JSON.parse(localStorage.getItem("sipHistory")) || [];

  // Function to update history UI
  const updateHistoryUI = () => {
    historyList.innerHTML = "";
    history.slice(-3).reverse().forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        Target: <strong>${item.currency}${item.FV}</strong> → 
        SIP: <strong>${item.currency}${item.sip}/month</strong>
        <br><small>Duration: ${item.years} yrs</small>
      `;
      historyList.appendChild(li);
    });
  };

  // Initialize history UI
  updateHistoryUI();

  // Calculate SIP
  calcBtn.addEventListener("click", () => {
    const FV = parseFloat(targetWealth.value);
    const annualRate = parseFloat(annualReturn.value) / 100;
    const years = parseFloat(durationYears.value);

    // Validate inputs
    if (isNaN(FV) || isNaN(annualRate) || isNaN(years) || FV <= 0 || annualRate <= 0 || years <= 0) {
      resultBox.style.display = "block";
      resultText.style.color = "red";
      resultText.innerHTML = "⚠️ Please enter valid inputs!";
      return;
    }

    // Monthly rate & total months
    const r = annualRate / 12;
    const n = years * 12;

    // SIP formula: SIP = FV × r / ((1+r)^n – 1)
    const sip = FV * r / (Math.pow(1 + r, n) - 1);

    // Display result
    resultBox.style.display = "block";
    resultText.style.color = "#333";
    resultText.innerHTML = `
      <h3>📊 SIP Result</h3>
      <p><strong>Target Wealth:</strong> ${currency.value}${FV.toLocaleString()}</p>
      <p><strong>Investment Duration:</strong> ${years} years (${n} months)</p>
      <p><strong>Required SIP:</strong> ${currency.value}${sip.toFixed(2)} / month</p>
      <button class="copy-btn" onclick="copySIPResult()">📋 Copy Result</button>
    `;

    // Save to history
    history.push({
      FV: FV.toLocaleString(),
      years,
      sip: sip.toFixed(2),
      currency: currency.value
    });

    if (history.length > 3) history = history.slice(-3);

    localStorage.setItem("sipHistory", JSON.stringify(history));
    updateHistoryUI();
  });

  // Copy result to clipboard
  window.copySIPResult = function () {
    const text = resultBox.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Result copied to clipboard!");
    });
  };
});
