// Cada producto que vende el super es creado con esta clase
class Producto {
  constructor(sku, nombre, precio, categoria, stock) {
    this.sku = sku;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    if (stock) {
      this.stock = stock;
    } else {
      this.stock = 10;
    }
  }
}

// Creo todos los productos que vende mi super
const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

// Genero un listado de productos. Simulando una base de datos
const productosDelSuper = [
  queso,
  gaseosa,
  cerveza,
  arroz,
  fideos,
  lavandina,
  shampoo,
  jabon,
];

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
  constructor() {
    this.precioTotal = 0;
    this.productos = [];
    this.categorias = [];
  }
  //función que agrega @{cantidad} de productos con @{sku} al carrito
  async agregarProducto(sku, cantidad) {
    console.log(`Agregando ${cantidad} ${sku}`);
    try {
      // Busco el producto en la "base de datos"
      const producto = await findProductBySku(sku);

      // Busco si el producto ya fue agregado al carrito
      const foundProduct = this.productos.find(
        (producto) => producto.sku === sku
      );

      if (foundProduct) {
        foundProduct.cantidad += cantidad;
      } else {
        const nuevoProducto = new ProductoEnCarrito(
          sku,
          producto.nombre,
          cantidad
        );
        this.productos.push(nuevoProducto);

        if (!this.categorias.includes(producto.categoria)) {
          this.categorias.push(producto.categoria);
        }
      }
      this.precioTotal += producto.precio * cantidad;
      //producto.stock -= cantidad;
    } catch (error) {
      console.log(error);
    }
  }

  //función que elimina @{cantidad} de producto con @{sku} al carrito
  eliminarProducto(sku, cantidad) {
    console.log(`Eliminando ${cantidad} unidades de ${sku}`);
    try {
      findProductBySku(sku).then((producto) => {
        const foundProductIndex = this.productos.findIndex(
          (producto) => producto.sku === sku
        );
        //Producto ${sku} eliminado del carrito.
        if (foundProductIndex !== -1) {
          const foundProduct = this.productos[foundProductIndex];
          if (foundProduct.cantidad <= cantidad) {
            this.productos.splice(foundProductIndex, 1);
            this.categorias.splice(foundProductIndex, 1);
          } else {
            foundProduct.cantidad -= cantidad;
          }
          this.precioTotal -= producto.precio * cantidad;
        } else {
          console.log(`El producto ${sku} no se encuentra en el carrito.`);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const compraFinalizada = () => {
  return new Promise((resolve, reject) => {
    if (carrito.length === 0) {
      reject(new Error("No existen compras"));
    }
    setTimeout(() => {
      resolve(carrito);
    }, 1500);
  });
};

async function compraTerminada() {
  try {
    const datosFetched = await compraFinalizada();
    console.log("==============================");
    console.log("TICKET POR TOTAL DE LA COMPRA:");
    console.log(carrito);
  } catch (err) {
    console.log(err.message);
  }
}

function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find(
        (product) => product.sku === sku
      );
      if (foundProduct) {
        resolve(foundProduct);
      } else {
        reject(`Producto ${sku} no encontrado`);
      }
    }, 1500);
  });
}

const carrito = new Carrito();
carrito.agregarProducto("KS944RUR", 2);
carrito.agregarProducto("KS944RUR", 2);
carrito.agregarProducto("WE328NJ", 3);
carrito.agregarProducto("UI999TY",4)
carrito.agregarProducto("xxxxxx", 1);
carrito.eliminarProducto("KS944RUR", 1);
carrito.eliminarProducto("WE328NJ", 3);
compraTerminada(carrito);
