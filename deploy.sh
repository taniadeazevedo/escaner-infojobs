#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ESCÁNER INFOJOBS - DEPLOY NETLIFY       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encuentra package.json${NC}"
    echo -e "${YELLOW}Por favor ejecuta este script desde la carpeta raíz del proyecto${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Directorio correcto detectado"
echo ""

# 2. Verificar Node version
NODE_VERSION=$(node -v)
echo -e "${BLUE}Node version:${NC} $NODE_VERSION"
echo -e "${YELLOW}⚠️  Netlify usará Node 20 (configurado en netlify.toml)${NC}"
echo ""

# 3. Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Dependencias instaladas"
echo ""

# 4. Build del proyecto
echo -e "${BLUE}🔨 Compilando proyecto...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Build completado"
echo ""

# 5. Inicializar Git si no existe
if [ ! -d ".git" ]; then
    echo -e "${BLUE}📝 Inicializando repositorio Git...${NC}"
    git init
    echo -e "${GREEN}✓${NC} Git inicializado"
else
    echo -e "${YELLOW}⚠️  Git ya inicializado${NC}"
fi
echo ""

# 6. Crear .gitignore si no existe
if [ ! -f ".gitignore" ]; then
    echo -e "${BLUE}📝 Creando .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF
    echo -e "${GREEN}✓${NC} .gitignore creado"
else
    echo -e "${YELLOW}⚠️  .gitignore ya existe${NC}"
fi
echo ""

# 7. Añadir archivos a Git
echo -e "${BLUE}📝 Añadiendo archivos a Git...${NC}"
git add .
git commit -m "Initial commit - Escáner InfoJobs ready for Netlify" 2>/dev/null || git commit -m "Update" 2>/dev/null
echo -e "${GREEN}✓${NC} Commit creado"
echo ""

# 8. Configurar GitHub
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        CONFIGURACIÓN DE GITHUB             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Pasos a seguir:${NC}"
echo -e "1. Ve a GitHub: ${BLUE}https://github.com/new${NC}"
echo -e "2. Crea un repositorio llamado: ${GREEN}escaner-infojobs${NC}"
echo -e "3. ${RED}NO${NC} inicialices con README, .gitignore o licencia"
echo -e "4. Crea el repositorio y vuelve aquí"
echo ""
read -p "¿Ya creaste el repositorio en GitHub? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}Cuando lo crees, ejecuta:${NC}"
    echo -e "git remote add origin https://github.com/TU_USUARIO/escaner-infojobs.git"
    echo -e "git push -u origin main"
    exit 0
fi

# 9. Pedir nombre de usuario de GitHub
echo ""
read -p "Ingresa tu usuario de GitHub: " GITHUB_USER
if [ -z "$GITHUB_USER" ]; then
    echo -e "${RED}❌ Usuario no puede estar vacío${NC}"
    exit 1
fi

# 10. Configurar remote
REPO_NAME="escaner-infojobs"
REMOTE_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo ""
echo -e "${BLUE}📡 Configurando remote...${NC}"
git remote remove origin 2>/dev/null
git remote add origin $REMOTE_URL
echo -e "${GREEN}✓${NC} Remote configurado: $REMOTE_URL"
echo ""

# 11. Cambiar a main si estamos en master
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${BLUE}📝 Cambiando a branch main...${NC}"
    git branch -M main
    echo -e "${GREEN}✓${NC} Branch cambiado a main"
fi
echo ""

# 12. Push a GitHub
echo -e "${BLUE}🚀 Subiendo código a GitHub...${NC}"
echo -e "${YELLOW}Se abrirá tu navegador para autenticar con GitHub...${NC}"
echo ""
git push -u origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al hacer push${NC}"
    echo ""
    echo -e "${YELLOW}Posibles soluciones:${NC}"
    echo -e "1. Verifica que el repositorio existe: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo -e "2. Intenta manualmente: ${BLUE}git push -u origin main${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Código subido a GitHub exitosamente"
echo ""

# 13. Instrucciones para Netlify
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ¡TODO LISTO! 🎉               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Ahora despliega en Netlify:${NC}"
echo ""
echo -e "1. Ve a: ${BLUE}https://app.netlify.com/start${NC}"
echo -e "2. Click en ${GREEN}'Import from Git'${NC}"
echo -e "3. Selecciona ${GREEN}'GitHub'${NC}"
echo -e "4. Busca y selecciona: ${GREEN}$GITHUB_USER/$REPO_NAME${NC}"
echo -e "5. ${YELLOW}Netlify detectará automáticamente la configuración:${NC}"
echo -e "   - Build command: ${GREEN}npm run build${NC}"
echo -e "   - Publish directory: ${GREEN}dist${NC}"
echo -e "   - Node version: ${GREEN}20${NC} (desde netlify.toml)"
echo -e "6. Click en ${GREEN}'Deploy site'${NC}"
echo ""
echo -e "${BLUE}Tu repositorio GitHub:${NC}"
echo -e "${GREEN}https://github.com/$GITHUB_USER/$REPO_NAME${NC}"
echo ""
echo -e "${YELLOW}⏱️  El deploy en Netlify tarda ~2 minutos${NC}"
echo ""
