let carrito = [];
let indice = 0;

function contadorCarrito() {
    const cantidadCarrito = document.getElementById("cantidadCarrito");
    cantidadCarrito.innerText = carrito.reduce((cantidadTotal, producto) => cantidadTotal + producto.unidades, 0);
    cantidadCarrito.style.display = "flex";
}

function recuperarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        contadorCarrito();
    } else {
        carrito = [];
    }
}

function agregarAlCarrito(productos, productoId) {
    const productoElegido = productos.find(producto => producto.id === productoId);
    const productoEnCarrito = carrito.find(item => item.id === productoElegido.id);

    if (productoElegido.stock > 0) {
        if (productoEnCarrito) {
            productoEnCarrito.unidades++;
            productoEnCarrito.subtotal = productoEnCarrito.unidades * productoEnCarrito.precio;
        } else {
            carrito.push({
                id: productoElegido.id,
                nombre: productoElegido.nombre,
                precio: productoElegido.precio,
                unidades: 1,
                subtotal: productoElegido.precio,
                rutaImagen: productoElegido.rutaImagen
            });
        }
        productoElegido.stock--;
        lanzarTostada('Producto agregado con éxito!', 2000);
        contadorCarrito();
        localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
        Swal.fire(
            'No hay más stock',
            'No hay más stock del producto',
            'warning'
        );
    }
}

function renderizarProductos(productos, nuevosItems) {
    const contenedor = nuevosItems ? document.getElementById("contenedorProductos") : document.getElementById("tienda-cont-productos");
    contenedor.innerHTML = '';

    const limite = nuevosItems ? Math.min(indice + 3, productos.length) : productos.length;

    for (let i = indice; i < limite; i++) {
        const producto = productos[i];
        const tarjeta = document.createElement("div");
        if (nuevosItems){
            tarjeta.classList.add("tarjeta-productos");

        tarjeta.innerHTML = `
          <img class=imgProducto src=../img/${producto.rutaImagen} />
          <div class="tarjeta-producto-cuerpo">
            <h4 class="tarjeta-producto-titulo">${producto.nombre}</h4>
            <p class="tarjeta-produto-precio">$${producto.precio || "-"}</p>
            <button class="btn-agregar-al-carrito" id=${producto.id}>
              AGREGAR AL CARRITO
            </button>
          </div>`;

        } else{
            tarjeta.classList.add("tarjeta-productos-tienda");

        tarjeta.innerHTML = `
          <img class=img-producto-tienda src=../img/${producto.rutaImagen} />
          <div class="tarjeta-producto-cuerpo">
            <h4 class="tarjeta-tienda-titulo">${producto.nombre}</h4>
            <p class="tarjeta-tienda-precio">$${producto.precio || "-"}</p>
            <button class="btn-agregar-al-carrito-tienda" id=${producto.id}>
              AGREGAR AL CARRITO
            </button>
          </div>`;
        }
        

        contenedor.appendChild(tarjeta);

        const botonAgregarAlCarrito = document.getElementById(producto.id);
        botonAgregarAlCarrito.addEventListener("click", () => agregarAlCarrito(productos, producto.id));
    }
}

function carrousel(productos) {
    const btnSiguiente = document.getElementById("btn-siguiente");
    btnSiguiente.addEventListener("click", () => avanzarCarrousel(productos));
    const btnAnterior = document.getElementById("btn-anterior");
    btnAnterior.addEventListener("click", () => retrocederCarrousel(productos));
}

function avanzarCarrousel(productos) {
    const productosPorPagina = 3;
    indice += productosPorPagina;
    if (indice >= productos.length) {
        indice = 0;
    }
    renderizarProductos(productos, true);
}

function retrocederCarrousel(productos) {
    const productosPorPagina = 3;
    indice -= productosPorPagina;
    if (indice < 0) {
        indice = Math.floor((productos.length - 1) / productosPorPagina) * productosPorPagina;
    }
    renderizarProductos(productos, true);
}

