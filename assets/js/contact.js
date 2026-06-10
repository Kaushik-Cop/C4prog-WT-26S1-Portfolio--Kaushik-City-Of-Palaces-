const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const successMsg = document.getElementById('success-msg');

const nameRegex = /^[a-zA-Z\s]{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const messageRegex = /^.{10,}$/;

function validateName() {
    if (!nameRegex.test(nameInput.value.trim())) {
        nameError.classList.remove('hidden');
        return false;
    }
    nameError.classList.add('hidden');
    return true;
}

function validateEmail() {
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.classList.remove('hidden');
        return false;
    }
    emailError.classList.add('hidden');
    return true;
}

function validateMessage() {
    if (!messageRegex.test(messageInput.value.trim())) {
        messageError.classList.remove('hidden');
        return false;
    }
    messageError.classList.add('hidden');
    return true;
}

nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
messageInput.addEventListener('input', validateMessage);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValid = validateName() & validateEmail() & validateMessage();
    if (isValid) {
        successMsg.classList.remove('hidden');
        submitBtn.disabled = true;
        form.reset();
    }
});