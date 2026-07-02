# 🛒 Lista de Compras

Aplicacion movil para gestionar listas de la compra por supermercado. Construida con **React Native** y **Expo**.

## Caracteristicas

- **Multiples supermercados** — listas independientes para Mercadona, Lidl y Carrefour
- **Marcar como comprado** — toca un producto para marcarlo/desmarcarlo
- **Anadir, editar y eliminar** productos con modales de cristal (glassmorphism)
- **Contadores en tiempo real** — pendientes, comprados y total por tienda
- **Persistencia local** — los datos se guardan con AsyncStorage entre sesiones
- **Limpiar comprados / Vaciar lista / Restablecer todo** con confirmacion
- **Animaciones fluidas** con Reanimated 4
- **UI oscura con gradientes** y estilo glassmorphism

## Capturas

| Inicio | Lista de tienda |
|--------|-----------------|
| Selecciona el supermercado | Gestiona tus productos |

## Tecnologias

| Libreria | Version | Uso |
|----------|---------|-----|
| Expo | ~57.0 | Plataforma base |
| Expo Router | ~57.0 | Navegacion basada en ficheros |
| React Native | 0.86 | Framework movil |
| React Native Reanimated | 4.5 | Animaciones |
| Expo Blur | ~57.0 | Efecto glassmorphism |
| Expo Linear Gradient | ~57.0 | Fondos con gradiente |
| AsyncStorage | 2.2 | Persistencia local |

## Estructura del proyecto

```
que-compramos-hoy-rn/
├── app/
│   ├── _layout.tsx          # Layout raiz (Expo Router)
│   ├── index.tsx            # Pantalla principal (lista de supermercados)
│   └── store/
│       └── [id].tsx         # Pantalla de lista por supermercado
├── src/
│   ├── components/
│   │   ├── GlassButton.tsx  # Boton con efecto cristal
│   │   ├── GlassCard.tsx    # Tarjeta con efecto cristal
│   │   ├── GlassInput.tsx   # Input con efecto cristal
│   │   ├── GlassModal.tsx   # Modal con efecto cristal
│   │   ├── ProductItem.tsx  # Item de producto en la lista
│   │   └── StoreCard.tsx    # Tarjeta de supermercado
│   ├── constants/
│   │   ├── stores.ts        # Supermercados predefinidos
│   │   └── theme.ts         # Colores, radios y sombras
│   ├── context/
│   │   └── ShoppingContext.tsx  # Estado global con useReducer
│   ├── hooks/
│   │   └── useShoppingList.ts   # Hook por tienda
│   └── types/
│       └── index.ts         # Tipos TypeScript
├── assets/                  # Iconos y splash
├── app.json                 # Configuracion Expo
└── package.json
```

## Instalacion y uso

### Requisitos

- Node.js 18+
- npm o yarn
- Expo Go en tu movil (para probar sin compilar) o un emulador

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/que-compramos-hoy-rn.git
cd que-compramos-hoy-rn

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

Escanea el QR con **Expo Go** (Android/iOS) o pulsa `a` para abrir en emulador Android / `i` para iOS.

### Scripts disponibles

```bash
npm start        # Inicia el servidor de desarrollo
npm run android  # Abre directamente en emulador Android
npm run ios      # Abre directamente en simulador iOS
npm run web      # Abre en el navegador
```

## Supermercados incluidos

| Tienda | Color |
|--------|-------|
| 🛒 Mercadona | Cian |
| 🏪 Lidl | Amarillo |
| 🏬 Carrefour | Purpura |

## Licencia

MIT
