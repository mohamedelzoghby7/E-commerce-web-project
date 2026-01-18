document.addEventListener("DOMContentLoaded", () => {

  // ======== FAVORITES =========
  const heartButtons = document.querySelectorAll(".heart-btn");

  heartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      if (!card) return;

      const name = btn.dataset.name || card.querySelector(".fw-bold")?.textContent;
      const price = btn.dataset.price || card.querySelector(".text-muted")?.textContent;
      const img = btn.dataset.img || card.querySelector("img")?.src;

      if (!name || !price || !img) return;

      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (!favorites.some(item => item.name === name)) {
        favorites.push({ name, price, img });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        btn.classList.add("text-danger");
        alert("Added to favorites ❤️");
      } else {
        alert("Already in favorites!");
      }
    });
  });

  // ======== DISPLAY FAVORITES PAGE =========
  const favoritesContainer = document.getElementById("favorites-list");
  if (favoritesContainer) {
    function renderFavorites() {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favoritesContainer.innerHTML = "";

      if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="text-center">No favorite products yet.</p>';
        return;
      }

      favorites.forEach((product, index) => {
        const div = document.createElement("div");
        div.classList.add("card", "mb-3", "shadow-sm");
        div.innerHTML = `
          <div class="row g-0 align-items-center">
            <div class="col-md-4">
              <img src="${product.img}" class="img-fluid rounded-start" alt="${product.name}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.price}</p>
                <button class="btn btn-danger remove-fav-btn" data-index="${index}">Remove</button>
              </div>
            </div>
          </div>
        `;
        favoritesContainer.appendChild(div);
      });
    }

    // حذف باستخدام delegation
    favoritesContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-fav-btn")) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const idx = e.target.dataset.index;
        favorites.splice(idx, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
      }
    });

    renderFavorites();
  }

  // ======== CART =========
  const cartContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  function updateCartDisplay() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalElement.textContent = "";
      if (checkoutBtn) checkoutBtn.style.display = "none";
      return;
    }

    cart.forEach((item, idx) => {
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.classList.add("col-md-4");
      div.innerHTML = `
        <div class="card shadow-sm mb-3">
          <img src="${item.image}" class="card-img-top" alt="${item.name}">
          <div class="card-body text-center">
            <h5>${item.name}</h5>
            <p>Price: $${item.price}</p>
            <p>Qty: ${item.quantity}</p>
            <button class="btn btn-danger remove-cart-btn" data-index="${idx}">Remove</button>
          </div>
        </div>
      `;
      cartContainer.appendChild(div);
    });

    totalElement.textContent = `Total: $${total}`;
    if (checkoutBtn) checkoutBtn.style.display = "block";
  }

  // remove from cart using delegation
  if (cartContainer) {
    cartContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-cart-btn")) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const idx = e.target.dataset.index;
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
      }
    });
  }

  // checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      alert("Checkout successful! 🛒");
      window.location.href = "index.html";
    });
  }

  updateCartDisplay();

  // ======== ADD TO CART =========
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      if (!card) return;

      const name = btn.dataset.name || card.querySelector(".fw-bold")?.textContent;
      const price = parseFloat(btn.dataset.price || card.querySelector(".text-muted")?.textContent.replace(/[^0-9.]/g, ""));
      const image = btn.dataset.img || card.querySelector("img")?.src;

      if (!name || !price || !image) return;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.name === name);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ name, price, image, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
      alert("Product added to cart 🛒");
    });
  });

});
