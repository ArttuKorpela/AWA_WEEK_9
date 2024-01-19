

document.addEventListener('DOMContentLoaded', () => {
    var form = document.getElementById('registerForm');
    form.onsubmit = function (e) {
        e.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        const errorArea = document.getElementById('errors');

        fetch('/api/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    console.log('Success:', data);
                    window.location.href = '/login.html';
                });
            } else if (response.status == 403) {
                errorArea.textContent = "Email already in use"; 
            } else if (response.status === 400) {
                errorArea.textContent = "Password is not strong enough"; 
            } else {
                console.error('Error:', error);
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
});
