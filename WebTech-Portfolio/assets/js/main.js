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
  responseArea.className = 'response-area';
  responseText.textContent = 'Waiting for your selection...';
}

function setupAdvice() {
  resetForm();
  inputLabel.textContent = 'No input needed for Advice API';
  apiInput.placeholder = '(no input required)';
  apiInput.disabled = true;
  submitBtn.disabled = false;
  responseArea.className = 'response-area response-ready';
  responseText.textContent = 'Ready! Click "Get Response" to fetch a random piece of advice.';
}

function setupCurrency() {
  resetForm();
  inputLabel.textContent = 'Enter: amount from-currency to-currency (e.g. 100 AUD KRW)';
  apiInput.placeholder = 'e.g. 100 AUD KRW';
  apiInput.disabled = false;
  apiInput.focus();
  submitBtn.disabled = false;
  responseArea.className = 'response-area response-ready';
  responseText.textContent = 'Ready! Enter your amount and currencies above, then click "Get Response".';
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
  responseArea.className = 'response-area';
  responseText.textContent = '';

  if (!cbAdvice.checked && !cbCurrency.checked) {
    responseArea.className = 'response-area response-error';
    responseText.textContent = 'Error: please select an API first.';
    return;
  }

  if (cbAdvice.checked) {
    callAdviceApi();
  } else if (cbCurrency.checked) {
    callCurrencyApi();
  }
});

function callAdviceApi() {
  responseText.textContent = 'Loading...';

  fetch('https://api.api-ninjas.com/v1/advice', {
    method: 'GET',
    headers: { 'X-Api-Key': API_KEY }
  })
    .then(function (response) {
      if (!response.ok) {
        return response.json().then(function (errData) {
          throw new Error(errData.error || 'API error ' + response.status);
        });
      }
      return response.json();
    })
    .then(function (data) {
      if (data && data.advice) {
        responseArea.className = 'response-area response-success';
        responseText.textContent = data.advice;
      } else {
        responseArea.className = 'response-area response-error';
        responseText.textContent = 'No advice returned. Please try again.';
      }
    })
    .catch(function (error) {
      responseArea.className = 'response-area response-error';
      responseText.textContent = 'Error: ' + error.message;
    });
}

function callCurrencyApi() {
  const inputValue = apiInput.value.trim();

  if (!inputValue) {
    responseArea.className = 'response-area response-error';
    responseText.textContent = 'Error: please enter an amount and currencies (e.g. 100 AUD KRW).';
    return;
  }

  const parts = inputValue.split(' ');

  if (parts.length !== 3) {
    responseArea.className = 'response-area response-error';
    responseText.textContent = 'Error: use the format — amount from-currency to-currency (e.g. 100 AUD KRW).';
    return;
  }

  const amount = parts[0];
  const fromCurrency = parts[1].toUpperCase();
  const toCurrency = parts[2].toUpperCase();

  if (isNaN(amount) || Number(amount) <= 0) {
    responseArea.className = 'response-area response-error';
    responseText.textContent = 'Error: the amount must be a positive number.';
    return;
  }

  responseText.textContent = 'Loading...';

  const url = 'https://api.api-ninjas.com/v1/convertcurrency?have=' +
    fromCurrency + '&want=' + toCurrency + '&amount=' + amount;

  fetch(url, {
    method: 'GET',
    headers: { 'X-Api-Key': API_KEY }
  })
    .then(function (response) {
      if (!response.ok) {
        return response.json().then(function (errData) {
          throw new Error(errData.error || 'API error ' + response.status);
        });
      }
      return response.json();
    })
    .then(function (data) {
      if (data && data.new_amount !== undefined) {
        responseArea.className = 'response-area response-success';
        responseText.textContent =
          amount + ' ' + fromCurrency + ' = ' + data.new_amount.toFixed(2) + ' ' + toCurrency;
      } else if (data && data.error) {
        responseArea.className = 'response-area response-error';
        responseText.textContent = 'API error: ' + data.error;
      } else {
        responseArea.className = 'response-area response-error';
        responseText.textContent = 'No result returned. Check your input and try again.';
      }
    })
    .catch(function (error) {
      responseArea.className = 'response-area response-error';
      responseText.textContent = 'Error: ' + error.message;
    });
}