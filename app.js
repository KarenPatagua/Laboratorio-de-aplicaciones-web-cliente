const API_URL = 'https://fakestoreapi.com/products';
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

window.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  actualizarContador();
  renderizarCarrito();

  document.getElementById('btn-carrito').addEventListener('click', toggleSidebar);
  document.getElementById('vaciarCarrito').addEventListener('click', vaciarCarrito);
  document.getElementById('finalizarCompra').addEventListener('click', finalizarCompra);
  document.getElementById('buscador').addEventListener('input', filtrarProductos);
});

async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    let productos = await res.json();
    productos = aplicarTraducciones(productos);


    productos.forEach(producto => {
      const titulo = producto.title.trim().toLowerCase();

      if (titulo === "fjallraven - foldsack no. 1 backpack, fits 15 laptops") {
        producto.imagenesExtra = [
          "https://m.media-amazon.com/images/I/714f12ktGFL._SY695_.jpg",
          "https://m.media-amazon.com/images/I/61XDjE9Y97L._SX695_.jpg"
        ];
      }
      
      if (titulo === "mens casual premium slim fit t-shirts") {
        producto.imagenesExtra = [
          "https://m.media-amazon.com/images/I/71-3HjGNDUL._AC_SY879_.jpg",
          "https://m.media-amazon.com/images/I/71gW8WQ8noL._AC_SY879_.jpg"
        ];
      }
    });

    window.todosLosProductos = productos;
    mostrarProductos(productos);
  } catch (e) {
    console.error('Error al cargar productos', e);
  }
}

function mostrarProductos(lista) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  lista.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card h-100 product-card">
        <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.title}</h5>
          <p class="card-text text-truncate">${producto.description}</p>
          <button class="btn btn-dark text-white mt-auto" onclick="verDetalle(${producto.id})">Ver más</button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function verDetalle(id) {
  const producto = window.todosLosProductos.find(p => p.id === id);
  if (!producto) return;

  document.getElementById('tituloModal').textContent = producto.title;
  document.getElementById('tituloModalDetalle').textContent = '';
  document.getElementById('descripcionModal').textContent = producto.description;
  document.getElementById('precioModal').textContent = `$${producto.price}`;

  const swiperWrapper = document.querySelector('.swiper-wrapper');
  swiperWrapper.innerHTML = '';

  const imagenes = producto.imagenesExtra && producto.imagenesExtra.length > 0 ? producto.imagenesExtra : [producto.image];

  imagenes.forEach(img => {
    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <img src="${img}" style="width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px;">
      </div>
    `;
  });

  new Swiper('.mySwiper', {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  });

  const btnAgregar = document.getElementById('agregarAlCarrito');
  btnAgregar.classList.remove("d-none");
  btnAgregar.onclick = () => agregarAlCarrito(producto);

  const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
  modal.show();
}

function agregarAlCarrito(producto) {
  const index = carrito.findIndex(p => p.id === producto.id);
  if (index >= 0) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
  bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContador() {
  document.getElementById('contador').textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

function renderizarCarrito() {
  const contenedor = document.getElementById('carrito-lista');
  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío</p>';
    return;
  }

  carrito.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center border-bottom py-3 gap-3';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="60" height="60" style="object-fit: contain; border-radius: 8px;" class="bg-light p-1">
      <div class="flex-grow-1">
        <strong class="d-block">${item.title}</strong>
        <span>$${(item.price * item.cantidad).toFixed(2)}</span>
      </div>
      <div class="d-flex align-items-center gap-1">
        <button class="btn btn-sm btn-outline-secondary" ${item.cantidad === 1 ? 'disabled' : ''} onclick="modificarCantidad(${i}, -1)">-</button>
        <span>${item.cantidad}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="modificarCantidad(${i}, 1)">+</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarItem(${i})">✕</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function modificarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'El carrito ya está vacío',
      confirmButtonColor: '#000'
    });
    return;
  }

  Swal.fire({
    title: '¿Estás segura?',
    text: 'Esta acción vaciará todo tu carrito.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#000',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      guardarCarrito();
      renderizarCarrito();
      actualizarContador();

      Swal.fire({
        icon: 'success',
        title: 'Carrito vaciado',
        text: 'Has eliminado todos los productos del carrito.',
        confirmButtonColor: '#000'
      });
    }
  });
}

function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Carrito vacío',
      text: 'Agrega productos antes de finalizar tu compra.',
      confirmButtonColor: '#000'
    });
    return;
  }

  carrito = [];
  guardarCarrito();
  renderizarCarrito();
  actualizarContador();

  Swal.fire({
    icon: 'success',
    title: '¡Compra finalizada!',
    text: 'Gracias por tu compra. Tu pedido será procesado.',
    confirmButtonColor: '#000'
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}

function filtrarProductos(e) {
  const texto = e.target.value.toLowerCase();
  const filtrados = window.todosLosProductos.filter(p => p.title.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
}

window.verDetalleFunction = verDetalle;

function aplicarTraducciones(productos) {
  return productos.map(producto => {
    const traduccion = traduccionesEs[producto.id];
    if (traduccion) {
      producto.title = traduccion.title;
      producto.description = traduccion.description;
    }
    return producto;
  });
}




