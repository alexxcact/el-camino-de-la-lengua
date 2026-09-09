# El Camino de la Lengua

Videojuego educativo móvil para **revitalizar la lengua pastoker** del Pueblo Pasto, acompañando a niños, jóvenes y familias de los resguardos en el aprendizaje de su idioma ancestral.

> Proyecto **comunitario de largo plazo** de la Asociación PUMA‑MAKI (resguardo de Muellamués, Nariño, Colombia). El objetivo es que sea una herramienta viva y genuinamente útil para la comunidad: la calidad y el respeto cultural están por encima de todo.

---

## Sobre el juego

Acompañas a **Kinti** en su camino por recuperar las palabras del pastoker. A medida que aprendes, el mundo pasa de gris a color: cada palabra recuperada devuelve vida al territorio.

- **75 palabras** organizadas en **5 mundos** temáticos.
- Sistema de progreso **gris → color** que premia el aprendizaje.
- Narrativa culturalmente situada, con la paleta Pasto (verde / dorado / tierra), fondos nocturnos y tarjetas claras para aprender.
- 15 ilustraciones vectoriales del primer mundo y un mapa con miniaturas de los escenarios.

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

- **React Native 0.74** + **Expo SDK 51**, con el proyecto nativo Android incluido.
- Navegación: React Navigation (stack + bottom tabs).
- Estado global: Context propio (`JuegoContext`) con persistencia en **AsyncStorage**.
- Gráficos vectoriales: `react-native-svg`. Audio/háptica: `expo-av`, `expo-haptics`. Voz placeholder: `expo-speech`.
- Tipografía Baloo 2 (`@expo-google-fonts/baloo-2`).

### Estructura

```
src/
├── screens/      Pantallas y pruebas de sus flujos
├── components/   Componentes reutilizables (Medallon, SenderoMapa, Hud…)
├── context/      JuegoContext + logica.js (lógica pura) + tests
├── data/         datos.js (palabras, mundos, logros, cinemáticas)
├── theme/        colors.js, fonts.js, ui.js (tokens de diseño)
├── test/         Herramientas de prueba de componentes
└── utils/        Ejercicios, duelo, navegación, sonidos, voz y notificaciones
```

La **lógica pura del estado** (serialización de Sets, hidratación/merge, racha, semilla de la palabra del día) vive aislada en `src/context/logica.js` y está cubierta por tests.

Las reglas visuales compartidas se documentan en [design.md](design.md).

### Correcciones recientes

- Memoria calcula el tamaño de cada carta a partir del ancho real del tablero y conserva la partida al redimensionar.
- Los ejercicios distinguen dibujos repetidos y calculan la aprobación según la cantidad de preguntas de la sesión.
- El progreso diario se actualiza al reanudar la app y al cambiar de día; los atuendos ganados siguen disponibles al perder una racha.
- Duelo respeta el vocabulario aprendido y los filtros; volver desde el final reutiliza la navegación existente.
- El recordatorio conserva las 00:00 y refleja si se autorizó su programación.

---

## Desarrollo

Requisitos: Node.js (verificación realizada con Node 24) y, para compilar el APK, un entorno Android con SDK y JDK 17.

```bash
npm install          # instalar dependencias
npm start            # arrancar Metro (Expo)
npm test             # lógica y flujos de componentes (node --test)
```

### Compilar el APK release

Gradle genera automáticamente el bundle JavaScript y sus recursos. No hace falta ejecutar `expo export:embed` manualmente ni copiar archivos a `android/app/src/main`.

Configura `JAVA_HOME` y `ANDROID_HOME`. La configuración actual usa `android/app/debug.keystore` para las compilaciones de desarrollo, incluido el APK release de prueba. Ese archivo se conserva localmente y no se versiona. Para actualizar una instalación existente, usa su misma clave; para una instalación de prueba nueva puedes generar una con el JDK:

```bash
keytool -genkeypair -keystore android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -dname "CN=Android Debug,O=Android,C=US" -keyalg RSA -keysize 2048 -validity 10000
```

Desde PowerShell:

```powershell
cd android
.\gradlew.bat :app:assembleRelease --no-daemon --max-workers=2 --console=plain
```

En macOS/Linux, el comando equivalente es `./gradlew :app:assembleRelease`. El resultado queda en `android/app/build/outputs/apk/release/app-release.apk`. Se puede añadir `--offline` cuando las dependencias ya están disponibles en la caché.

Los APK y demás archivos generados no se versionan. La distribución de producción requiere configurar una clave propia de publicación.

### Verificación de esta actualización

Las 41 pruebas automatizadas pasan y el APK release compila con firma verificada. Las vistas se comprobaron en una previsualización web, incluida Memoria a 320, 375, 414 y 768 píxeles. Esa revisión no sustituye la comprobación visual en un dispositivo Android.

---

## Nota cultural

El contenido lingüístico y narrativo (incluidos los guiones de las cinemáticas) es **material en revisión por la comunidad**. Nada aquí sustituye el conocimiento de los sabedores y sabedoras del Pueblo Pasto; el juego es una herramienta de apoyo, no una fuente de autoridad sobre la lengua.

Repositorio **privado** mientras avanza esa revisión cultural.

---

## Créditos

Desarrollado con y para la comunidad del resguardo de Muellamués (Nariño) — Asociación PUMA‑MAKI.

*Sumak kawsay* — que el camino de la lengua siga vivo.
