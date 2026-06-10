const API_KEY = 'sdMUc9K1dDZI3RMEl8qnItMDb5DEWrjT4cHAM7jM';

const cbAdvice = document.getElementById('cb-advice');
const cbCurrency = document.getElementById('cb-currency');
const inputLabel = document.getElementById('input-label');
const apiInput = document.getElementById('api-input');
const responseText = document.getElementById('response-text');
const responseArea = document.getElementById('response-area');
const submitBtn = document.getElementById('submit-btn');

function resetForm() {
    apiInput.value = '';
    apiInput.disabled = true;
    apiInput.placeholder = '';
    submitBtn.disabled = true;
    responseText.textContent = 'Waiting for your selection...';
    responseText.className = 'text-gray-500 text-center';
}

function setupAdvice() {
    resetForm();
    inputLabel.textContent = 'No input needed for Advice API';
    apiInput.placeholder = '(no input required)';
    apiInput.disabled = true;
    submitBtn.disabled = false;
    responseText.textContent = 'Ready! Click "Get Response" to fetch a random piece of advice.';
    responseText.className = 'text-[#445E93] text-center';
}

function setupCurrency() {
    resetForm();
    inputLabel.textContent = 'Enter: amount from-currency to-currency (e.g. 100 AUD KRW)';
    apiInput.placeholder = 'e.g. 100 AUD KRW';
    apiInput.disabled = false;
    apiInput.focus();
    submitBtn.disabled = false;
    responseText.textContent = 'Ready! Enter your amount and currencies above, then click "Get Response".';
    responseText.className = 'text-[#445E93] text-center';
}

cbAdvice.addEventListener('change', function () {
    if (cbAdvice.checked) {
        cbCurrency.checked = false;
        setupAdvice();
    } else {
        resetForm();
        inputLabel.textContent = 'Select an API above to get started';
    }
});

cbCurrency.addEventListener('change', function () {
    if (cbCurrency.checked) {
        cbAdvice.checked = false;
        setupCurrency();
    } else {
        resetForm();
        inputLabel.textContent = 'Select an API above to get started';
    }
});

submitBtn.addEventListener('click', function () {
    responseText.textContent = '';
    if (cbAdvice.checked) {
        callAdviceApi();
    } else if (cbCurrency.checked) {
        callCurrencyApi();
    }
});

function callAdviceApi() {
    responseText.textContent = 'Loading...';
    responseText.className = 'text-gray-500 text-center';

    fetch('https://api.api-ninjas.com/v1/advice', {
        method: 'GET',
        headers: { 'X-Api-Key': API_KEY }
    })
    .then(function (response) {
        if (!response.ok) throw new Error('API error ' + response.status);
        return response.json();
    })
    .then(function (data) {
        if (data && data.advice) {
            responseText.textContent = '💡 ' + data.advice;
            responseText.className = 'text-[#445E93] text-center text-lg font-semibold';
        } else {
            responseText.textContent = 'No advice returned. Please try again.';
            responseText.className = 'text-red-500 text-center';
        }
    })
    .catch(function (error) {
        responseText.textContent = 'Error: ' + error.message;
        responseText.className = 'text-red-500 text-center';
    });
}

function callCurrencyApi() {
    const inputValue = apiInput.value.trim();

    if (!inputValue) {
        responseText.textContent = 'Error: please enter an amount and currencies (e.g. 100 AUD KRW).';
        responseText.className = 'text-red-500 text-center';
        return;
    }

    const parts = inputValue.split(' ');
    if (parts.length !== 3) {
        responseText.textContent = 'Error: use the format — amount from-currency to-currency (e.g. 100 AUD KRW).';
        responseText.className = 'text-red-500 text-center';
        return;
    }

    const amount = parts[0];
    const fromCurrency = parts[1].toUpperCase();
    const toCurrency = parts[2].toUpperCase();

    if (isNaN(amount) || Number(amount) <= 0) {
        responseText.textContent = 'Error: the amount must be a positive number.';
        responseText.className = 'text-red-500 text-center';
        return;
    }

    responseText.textContent = 'Loading...';
    responseText.className = 'text-gray-500 text-center';

    const url = 'https://api.api-ninjas.com/v1/convertcurrency?have=' +
        fromCurrency + '&want=' + toCurrency + '&amount=' + amount;

    fetch(url, {
        method: 'GET',
        headers: { 'X-Api-Key': API_KEY }
    })
    .then(function (response) {
        if (!response.ok) throw new Error('API error ' + response.status);
        return response.json();
    })
    .then(function (data) {
        if (data && data.new_amount !== undefined) {
            responseText.textContent = '💱 ' + amount + ' ' + fromCurrency + ' = ' + data.new_amount.toFixed(2) + ' ' + toCurrency;
            responseText.className = 'text-[#445E93] text-center text-lg font-semibold';
        } else {
            responseText.textContent = 'No result returned. Check your input and try again.';
            responseText.className = 'text-red-500 text-center';
        }
    })
    .catch(function (error) {
        responseText.textContent = 'Error: ' + error.message;
        responseText.className = 'text-red-500 text-center';
    });
}
