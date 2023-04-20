// importar productos de productos.js
import { productos } from "./productos.js";
// obtengo elementos DOM
const contenedorProductos = document.getElementById("contenedorProductos");
const btnCategorias = document.querySelectorAll(".btn-categoria");
const tituloPrincipal = document.getElementById("titulo-principal");
let btnAgregar = document.querySelectorAll(".producto-agregar");
let numerito=document.getElementById("numerito")
let productosCarrito;

// actualizo el numero del carrito de compras por si hay productos en el LS
const productosCarritoLS = localStorage.getItem("productos-carrito")
if (productosCarritoLS){
  productosCarrito = JSON.parse(productosCarritoLS);
  actualizarNumero()
}else{
  productosCarrito=[];
}


function cargarProductos(productosFiltro) {
  contenedorProductos.innerHTML = "";
  productosFiltro.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
    <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
    <div class="producto-detalles">
        <h3 class="producto-titulo">${producto.titulo}</h3>
        <p class="producto-precio">$ ${producto.precio}</p>
        <button class="producto-agregar" id=${producto.id}>Agregar</button>
    </div>
</div>
    `;
    contenedorProductos.append(div);
  });
  actualizarBtn();
}
cargarProductos(productos);

btnCategorias.forEach((boton) => {
  boton.addEventListener("click", (event) => {
    btnCategorias.forEach((boton) => boton.classList.remove("active"));

    event.currentTarget.classList.add("active");
    //filtro para traer productos de cada categoria

    if (event.currentTarget.id != "todos") {
      const productoCategoria = productos.find(
        (producto) => producto.categoria.id === event.currentTarget.id
      );
      tituloPrincipal.innerText = productoCategoria.categoria.nombre;

      const productosBtn = productos.filter(
        (producto) => producto.categoria.id === event.currentTarget.id
      );
      cargarProductos(productosBtn);
    } else {
      tituloPrincipal.innerText = "Todos los productos";
      cargarProductos(productos);
    }
  });
});
//actualizar botones cuando se carguen los productos nuevos con su respectivo id del producto
function actualizarBtn() {
  btnAgregar = document.querySelectorAll(".producto-agregar");

  btnAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarCarrito);
  });
}

//agrego al carrito los productos verifico si hay para sumarle la cantidad, sino agrego y asigno cantidad=1
function agregarCarrito (event){
  //Toast de producto agregado
  Toastify({
    text:  "Producto Agregado al carrito",
    className: "info",
    style: {
      background: "linear-gradient(to right, #42e710, #298d36)",
    }
  }).showToast();
  const idBtn = event.currentTarget.id
  const productoAgregado = productos.find(producto => producto.id === idBtn)
  if(productosCarrito.some(producto => producto.id === idBtn)){
    const indice=productosCarrito.findIndex(producto => producto.id === idBtn)
    productosCarrito[indice].cantidad++
  }else{
    productoAgregado.cantidad=1;
    productosCarrito.push(productoAgregado);
  }
  actualizarNumero()
  //cargo al LS para visualizarlo en el carro de compras
  localStorage.setItem("productos-carrito",JSON.stringify(productosCarrito))
}
// actualiza el numero del carro de compras
function actualizarNumero(){
  let nuevoNumero = productosCarrito.reduce((acumulador,producto) => acumulador + producto.cantidad,0);
  numerito.innerText = nuevoNumero
}