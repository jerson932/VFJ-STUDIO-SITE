# VFJ Studio — Sitio web

Portafolio de fotografía y video. Sitio estático, listo para GitHub Pages.

## Publicar en GitHub Pages

1. Subí **todo el contenido de esta carpeta** a la raíz de tu repositorio
   (que los archivos `.html` queden en la raíz, no dentro de otra carpeta).
2. En GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. En unos minutos el sitio queda publicado.

## Estructura

```
index.html        Portada
fotografia.html   Galería con filtros y visor
video.html        Reel de 12 producciones
estudio.html      Historia y equipo
contacto.html     Formulario de cotización

css/style.css     Todos los estilos
js/main.js        Comportamiento del sitio
js/photos.js      Catálogo de las 49 fotos

images/           Fotos a tamaño completo (máx. 1800px)
images/thumb/     Miniaturas de la galería (máx. 720px)
previews/         Clips de 10s sin audio (autoplay)
videos/           Videos completos con audio
posters/          Imagen fija de cada video
```

## Cómo agregar una foto nueva

1. Guardá la imagen en `images/` y una versión reducida en `images/thumb/`
   (mismo nombre en las dos carpetas).
2. Agregá una línea al final de la lista en `js/photos.js`:

```js
{f:"boda-14.jpg", c:"boda", l:"Boda", o:"h", r:"050"}
```

- `f` = nombre del archivo
- `c` = categoría: `boda`, `boda-bn`, `graduacion`, `baby-shower`, `retrato`
- `l` = etiqueta que se muestra
- `o` = orientación: `h` horizontal, `v` vertical, `s` cuadrada
- `r` = número de referencia (el que sigue)

## Cómo agregar un video nuevo

1. Poné el video completo en `videos/nombre.mp4`, un clip corto sin audio en
   `previews/nombre.mp4` y una imagen fija en `posters/nombre.jpg`.
2. Copiá un bloque `<article class="reel-item ...">` en `video.html`, cambiá el
   `data-slug` por el nombre nuevo y ajustá el título y la descripción.

Usá la clase `wide` para videos horizontales y `tall` para verticales.

## Formulario de cotización

Las solicitudes llegan a **jersonmelendez123@gmail.com** a través de Web3Forms.
La clave está en `contacto.html`, en el campo `access_key`.

Si algún día querés cambiar el correo de destino, entrá a
[web3forms.com](https://web3forms.com), generá una clave nueva con el correo
que quieras y reemplazá el valor de `access_key`.

## Contacto

VFJ Studio — Ciudad de Guatemala
WhatsApp +502 4237-3645 · jersonmelendez123@gmail.com
