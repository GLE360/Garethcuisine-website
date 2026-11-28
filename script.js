
/* =========================================================
   SAVORIA
   STAGE 2: COMPLETE JAVASCRIPT FUNCTIONALITY

   Restaurant | Catering | Food Delivery
========================================================= */


/* =========================================================
   1. GLOBAL CONFIGURATION & STORAGE
========================================================= */

const SAVORIA = {
    currency: "USD",
    locale: "en-US",
    slideshowSpeed: 5000,
    storage: {
        cart: "savoria_cart",
        favorites: "savoria_favorites"
    }
};

const money = new Intl.NumberFormat(SAVORIA.locale, {
    style: "currency",
    currency: SAVORIA.currency
});

function loadStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.warn("Storage could not be loaded:", error);
        return fallback;
    }
}

function saveStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn("Storage could not be saved:", error);
        showToast("Your browser could not save this information.", "error");
    }
}

let cart = loadStorage(SAVORIA.storage.cart, []);
let favorites = loadStorage(SAVORIA.storage.favorites, []);

if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(favorites)) favorites = [];

let activeFilter = "all";
let visibleExtraProducts = 0;


/* =========================================================
   2. GENERAL HELPERS
========================================================= */

const select = (selector, parent = document) =>
    parent.querySelector(selector);

