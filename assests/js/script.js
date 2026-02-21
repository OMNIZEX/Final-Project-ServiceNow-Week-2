// Global state
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('myCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];
let orders = JSON.parse(localStorage.getItem('myOrders')) || [];
let allSearchProducts = [];

const itemsPerPage = 6;
let currentPage = 1;

// Custom fruits data
const myFruits = [
    { title: "Fresh Strawberry", img: "assests/img/product-img-1.jpg", price: 85, desc: "Sweet and juicy red strawberries.", color: "Red" },
    { title: "Green Apple", img: "assests/img/product-img-5.jpg", price: 45, desc: "Crispy and sour green apples.", color: "Green" },
    { title: "Sweet Orange", img: "assests/img/product-img-6.jpg", price: 30, desc: "Vitamin C rich fresh oranges.", color: "Yellow" },
    { title: "Yellow Banana", img: "assests/img/product-img-7.jpg", price: 25, desc: "Energy boosting yellow bananas.", color: "Yellow" },
    { title: "Fresh Pineapple", img: "assests/img/product-img-8.jpg", price: 60, desc: "Tropical sweet pineapple.", color: "Yellow" },
    { title: "Red Cherry", img: "assests/img/product-img-9.jpg", price: 90, desc: "Fresh organic red cherries.", color: "Red" },
    { title: "Fresh Strawberry", img: "assests/img/product-img-1.jpg", price: 85, desc: "Sweet and juicy red strawberries.", color: "Red" },
    { title: "Green Apple", img: "assests/img/product-img-5.jpg", price: 45, desc: "Crispy and sour green apples.", color: "Green" },
    { title: "Sweet Orange", img: "assests/img/product-img-6.jpg", price: 30, desc: "Vitamin C rich fresh oranges.", color: "Yellow" },
    { title: "Yellow Banana", img: "assests/img/product-img-7.jpg", price: 25, desc: "Energy boosting yellow bananas.", color: "Yellow" },
    { title: "Fresh Pineapple", img: "assests/img/product-img-8.jpg", price: 60, desc: "Tropical sweet pineapple.", color: "Yellow" },
    { title: "Red Cherry", img: "assests/img/product-img-9.jpg", price: 90, desc: "Fresh organic red cherries.", color: "Red" },
    { title: "Fresh Strawberry", img: "assests/img/product-img-1.jpg", price: 85, desc: "Sweet and juicy red strawberries.", color: "Red" },
    { title: "Green Apple", img: "assests/img/product-img-5.jpg", price: 45, desc: "Crispy and sour green apples.", color: "Green" },
    { title: "Sweet Orange", img: "assests/img/product-img-6.jpg", price: 30, desc: "Vitamin C rich fresh oranges.", color:"Yellow" },
    { title:"Yellow Banana", img:"assests/img/product-img-7.jpg", price :25,desc:"Energy boosting yellow bananas.",color:"Yellow"},
    { title: "Fresh Pineapple", img: "assests/img/product-img-8.jpg", price: 60, desc: "Tropical sweet pineapple.", color: "Yellow" },
    { title: "Red Cherry", img: "assests/img/product-img-9.jpg", price: 90, desc: "Fresh organic red cherries.", color: "Red" },
];

// 1. Fetch products from API + override with myFruits
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=18');
        const apiData = await response.json();

        allProducts = apiData.map((item, index) => {
            const fruit = myFruits[index % myFruits.length] || {};
            return {
                id: item.id,
                title: fruit.title || item.title,
                price: fruit.price || item.price,
                image: fruit.img || item.image,
                description: fruit.desc || item.description,
                category: fruit.color || item.category
            };
        });

        allSearchProducts = [...allProducts];
    } catch (error) {
        console.error('API error, using fallback:', error);
        allProducts = myFruits.map((fruit, index) => ({
            id: index + 1,
            title: fruit.title,
            price: fruit.price,
            image: fruit.img,
            description: fruit.desc,
            category: fruit.color
        }));
        allSearchProducts = [...allProducts];
    }
}

