# Carrera Hybrid Tracks

Una aplicación web para crear y compartir tus propios circuitos de Carrera Hybrid.

## Descripción

Carrera Hybrid Tracks es una herramienta de referencia para pilotos de Carrera Hybrid. Permite a los usuarios crear y compartir sus circuitos con la comunidad. La aplicación está diseñada para ser rápida y fácil de usar.

## Tecnologías Utilizadas

-   [Vue.js 3](https://vuejs.org/) (con Composition API y `<script setup>`)
-   Vue Router para el enrutamiento del lado del cliente.
-   Tailwind CSS para el diseño de la interfaz de usuario.
-   Vue I18n para la internacionalización.

## Estructura del Proyecto

```
/
├── public/
├── src/
│   ├── assets/         # Archivos estáticos como CSS e imágenes
│   ├── components/     # Componentes de Vue reutilizables
│   ├── locales/        # Archivos de traducción para i18n
│   ├── router/         # Configuración de Vue Router
│   ├── views/          # Componentes de página (vistas)
│   ├── App.vue         # Componente raíz de la aplicación
│   └── main.js         # Punto de entrada de la aplicación
├── package.json
└── README.md
```

## Instalación y Uso

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

-   Node.js (versión 16.x o superior)
-   npm o yarn

### Pasos

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/carrera-hybrid-tracks.git
    cd carrera-hybrid-tracks
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecuta el servidor de desarrollo:**
    La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la consola).
    ```bash
    npm run dev
    ```

4.  **Compila para producción:**
    Genera los archivos estáticos para el despliegue en el directorio `dist/`.
    ```bash
    npm run build
    ```