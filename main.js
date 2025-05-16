document.addEventListener('DOMContentLoaded', function() {
  // Productos por categoría (3 por categoría, imágenes de internet DIFERENTES)
  const allProducts = [
    // Blusas
    { id: 1, name: 'Blusa Seda Elegante', price: 180, category: 'Blusas', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Blusa Blanca Clásica', price: 150, category: 'Blusas', image: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Blusa Floral Pastel', price: 170, category: 'Blusas', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
    // Tops
    { id: 4, name: 'Top Negro Minimal', price: 120, category: 'Tops', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'Top Blanco Sport', price: 110, category: 'Tops', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'Top Estampado', price: 130, category: 'Tops', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    // Vestidos
    { id: 7, name: 'Vestido Rojo Fiesta', price: 250, category: 'Vestidos', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80' },
    { id: 8, name: 'Vestido Azul Verano', price: 230, category: 'Vestidos', image: 'https://images.unsplash.com/photo-1469398715555-76331a6c7c9b?auto=format&fit=crop&w=400&q=80' },
    { id: 9, name: 'Vestido Blanco Elegante', price: 260, category: 'Vestidos', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80' },
    // Pantalones
    { id: 10, name: 'Pantalón Jeans Mom', price: 180, category: 'Pantalones', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
    { id: 11, name: 'Pantalón Blanco', price: 170, category: 'Pantalones', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80' },
    { id: 12, name: 'Pantalón Negro Formal', price: 190, category: 'Pantalones', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' }
  ];

  let cart = [];
  let cartTotal = 0;
  let filteredCategory = null;

  // Animación de scroll con clase visible
  const animateElements = document.querySelectorAll('.animate');
  const animateOnScroll = () => {
    animateElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementPosition < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  // Header scroll effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Botón volver arriba
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Aviso de cookies
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieAccepted')) {
      cookieBanner.style.display = 'flex';
    }
    cookieAccept.addEventListener('click', () => {
      cookieBanner.classList.add('hide');
      localStorage.setItem('cookieAccepted', 'true');
      setTimeout(() => cookieBanner.style.display = 'none', 500);
    });
  }

  // Renderizar productos
  function renderProducts(category = null) {
    const productsGrid = document.getElementById('products-grid');
    const noProductsMessage = document.getElementById('no-products-message');
    const productsTitle = document.getElementById('products-title');
    productsGrid.innerHTML = '';
    let productsToShow = [];
    if (category) {
      productsToShow = allProducts.filter(p => p.category === category);
      productsTitle.style.display = 'block';
      productsTitle.textContent = `Productos de ${category}`;
    } else {
      productsToShow = allProducts;
      productsTitle.style.display = 'block';
      productsTitle.textContent = `Todos los productos`;
    }
    if (productsToShow.length === 0) {
      noProductsMessage.style.display = 'block';
      return;
    } else {
      noProductsMessage.style.display = 'none';
    }
    productsToShow.forEach((product, idx) => {
      const card = document.createElement('div');
      card.className = 'product-card animate';
      card.style.animationDelay = (0.1 + idx * 0.04) + 's';
      card.innerHTML = `
        <div class="product-img-container">
          <img src="${product.image}" alt="${product.name}" class="product-img" />
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.name}</h3>
          <div class="product-price">
            <span class="price">Bs. ${product.price}</span>
            <button class="add-to-cart"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      `;
      // Evento para agregar al carrito
      card.querySelector('.add-to-cart').addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(product);
      });
      productsGrid.appendChild(card);
    });
    animateOnScroll();
  }

  // Filtro por categoría
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      filteredCategory = category;
      renderProducts(category);
      document.getElementById('category-filter-message').textContent = `Mostrando productos de la categoría "${category}"`;
      document.getElementById('category-filter-message').style.display = 'block';
      document.getElementById('category-filter-reset').style.display = 'block';
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });

  window.resetCategoryFilter = function() {
    filteredCategory = null;
    renderProducts();
    document.getElementById('category-filter-message').style.display = 'none';
    document.getElementById('category-filter-reset').style.display = 'none';
  };

  // Carrito
  const cartIcon = document.getElementById('cart-icon');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCart = document.getElementById('close-cart');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const modalClose = document.getElementById('modal-close');
  const checkoutForm = document.getElementById('checkout-form');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.querySelector('.cart-count');

  function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    openCart();
    cartIcon.classList.add('pulse');
    setTimeout(() => cartIcon.classList.remove('pulse'), 1000);
  }

  function updateCart() {
    cartItemsContainer.innerHTML = '';
    cartTotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-light);">
          <i class="fas fa-shopping-bag" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Tu carrito está vacío</p>
        </div>
      `;
    } else {
      cart.forEach(item => {
        cartTotal += item.price * item.quantity;
        totalItems += item.quantity;
        cartItemsContainer.innerHTML += `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">Bs. ${item.price} x ${item.quantity}</div>
              <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
          </div>
        `;
      });
    }
    cartTotalEl.textContent = `Bs. ${cartTotal}`;
    cartCountEl.textContent = totalItems;
  }

  function openCart() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
  }
  function closeCartSidebar() {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
  }
  cartIcon.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartSidebar);
  cartOverlay.addEventListener('click', closeCartSidebar);

  // Eliminar del carrito
  window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
  };

  // Checkout
  checkoutBtn.addEventListener('click', function() {
    checkoutModal.classList.add('active');
  });
  modalClose.addEventListener('click', function() {
    checkoutModal.classList.remove('active');
  });

  // Ubicación en el checkout
  const getLocationBtn = document.getElementById('get-location');
  const locationInput = document.getElementById('location');
  if (getLocationBtn && locationInput) {
    getLocationBtn.addEventListener('click', function() {
      if (navigator.geolocation) {
        getLocationBtn.textContent = "Obteniendo ubicación...";
        navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mapsUrl = `https://maps.google.com/?q=${lat},${lon}`;
          locationInput.value = mapsUrl;
          getLocationBtn.textContent = "Ubicación obtenida";
        }, function() {
          locationInput.value = "";
          getLocationBtn.textContent = "No se pudo obtener ubicación";
          alert("No se pudo obtener tu ubicación. Activa el GPS e inténtalo de nuevo.");
        });
      } else {
        alert("Tu navegador no soporta geolocalización.");
      }
    });
  }

  // --- NUEVO: Manejo de método de pago y QR ---
  const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
  const qrSection = document.getElementById('qr-section');
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'qr') {
        qrSection.style.display = 'flex';
      } else {
        qrSection.style.display = 'none';
      }
    });
  });
  // Mostrar/ocultar QR al cargar
  if(document.querySelector('input[name="payment-method"]:checked').value === 'qr'){
    qrSection.style.display = 'flex';
  } else {
    qrSection.style.display = 'none';
  }

  // Checkout WhatsApp con método de pago y mensaje QR
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    let message = `🛍️ *Pedido Charlotte MODA*%0A`;
    message += `------------------------%0A`;
    cart.forEach(item => {
      message += `• ${item.name} (${item.category}) x${item.quantity} - Bs. ${item.price * item.quantity}%0A`;
    });
    message += `------------------------%0A`;
    message += `*Total:* Bs. ${cartTotal}%0A`;
    message += `*Nombre:* ${name}%0A*Teléfono:* ${phone}%0A`;
    if (location) message += `*Ubicación:* ${location}%0A`;
    message += `*Método de pago:* ${paymentMethod === 'qr' ? 'QR' : 'Efectivo'}%0A`;
    if (paymentMethod === 'qr') {
      message += `Por favor, adjunta tu comprobante de pago QR en este chat.%0A`;
    }
    message += `%0A¡Gracias por tu compra!`;

    window.open(`https://wa.me/59175053524?text=${encodeURIComponent(message)}`, '_blank');
    document.getElementById('checkout-success').style.display = 'block';
    setTimeout(() => {
      document.getElementById('checkout-success').style.display = 'none';
      checkoutModal.classList.remove('active');
      cart = [];
      updateCart();
      closeCartSidebar();
    }, 2000);
  });

  // Inicializar
  renderProducts();
  updateCart();
});