// 2. Display products (home, shop, search, wishlist, related)
function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);

        container.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card product-card h-100 border-0 shadow-sm p-4 text-center rounded-4 position-relative"
                     onclick="goToProductDetails(${product.id})"
                     style="cursor: pointer;">
                    
                    <button class="wishlist-btn position-absolute top-0 end-0 mt-2 me-2 bg-white rounded-circle border-0 shadow-sm p-2 z-3"
                            onclick="event.stopPropagation(); toggleWishlist(${product.id}, '${containerId}');">
                        <i class="fas fa-heart ${isInWishlist ? 'text-orange' : 'text-muted'} fs-5"></i>
                    </button>

                    <div class="product-img mb-4 position-relative">
                        <img src="${product.image}" class="img-fluid" style="height:180px; object-fit:contain;">
                    </div>
                    <h4 class="fw-bold h5">${product.title}</h4>
                    <p class="text-muted small">Per Kg</p>
                    <div class="price fw-bold fs-4 mb-3">$${product.price}</div>
                    <button class="btn btn-orange rounded-pill px-4 py-2 fw-bold border-0" 
                            onclick="event.stopPropagation(); addToCart(${product.id}, '${containerId}');">
                        <i class="fas fa-shopping-cart me-2"></i> Add to Cart
                    </button>
                </div>
            </div>`;
    });
}

// 3. Add to cart
function addToCart(productId, containerId) {

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert("Please login first to add items to your cart!");
        window.location.href = 'Login_page.html'; // Redirect to login page
        return; // Stop execution here
    }

    // If logged in, proceed normally
    let product = allProducts.find(p => p.id === productId);
    if (!product) {
        product = JSON.parse(localStorage.getItem('selectedProduct'));
        if (!product || product.id !== productId) return;
    }

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('myCart', JSON.stringify(cart));
    alert(`${product.title} added to cart!`);

    if (document.getElementById('cartTableBody')) displayCart();
}

// 4. Display cart (X icon remove + reset button)
function displayCart() {
    const tbody = document.getElementById('cartTableBody');
    if (!tbody) return;

    tbody.innerHTML = "";

    cart.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td class="p-3">
                    <button class="btn btn-outline-dark btn-sm border-0" onclick="removeFromCart(${index})">
                        <i class="far fa-times-circle fs-5 text-danger"></i>
                    </button>
                </td>
                <td class="p-3"><img src="${item.image}" width="50"></td>
                <td class="p-3 fw-bold text-dark">${item.title}</td>
                <td class="p-3">$${item.price}</td>
                <td class="p-3">
                    <input type="number" class="form-control mx-auto text-center" 
                           value="${item.quantity}" min="1" style="width: 70px;" 
                           onchange="updateQuantity(${index}, this.value)">
                </td>
                <td class="p-3 fw-bold text-dark">$${item.price * item.quantity}</td>
            </tr>`;
    });
    updateTotals();
}

// 5. Update quantity
function updateQuantity(index, qty) {
    cart[index].quantity = parseInt(qty) || 1;
    localStorage.setItem('myCart', JSON.stringify(cart));
    displayCart();
}

// 6. Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('myCart', JSON.stringify(cart));
    displayCart();
}

// 7. Reset cart
function resetCart() {
    if (confirm("Are you sure you want to clear the cart?")) {
        cart = [];
        localStorage.setItem('myCart', JSON.stringify(cart));
        displayCart();
    }
}

// 8. Update cart totals + disable checkout if subtotal = 0
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 45 : 0;

    document.getElementById('subtotalPrice').innerText = `$${subtotal}`;
    document.getElementById('totalPrice').innerText = `$${subtotal + shipping}`;

    // Disable checkout button if subtotal = 0
    const checkoutBtn = document.querySelector('button[onclick="processCheckout()"]');
    if (checkoutBtn) {
        checkoutBtn.disabled = subtotal === 0;
        checkoutBtn.style.opacity = subtotal === 0 ? '0.5' : '1';
        checkoutBtn.style.cursor = subtotal === 0 ? 'not-allowed' : 'pointer';
    }
}

