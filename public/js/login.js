document.addEventListener('DOMContentLoaded', () => {
    var form = document.getElementById('loginForm');
    form.onsubmit = function (e) {
        e.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        const errorArea = document.getElementById('errors');

        fetch('/api/user/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    
                    if (data.success === true) {
                        console.log(data)
                        const token = data.token;
                        localStorage.setItem("auth_token",token);
                        window.location.href = '/';
                    }           
                });
            } else {
                errorArea.textContent = "Invalid credentials";
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
});
