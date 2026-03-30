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
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globales
├── public/
│   └── _redirects       # Configuración SPA
├── index.html           # HTML base con meta tags OG
├── package.json         # Dependencias
├── vite.config.js       # Configuración Vite
├── netlify.toml         # Configuración Netlify (Node 20)
├── deploy.sh            # Script de deploy automatizado
├── .gitignore           # Archivos ignorados por Git
└── README.md            # Este archivo
```

---

## 🛠️ Stack Tecnológico

- **Framework**: React 18.3.1
- **Build Tool**: Vite 7.3.1
- **Hosting**: Netlify
- **Estilos**: Tailwind CSS (CDN)
- **Gráficos**: Chart.js 4.4.0 (CDN)

---

## 🎨 Características

- ✅ 15 preguntas divididas en 5 bloques temáticos
- ✅ Sistema de arquetipos laborales (6 perfiles)
- ✅ Análisis por dimensiones (Bienestar, Cultura, Cinismo, Ambición, Discurso)
- ✅ Diseño glassmorphism responsive
- ✅ Integración con InfoJobs
- ✅ Meta tags Open Graph optimizados
- ✅ SEO friendly

---

## 📱 Bloques del Test

1. **Bienestar** - ¿Cómo gestionas el equilibrio vida-trabajo?
2. **Cultura** - Tu percepción del ambiente corporativo
3. **Cinismo** - Nivel de escepticismo laboral
4. **Ambición** - Tu relación con el éxito profesional
5. **Discurso** - Cómo te adaptas al lenguaje corporativo

---

## 🎭 Arquetipos Detectados

1. **El Equilibrista** - Pragmático con principios
2. **El Rebelde Funcional** - Crítico pero operativo
3. **El Candidato Prioritario** - Ambición pragmática
4. **El Arquitecto del Discurso** - Simulación avanzada
5. **El Director de Operaciones** - Integración sistémica
6. **La Entidad Corporativa** - Metamorfosis completa

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
