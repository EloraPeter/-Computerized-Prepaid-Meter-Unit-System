const API_BASE = 'http://localhost:5000';


// Handle signup
async function handleSignup(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Signup successful. You can now log in.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Error signing up.');
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Login successful.');
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Error logging in.');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

// Attach event listeners
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}



// Fetch user balance
async function fetchBalance() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE}/dashboard/balance`, {
            headers: { Authorization: token },
        });
        const data = await response.json();
        // document.getElementById('kwh-balance').textContent = data.kwh_balance.toFixed(2);
        if (data && typeof data.kwh_balance === 'number') {
            document.getElementById('kwh-balance').textContent = `${data.kwh_balance.toFixed(2)}`;
        } else {
            console.error('Invalid or missing balance:', data);
            document.getElementById('kwh-balance').textContent = 'Error fetching balance.';
        }

    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

// Fetch transaction history
async function fetchTransactions() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE}/transactions/history`, {
            headers: { Authorization: token }
        });
        const data = await response.json();
        const transactionList = document.getElementById('transaction-list');
        transactionList.innerHTML = '';
        data.forEach((transaction) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${transaction.amount.toFixed(2)}</td>
        <td>${transaction.kwh.toFixed(2)}</td>
        <td>${transaction.payment_method}</td>
        <td>${new Date(transaction.created_at).toLocaleString()}</td>
      `;
            transactionList.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}


//rechargeAccount
async function rechargeAccount(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    console.log("Token:", token); // Debug token
    if (!token) {
        alert("You must be logged in to recharge.");
        window.location.href = "login.html";
        return;
    }

    const amount = document.getElementById('amount').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    console.log("Amount:", amount); // Debug amount
    console.log("Payment Method:", paymentMethod); // Debug payment method

    if (!amount || !paymentMethod) {
        alert("Please fill in all the required fields.");
        return;
    }

    console.log("Request Body:", { amount, payment_method: paymentMethod }); // Debug request body

    try {
        const response = await fetch(`${API_BASE}recharge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount, payment_method: paymentMethod }),
        });

        console.log("Response Status:", response.status); // Debug response status
        console.log("Response OK:", response.ok); // Debug response ok status

        if (!response.ok) {
            const data = await response.json();
            alert(data.message || 'Recharge failed. Please try again.');
            return;
        }

        const data = await response.json();
        console.log("Response Data:", data); // Debug response data

        alert(`Recharge successful! ${data.kwh || 0} kWh added.`);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Error Details:", error); // Debug error details
        alert("An error occurred while processing your request. Please try again.");
    }
}


// Event listeners
if (document.getElementById('rechargeForm')) {
    document.getElementById('rechargeForm').addEventListener('submit', rechargeAccount);
}
if (document.getElementById('transaction-list')) {
    fetchTransactions();
}
if (document.getElementById('kwh-balance')) {
    fetchBalance();
}

document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});