// 9. Toggle wishlist
function toggleWishlist(productId, containerId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.findIndex(item => item.id === productId);

    if (index === -1) {
        wishlist.push({ ...product });
    } else {
        wishlist.splice(index, 1);
    }

    localStorage.setItem('myWishlist', JSON.stringify(wishlist));

    // Re-render current container
    if (containerId === 'homeProductContainer') displayProducts(allProducts.slice(0, 3), 'homeProductContainer');
    if (containerId === 'productContainer') renderPage(currentPage);
    if (containerId === 'relatedProductsContainer') displayRelatedProducts();
    if (document.getElementById('wishlistContainer')) displayWishlist();
}

// Display wishlist using the same consistent product card layout
function displayWishlist() {
    const container = document.getElementById('wishlistContainer');
    if (!container) return;

    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-5">Your wishlist is empty</p>';
        return;
    }

    // Reuse displayProducts – it already handles the visible heart button correctly
    displayProducts(wishlist, 'wishlistContainer');
}

// 11. Go to product details
function goToProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    localStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.href = 'Product_Details.html';
}

// 12. Load product details page
function loadProductDetails() {
    const selected = JSON.parse(localStorage.getItem('selectedProduct'));
    if (!selected) {
        document.querySelector('.product-details').innerHTML = '<h3 class="text-center text-muted py-5">No product selected</h3>';
        return;
    }

    document.getElementById('productImage').src = selected.image;
    document.getElementById('productTitle').textContent = selected.title;
    document.getElementById('productPrice').textContent = `$${selected.price}`;
    document.getElementById('productDesc').textContent = selected.description || "Fresh organic fruit, perfect for daily consumption.";
    document.getElementById('productCategory').textContent = selected.category || "Fruits, Organic";

    document.getElementById('addToCartBtn').onclick = () => addToCart(selected.id, 'details');

    // Wishlist button in details
    const isFav = wishlist.some(item => item.id === selected.id);
    const heart = document.getElementById('heartIcon');
    if (heart) {
        heart.classList.toggle('text-orange', isFav);
        heart.classList.toggle('text-muted', !isFav);
    }

    window.toggleFavoriteFromDetails = () => {
        toggleWishlist(selected.id, 'details');
        heart.classList.toggle('text-orange');
        heart.classList.toggle('text-muted');
    };

    displayRelatedProducts();
}

// 13. Display related products
function displayRelatedProducts() {
    const container = document.getElementById('relatedProductsContainer');
    if (!container) return;

    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    const randomThree = shuffled.slice(0, 3);

    displayProducts(randomThree, 'relatedProductsContainer');
}

// 14. Shop pagination (smooth scroll without jumping to top)
function renderPage(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    displayProducts(allProducts.slice(start, end), 'productContainer');

    // Smooth scroll to product section only
    const productSection = document.getElementById('productContainer')?.parentElement;
    if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setupPagination();
}

function setupPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const pageCount = Math.ceil(allProducts.length / itemsPerPage);
    container.innerHTML = "";

    container.innerHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="renderPage(${currentPage - 1}); return false;">Prev</a>
    </li>`;

    for (let i = 1; i <= pageCount; i++) {
        container.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="renderPage(${i}); return false;">${i}</a>
        </li>`;
    }

    container.innerHTML += `<li class="page-item ${currentPage === pageCount ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="renderPage(${currentPage + 1}); return false;">Next</a>
    </li>`;
}

// 15. Search filters
function applyFilters() {
    const nameValue = document.getElementById('nameSearch')?.value.toLowerCase() || '';
    const colorValue = document.getElementById('colorFilter')?.value || 'all';
    const priceSort = document.getElementById('priceSort')?.value || 'default';

    let results = allSearchProducts.filter(product => {
        const nameMatch = product.title.toLowerCase().includes(nameValue);
        const colorMatch = colorValue === 'all' || product.category === colorValue;
        return nameMatch && colorMatch;
    });

    if (priceSort === 'low') results.sort((a, b) => a.price - b.price);
    if (priceSort === 'high') results.sort((a, b) => b.price - a.price);

    displayProducts(results, 'searchResultContainer');
}

