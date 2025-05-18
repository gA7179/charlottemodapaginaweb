document.addEventListener('DOMContentLoaded', () => {
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
  let cart = [], cartTotal = 0;

  const productsGrid   = document.getElementById('products-grid');
  const productsTitle  = document.getElementById('products-title');
  const noProducts     = document.getElementById('no-products');
  const catCards       = document.querySelectorAll('.cat-card');
  const cartBtn        = document.getElementById('cart-btn');
  const cartOverlay    = document.getElementById('cart-overlay');
  const cartSidebar    = document.getElementById('cart-sidebar');
  const cartItems      = document.getElementById('cart-items');
  const cartCount      = document.getElementById('cart-count');
  const cartTotalEl    = document.getElementById('cart-total');
  const cartClose      = document.getElementById('cart-close');
  const checkoutBtn    = document.getElementById('checkout-btn');
  const checkoutModal  = document.getElementById('checkout-modal');
  const modalClose     = document.getElementById('modal-close');
  const checkoutForm   = document.getElementById('checkout-form');
  const successMsg     = document.getElementById('success-msg');

  function renderProducts(cat = null) {
    productsGrid.innerHTML = '';
    let list = cat ? allProducts.filter(p=>p.category===cat) : allProducts;
    productsTitle.textContent = cat ? `Productos de ${cat}` : 'Todos los productos';
    noProducts.style.display = list.length ? 'none' : 'block';
    list.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}" onerror="this.src='img/favicon.jpeg'">
        <div class="product-info">
          <h4>${p.name}</h4>
          <p class="price">Bs. ${p.price}</p>
          <button class="add-btn">Comprar</button>
        </div>`;
      div.querySelector('.add-btn').onclick = () => addToCart(p);
      productsGrid.appendChild(div);
    });
    // mostrar carrito icono si hay
    cartBtn.classList.toggle('hidden', cart.length === 0);
  }

  catCards.forEach(card => {
    card.onclick = () => {
      renderProducts(card.dataset.cat);
      document.getElementById('products').scrollIntoView({ behavior:'smooth' });
    };
  });

  function addToCart(prod) {
    const exists = cart.find(i=>i.id===prod.id);
    exists ? exists.quantity++ : cart.push({ ...prod, quantity:1 });
    updateCart();
    renderProducts(); // para mostrar o ocultar carrito icono
  }

  function updateCart() {
    cartItems.innerHTML = '';
    cartTotal = 0; let totalCount = 0;
    if (!cart.length) {
      cartItems.innerHTML = '<li class="empty">Tu carrito está vacío.</li>';
    } else {
      cart.forEach(i => {
        cartTotal += i.price * i.quantity;
        totalCount += i.quantity;
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
          <img src="${i.image}" alt="${i.name}">
          <div class="item-info">
            <h5>${i.name}</h5>
            <p>Bs. ${i.price} x ${i.quantity}</p>
          </div>
          <button onclick="removeFromCart(${i.id})">✕</button>`;
        cartItems.appendChild(li);
      });
    }
    cartCount.textContent = totalCount;
    cartTotalEl.textContent = `Bs. ${cartTotal}`;
  }

  window.removeFromCart = id => { cart = cart.filter(i=>i.id!==id); updateCart(); renderProducts(); };

  cartBtn.onclick = () => { cartOverlay.classList.add('active'); cartSidebar.classList.add('active'); };
  cartClose.onclick = () => { cartOverlay.classList.remove('active'); cartSidebar.classList.remove('active'); };

  checkoutBtn.onclick = () => {
    if (!cart.length) return alert('Tu carrito está vacío');
    checkoutModal.classList.add('active');
  };
  modalClose.onclick = () => checkoutModal.classList.remove('active');

  document.getElementById('get-location').onclick = () => {
    if (!navigator.geolocation) return alert('Geolocalización no soportada');
    navigator.geolocation.getCurrentPosition(pos => {
      document.getElementById('location').value =
        `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
    }, ()=> alert('Error al obtener ubicación'));
  };

  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.onchange = () =>
      document.getElementById('qr-section').style.display = radio.value==='qr'?'flex':'none';
  });

  checkoutForm.onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone= document.getElementById('phone').value.trim();
    if(!name||!phone) return alert('Completa los campos');
    let msg = `🛍️ Pedido Charlotte MODA%0A%0A`;
    cart.forEach(i=> msg+=`- ${i.name} x${i.quantity} = Bs. ${i.price*i.quantity}%0A`);
    msg += `%0ATotal: Bs. ${cartTotal}%0ANombre: ${name}%0ATeléfono: ${phone}%0A`;
    const loc = document.getElementById('location').value;
    if(loc) msg+=`Ubicación: ${loc}%0A`;
    const pay = document.querySelector('input[name="payment"]:checked').value;
    msg+=`Pago: ${pay==='qr'?'QR':'Efectivo'}%0A`;
    if(pay==='qr') msg+=`Adjunta comprobante QR.%0A`;
    msg+=`¡Gracias por tu compra!`;
    window.open(`https://wa.me/59175053524?text=${encodeURIComponent(msg)}`, '_blank');
    successMsg.style.display='block';
    setTimeout(()=>{
      successMsg.style.display='none';
      checkoutModal.classList.remove('active');
      cart=[]; updateCart(); renderProducts();
    },3000);
  };

  setTimeout(()=>document.getElementById('cookie-banner').classList.add('show'),2000);
  document.getElementById('cookie-accept').onclick = () =>
    document.getElementById('cookie-banner').classList.remove('show');

  const backTop = document.getElementById('back-to-top');
  window.onscroll = ()=> backTop.classList.toggle('show', window.scrollY>300);
  backTop.onclick = ()=> window.scrollTo({top:0,behavior:'smooth'});

  // Inicial
  renderProducts();
  updateCart();
});