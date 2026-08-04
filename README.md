# El Camino de la Lengua

Videojuego educativo móvil para **revitalizar la lengua pastoker** del Pueblo Pasto, acompañando a niños, jóvenes y familias de los resguardos en el aprendizaje de su idioma ancestral.

> Proyecto **comunitario de largo plazo** de la Asociación PUMA‑MAKI (resguardo de Muellamués, Nariño, Colombia). El objetivo es que sea una herramienta viva y genuinamente útil para la comunidad: la calidad y el respeto cultural están por encima de todo.

---

## Sobre el juego

Acompañas a **Kinti** en su camino por recuperar las palabras del pastoker. A medida que aprendes, el mundo pasa de gris a color: cada palabra recuperada devuelve vida al territorio.

- **75 palabras** organizadas en **5 mundos** temáticos.
- Sistema de progreso **gris → color** que premia el aprendizaje.
- Narrativa culturalmente situada, con la paleta Pasto (verde / dorado / tierra) sobre un look nocturno luminoso ("Futurismo Andino").

### Modos y mecánicas

| Área | Qué ofrece |
|------|------------|
| **Misiones** | Quiz, Parejas, Dictado, Escucha y Memoria por cada mundo |
| **Reto diario** | Palabra del Día determinística + reto de 5 pasos con bono |
| **Práctica libre** | Repaso de las palabras aprendidas sin afectar la historia |
| **Diccionario** | Las 75 palabras consultables, con búsqueda, filtros y fonética |
| **Duelo de 2** | Partida local por turnos en el mismo dispositivo |
| **Cinemáticas** | Escenas narrativas entre mundos |
| **Avatar** | Personalización por capas con desbloqueos |
| **Estadísticas** | Racha diaria, progreso por mundo/categoría y calendario de actividad |

Incluye además logros declarativos, medallas Pasto, mascota (Pishku), audio y vibración, y recordatorio diario opcional.

---

## Stack técnico

- **React Native 0.74** + **Expo SDK 51** (managed).
- Navegación: React Navigation (stack + bottom tabs).
- Estado global: Context propio (`JuegoContext`) con persistencia en **AsyncStorage**.
- Gráficos vectoriales: `react-native-svg`. Audio/háptica: `expo-av`, `expo-haptics`. Voz placeholder: `expo-speech`.
- Tipografía Baloo 2 (`@expo-google-fonts/baloo-2`).

### Estructura

```
src/
├── screens/      Pantallas (19)
├── components/   Componentes reutilizables (Medallon, SenderoMapa, Hud…)
├── context/      JuegoContext + logica.js (lógica pura) + tests
├── data/         datos.js (palabras, mundos, logros, cinemáticas)
├── theme/        colors.js, fonts.js, ui.js (tokens de diseño)
└── utils/        sonidos, feedback, notificaciones, voz, ajustes
```

La **lógica pura del estado** (serialización de Sets, hidratación/merge, racha, semilla de la palabra del día) vive aislada en `src/context/logica.js` y está cubierta por tests.

---

## Desarrollo

Requisitos: Node.js LTS y, para compilar el APK, un entorno Android (SDK + JDK).

```bash
npm install          # instalar dependencias
npm start            # arrancar Metro (Expo)
npm test             # correr la suite de lógica pura (node --test)
```

### Compilar el APK release

El bundle JS es un artefacto de build (no se versiona) y se regenera así:

```bash
npx expo export:embed --platform android --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

---

## Nota cultural

El contenido lingüístico y narrativo (incluidos los guiones de las cinemáticas) es **material en revisión por la comunidad**. Nada aquí sustituye el conocimiento de los sabedores y sabedoras del Pueblo Pasto; el juego es una herramienta de apoyo, no una fuente de autoridad sobre la lengua.

Repositorio **privado** mientras avanza esa revisión cultural.

---

## Créditos

Desarrollado con y para la comunidad del resguardo de Muellamués (Nariño) — Asociación PUMA‑MAKI.

*Sumak kawsay* — que el camino de la lengua siga vivo.
