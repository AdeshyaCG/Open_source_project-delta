"use strict";

/* =====================================================
   CART DATA
===================================================== */

let cart = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Audio",
        price: 1999,
        quantity: 1,
        image: "🎧"
    },

    {
        id: 2,
        name: "Gaming Mouse",
        category: "Gaming",
        price: 999,
        quantity: 2,
        image: "🖱️"
    },

    {
        id: 3,
        name: "Mechanical Keyboard",
        category: "Accessories",
        price: 1499,
        quantity: 1,
        image: "⌨️"
    }
];


/* =====================================================
   SETTINGS
===================================================== */

const DELIVERY_CHARGE = 100;
const FREE_DELIVERY_LIMIT = 999;
const PROMO_CODE = "NOVA20";
const PROMO_PERCENT = 20;


/* =====================================================
   DOM ELEMENTS
===================================================== */

const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");

const cartCount = document.getElementById("cart-count");
const itemCount = document.getElementById("item-count");

const subtotalElement = document.getElementById("subtotal");
const discountElement = document.getElementById("discount");
const deliveryElement = document.getElementById("delivery");
const grandTotalElement = document.getElementById("grand-total");

const promoInput = document.getElementById("promo-code");
const promoButton = document.getElementById("apply-promo");

const checkoutButton = document.getElementById("checkout-btn");


/* =====================================================
   STATE
===================================================== */

let promoApplied = false;


/* =====================================================
   CURRENCY FORMATTER
===================================================== */

function formatPrice(amount) {

    return `₹${amount.toLocaleString("en-IN")}`;

}


/* =====================================================
   CALCULATE SUBTOTAL
===================================================== */

function calculateSubtotal() {

    return cart.reduce((total, item) => {

        return total + (item.price * item.quantity);

    }, 0);

}


/* =====================================================
   GET TOTAL QUANTITY
===================================================== */

function getTotalQuantity() {

    return cart.reduce((total, item) => {

        return total + item.quantity;

    }, 0);

}


/* =====================================================
   CALCULATE DISCOUNT
===================================================== */

function calculateDiscount(subtotal) {

    if (!promoApplied) {
        return 0;
    }

    return Math.round(subtotal * PROMO_PERCENT / 100);

}


/* =====================================================
   CALCULATE DELIVERY
===================================================== */

function calculateDelivery(subtotal) {

    if (subtotal === 0) {
        return 0;
    }

    if (subtotal >= FREE_DELIVERY_LIMIT) {
        return 0;
    }

    return DELIVERY_CHARGE;

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        emptyCart.classList.remove("hidden");

        updateSummary();

        return;

    }

    emptyCart.classList.add("hidden");


    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        const product = document.createElement("article");

        product.className = "cart-item";

        product.dataset.id = item.id;


        product.innerHTML = `

            <div class="product-image">
                ${item.image}
            </div>


            <div class="product-info">

                <h3>${item.name}</h3>

                <p>${item.category}</p>

                <span class="product-price">
                    ${formatPrice(item.price)}
                </span>

            </div>


            <div class="quantity">

                <button
                    class="decrease-btn"
                    aria-label="Decrease quantity">
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    class="increase-btn"
                    aria-label="Increase quantity">
                    +
                </button>

            </div>


            <div class="item-total">
                ${formatPrice(itemTotal)}
            </div>


            <button
                class="remove-btn"
                aria-label="Remove ${item.name}">
                ×
            </button>

        `;


        cartItems.appendChild(product);

    });


    updateSummary();

}


/* =====================================================
   UPDATE SUMMARY
===================================================== */

function updateSummary() {

    const subtotal = calculateSubtotal();

    const discount = calculateDiscount(subtotal);

    const delivery = calculateDelivery(subtotal);

    const grandTotal =
        subtotal - discount + delivery;


    const totalQuantity = getTotalQuantity();


    cartCount.textContent = totalQuantity;

    itemCount.textContent =
        `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`;


    subtotalElement.textContent =
        formatPrice(subtotal);


    discountElement.textContent =
        `-${formatPrice(discount)}`;


    if (delivery === 0 && subtotal > 0) {

        deliveryElement.textContent = "FREE";

        deliveryElement.style.color = "#10b981";

    } else {

        deliveryElement.textContent =
            formatPrice(delivery);

        deliveryElement.style.color = "";

    }


    grandTotalElement.textContent =
        formatPrice(grandTotal);

}


/* =====================================================
   INCREASE / DECREASE / REMOVE
===================================================== */

cartItems.addEventListener("click", event => {

    const itemElement =
        event.target.closest(".cart-item");


    if (!itemElement) {
        return;
    }


    const id =
        Number(itemElement.dataset.id);


    const item =
        cart.find(product => product.id === id);


    if (!item) {
        return;
    }


    /* Increase */

    if (event.target.classList.contains("increase-btn")) {

        item.quantity++;

        renderCart();

    }


    /* Decrease */

    if (event.target.classList.contains("decrease-btn")) {

        if (item.quantity > 1) {

            item.quantity--;

        } else {

            cart = cart.filter(
                product => product.id !== id
            );

        }

        renderCart();

    }


    /* Remove */

    if (event.target.classList.contains("remove-btn")) {

        cart = cart.filter(
            product => product.id !== id
        );

        renderCart();

    }

});


