// --- NAVBAR SCROLL EFFECT ---
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// --- REGISTRATION LOGIC ---
const registerForm = document.getElementById('registerForm');

if (registerForm) { // Only run if we are on the register page
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevents the page from refreshing

        // 1. Grab values from the input fields
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;
        const confirmPass = document.getElementById('regConfirmPass').value;

        // 2. Form Validation Requirement
        if (pass !== confirmPass) {
            alert("Passwords do not match! Please try again.");
            return; // Stops the function here if passwords don't match
        }
        if (pass.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        // 3. Create a user object
        const user = { name: name, email: email, password: pass };

        // 4. Save to LocalStorage Requirement
        localStorage.setItem('fruitkhaUser', JSON.stringify(user));
        
        alert("Registration Successful! Please login.");
        window.location.href = 'Login_page.html'; // Redirect to login page
    });
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');

if (loginForm) { // Only run if we are on the login page
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;

        // Retrieve saved user from LocalStorage
        const savedUser = JSON.parse(localStorage.getItem('fruitkhaUser'));

        // Validation: Check if user exists and passwords match
        if (savedUser && savedUser.email === email && savedUser.password === pass) {
            localStorage.setItem('isLoggedIn', 'true'); // Save login session
            window.location.href = 'home.html'; // Redirect to home
        } else {
            alert("Invalid Email or Password!");
        }
    });
}
// --- PROFILE PAGE LOGIC ---

function displayRecentOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (!ordersList) return;

    // Get real orders from localStorage (the same array used in checkout)
    let orders = JSON.parse(localStorage.getItem('myOrders')) || [];

    // If no orders, show message
    if (orders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No recent orders found.</td></tr>';
        return;
    }

    // Use .map() to generate table rows dynamically
    const ordersHTML = orders.map(order => {
        return `
            <tr>
                <td class="fw-bold">${order.orderId}</td>
                <td>${order.date}</td>
                <td class="fw-bold text-dark-custom">$${order.total.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    ordersList.innerHTML = ordersHTML;
}

// Function to handle logging out (This is triggered by the onclick="logout()" in your HTML)
function logout() {
    // 1. Remove the saved user session from LocalStorage
    localStorage.removeItem('fruitkhaUser');
    localStorage.removeItem('isLoggedIn');

    // 2. Show a friendly message and redirect to the login page
    alert("You have been successfully logged out.");
    window.location.href = 'Login_page.html';
}

// Run the function automatically as soon as the script loads
loadUserProfile();

// Update your existing loadUserProfile() to call this new function!
function loadUserProfile() {
    const nameDisplay = document.getElementById('userNameDisplay');
    const emailDisplay = document.getElementById('userEmailDisplay');

    if (nameDisplay && emailDisplay) {
        const savedUser = JSON.parse(localStorage.getItem('fruitkhaUser'));

        if (savedUser) {
            nameDisplay.innerText = savedUser.name;
            emailDisplay.innerText = savedUser.email;
            
            // --- CALL THE NEW FUNCTION HERE ---
            displayRecentOrders(); 
        } else {
            alert("You must be logged in to view your profile.");
            window.location.href = 'Login_page.html';
        }
    }
}