const selectAll = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function showToast(message, type = "success") {
    const container = select("#toastContainer");

    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-message ${type}`;

    const icon = type === "error"
        ? "fa-circle-exclamation"
        : "fa-circle-check";

    const iconElement = document.createElement("i");
    iconElement.className = `fas ${icon}`;

    const messageElement = document.createElement("span");
    messageElement.textContent = message;

    toast.append(iconElement, messageElement);
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


/* =========================================================
   3. HERO IMAGE SLIDESHOW
========================================================= */

const heroSlides = selectAll(".hero-slide");
const heroDotsContainer = select(".hero-dots");

let currentSlide = 0;
let slideshowInterval = null;

function createHeroDots() {
    if (!heroDotsContainer) return;

    heroDotsContainer.innerHTML = "";

    heroSlides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.className = index === 0 ? "hero-dot active" : "hero-dot";
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

        dot.addEventListener("click", () => {
            goToSlide(index);
            restartSlideshow();
        });

        heroDotsContainer.appendChild(dot);
    });
}

function goToSlide(index) {
    if (!heroSlides.length) return;

    heroSlides[currentSlide]?.classList.remove("active");

    currentSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides[currentSlide].classList.add("active");

    selectAll(".hero-dot").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentSlide);
    });
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function previousSlide() {
    goToSlide(currentSlide - 1);
}

function startSlideshow() {
    if (heroSlides.length < 2) return;

    clearInterval(slideshowInterval);

    slideshowInterval = setInterval(
        nextSlide,
        SAVORIA.slideshowSpeed
    );
}

function restartSlideshow() {
    startSlideshow();
}

select(".hero-next")?.addEventListener("click", () => {
    nextSlide();
    restartSlideshow();
});

select(".hero-prev")?.addEventListener("click", () => {
    previousSlide();
    restartSlideshow();
});

createHeroDots();
startSlideshow();


/* =========================================================
   4. MOBILE NAVIGATION
========================================================= */

const menuToggle = select("#menuToggle");
const navbar = select("#navbar");

menuToggle?.addEventListener("click", () => {
    navbar?.classList.toggle("active");

    const icon = select("i", menuToggle);

    if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
    }
});

selectAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar?.classList.remove("active");

        const icon = select("i", menuToggle);

        icon?.classList.remove("fa-times");
        icon?.classList.add("fa-bars");
    });
});


/* =========================================================
   5. EXTRA MENU PRODUCTS
========================================================= */

const extraProducts = [

    {
        id: "food-7",
        name: "Classic English Breakfast",
        category: "breakfast",
        price: 12.50,
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=85",
        description: "A satisfying breakfast with eggs, toast, sausages and fresh sides.",
        rating: "4.8"
    },

    {
        id: "food-8",
        name: "Fresh Avocado Toast",
        category: "breakfast",
        price: 9.50,
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=85",
        description: "Fresh avocado served on toasted artisan bread.",
        rating: "4.7"
    },

    {
        id: "food-9",
        name: "Chocolate Dessert",
        category: "dessert",
        price: 7.50,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=85",
        description: "A delicious chocolate dessert for sweet moments.",
        rating: "4.9"
    },

    {
        id: "food-10",
        name: "Fresh Orange Juice",
        category: "drinks",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=85",
        description: "Freshly squeezed orange juice, served chilled.",
        rating: "4.8"
    },

    {
        id: "food-11",
        name: "Mediterranean Salad",
        category: "main",
        price: 11.50,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85",
        description: "A refreshing salad with fresh vegetables and dressing.",
        rating: "4.8"
    },

    {
        id: "food-12",
        name: "Classic Margherita Pizza",
        category: "pizza",
        price: 14.50,
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=85",
        description: "Classic pizza topped with tomato, mozzarella and basil.",
        rating: "4.9"
    },

    {
        id: "food-13",
        name: "Grilled Salmon",
        category: "main",
        price: 22.50,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=85",
        description: "Tender grilled salmon served with seasonal sides.",
        rating: "4.9"
    },

    {
        id: "food-14",
        name: "Strawberry Smoothie",
        category: "drinks",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=85",
        description: "A refreshing strawberry and fruit smoothie.",
        rating: "4.7"
    },

    {
        id: "food-15",
        name: "Chocolate Pancakes",
        category: "breakfast",
        price: 10.50,
        image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=85",
        description: "Fluffy pancakes with chocolate and fresh toppings.",
        rating: "4.9"
    },

    {
        id: "food-16",
        name: "Creamy Mushroom Pasta",
        category: "main",
        price: 17.50,
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=85",
        description: "Creamy pasta with mushrooms and aromatic herbs.",
        rating: "4.8"
    }

];


/* =========================================================
   6. FOOD CARD GENERATOR
========================================================= */

function createFoodCard(food) {

    const card = document.createElement("article");

    card.className = "food-card extra-food-card";

    card.dataset.category = food.category;
    card.dataset.name = food.name.toLowerCase();
    card.dataset.id = food.id;

    const isFavorite = favorites.includes(food.id);

    card.innerHTML = `
        <div class="food-image">

            <img
                src="${escapeHTML(food.image)}"
                alt="${escapeHTML(food.name)}"
                loading="lazy">

            <button
                class="favorite-btn ${isFavorite ? "active" : ""}"
                aria-label="Add to favorites"
                aria-pressed="${isFavorite}"
                data-id="${escapeHTML(food.id)}">

                <i class="${isFavorite ? "fas" : "far"} fa-heart"></i>

            </button>

        </div>

        <div class="food-details">

            <div class="food-rating">
                <i class="fas fa-star"></i>
                ${escapeHTML(food.rating)}
                <span>Chef's selection</span>
            </div>

            <h3>${escapeHTML(food.name)}</h3>

            <p>${escapeHTML(food.description)}</p>

            <div class="food-bottom">

                <strong>${money.format(food.price)}</strong>

                <button
                    class="add-cart-btn"
                    data-name="${escapeHTML(food.name)}"
                    data-price="${food.price}"
                    data-id="${escapeHTML(food.id)}">

                    <i class="fas fa-plus"></i>
                    Add

                </button>

            </div>

        </div>
    `;

    return card;
}


/* =========================================================
   7. LOAD MORE PRODUCTS
========================================================= */

const foodGrid = select("#foodGrid");
const loadMoreButton = select("#loadMore");

loadMoreButton?.addEventListener("click", () => {

    const nextBatch = extraProducts.slice(
        visibleExtraProducts,
        visibleExtraProducts + 4
    );

    if (!nextBatch.length) {
        showToast("You've explored our entire sample menu!");
        return;
    }

    nextBatch.forEach(food => {
        foodGrid?.appendChild(createFoodCard(food));
    });

    visibleExtraProducts += nextBatch.length;

    applyFoodFilters();

    if (visibleExtraProducts >= extraProducts.length) {
        loadMoreButton.innerHTML = `
            <i class="fas fa-check"></i>
            All Sample Dishes Loaded
        `;

        loadMoreButton.disabled = true;
    } else {
        loadMoreButton.innerHTML = `
            Explore More Dishes
            <i class="fas fa-arrow-right"></i>
        `;
    }

});


/* =========================================================
   8. FOOD CATEGORY FILTERS
========================================================= */

function applyFoodFilters() {

    const searchValue = (
        select("#foodSearch")?.value || ""
    ).trim().toLowerCase();

    const foodCards = selectAll(".food-card", foodGrid);

    foodCards.forEach(card => {

        const category = card.dataset.category;
        const name = card.dataset.name ||
            select("h3", card)?.textContent.toLowerCase() || "";

        const description =
            select(".food-details p", card)?.textContent.toLowerCase() || "";

        const categoryMatches =
            activeFilter === "all" ||
            category === activeFilter;

        const searchMatches =
            name.includes(searchValue) ||
            description.includes(searchValue);

        card.style.display =
            categoryMatches && searchMatches ? "" : "none";

    });

}

selectAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        selectAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        activeFilter = button.dataset.filter;

        applyFoodFilters();

    });

});


/* =========================================================
   9. LIVE FOOD SEARCH
========================================================= */

select("#foodSearch")?.addEventListener("input", () => {
    applyFoodFilters();
});

select(".search-btn")?.addEventListener("click", () => {

    select("#menu")?.scrollIntoView({
        behavior: "smooth"
    });

    setTimeout(() => {
        select("#foodSearch")?.focus();
    }, 500);

});


/* =========================================================
   10. FAVORITES / WISHLIST
========================================================= */

function saveFavorites() {
    saveStorage(SAVORIA.storage.favorites, favorites);
}

function toggleFavorite(button) {

    const card = button.closest(".food-card");

    const id = button.dataset.id ||
        card?.dataset.id ||
        `original-${select("h3", card)?.textContent.trim()}`;

    const index = favorites.indexOf(id);

    if (index === -1) {
        favorites.push(id);
        button.classList.add("active");
        showToast("Added to your favorites!");
    } else {
        favorites.splice(index, 1);
        button.classList.remove("active");
        showToast("Removed from favorites.");
    }

    const icon = select("i", button);

    if (icon) {
        icon.classList.toggle("far", !favorites.includes(id));
        icon.classList.toggle("fas", favorites.includes(id));
    }

    button.setAttribute(
        "aria-pressed",
        String(favorites.includes(id))
    );

    saveFavorites();
}

foodGrid?.addEventListener("click", event => {

    const button = event.target.closest(".favorite-btn");

    if (button) {
        toggleFavorite(button);
    }

});

// Restore saved favorites on original cards.

selectAll(".food-card").forEach(card => {

    const name = select("h3", card)?.textContent.trim();
    const id = `original-${name}`;

    const button = select(".favorite-btn", card);

    if (!button) return;

    if (favorites.includes(id)) {
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        const icon = select("i", button);

        icon?.classList.replace("far", "fas");
    }

    button.dataset.id = id;

});


/* =========================================================
   11. SHOPPING CART SYSTEM
========================================================= */

const cartDrawer = select("#cartDrawer");
const cartOverlay = select("#cartOverlay");
const cartItemsContainer = select("#cartItems");

function saveCart() {
    saveStorage(SAVORIA.storage.cart, cart);
}

function calculateCartTotal() {

    return cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

}

function calculateCartQuantity() {

    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

}

function openCart() {

    cartDrawer?.classList.add("active");
    cartOverlay?.classList.add("active");

    document.body.classList.add("cart-open");

}

function closeCart() {

    cartDrawer?.classList.remove("active");
    cartOverlay?.classList.remove("active");

    document.body.classList.remove("cart-open");

}

select("#cartButton")?.addEventListener("click", openCart);

select("#closeCart")?.addEventListener("click", closeCart);

cartOverlay?.addEventListener("click", closeCart);


function addToCart(name, price, id) {

    price = Number(price);

    if (!name || !Number.isFinite(price) || price <= 0) {
        showToast("This food item has invalid information.", "error");
        return;
    }

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {

        cart.push({
            id,
            name,
            price,
            quantity: 1
        });

    }

    saveCart();
    renderCart();

    showToast(`${name} added to your cart!`);

}

foodGrid?.addEventListener("click", event => {

    const button = event.target.closest(".add-cart-btn");

    if (!button) return;

    const name = button.dataset.name;
    const price = button.dataset.price;

    const id = button.dataset.id ||
        `original-${name}`;

    addToCart(name, price, id);

});


/* =========================================================
   12. CART DISPLAY
========================================================= */

function renderCart() {

    if (!cartItemsContainer) return;

    const cartCount = select("#cartCount");
    const cartSubtotal = select("#cartSubtotal");

    if (cartCount) {
        cartCount.textContent = calculateCartQuantity();
    }

    if (cartSubtotal) {
        cartSubtotal.textContent =
            money.format(calculateCartTotal());
    }

    if (!cart.length) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">

                <i class="fas fa-shopping-basket"></i>

                <h3>Your cart is empty</h3>

                <p>Discover something delicious from our menu.</p>

                <a href="#menu" class="primary-btn">
                    Explore Menu
                </a>

            </div>
        `;

        return;

    }

    cartItemsContainer.innerHTML = cart.map(item => `

        <div class="cart-item" data-id="${escapeHTML(item.id)}">

            <div class="cart-item-details">

                <h3>${escapeHTML(item.name)}</h3>

                <p>${money.format(item.price)} each</p>

                <strong>
                    ${money.format(item.price * item.quantity)}
                </strong>

            </div>

            <div class="cart-item-actions">

                <button
                    class="quantity-btn decrease-quantity"
                    data-id="${escapeHTML(item.id)}"
                    aria-label="Decrease quantity">

                    <i class="fas fa-minus"></i>

                </button>

                <span>${item.quantity}</span>

                <button
                    class="quantity-btn increase-quantity"
                    data-id="${escapeHTML(item.id)}"
                    aria-label="Increase quantity">

                    <i class="fas fa-plus"></i>

                </button>

                <button
                    class="remove-cart-item"
                    data-id="${escapeHTML(item.id)}"
                    aria-label="Remove item">

                    <i class="fas fa-trash"></i>

                </button>

            </div>

        </div>

    `).join("");

}

