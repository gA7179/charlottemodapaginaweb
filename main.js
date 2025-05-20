document.addEventListener('DOMContentLoaded', function() {
  // Asegúrate que los nombres de imagen coincidan exactamente con los archivos en /img
  const allProducts = [
    // Blusas
    { id: 1, name: 'Blusa Elegante', price: 50, category: 'Blusas', image: 'img/blusa1.jpeg' },
    { id: 2, name: 'Blusa Clásica', price: 50, category: 'Blusas', image: 'img/blusa2.jpeg' },
    { id: 3, name: 'Blusa Moderna', price: 50, category: 'Blusas', image: 'img/blusa3.jpeg' },
    // Tops
    { id: 4, name: 'Top Básico', price: 50, category: 'Tops', image: 'img/top1.jpeg' },
    { id: 5, name: 'Top Deportivo', price: 50, category: 'Tops', image: 'img/top2.jpeg' },
    { id: 6, name: 'Top Estilo', price: 50, category: 'Tops', image: 'img/top3.jpeg' },
    // Vestidos
    { id: 7, name: 'Vestido Casual', price: 50, category: 'Vestidos', image: 'img/vestido1.jpeg' },
    { id: 8, name: 'Vestido Elegante', price: 50, category: 'Vestidos', image: 'img/vestido2.jpeg' },
    { id: 9, name: 'Vestido Fiesta', price: 50, category: 'Vestidos', image: 'img/vestido3.jpeg' },
    // Pantalones
    { id: 10, name: 'Pantalón Clásico', price: 50, category: 'Pantalones', image: 'img/pantalon1.jpeg' },
    { id: 11, name: 'Pantalón Moderno', price: 50, category: 'Pantalones', image: 'img/pantalon2.jpeg' },
    { id: 12, name: 'Pantalón Elegante', price: 50, category: 'Pantalones', image: 'img/pantalon3.jpeg' }
  ];

  let cart = [];
  let cartTotal = 0;
  let filteredCategory = null;

  // Animación de scroll (CORREGIDO)
  const animateOnScroll = () => {
    const animateElements = document.querySelectorAll('.animate');
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
    if (window.scrollY > 50) {
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
      cookieBanner.style.display = 'none';
      localStorage.setItem('cookieAccepted', 'true');
    });
  }

  // Renderizar productos
  function renderProducts(category = null) {
    const productsGrid = document.getElementById('products-grid');
    const noProductsMessage = document.getElementById('no-products-message');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    let productsToShow = [];

    if (category) {
      // Normaliza para evitar problemas de mayúsculas/minúsculas/espacios
      productsToShow = allProducts.filter(
        p => p.category.trim().toLowerCase() === category.trim().toLowerCase()
      );
    } else {
      productsToShow = allProducts;
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
      card.style.animationDelay = `${idx * 0.1}s`;

      card.innerHTML = `
        <div class="product-img-container">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.onerror=null;this.src='img/favicon.ico'" />
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

      card.querySelector('.add-to-cart').addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(product);
      });

      productsGrid.appendChild(card);
    });

    animateOnScroll(); // <-- Esto asegura que las animaciones se apliquen a los nuevos productos
  }

  // Filtro por categoría
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      filteredCategory = category;
      renderProducts(category);

      document.getElementById('category-filter-message').textContent = `Mostrando productos de ${category}`;
      document.getElementById('category-filter-message').style.display = 'block';
      document.getElementById('category-filter-reset').style.display = 'block';

      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Resetear filtro
  window.resetCategoryFilter = function() {
    filteredCategory = null;
    renderProducts();
    document.getElementById('category-filter-message').style.display = 'none';
    document.getElementById('category-filter-reset').style.display = 'none';
  };

  // Carrito
  const cartIcon = document.getElementById('cart-icon');
  const cartFloatBtn = document.getElementById('cart-float-btn');
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

  // Agregar al carrito
  function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    // Feedback visual
    const floatingAdd = document.createElement('div');
    floatingAdd.className = 'floating-add';
    floatingAdd.innerHTML = `<i class="fas fa-check"></i> ${product.name} agregada`;
    document.body.appendChild(floatingAdd);

    setTimeout(() => {
      floatingAdd.style.opacity = '1';
      floatingAdd.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
      floatingAdd.style.opacity = '0';
      floatingAdd.style.transform = 'translateY(-20px)';
      setTimeout(() => floatingAdd.remove(), 300);
    }, 2000);

    updateCart();
    cartIcon.classList.add('pulse');
    setTimeout(() => cartIcon.classList.remove('pulse'), 1000);
  }

  // Actualizar carrito (sincroniza contador flotante)
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
      // Ya no actualices shipping-cost aquí, solo cart-total
      document.getElementById('cart-total').textContent = 'Bs. 0';
      window.costoEnvioCalculado = 0;
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
      document.getElementById('cart-total').textContent = `Bs. ${cartTotal + (window.costoEnvioCalculado || 0)}`;
    }

    cartCountEl.textContent = totalItems;
  }

  // Abrir/cerrar carrito
  function openCart() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeCartSidebar() {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  if (cartIcon) cartIcon.addEventListener('click', openCart);
  if (cartFloatBtn) cartFloatBtn.addEventListener('click', openCart);
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
    document.body.classList.add('no-scroll');
  });

  modalClose.addEventListener('click', function() {
    checkoutModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });

  // Punto base de origen (Mercadito Las Américas, Santa Cruz, Bolivia)
  const origen = {
    lat: -17.85507,
    lng: -63.19901
  };
  const costoPorKm = 2;
  window.costoEnvioCalculado = 0;

  function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Ubicación en el checkout
  const getLocationBtn = document.getElementById('get-location');
  const locationInput = document.getElementById('location');

  if (getLocationBtn && locationInput) {
    getLocationBtn.addEventListener('click', function() {
      if (navigator.geolocation) {
        getLocationBtn.textContent = "Obteniendo ubicación...";
        getLocationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
          function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            locationInput.value = `https://www.google.com/maps?q=${lat},${lon}`;
            getLocationBtn.textContent = "Ubicación obtenida";
            getLocationBtn.disabled = false;

            // Calcular distancia y costo de envío
            const distancia = calcularDistanciaKm(origen.lat, origen.lng, lat, lon);
            const costoEnvio = Math.round(distancia * costoPorKm);
            window.costoEnvioCalculado = costoEnvio;
            document.getElementById('shipping-cost').textContent = `Bs. ${costoEnvio}`;
            document.getElementById('cart-total').textContent = `Bs. ${cartTotal + costoEnvio}`;
          },
          function(error) {
            locationInput.value = "";
            getLocationBtn.textContent = "Error al obtener ubicación";
            getLocationBtn.disabled = false;
            alert("No se pudo obtener tu ubicación. Por favor ingrésala manualmente.");
            window.costoEnvioCalculado = 0;
            document.getElementById('shipping-cost').textContent = 'Bs. 0';
            document.getElementById('cart-total').textContent = `Bs. ${cartTotal}`;
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        alert("Tu navegador no soporta geolocalización.");
      }
    });
  }

  // Manejo de método de pago
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

  // Checkout WhatsApp
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    if (!name || !phone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Fecha y hora actual
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const fecha = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const hora = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Link de la página
    const pagina = "https://ga7179.github.io/charlottemodapaginaweb/";

    // Detalle de productos
    let productosMsg = "";
    cart.forEach(item => {
      productosMsg += `x${item.quantity} ${item.name}   Bs ${item.price * item.quantity}.00 BOB\n`;
    });

    // Costos
    const totalParcial = cartTotal;
    const costoEnvio = window.costoEnvioCalculado || 0;
    const totalFinal = cartTotal + costoEnvio;
    const metodoPago = paymentMethod === 'qr' ? 'QR' : 'Efectivo';

    // Mensaje final adaptado (nuevo formato)
    let message = `¡Hola! Vengo de: ${pagina}\n\n`;
    message += `🗓️ Fecha: ${fecha}\n`;
    message += `🕐 Hora: ${hora}\n\n`;
    message += `👤 Información del cliente\n`;
    message += `Nombre: ${name}\n`;
    message += `Teléfono: ${phone}\n\n`;
    message += `🏠 El pedido se llevará a domicilio:\n`;
    message += `📍 Dirección: ${location ? location : ''}\n\n`;
    message += `📝 Pedido:\n`;
    message += `${productosMsg}\n`;
    message += `💲 Costos:\n`;
    message += `Total parcial: Bs ${totalParcial}.00 BOB\n`;
    message += `Costo de envío: Bs ${costoEnvio}.00 BOB\n`;
    message += `Método de Pago: ${metodoPago}\n\n`;
    message += `Costo total: Bs ${totalFinal}.00 BOB`;

    // Codificar el mensaje para WhatsApp
    let mensajeCodificado = encodeURIComponent(message);

    // Armar link de WhatsApp
    let numero = "59175053524"; // Número del dueño de la tienda
    let url = `https://wa.me/${numero}?text=${mensajeCodificado}`;

    // Abrir WhatsApp con el mensaje
    window.open(url);

    // Mostrar mensaje de éxito
    document.getElementById('checkout-success').style.display = 'flex';

    // Resetear después de 3 segundos
    setTimeout(() => {
      document.getElementById('checkout-success').style.display = 'none';
      checkoutModal.classList.remove('active');
      cart = [];
      updateCart();
      closeCartSidebar();
      checkoutForm.reset();
      qrSection.style.display = 'none';
      document.body.classList.remove('no-scroll');
      window.costoEnvioCalculado = 0;
      document.getElementById('shipping-cost').textContent = 'Bs. 0';
      document.getElementById('cart-total').textContent = 'Bs. 0';
    }, 3000);
  });

  // Inicializar
  renderProducts();
  updateCart();
});