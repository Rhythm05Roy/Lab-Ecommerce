const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const productsGrid = document.getElementById('productsGrid');
const categoryFilters = document.getElementById('categoryFilters');
const carousel = document.getElementById('carousel');
const carouselContainer = document.getElementById('carouselContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSlide = 0;
let selectedCategory = 'All';

// Categories
const categories = ['All', ...new Set(products.map(product => product.category))];

// Initialize
function init() {
  renderCategories();
  renderProducts();
  renderCarousel();
  updateCart();
}

// Render Categories
function renderCategories() {
  categoryFilters.innerHTML = categories.map(category => `
    <button class="category-btn ${category === selectedCategory ? 'active' : ''}"
            onclick="filterProducts('${category}')">
      ${category}
    </button>
  `).join('');
}

// Filter Products
function filterProducts(category) {
  selectedCategory = category;
  renderCategories();
  renderProducts();
}

// Render Products
function renderProducts() {
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

// Carousel
function renderCarousel() {
  const featuredProducts = products.slice(0, 3);
  carouselContainer.innerHTML = featuredProducts.map(product => `
    <div class="carousel-item">
      <img src="${product.image}" alt="${product.name}">
      <div class="carousel-item-content">
        <h2>${product.name}</h2>
        <p>$${product.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
  updateCarousel();
}

function updateCarousel() {
  carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % 3;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + 3) % 3;
  updateCarousel();
}

// Cart Functions
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  saveCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  saveCart();
}

function updateQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(0, item.quantity + delta);
    if (item.quantity === 0) {
      removeFromCart(productId);
    } else {
      updateCart();
      saveCart();
    }
  }
}

function updateCart() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Cart Modal
function openCart() {
  cartModal.classList.add('open');
}

function closeCart() {
  cartModal.classList.remove('open');
}

// Event Listeners
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto-advance carousel
setInterval(nextSlide, 5000);

// Initialize the app
init();