cartItemsContainer?.addEventListener("click", event => {

    const increase = event.target.closest(".increase-quantity");
    const decrease = event.target.closest(".decrease-quantity");
    const remove = event.target.closest(".remove-cart-item");

    const button = increase || decrease || remove;

    if (!button) return;

    const item = cart.find(
        product => product.id === button.dataset.id
    );

    if (!item) return;

    if (increase) {
        item.quantity += 1;
    }

    if (decrease) {
        item.quantity -= 1;
    }

    if (remove || item.quantity <= 0) {
        cart = cart.filter(
            product => product.id !== button.dataset.id
        );
    }

    saveCart();
    renderCart();

});

renderCart();


/* =========================================================
   13. CHECKOUT MODAL
========================================================= */

const checkoutModal = select("#checkoutModal");

function openCheckout() {

    if (!cart.length) {
        showToast("Your cart is empty. Add food first.", "error");
        return;
    }

    closeCart();

    checkoutModal?.classList.add("active");

    document.body.classList.add("modal-open");

}

function closeCheckout() {

    checkoutModal?.classList.remove("active");

    document.body.classList.remove("modal-open");

}

select("#checkoutButton")?.addEventListener("click", openCheckout);

select("#closeCheckout")?.addEventListener("click", closeCheckout);

checkoutModal?.addEventListener("click", event => {

    if (event.target === checkoutModal) {
        closeCheckout();
    }

});