// 16. Load order details in checkout
function loadOrderDetails() {
    const tbody = document.getElementById('orderDetailsBody');
    if (!tbody) return;

    tbody.innerHTML = "";

    let subtotal = 0;
    cart.forEach(item => {
        const totalItem = item.price * item.quantity;
        subtotal += totalItem;

        tbody.innerHTML += `
            <tr class="bg-white">
                <td>${item.title} (x${item.quantity})</td>
                <td class="text-end">$${totalItem.toFixed(2)}</td>
            </tr>`;
    });

    const shipping = 45;
    document.getElementById('orderSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `$${(subtotal + shipping).toFixed(2)}`;

    // Disable checkout button if subtotal = 0
    const checkoutBtn = document.querySelector('button[onclick="processCheckout()"]');
    if (checkoutBtn) {
        checkoutBtn.disabled = subtotal === 0;
        checkoutBtn.style.opacity = subtotal === 0 ? '0.5' : '1';
        checkoutBtn.style.cursor = subtotal === 0 ? 'not-allowed' : 'pointer';
    }
}

// 17. Process checkout with validation
function processCheckout() {
    const form = document.getElementById('checkoutForm');
    if (!form || !form.checkValidity()) {
        form?.reportValidity();
        return;
    }

    // Phone validation: numbers only
    const phoneInput = document.getElementById('billPhone');
    if (phoneInput && !/^\d+$/.test(phoneInput.value.trim())) {
        alert("Phone number must contain numbers only!");
        phoneInput.focus();
        return;
    }

    const orderData = {
        orderId: 'ORD-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleString(),
        name: document.getElementById('billName')?.value || '',
        email: document.getElementById('billEmail')?.value || '',
        address: document.getElementById('billAddress')?.value || '',
        phone: document.getElementById('billPhone')?.value || '',
        items: [...cart],
        subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        shipping: 45,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 45
    };

    orders.push(orderData);
    localStorage.setItem('myOrders', JSON.stringify(orders));

    cart = [];
    localStorage.setItem('myCart', JSON.stringify(cart));

    alert(`Order placed successfully! Order ID: ${orderData.orderId}`);
    window.location.href = 'home.html';
}

// Main initialization
document.addEventListener('DOMContentLoaded', async () => {
    await fetchProducts();

    // Home
    if (document.getElementById('homeProductContainer')) {
        displayProducts(allProducts.slice(0, 3), 'homeProductContainer');
    }

    // Shop
    if (document.getElementById('productContainer')) {
        renderPage(1);
    }

    // Cart
    if (document.getElementById('cartTableBody')) {
        displayCart();
    }

    // Wishlist
    if (document.getElementById('wishlistContainer')) {
        displayWishlist();
    }

    // Search
    if (document.getElementById('searchResultContainer')) {
        displayProducts(allSearchProducts, 'searchResultContainer');
    }

    // Product Details
    if (document.getElementById('productImage')) {
        loadProductDetails();
    }

    // Checkout
    if (document.getElementById('orderDetailsBody')) {
        loadOrderDetails();
    }

    // Contact form validation on submit
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            if (!validateForm(contactForm.id || 'contactForm')) {
                e.preventDefault();
            }
        });
    }
});

// Contact & Checkout form validation (improved for email & phone)
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let valid = true;

    // Reset previous errors
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    // Required fields check
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.classList.add('is-invalid');
        }
    });

    // Email validation (must be valid format)
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            valid = false;
            emailInput.classList.add('is-invalid');
            // Optional: custom message
            emailInput.setCustomValidity("Please enter a valid email address (e.g., name@example.com)");
        } else {
            emailInput.setCustomValidity("");
        }
    }

    // Phone validation (numbers only, min 10 digits for Egypt)
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput && phoneInput.value.trim()) {
        const phonePattern = /^\d{10,15}$/; // 10-15 digits only
        if (!phonePattern.test(phoneInput.value.trim())) {
            valid = false;
            phoneInput.classList.add('is-invalid');
            phoneInput.setCustomValidity("Phone number must contain 10-15 digits only (no letters or symbols)");
        } else {
            phoneInput.setCustomValidity("");
        }
    }

    // Show browser validation messages if needed
    if (!valid) {
        form.reportValidity();
    }

    return valid;
}

// Scroll navbar effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
});
