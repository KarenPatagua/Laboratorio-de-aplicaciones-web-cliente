#  Proyecto E-commerce con FakeStoreAPI

Este proyecto es una aplicación web de e-commerce desarrollada con **HTML, CSS, JavaScript** y usando **FakeStoreAPI** como fuente de datos. Permite ver productos, agregarlos a un carrito, ver detalles en un modal con carrusel, y finalizar la compra.

---

## Integrante

- **Karen Patagua**  
  GitHub: [https://github.com/KarenPatagua]

---

## Funcionalidades principales

- Listado de productos desde [https://fakestoreapi.com/]
- Modal con más detalles del producto y carrusel de imágenes (Swiper.js)
- Agregado y eliminación de productos en el carrito (con persistencia en `localStorage`)
- Traducción de títulos y descripciones de productos del inglés al español (archivo `traducciones.js`)
- Buscador en tiempo real
- Botones para vaciar carrito o finalizar compra

---

##  Estructura de Archivos

```
/Laboratorio de aplicaciones web cliente
│
├── index.html
├── style.css
├── app.js
├── traducciones.js
└── README.md
```

---

##  Tecnologías utilizadas

- HTML5, CSS3
- JavaScript Vanilla
- Bootstrap 5
- Swiper.js
- SweetAlert2
- FakeStoreAPI

---

## Traducción de productos

Se usó un archivo `traducciones.js` externo que contiene los textos en español por ID del producto. En `app.js`, se usa la función `aplicarTraducciones()` para reemplazar dinámicamente los textos.

---

##  Cómo iniciar el proyecto

1. Clona el repositorio o descarga el ZIP
2. Abre `index.html` en tu navegador
3. ¡Explora la tienda!