/* =========================================================
   14. CHECKOUT VALIDATION
========================================================= */

select("#checkoutForm")?.addEventListener("submit", event => {

    event.preventDefault();

    if (!cart.length) {
        showToast("Your cart is empty.", "error");
        return;
    }

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const orderReference =
        "SAV-" + Date.now().toString().slice(-8);

    const orderSummary = {
        reference: orderReference,
        items: cart.map(item => ({ ...item })),
        total: calculateCartTotal(),
        customer: form.customerName.value,
        country: form.customerCountry.value,
        paymentMethod: form.paymentMethod.value,
        createdAt: new Date().toISOString()
    };

    console.log("DEMO CHECKOUT:", orderSummary);

    showToast(
        `Demo checkout prepared. Reference: ${orderReference}`
    );

    console.info(
        "No real order or payment has been submitted. Backend integration is required."
    );

    closeCheckout();

});


/* =========================================================
   15. CATERING FORM
========================================================= */

select("#cateringForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const cateringRequest = {
        name: form.querySelector("#cateringName").value,
        email: form.querySelector("#cateringEmail").value,
        event: form.querySelector("#eventType").value,
        guests: form.querySelector("#eventGuests").value,
        date: form.querySelector("#eventDate").value,
        location: form.querySelector("#eventLocation").value,
        details: form.querySelector("#eventDetails").value
    };

    console.log("DEMO CATERING REQUEST:", cateringRequest);

    showToast(
        "Catering request validated! Backend submission will be enabled later."
    );

    form.reset();

});