function finalizarCompra() {
    carrito = [];
    localStorage.removeItem("carrito");
    const contenedorCarrito = document.getElementById("modal-contenedor");
        const btnCerrarCarrito = document.getElementById("cerrarCarrito");
        const carritoContenedor = document.getElementById("carrito-contenedor-prod");
        contenedorCarrito.style.display = "none";
        btnCerrarCarrito.style.display = "none";
        carritoContenedor.innerHTML = '';
    contadorCarrito();
    Swal.fire(
        'Su compra se ha realizado con éxito',
        'Gracias por comprar en Ofira!',
        'success'
    );
}

function eliminarProducto(productos, productoId) {
    const productoElegido = productos.find(producto => producto.id === productoId);
    const productoEnCarrito = carrito.find(item => item.id === productoElegido.id);

    if (productoEnCarrito) {
        carrito.splice(carrito.indexOf(productoEnCarrito), 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));

        const contenedorCarrito = document.getElementById("modal-contenedor");
        const btnCerrarCarrito = document.getElementById("cerrarCarrito");
        const carritoContenedor = document.getElementById("carrito-contenedor-prod");
        contenedorCarrito.style.display = "none";
        btnCerrarCarrito.style.display = "none";
        carritoContenedor.innerHTML = '';
        contadorCarrito();
        Swal.fire(
            'Éxito!',
            'El producto se ha eliminado satisfactoriamente del carrito!',
            'success'
        );
    }
}

function renderizarCarrito(contenedor) {
    contenedor.innerHTML = '';
    carrito.forEach(producto => {
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.className = "modal-carrito-product";
        tarjetaProducto.innerHTML = `
          <img class=imgProducto src=../img/${producto.rutaImagen} />
          <h3>${producto.nombre}</h3>
          <p class="tarjeta-produto-precio">$${producto.subtotal || "-"}</p>
          <p class="tarjeta">Cantidad: ${producto.unidades}</p>`;

        const eliminarProd = document.createElement("span");
        eliminarProd.innerText = "❌";
        eliminarProd.className = "eliminar-producto";
        eliminarProd.id = producto.id;
        tarjetaProducto.appendChild(eliminarProd);
        eliminarProd.addEventListener("click", () => eliminarProducto(carrito, producto.id));

        contenedor.appendChild(tarjetaProducto);
    });

    if (carrito.length > 0) {
        const footerCarrito = document.createElement("div");
        footerCarrito.className = "modal-carrito-footer";
        contenedor.appendChild(footerCarrito);

        const total = carrito.reduce((precioTotal, producto) => precioTotal + producto.subtotal, 0);
        const totalVendido = document.createElement("div");
        totalVendido.className = "total-contenedor";
        totalVendido.innerHTML = `Total a pagar: $ ${total}`;
        footerCarrito.appendChild(totalVendido);

        const finalizarCompraBtn = document.createElement("button");
        finalizarCompraBtn.className = "btn-finalizar-compra";
        finalizarCompraBtn.id = "btn-finalizar";
        finalizarCompraBtn.innerText = "FINALIZAR COMPRA";
        finalizarCompraBtn.style.display = "block";
        footerCarrito.appendChild(finalizarCompraBtn);

        finalizarCompraBtn.addEventListener("click", finalizarCompra);
    } else {
        const totalVendido = document.createElement("div");
        totalVendido.className = "total-contenedor";
        totalVendido.innerHTML = "No hay productos en el carrito";
        contenedor.appendChild(totalVendido);
    }
}

function lanzarTostada(text, duration) {
    Toastify({
        text,
        duration
    }).showToast();
}

function traerProductos() {
    fetch("../js/info.json")
        .then(respuesta => respuesta.json())
        .then(productos => principal(productos));
}

function desplegarCarrito(contenedor) {
    const btnCerrarCarrito = document.getElementById("cerrarCarrito");
    const btnMostrarCarrito = document.getElementById("mostrarCarrito");
    const carritoContenedor = document.getElementById("carrito-contenedor-prod");

    btnCerrarCarrito.addEventListener("click", () => {
        contenedor.style.display = "none";
        btnCerrarCarrito.style.display = "none";
        carritoContenedor.innerHTML = '';
    });

    btnMostrarCarrito.addEventListener("click", () => {
        contenedor.style.display = "block";
        btnCerrarCarrito.style.display = "block";

        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-carrito-header";
        modalHeader.innerHTML = `
        <h4 class="modal-header-titulo">CARRITO DE COMPRAS</h4>`;
        carritoContenedor.appendChild(modalHeader);

        const carritoBody = document.createElement("div");
        carritoBody.className = "modal-carrito-body";
        carritoContenedor.appendChild(carritoBody);

        renderizarCarrito(carritoBody);
    });
}

