# 🧘 TubeZero — YouTube Focus & Distraction Zero

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success?style=flat-square&color=10b981)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20JS%2FCSS)-blue?style=flat-square&color=38bdf8)](https://github.com)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Local-purple?style=flat-square&color=a855f7)](https://github.com)
[![Size](https://img.shields.io/badge/Size-%3C%2035%20KB-orange?style=flat-square&color=f59e0b)](https://github.com)

**TubeZero** es una extensión ultraligera de alto rendimiento para navegadores Chromium (**Google Chrome, Brave, Microsoft Edge, Opera**) diseñada para transformar YouTube de una trampa de distracción algorítmica a un entorno de estudio, investigación y aprendizaje intencional.

---

## ⚡ Los 4 Pilares de TubeZero

1. 🎯 **Buscador Zen Intencional (Zero Feed Casino):**
   - Elimina por completo el feed infinito de la página principal de YouTube.
   - Lo reemplaza por un buscador minimalista con la pregunta: *"¿Qué viniste a dominar hoy?"*, accesos directos a tus Suscripciones, Historial y Ver Más Tarde, y citas estoicas y de enfoque profundo.
   - Incluye botón de pausa temporal de 10 minutos si de verdad necesitas ver la página principal para buscar algo específico.

2. 🚫 **Aniquilador y Redirigidor de YouTube Shorts:**
   - Oculta todos los estantes, carruseles y botones de Shorts de la barra lateral y de los resultados de búsqueda.
   - **Auto-Redirección Inteligente:** Si alguien te envía o abres un enlace `/shorts/VIDEO_ID`, **TubeZero lo redirige automáticamente a `/watch?v=VIDEO_ID`**, permitiéndote ver el video en el reproductor normal con barra de reproducción, control de velocidad y sin la rueda de doomscroll.

3. 🎬 **Modo Cine & Estudio en Reproductor (Watch Page Focus):**
   - Oculta la columna lateral de videos recomendados (`#secondary` / `#related`), permitiendo que el reproductor se centre limpiamente como un cine sin distracciones visuales llamativas.
   - Oculta las tarjetas intrusivas y pantallas finales (*End-screens*) que te bombardean en los últimos 20 segundos de cada video.
   - Opción para ocultar la sección de comentarios si necesitas concentración absoluta.

4. ⌨️ **Atajo Rápido de Teclado:**
   - Pulsa `Alt + Z` en cualquier momento dentro de YouTube para alternar el modo enfoque al instante.

---

## 🚀 Guía de Instalación Rápida (3 Pasos)

Instala TubeZero en menos de 1 minuto sin necesidad de programar ni instalar herramientas adicionales:

### Paso 1: Descargar el código
1. Haz clic en el botón verde superior **`<> Code`** de este repositorio.
2. Selecciona **`Download ZIP`**.
3. Descomprime el archivo `.zip` en cualquier carpeta de tu computadora (por ejemplo, en `Documentos` o `Descargas`).

### Paso 2: Abrir Extensiones en tu Navegador
Abre tu navegador preferido e ingresa a la sección de extensiones:
- En **Google Chrome**: Escribe en la barra de direcciones `chrome://extensions/` y presiona Enter.
- En **Brave**: Escribe `brave://extensions/` y presiona Enter.
- En **Microsoft Edge**: Escribe `edge://extensions/` y presiona Enter.

### Paso 3: Cargar la Extensión
1. En la esquina superior derecha de la página de extensiones, activa el interruptor **"Modo de desarrollador"** (*Developer mode*).
2. Haz clic en el botón **"Cargar descomprimida"** (*Load unpacked*) en la barra superior izquierda.
3. Selecciona la carpeta donde descomprimiste **TubeZero** (la carpeta que contiene el archivo `manifest.json`).

🎉 **¡Listo!** Abre `youtube.com` y disfruta de una experiencia limpia, rápida y enfocada en lo que realmente importa.

---

## ⚙️ Panel de Control y Presets

Haz clic en el ícono de **TubeZero** en la barra de extensiones para acceder a:
- **Presets Rápidos:**
  - 🎓 **Estudio (Recomendado):** Sin feed de inicio, sin Shorts, sin videos recomendados al reproducir.
  - 🧘 **Minimal:** Solo oculta el feed de inicio y Shorts, manteniendo recomendaciones laterales.
  - 🔒 **Total:** Oculta inicio, Shorts, barra lateral, comentarios, pantallas finales y notificaciones.
  - ⏸️ **Desactivado temporal:** Pausa las reglas temporalmente.
- **Métricas de Tiempo Salvado:** Contador en tiempo real de Shorts bloqueados y minutos de atención protegidos.

---

## 📂 Estructura del Proyecto

```text
TubeZero/
├── manifest.json       # Manifiesto V3 oficial de la extensión
├── background.js       # Service worker mínimo para métricas de tiempo salvado
├── content.js          # Inyector SPA del Buscador Zen y redirección de Shorts
├── tubezero.css        # Motor CSS ultra-optimizado anti-flicker
├── icons/              # Iconografía vectorial y PNG de alta resolución (16, 32, 48, 128 px)
│   ├── icon.svg
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── popup/              # Panel de control de presets e interruptores
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── test_preview.html   # Entorno local para pruebas visuales del popup
└── README.md           # Guía rápida e instrucciones
```

---

## 🔒 Privacidad y Rendimiento

- **0% Telemetría:** No envía ningún dato a servidores externos.
- **100% Local:** Tus configuraciones y estadísticas se guardan en el almacenamiento local de tu navegador.
- **Zero-Flicker:** Carga instantánea sin saltos visuales ni parpadeos.
- **Peso Pluma:** Todo el paquete pesa menos de 35 KB.

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia [MIT](LICENSE). Siéntete libre de compartirlo con tus amigos, modificarlo y adaptarlo a tu flujo de trabajo.
