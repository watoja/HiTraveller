/****************************************************
 * FILE: currency.js
 * ---------------------------------------------
 * PURPOSE: Real-time currency conversion using Frankfurter API.
 ****************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amountInput');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const convertBtn = document.getElementById('convertBtn');
    const resultBox = document.getElementById('conversionResult');

    if (!convertBtn) return;

    convertBtn.addEventListener('click', convertCurrency);

    async function fetchCurrencies() {
        // Fetches a list of available currencies to populate the dropdowns
        const API_URL = 'https://api.frankfurter.app/latest';
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const rates = data.rates;
            // The API returns rates relative to EUR, so we need to add EUR itself
            const allCurrencies = ['EUR', ...Object.keys(rates)].sort(); 

            // Clear and repopulate dropdowns
            [fromCurrency, toCurrency].forEach(select => {
                select.innerHTML = '';
                allCurrencies.forEach(currency => {
                    const option = document.createElement('option');
                    option.value = currency;
                    option.textContent = currency;
                    select.appendChild(option);
                });
            });

            // Set initial default values
            fromCurrency.value = 'USD';
            toCurrency.value = 'EUR';
        } catch (error) {
            console.error("Could not fetch currencies:", error);
            resultBox.textContent = 'Error loading currency list. Using default set.';
        }
    }

    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) || amount <= 0) {
            resultBox.textContent = 'Please enter a valid amount.';
            return;
        }

        if (from === to) {
            resultBox.textContent = `${amount.toFixed(2)} ${from} = ${amount.toFixed(2)} ${to}`;
            return;
        }

        resultBox.innerHTML = `Converting ${amount.toFixed(2)} ${from} to ${to}...`;

        // =======================================================
        // 💡 Frankfurter API INTEGRATION
        // =======================================================
        const API_URL = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            const data = await response.json();
            
            const convertedRate = data.rates[to];
            if (convertedRate) {
                const result = convertedRate.toFixed(2);
                resultBox.innerHTML = `
                    <h3>Conversion Result:</h3>
                    <p style="font-size: 1.5rem;">
                        <strong>${amount.toFixed(2)} ${from}</strong> = 
                        <strong style="color: #0078ff;">${result} ${to}</strong>
                    </p>
                    <small>Rates are as of ${data.date}</small>
                `;
            } else {
                resultBox.textContent = `Conversion failed. Check currency codes.`;
            }

        } catch (error) {
            console.error('Conversion error:', error);
            resultBox.textContent = 'Failed to fetch current exchange rates.';
        }
    }

    fetchCurrencies(); // Load currencies on page load
});