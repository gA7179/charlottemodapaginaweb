document.addEventListener('DOMContentLoaded', () => {
  // Datos de productos
  const allProducts = [
    { id:1, name:'Blusa Elegante', price:50, category:'Blusas', image:'img/blusa1.jpeg' },
    { id:2, name:'Blusa Clásica', price:50, category:'Blusas', image:'img/blusa2.jpeg' },
    { id:3, name:'Blusa Moderna', price:50, category:'Blusas', image:'img/blusa3.jpeg' },
    { id:4, name:'Top Básico', price:50, category:'Tops', image:'img/top1.jpeg' },
    { id:5, name:'Top Deportivo', price:50, category:'Tops', image:'img/top2.jpeg' },
    { id:6, name:'Top Estilo', price:50, category:'Tops', image:'img/top3.jpeg' },
    { id:7, name:'Vestido Casual', price:50, category:'Vestidos', image:'img/vestido1.jpeg' },
    { id:8, name:'Vestido Elegante', price:50, category:'Vestidos', image:'img/vestido2.jpeg' },
    { id:9, name:'Vestido Fiesta', price:50, category:'Vestidos', image:'img/vestido3.jpeg' },
    { id:10,name:'Pantalón Clásico',price:50,category:'Pantalones',image:'img/pantalon1.jpeg'},
    { id:11,name:'Pantalón Moderno',price:50,category:'Pantalones',image:'img/pantalon2.jpeg'},
    { id:12,name:'Pantalón Elegante',price:50,category:'Pantalones',image:'img/pantalon3.jpeg'}
  ];
  
  // Estado de la aplicación
  let cart = [];
  let cartTotal = 0;
  
  // Elementos del DOM
  const productsGrid = document.getElementById('products-grid');
  const productsTitle = document.getElementById('products-title');
  const noProducts = document.getElementById('no-products');
  const catCards = document.querySelectorAll('.cat-card');
  const cartBtn = document.getElementById('cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotalEl = document.getElementById('cart-total');
  const cartClose = document.getElementById('cart-close');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const modalClose = document.getElementById('modal-close');
  const checkoutForm = document.getElementById('checkout-form');
  const successMsg = document.getElementById('success-msg');
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notification-text');
  
  // Función para renderizar productos
  function renderProducts(cat = null) {
    productsGrid.innerHTML = '';
    let list = cat ? allProducts.filter(p => p.category === cat) : allProducts;
    
    productsTitle.textContent = cat ? `${cat}` : 'Nuestros Productos';
    noProducts.style.display = list.length ? 'none' : 'block';
    
    list.forEach(p => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.dataset.aos = 'fade-up';
      
      productCard.innerHTML = `
        <img src="${p.image}" alt="${p.name}" onerror="this.src='img/favicon.jpeg'">
        <div class="product-info">
          <h4>${p.name}</h4>
          <p class="price">Bs. ${p.price}</p>
          <button class="add-btn">Añadir al carrito</button>
        </div>
      `;
      
      productCard.querySelector('.add-btn').addEventListener('click', () => {
        addToCart(p);
        // Mostrar el carrito flotante al agregar producto
        if (!cartSidebar.classList.contains('active')) {
          toggleCart();
          // Ocultar después de 3 segundos
          setTimeout(() => {
            if (cartSidebar.classList.contains('active')) {
              toggleCart();
            }
          }, 3000);
        }
      });
      
      productsGrid.appendChild(productCard);
    });
    
    // Actualizar visibilidad del botón del carrito
    cartBtn.classList.toggle('hidden', cart.length === 0);
  }
  
  // Función para mostrar notificación
  function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // Función para añadir al carrito
  function addToCart(prod) {
    const exists = cart.find(i => i.id === prod.id);
    
    if (exists) {
      exists.quantity++;
    } else {
      cart.push({ ...prod, quantity: 1 });
    }
    
    updateCart();
    showNotification(`${prod.name} añadido al carrito`);
    
    // Mostrar el botón del carrito si estaba oculto
    if (cartBtn.classList.contains('hidden')) {
      cartBtn.classList.remove('hidden');
    }
  }
  
  // Función para actualizar el carrito
  function updateCart() {
    cartItems.innerHTML = '';
    cartTotal = 0;
    let totalCount = 0;
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<li class="empty">Tu carrito está vacío</li>';
    } else {
      cart.forEach(item => {
        cartTotal += item.price * item.quantity;
        totalCount += item.quantity;
        
        const cartItem = document.createElement('li');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" onerror="this.src='img/favicon.jpeg'">
          <div class="item-info">
            <h5>${item.name}</h5>
            <p>Bs. ${item.price} x ${item.quantity}</p>
          </div>
          <button onclick="removeFromCart(${item.id})">✕</button>
        `;
        
        cartItems.appendChild(cartItem);
      });
    }
    
    cartCount.textContent = totalCount;
    cartTotalEl.textContent = `Bs. ${cartTotal}`;
  }
  
  // Función para eliminar del carrito (global para poder llamarla desde HTML)
  window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    
    // Ocultar el botón del carrito si no hay productos
    if (cart.length === 0) {
      cartBtn.classList.add('hidden');
    }
  };
  
  // Función para alternar el carrito
  window.toggleCart = () => {
    cartOverlay.classList.toggle('active');
    cartSidebar.classList.toggle('active');
  };
  
  // Event listeners para categorías
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      renderProducts(card.dataset.cat);
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Event listeners para el carrito
  cartBtn.addEventListener('click', toggleCart);
  cartClose.addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);
  
  // Event listener para el botón de compra
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showNotification('Tu carrito está vacío');
      return;
    }
    checkoutModal.classList.add('active');
  });
  
  // Event listener para cerrar el modal
  modalClose.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
  });
  
  // Event listener para obtener ubicación
  document.getElementById('get-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
      showNotification('Geolocalización no soportada en tu navegador');
      return;
    }
    
    showNotification('Obteniendo tu ubicación...');
    
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        document.getElementById('location').value = 
          `https://www.google.com/maps?q=${latitude},${longitude}`;
        showNotification('Ubicación obtenida con éxito');
      },
      () => {
        showNotification('No se pudo obtener la ubicación');
      }
    );
  });
  
  // Event listeners para métodos de pago
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('qr-section').style.display = 
        radio.value === 'qr' ? 'flex' : 'none';
    });
  });
  
  // Event listener para el formulario de compra
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!name || !phone) {
      showNotification('Por favor completa todos los campos requeridos');
      return;
    }
    
    // Construir mensaje para WhatsApp
    let message = `🛍️ *Pedido Charlotte MODA*%0A%0A`;
    message += `*Detalle del pedido:*%0A`;
    
    cart.forEach(item => {
      message += `- ${item.name} x${item.quantity} = Bs. ${item.price * item.quantity}%0A`;
    });
    
    message += `%0A*Total:* Bs. ${cartTotal}%0A`;
    message += `*Nombre:* ${name}%0A`;
    message += `*Teléfono:* ${phone}%0A`;
    
    const location = document.getElementById('location').value;
    if (location) {
      message += `*Ubicación:* ${location}%0A`;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    message += `*Pago:* ${paymentMethod === 'qr' ? 'Transferencia QR' : 'Efectivo'}%0A`;
    
    if (paymentMethod === 'qr') {
      message += `(Adjuntaré comprobante de pago)%0A`;
    }
    
    message += `%0A¡Gracias por tu compra! 💖`;
    
    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/59175053524?text=${message}`, '_blank');
    
    // Mostrar mensaje de éxito
    successMsg.style.display = 'flex';
    
    // Resetear después de 3 segundos
    setTimeout(() => {
      successMsg.style.display = 'none';
      checkoutModal.classList.remove('active');
      cart = [];
      updateCart();
      renderProducts();
      checkoutForm.reset();
    }, 3000);
  });
  
  // Inicialización
  renderProducts();
  updateCart();
  
  // Prevenir desplazamiento horizontal
  document.body.addEventListener('wheel', (e) => {
    if (e.deltaY === 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Deshabilitar zoom con touch en dispositivos móviles
  document.addEventListener('touchmove', (e) => {
    if (e.scale !== 1) {
      e.preventDefault();
    }
  }, { passive: false });
});