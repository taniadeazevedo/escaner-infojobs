# 🎯 Escáner de Compatibilidad Laboral | InfoJobs

Test psicológico laboral gamificado que mide tu nivel de corporativismo y compatibilidad con el mundo laboral.

## 🚀 Deploy Rápido en Netlify (3 comandos)

```bash
# 1. Dar permisos de ejecución
chmod +x deploy.sh

# 2. Ejecutar script
./deploy.sh

# 3. Seguir las instrucciones en pantalla
```

El script automatiza todo:
- ✅ Instalación de dependencias
- ✅ Build del proyecto
- ✅ Inicialización de Git
- ✅ Push a GitHub
- ✅ Instrucciones para Netlify

---

## 📋 Requisitos

- **Node.js**: 20.x (configurado en Netlify)
- **npm**: 10.x o superior
- **Git**: Cualquier versión
- **Cuenta GitHub**: Para hosting del código
- **Cuenta Netlify**: Para hosting web (gratis)

---

## 📦 Estructura del Proyecto

```
escaner-infojobs/
├── src/
│   ├── App.jsx                  # Decide qué pantalla se ve y guarda las respuestas
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Todos los estilos (colores en :root)
│   ├── data/
│   │   ├── bloques.js           # Preguntas, sellos y frases del escáner
│   │   └── arquetipos.js        # Los 6 arquetipos, la escala y los enlaces de ofertas
│   ├── lib/
│   │   ├── puntuacion.js        # Cálculo del resultado
│   │   └── compartir.js         # Enlace del resultado y tarjeta-imagen
│   └── components/
│       ├── Pantallas.jsx        # Portada, pregunta, transición y análisis
│       ├── Resultados.jsx       # Pantalla de resultados
│       └── Medidor.jsx          # Barra, medidor en vivo y contador animado
├── public/                      # Fotos y _redirects
├── index.html                   # HTML base con meta tags OG
├── netlify.toml                 # Configuración Netlify (Node 20)
└── deploy.sh                    # Script de deploy automatizado
```

---

## 🛠️ Stack Tecnológico

- **Framework**: React 18
- **Build Tool**: Vite 7
- **Hosting**: Netlify
- **Estilos**: CSS propio (sin librerías)

---

## 🎨 Características

- ✅ 15 preguntas en 5 bloques (2 puntúan + 1 de perfil por bloque)
- ✅ Medidor de nivel corporativo que se mueve en vivo al responder
- ✅ Reacción del escáner a cada respuesta
- ✅ Un sello (logro) desbloqueado por bloque
- ✅ 6 arquetipos + perfil creativo / analítico / híbrido
- ✅ Tarjeta-imagen del resultado para descargar y compartir
- ✅ Enlace que abre tu resultado (`?r=...`)
- ✅ Teclado (1-4 y Enter), responsive y accesible

---

## 🧮 Cómo se puntúa

- Cada pregunta corporativa vale de 1 (nada corporativo) a 4 (muy corporativo).
- El **nivel corporativo** es la media de las 10 preguntas corporativas, pasada a 0-100 %.
- Las 5 preguntas de perfil **no puntúan**: solo deciden si eres creativo, analítico o híbrido.
- Cada barra de "dimensión" es la media de un bloque.

---

## 🎭 Arquetipos (de menos a más corporativo)

1. **Especialista en irse a su hora** - Límites con contrato indefinido
2. **Disidente con nómina** - Critica al sistema, cobra del sistema
3. **Estratega del toma y daca** - Ambición con calculadora
4. **Portavoz oficial del humo** - Bilingüe: español y corporativo
5. **Evangelista del KPI** - Lo que no se mide, no existe
6. **Entidad corporativa** - Persona física, alma jurídica

---

## 🔧 Comandos Disponibles

### Desarrollo
```bash
npm install          # Instalar dependencias
npm run dev          # Servidor desarrollo (localhost:5173)
```

### Producción
```bash
npm run build        # Build para producción
npm run preview      # Preview del build
```

### Deploy
```bash
chmod +x deploy.sh   # Dar permisos (solo primera vez)
./deploy.sh          # Deploy automatizado
```

---

## 🌐 Deploy Manual (Sin Script)

Si prefieres hacerlo manual:

### 1. Preparar el Proyecto
```bash
npm install
npm run build
```

### 2. Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/escaner-infojobs.git
git push -u origin main
```

### 3. Conectar con Netlify
1. Ve a [Netlify](https://app.netlify.com/start)
2. Click en "Import from Git"
3. Selecciona GitHub
4. Busca tu repositorio
5. Netlify detectará automáticamente:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20` (desde netlify.toml)
6. Click "Deploy site"

---

## ⚙️ Configuración de Netlify

El archivo `netlify.toml` ya incluye:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Node 20** está configurado para máxima compatibilidad con Vite 7.

---

## 🎯 Meta Tags Open Graph

```html
<!-- Optimizado para compartir en redes sociales -->
<meta property="og:title" content="Escáner de Compatibilidad Laboral | InfoJobs" />
<meta property="og:description" content="El test que ningún RRHH se atreve a hacerte. Ahora 15 preguntas. 3 minutos. Un diagnóstico real de tu perfil." />
<meta property="og:image" content="https://taniadeazevedo.es/wp-content/uploads/2025/11/cropped-Yo.jpg" />
```

---

## 🐛 Troubleshooting

### Error: "Node version mismatch"
**Solución**: Netlify usa Node 20 (configurado en `netlify.toml`)

### Error: "404 en rutas"
**Solución**: El archivo `public/_redirects` maneja las rutas SPA

### Error: "Build failed"
**Solución**: Verifica que `npm run build` funcione localmente

### Error: "Git push denied"
**Solución**: Verifica que el repositorio exista en GitHub

---

## 📄 Licencia

Proyecto creado por [Tania de Azevedo](https://taniadeazevedo.es)

---

## 🤝 Contacto

- **Portfolio**: [taniadeazevedo.es](https://taniadeazevedo.es)
- **GitHub**: Tu usuario de GitHub

---

## 🎉 ¡Listo!

Después del deploy, tu app estará disponible en:
```
https://TU-SITE.netlify.app
```

Netlify te dará un dominio automático que puedes personalizar.

---

**Última actualización**: Febrero 2026
