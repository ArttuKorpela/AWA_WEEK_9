

document.addEventListener('DOMContentLoaded', () => {
    var form = document.getElementById('registerForm');
    form.onsubmit = function (e) {
        e.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

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
            } else {
                console.error('Registration failed with status:', response.status);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
});