function generarOpcionesCategoria(productos) {
    const categoriaFiltro = document.getElementById("categoria-filtro");
    const categorias = [...new Set(productos.map(producto => producto.categoria))];

    categorias.forEach(categoria => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<label><input type="checkbox" value="${categoria}"> ${categoria}</label>`;
        categoriaFiltro.appendChild(listItem);
    });
}

function filtrarCategorias(productos) {
    const aplicarFiltrosBtn = document.getElementById("aplicar-filtros");
    const limpiarFiltrosBtn = document.getElementById("limpiar-filtros");

    aplicarFiltrosBtn.addEventListener("click", () => {
        const categoriaSeleccionada = Array.from(document.querySelectorAll("#categoria-filtro input:checked")).map(
            checkbox => checkbox.value
        );
        const precioMin = document.getElementById("precio-min").value;
        const precioMax = document.getElementById("precio-max").value;

        const productosFiltrados = productos.filter(producto => {
            const categoriaCoincide = categoriaSeleccionada.length === 0 || categoriaSeleccionada.includes(producto.categoria);
            const precioCoincide = (!precioMin || producto.precio >= precioMin) && (!precioMax || producto.precio <= precioMax);
            return categoriaCoincide && precioCoincide;
        });

        const contProd = document.getElementById("tienda-cont-productos");
        renderizarProductos(productosFiltrados, false);
    });

    limpiarFiltrosBtn.addEventListener("click", () => {
        document.querySelectorAll("#categoria-filtro input:checked").forEach(checkbox => (checkbox.checked = false));
        document.getElementById("precio-min").value = "";
        document.getElementById("precio-max").value = "";
        const contProd = document.getElementById("tienda-cont-productos");
        renderizarProductos(productos, false);
    });
}

function buscar(productos, contenedor) {
    const buscador = document.getElementById("input-buscar");
    const botonBuscar = document.getElementById("btn-buscar");

    botonBuscar.addEventListener("click", () => {
        const textBuscar = buscador.value.trim().toLowerCase();
        if (textBuscar) {
            const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(textBuscar));
            if (productosFiltrados.length > 0) {
                renderizarProductos(productosFiltrados, false);
            } else {
                contenedor.innerHTML = '<h4>No se encontraron productos</h4>';
            }
        } else {
            renderizarProductos(productos, false);
        }
    });
}

function establecerCategoriasUnicasEnTarjetas(productos) {
    const categoriasUnicas = [...new Set(productos.map(producto => producto.categoria))];
    const tarjetasCategorias = document.querySelectorAll('.categorias-content-categoria-tarjeta-grande, .categorias-content-categoria-tarjeta-chica');
    
    tarjetasCategorias.forEach((tarjeta, index) => {
        const tituloCategoria = tarjeta.querySelector('.titulo-categoria');
        const btnVerMas = tarjeta.querySelector('.btn-ver-mas');
        if (index < categoriasUnicas.length) {
            tituloCategoria.textContent = categoriasUnicas[index];
            btnVerMas.textContent = `Ver Más de ${categoriasUnicas[index]}`;
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

function principal(productos) {
    const cantidadCarrito = document.getElementById("cantidadCarrito");
    const contenedorCarrito = document.getElementById("modal-contenedor");
    const contNewItems = document.getElementById("contenedorProductos");
    const tienda = document.getElementById("cont-tienda");

    if (contNewItems) {
        establecerCategoriasUnicasEnTarjetas(productos);
        renderizarProductos(productos, true);
        carrousel(productos);
        //avanzarCarrousel(productos);
        retrocederCarrousel(productos);
    }

    recuperarCarrito();
    desplegarCarrito(contenedorCarrito);

    if (tienda) {
        generarOpcionesCategoria(productos);
        filtrarCategorias(productos);
        const contProd = document.getElementById("tienda-cont-productos");
        renderizarProductos(productos, false);
        buscar(productos, contProd);
    }
}

// Inicialización
traerProductos();
