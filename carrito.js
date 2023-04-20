// traigo del LS los productos que se agregaron de el index
let productosCarrito = JSON.parse(localStorage.getItem("productos-carrito"));
// obtengo elementos del DOM
const carritoVacio = document.getElementById("carritoVacio");
const contenedorProductos = document.getElementById("carritoProductos");
const contenedorAcciones = document.getElementById("carritoAcciones");
const contenedorComprado = document.getElementById("carritoComprado");
const btnVaciar = document.getElementById("carritoVaciar");
const total = document.getElementById("total");
const btnComprar = document.getElementById("comprarAhora");
const graciasVuelvaPronto=document.getElementById("carritoCompradoImg")
let btnEliminar;
// funciones para mostrar diferentes elementos del DOM
function carritoVacioMostrar() {
  carritoVacio.classList.remove("disabled");
  contenedorProductos.classList.add("disabled");
  contenedorAcciones.classList.add("disabled");
  contenedorComprado.classList.add("disabled");
}
function carritoLlenoMostrar() {
  carritoVacio.classList.add("disabled");
  contenedorProductos.classList.remove("disabled");
  contenedorAcciones.classList.remove("disabled");
  contenedorComprado.classList.add("disabled");
}

function carritoCompradoMostrar() {
  carritoVacio.classList.add("disabled");
  contenedorProductos.classList.add("disabled");
  contenedorAcciones.classList.add("disabled");
  contenedorComprado.classList.remove("disabled");
  graciasVuelvaPronto.classList.remove("disabled");
}

function cargarProductos() {
  //verifico que el arreglo si contenga al menos un producto o muestro el carrito vacio
  if (productosCarrito && productosCarrito.length > 0) {
    carritoLlenoMostrar();

    contenedorProductos.innerHTML = "";

    productosCarrito.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
<img class="carrito-producto-imagen" src="${producto.imagen}" alt="${
        producto.titulo
      }">
<div class="carrito-producto-titulo">
    <small>Título</small>
    <h3>${producto.titulo}</h3>
</div>
<div class="carrito-producto-cantidad">
    <small>${producto.cantidad}</small>
</div>
<div class="carrito-producto-precio">
    <small>Precio</small>
    <p>$ ${producto.precio}</p>
</div>
<div class="carrito-producto-subtotal">
    <small>Subtotal</small>
    <p>$ ${producto.precio * producto.cantidad}</p>
</div>
<button class="carrito-producto-eliminar" id="${
        producto.id
      }"><i class="bi bi-trash-fill"></i></button>
    `;
      contenedorProductos.append(div);
    });
    actualizarPrecio();
  } else {
    carritoVacioMostrar();
  }
  actualizarBtnEliminar();
}
// asigno el boton eliminar con su respectivo id para poder eliminar el producto
function actualizarBtnEliminar() {
  btnEliminar = document.querySelectorAll(".carrito-producto-eliminar");

  btnEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}
// eliminar el producto del carrito y LS
function eliminarDelCarrito(event) {
  Toastify({
    text: "Producto Eliminado",
    className: "info",
    style: {
      background: "linear-gradient(to right, #d44215, #772c15)",
    },
  }).showToast();
  const idBoton = event.currentTarget.id;
  const index = productosCarrito.findIndex(
    (producto) => producto.id === idBoton
  );
  productosCarrito.splice(index, 1);
  cargarProductos();
  localStorage.setItem("productos-carrito", JSON.stringify(productosCarrito));
}
// sweet alert de si esta seguro de vacear carrito
btnVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
  Swal.fire({
    title: "Vas a vaciar el carrito",
    text: "¿Estás seguro?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      productosCarrito.length = 0;
      localStorage.setItem(
        "productos-carrito",
        JSON.stringify(productosCarrito)
      );
      cargarProductos();
    }
  });
}

btnComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Realizar compra de los productos",
      text: "Nuestros productos son de los mas altos estandares",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Comprar ahora",
      cancelButtonText: "Ya vuelvo",
      reverseButtons: true,
    })
    //resultado SI, vacea [] carrito y LS de productos 
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          "Compra realizada",
          "Gracias por confiar en nosotros",
          "success"
        );
        productosCarrito.length = 0;
        localStorage.setItem(
          "productos-carrito",
          JSON.stringify(productosCarrito)
        );
        carritoCompradoMostrar();
      } else if (
        // caso contrario no me borra nada de la pagina del carrito
        result.dismiss === Swal.DismissReason.cancel
      ) {
        // alerta por si le damos en ya vuelvo y la compra no se realiza
        swalWithBootstrapButtons.fire(
          "La compra no se ha hecho",
          "Presiona Comprar ahora para tener tus productos",
          "warning"
        );
      }
    });
}

function actualizarPrecio() {
  const precioCalculado = productosCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  total.innerText = `$ ${precioCalculado}`;
}

function main() {
  cargarProductos();
}

main();
