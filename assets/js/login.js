// login form validation
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');

// show or hide field error
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

    const emailOk = checkField(email, emailPattern.test(email.value.trim()));
    const passwordOk = checkField(password, password.value !== '');

    if (!emailOk || !passwordOk) {
        event.preventDefault();
    }
});

// remove error when the user starts correcting the field
[email, password].forEach(function (input) {
    input.addEventListener('input', function () {
        input.classList.remove('is-invalid');
    });
});