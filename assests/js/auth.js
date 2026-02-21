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
            window.location.href = 'index.html'; // Redirect to home
        } else {
            alert("Invalid Email or Password!");
        }
    });
}
// --- PROFILE PAGE LOGIC ---

// Function to load and display user data
function loadUserProfile() {
    // 1. Find the specific HTML elements where the data will go
    const nameDisplay = document.getElementById('userNameDisplay');
    const emailDisplay = document.getElementById('userEmailDisplay');

    // 2. Only run this logic if these elements exist (meaning we are on the Profile page)
    if (nameDisplay && emailDisplay) {
        
        // 3. Retrieve the saved user string from LocalStorage and parse it back into an object
        const savedUser = JSON.parse(localStorage.getItem('fruitkhaUser'));

        // 4. Check if the user is actually logged in
        if (savedUser) {
            // DOM Manipulation: Change the text inside the HTML tags to match the saved data
            nameDisplay.innerText = savedUser.name;
            emailDisplay.innerText = savedUser.email;
        } else {
            // Security measure: If someone tries to visit profile.html without logging in, kick them out
            alert("You must be logged in to view your profile.");
            window.location.href = 'Login_page.html';
        }
    }
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

// Function to display the user's order history
function displayRecentOrders() {
    // 1. Find the table body element where rows will be injected
    const ordersList = document.getElementById('ordersList');
    
    // 2. Safety check: Only run if the table exists (meaning we are on profile.html)
    if (!ordersList) return; 

    // 3. Get orders from LocalStorage. 
    // If none exist, we provide a dummy array to demonstrate the .map() method
    let orders = JSON.parse(localStorage.getItem('fruitkhaOrders')) || [
        { id: '#1042', date: '05/02/2026', status: 'Delivered', total: 85.00 },
        { id: '#1043', date: '10/02/2026', status: 'Processing', total: 120.50 }
    ];

    // 4. Handle the case where the user has zero orders
    if (orders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No recent orders found.</td></tr>';
        return;
    }

    // 5. Technical Rule: Array Method .map()
    const ordersHTML = orders.map(order => {
        // Simple logic to change the color of the status pill
        let statusColor = order.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark';

        return `
            <tr>
                <td class="fw-bold">${order.id}</td>
                <td>${order.date}</td>
                <td><span class="badge ${statusColor} rounded-pill px-3 py-2">${order.status}</span></td>
                <td class="fw-bold text-dark-custom">$${order.total.toFixed(2)}</td>
            </tr>
        `;
    }).join(''); // 6. Turn the array of HTML strings into one single block of text

    // 7. Technical Rule: DOM Manipulation
    ordersList.innerHTML = ordersHTML;
}

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