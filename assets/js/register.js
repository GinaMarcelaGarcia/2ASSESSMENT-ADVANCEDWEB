// show / hide password
const toggleButtons = document.querySelectorAll('.toggle-password');

toggleButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const input = button.previousElementSibling;   // password field next to the button
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('bi-eye', 'bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('bi-eye-slash', 'bi-eye');
        }
    });
});

// Validação do formulário
const form = document.getElementById('registerForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm_password');

// Mostra ou esconde o erro de um campo
function checkField(input, isValid) {
    if (isValid) {
        input.classList.remove('is-invalid');
        return true;
    }
    input.classList.add('is-invalid');
    return false;
}

form.addEventListener('submit', function (event) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const usernameOk = checkField(username, username.value.trim() !== '');
    const emailOk = checkField(email, emailPattern.test(email.value.trim()));
    const passwordOk = checkField(password, password.value.length >= 8);
    const confirmOk = checkField(confirmPassword, confirmPassword.value !== '' && confirmPassword.value === password.value);

    // if theres any error, don't submit the form
    if (!usernameOk || !emailOk || !passwordOk || !confirmOk) {
        event.preventDefault();
    }
});

// remove error when the user starts correcting the field
[username, email, password, confirmPassword].forEach(function (input) {
    input.addEventListener('input', function () {
        input.classList.remove('is-invalid');
    });
});