/* =====================================================
   PROMO CODE
===================================================== */

promoButton.addEventListener("click", () => {

    const code =
        promoInput.value.trim().toUpperCase();


    if (code === PROMO_CODE) {

        if (promoApplied) {

            alert("Promo code is already applied.");

            return;

        }


        promoApplied = true;

        promoInput.value = "";

        promoInput.placeholder = "NOVA20 applied ✓";

        promoInput.disabled = true;

        promoButton.textContent = "Applied";

        promoButton.disabled = true;

        updateSummary();

        return;

    }


    alert("Invalid promo code.");

});


/* =====================================================
   CHECKOUT
===================================================== */

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }


    const subtotal = calculateSubtotal();

    const discount = calculateDiscount(subtotal);

    const delivery = calculateDelivery(subtotal);

    const total =
        subtotal - discount + delivery;


    alert(
        `Order Summary\n\n` +

        `Items: ${getTotalQuantity()}\n` +

        `Subtotal: ${formatPrice(subtotal)}\n` +

        `Discount: -${formatPrice(discount)}\n` +

        `Delivery: ${delivery === 0
            ? "FREE"
            : formatPrice(delivery)
        }\n\n` +

        `Total: ${formatPrice(total)}\n\n` +

        `Thank you for shopping with NovaCart!`
    );

});


/* =====================================================
   INITIALIZE
===================================================== */

renderCart();



/* =====================================================
   AI SHOPPING ADVISOR
===================================================== */

const aiData = {

    "7": {
        prices: [5299, 5180, 5100, 4999, 4850, 4699, 4497],
        labels: ["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "Yesterday", "Today"]
    },

    "30": {
        prices: [
            5499, 5399, 5299, 5199, 5299,
            5199, 5099, 4999, 5099, 4999,
            4899, 4999, 4799, 4899, 4699,
            4799, 4599, 4699, 4599, 4499,
            4599, 4499, 4399, 4499, 4397,
            4499, 4399, 4497, 4497, 4497
        ],

        labels: [
            "30d", "29d", "28d", "27d", "26d",
            "25d", "24d", "23d", "22d", "21d",
            "20d", "19d", "18d", "17d", "16d",
            "15d", "14d", "13d", "12d", "11d",
            "10d", "9d", "8d", "7d", "6d",
            "5d", "4d", "3d", "2d", "Today"
        ]
    },

    "90": {
        prices: [
            5899, 5799, 5699, 5599, 5499,
            5399, 5299, 5199, 5299, 5099,
            4999, 5099, 4899, 4999, 4799,
            4699, 4799, 4599, 4699, 4499,
            4599, 4399, 4499, 4397
        ],

        labels: [
            "90d", "86d", "82d", "78d", "74d",
            "70d", "66d", "62d", "58d", "54d",
            "50d", "46d", "42d", "38d", "34d",
            "30d", "26d", "22d", "18d", "14d",
            "10d", "6d", "3d", "Today"
        ]
    }

};


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById("price-chart");

const ctx =
    canvas.getContext("2d");


/* =====================================================
   DRAW CHART
===================================================== */

function drawPriceChart(period = "30") {

    const data = aiData[period];

    const prices = data.prices;

    const labels = data.labels;


    const rect =
        canvas.getBoundingClientRect();


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;


    ctx.scale(dpr, dpr);


    const width = rect.width;
    const height = rect.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const padding = {
        top: 20,
        right: 15,
        bottom: 35,
        left: 50
    };


    const chartWidth =
        width -
        padding.left -
        padding.right;


    const chartHeight =
        height -
        padding.top -
        padding.bottom;


    const minPrice =
        Math.min(...prices) - 200;


    const maxPrice =
        Math.max(...prices) + 200;


    /* ================= GRID ================= */

    ctx.strokeStyle = "#edf0f5";

    ctx.lineWidth = 1;


    for (let i = 0; i <= 4; i++) {

        const y =
            padding.top +
            (chartHeight / 4) * i;


        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width - padding.right,
            y
        );

        ctx.stroke();


        const value =
            Math.round(
                maxPrice -
                ((maxPrice - minPrice) / 4) * i
            );


        ctx.fillStyle = "#9aa2b1";

        ctx.font = "10px Arial";

        ctx.textAlign = "right";

        ctx.fillText(
            `₹${value}`,
            padding.left - 8,
            y + 3
        );

    }


    /* ================= POINTS ================= */

    const points = prices.map(
        (price, index) => {

            const x =
                padding.left +
                (index / (prices.length - 1)) *
                chartWidth;


            const y =
                padding.top +
                ((maxPrice - price) /
                    (maxPrice - minPrice)) *
                chartHeight;


            return {
                x,
                y,
                price
            };

        }
    );


    /* ================= GRADIENT ================= */

    const gradient =
        ctx.createLinearGradient(
            0,
            padding.top,
            0,
            height
        );


    gradient.addColorStop(
        0,
        "rgba(99, 91, 255, 0.20)"
    );

    gradient.addColorStop(
        1,
        "rgba(99, 91, 255, 0)"
    );


    ctx.beginPath();

    ctx.moveTo(
        points[0].x,
        height - padding.bottom
    );


    points.forEach(point => {

        ctx.lineTo(
            point.x,
            point.y
        );

    });


    ctx.lineTo(
        points[points.length - 1].x,
        height - padding.bottom
    );


    ctx.closePath();

    ctx.fillStyle = gradient;

    ctx.fill();


    /* ================= LINE ================= */

    ctx.beginPath();

    points.forEach(
        (point, index) => {

            if (index === 0) {

                ctx.moveTo(
                    point.x,
                    point.y
                );

            } else {

                ctx.lineTo(
                    point.x,
                    point.y
                );

            }

        }
    );


    ctx.strokeStyle = "#635bff";

    ctx.lineWidth = 3;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.stroke();


    /* ================= CURRENT POINT ================= */

    const current =
        points[points.length - 1];


    ctx.beginPath();

    ctx.arc(
        current.x,
        current.y,
        6,
        0,
        Math.PI * 2
    );


    ctx.fillStyle = "#635bff";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        current.x,
        current.y,
        3,
        0,
        Math.PI * 2
    );


    ctx.fillStyle = "#ffffff";

    ctx.fill();


    /* ================= LABELS ================= */

    ctx.fillStyle = "#9aa2b1";

    ctx.font = "10px Arial";

    ctx.textAlign = "center";


    const labelStep =
        Math.ceil(labels.length / 6);


    labels.forEach((label, index) => {

        if (
            index % labelStep === 0 ||
            index === labels.length - 1
        ) {

            const x =
                padding.left +
                (index / (prices.length - 1)) *
                chartWidth;


            ctx.fillText(
                label,
                x,
                height - 12
            );

        }

    });

}


