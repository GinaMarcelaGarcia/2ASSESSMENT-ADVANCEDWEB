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