/* =========================================================
   16. TABLE RESERVATIONS
========================================================= */

select("#reservationForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const reservation = {
        name: form.querySelector("#reserveName").value,
        email: form.querySelector("#reserveEmail").value,
        date: form.querySelector("#reserveDate").value,
        time: form.querySelector("#reserveTime").value,
        guests: form.querySelector("#reserveGuests").value
    };

    console.log("DEMO RESERVATION:", reservation);

    showToast(
        "Reservation details validated! Booking service is coming soon."
    );

    form.reset();

});


/* =========================================================
   17. CONTACT FORM
========================================================= */

select("#contactForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const contactMessage = {
        name: form.querySelector("#contactName").value,
        email: form.querySelector("#contactEmail").value,
        subject: form.querySelector("#contactSubject").value,
        message: form.querySelector("#contactMessage").value
    };

    console.log("DEMO CONTACT MESSAGE:", contactMessage);

    showToast(
        "Your message is ready. Connect a backend to send it."
    );

    form.reset();

});


/* =========================================================
   18. NEWSLETTER SUBSCRIPTION
========================================================= */

select("#newsletterForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const email = select("#newsletterEmail")?.value.trim();

    if (!email) return;

    console.log("DEMO NEWSLETTER SUBSCRIPTION:", email);

    showToast(
        "Thank you for your interest in SAVORIA!"
    );

    form.reset();

});


/* =========================================================
   19. ACCOUNT BUTTON
========================================================= */

select(".account-btn")?.addEventListener("click", () => {

    showToast(
        "Customer accounts will be introduced during backend development."
    );

});


/* =========================================================
   20. DATE VALIDATION
========================================================= */

function setMinimumDates() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const minimumDate = `${year}-${month}-${day}`;

    [
        "#eventDate",
        "#reserveDate"
    ].forEach(selector => {

        const input = select(selector);

        if (input) {
            input.min = minimumDate;
        }

    });

}

setMinimumDates();


/* =========================================================
   21. BACK TO TOP BUTTON
========================================================= */

const backToTop = select("#backToTop");

window.addEventListener("scroll", () => {

    if (!backToTop) return;

    backToTop.classList.toggle(
        "show",
        window.scrollY > 450
    );

});

backToTop?.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================================================
   22. FOOTER YEAR
========================================================= */

const currentYear = select("#currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   23. KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCart();
        closeCheckout();

        navbar?.classList.remove("active");

    }

});


/* =========================================================
   24. INITIALIZE SAVORIA
========================================================= */

function initializeSavoria() {

    renderCart();
    applyFoodFilters();

    console.log(`
    =============================================

       SAVORIA RESTAURANT PLATFORM

       Every Bite. A Beautiful Experience.

       JavaScript initialized successfully.

       Modules:
       ✓ Hero slideshow
       ✓ Navigation
       ✓ Food categories
       ✓ Food search
       ✓ Product loading
       ✓ Favorites
       ✓ Shopping cart
       ✓ Quantity management
       ✓ Checkout validation
       ✓ Catering forms
       ✓ Table reservations
       ✓ Contact form
       ✓ Newsletter
       ✓ Notifications

       NOTE:
       This is a front-end demonstration.
       Backend and payment services are not
       connected yet.

    =============================================
    `);

}

initializeSavoria();


/* =========================================================
   END OF SAVORIA JAVASCRIPT
========================================================= */