/* =====================================================
   AI ANALYSIS
===================================================== */

function analyzePurchaseTiming() {

    const currentPrice =
        aiData["30"].prices.at(-1);


    const averagePrice =
        aiData["30"].prices.reduce(
            (sum, price) => sum + price,
            0
        ) / aiData["30"].prices.length;


    const saving =
        Math.max(
            0,
            Math.round(
                averagePrice - currentPrice
            )
        );


    const percentageBelowAverage =
        Math.round(
            ((averagePrice - currentPrice) /
                averagePrice) * 100
        );


    let score;


    if (percentageBelowAverage >= 10) {

        score = 91;

    } else if (percentageBelowAverage >= 5) {

        score = 78;

    } else {

        score = 62;

    }


    document.getElementById(
        "ai-current-price"
    ).textContent =
        formatPrice(currentPrice);


    document.getElementById(
        "ai-average-price"
    ).textContent =
        formatPrice(Math.round(averagePrice));


    document.getElementById(
        "ai-saving"
    ).textContent =
        formatPrice(saving);


    document.getElementById(
        "buy-score"
    ).textContent =
        score;


    if (score >= 85) {

        document.getElementById(
            "ai-verdict-title"
        ).textContent =
            "Good Time to Buy";


        document.getElementById(
            "ai-verdict-text"
        ).textContent =
            `The current price is approximately ${percentageBelowAverage}% below the recent average. AI predicts that waiting may not provide significant additional savings.`;


        document.getElementById(
            "best-time-title"
        ).textContent =
            "Best time to purchase: Now";


        document.getElementById(
            "best-time-description"
        ).textContent =
            `Current prices are around ${percentageBelowAverage}% lower than the recent average. Buying now could help you avoid a potential price increase.`;

    } else {

        document.getElementById(
            "ai-verdict-title"
        ).textContent =
            "Consider Waiting";


        document.getElementById(
            "ai-verdict-text"
        ).textContent =
            "The current price is relatively close to the recent average. Waiting could potentially give you a better price.";


        document.getElementById(
            "best-time-title"
        ).textContent =
            "Best time to purchase: Wait";


        document.getElementById(
            "best-time-description"
        ).textContent =
            "The current price is not significantly below the recent average. Monitoring the price for a few more days may be useful.";

    }

}


/* =====================================================
   PERIOD SELECTOR
===================================================== */

document
    .getElementById("chart-period")
    .addEventListener("change", event => {

        drawPriceChart(
            event.target.value
        );

    });


/* =====================================================
   RESPONSIVE CHART
===================================================== */

window.addEventListener(
    "resize",
    () => {

        drawPriceChart(
            document.getElementById(
                "chart-period"
            ).value
        );

    }
);


/* =====================================================
   START AI
===================================================== */

analyzePurchaseTiming();

drawPriceChart("30");