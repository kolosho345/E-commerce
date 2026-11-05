// PRODUCT DATABASE
const products = [

    {
        id: 1,
        name: "A5 Lecture Notebook",
        category: "Study",
        price: 180,
        emoji: "📓",
        description: "A durable notebook for class notes and revision."
    },

    {
        id: 2,
        name: "Pen Set (5 pieces)",
        category: "Study",
        price: 120,
        emoji: "🖊️",
        description: "Smooth-writing pens for everyday coursework."
    },

    {
        id: 3,
        name: "Scientific Calculator",
        category: "Study",
        price: 850,
        emoji: "🧮",
        description: "A practical calculator for mathematics and science."
    },

    {
        id: 4,
        name: "USB Flash Drive 32GB",
        category: "Tech",
        price: 650,
        emoji: "💾",
        description: "Portable storage for assignments and files."
    },

    {
        id: 5,
        name: "Wired Earphones",
        category: "Tech",
        price: 450,
        emoji: "🎧",
        description: "Listen to lectures and study materials."
    },

    {
        id: 6,
        name: "Phone Charging Cable",
        category: "Tech",
        price: 300,
        emoji: "🔌",
        description: "A useful spare cable."
    },

    {
        id: 7,
        name: "Reusable Water Bottle",
        category: "Daily",
        price: 500,
        emoji: "🚰",
        description: "Stay hydrated during long campus days."
    },

    {
        id: 8,
        name: "Backpack",
        category: "Daily",
        price: 1450,
        emoji: "🎒",
        description: "Carry books and essentials comfortably."
    }

];


// SHOPPING CART
let cart = JSON.parse(
    localStorage.getItem("campusCart") || "[]"
);



const grid = document.getElementById("product-grid");

const cartPanel = document.getElementById("cart-panel");

const overlay = document.getElementById("overlay");



const money = amount =>
    "KSh " + amount.toLocaleString("en-KE");



function renderProducts() {

    const query = document
        .getElementById("search")
        .value
        .trim()
        .toLowerCase();

    const category = document
        .getElementById("category-filter")
        .value;


    const filtered = products.filter(product =>

        (category === "All" || product.category === category) &&

        (
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        )

    );


    grid.innerHTML = filtered.map(product => `

        <article class="product-card">

            <div class="product-visual">
                ${product.emoji}
            </div>

            <div class="product-info">

                <span class="category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <span class="price">
                        ${money(product.price)}
                    </span>

                    <button
                        class="add-btn"
                        data-add="${product.id}"
                    >
                        + Add to cart
                    </button>

                </div>

            </div>

        </article>

    `).join("");

}



function addToCart(id) {

    const item = cart.find(product => product.id === id);

    if (item) {

        item.qty++;

    } else {

        cart.push({
            id: id,
            qty: 1
        });

    }

    saveCart();

    showToast("Product added to cart!");

}



function saveCart() {

    localStorage.setItem(
        "campusCart",
        JSON.stringify(cart)
    );

    renderCart();

}



function changeQty(id, delta) {

    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {

        cart = cart.filter(product => product.id !== id);

    }

    saveCart();

}



function cartTotal() {

    return cart.reduce((total, item) => {

        const product = products.find(
            product => product.id === item.id
        );

        return total + product.price * item.qty;

    }, 0);

}



function renderCart() {

    document.getElementById("cart-count").textContent =

        cart.reduce((sum, item) => sum + item.qty, 0);


    const target = document.getElementById("cart-items");


    if (cart.length === 0) {

        target.innerHTML = `
            <div class="cart-empty">
                🛒
                <p>Your cart is empty.</p>
            </div>
        `;

    } else {

        target.innerHTML = cart.map(item => {

            const product = products.find(
                p => p.id === item.id
            );

            return `

                <div class="cart-item">

                    <div class="cart-emoji">
                        ${product.emoji}
                    </div>

                    <div>

                        <h4>${product.name}</h4>

                        <small>
                            ${money(product.price)} each
                        </small>

                        <div class="qty-controls">

                            <button
                                data-qty="${product.id}"
                                data-delta="-1"
                            >−</button>

                            <span>${item.qty}</span>

                            <button
                                data-qty="${product.id}"
                                data-delta="1"
                            >+</button>

                        </div>

                    </div>

                    <button
                        class="remove-btn"
                        data-remove="${product.id}"
                    >
                        Remove
                    </button>

                </div>

            `;

        }).join("");

    }


    document.getElementById("cart-total").textContent =
        money(cartTotal());

    document.getElementById("checkout-total").textContent =
        money(cartTotal());

}



function openCart() {

    cartPanel.classList.add("open");

    overlay.classList.add("show");

}



function closeCart() {

    cartPanel.classList.remove("open");

    overlay.classList.remove("show");

}



function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 1900);

}



grid.addEventListener("click", event => {

    const button = event.target.closest("[data-add]");

    if (button) {

        addToCart(Number(button.dataset.add));

    }

});



document.getElementById("search")
    .addEventListener("input", renderProducts);



document.getElementById("category-filter")
    .addEventListener("change", renderProducts);



document.getElementById("cart-items")
    .addEventListener("click", event => {

        const qty = event.target.closest("[data-qty]");

        const remove = event.target.closest("[data-remove]");


        if (qty) {

            changeQty(
                Number(qty.dataset.qty),
                Number(qty.dataset.delta)
            );

        }


        if (remove) {

            cart = cart.filter(
                item => item.id !== Number(remove.dataset.remove)
            );

            saveCart();

        }

    });



document.getElementById("open-cart")
    .addEventListener("click", openCart);

document.getElementById("close-cart")
    .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);



document.getElementById("checkout-btn")
    .addEventListener("click", () => {

        if (cart.length === 0) return;

        closeCart();

        document.getElementById("checkout-modal")
            .classList.add("show");

    });



document.getElementById("close-checkout")
    .addEventListener("click", () => {

        document.getElementById("checkout-modal")
            .classList.remove("show");

    });



document.getElementById("checkout-form")
    .addEventListener("submit", event => {

        event.preventDefault();

        if (cart.length === 0) return;


        const form = new FormData(event.target);

        const orderId = "CC" + Date.now().toString().slice(-7);


        const order = {

            orderId: orderId,

            name: form.get("name"),

            phone: form.get("phone"),

            method: form.get("method"),

            notes: form.get("notes"),

            items: [...cart],

            total: cartTotal(),

            createdAt: new Date().toISOString()

        };


        
        const orders = JSON.parse(
            localStorage.getItem("campusOrders") || "[]"
        );

        orders.push(order);

        localStorage.setItem(
            "campusOrders",
            JSON.stringify(orders)
        );


       
        document.getElementById("checkout-modal")
            .classList.remove("show");


        document.getElementById("success-message").textContent =

            `Thank you ${order.name}. Your order has been received.`;


        document.getElementById("order-number").textContent =

            "Order reference: " + orderId;


        document.getElementById("success-modal")
            .classList.add("show");


        cart = [];

        saveCart();

        event.target.reset();

    });



document.getElementById("finish-order")
    .addEventListener("click", () => {

        document.getElementById("success-modal")
            .classList.remove("show");

    });



document.getElementById("year").textContent =
    new Date().getFullYear();



renderProducts();

renderCart();