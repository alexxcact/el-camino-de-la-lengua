# El Camino de la Lengua

Videojuego educativo móvil para explorar vocabulario y contextos culturales del pueblo Pasto mediante una aventura de aprendizaje.

El corpus contiene las 75 entradas proporcionadas para esta actualización. Su cotejo documental y revisión cultural están pendientes; la aplicación no acredita una afiliación institucional ni una validación comunitaria.

---

## Sobre el juego

Acompañas al **Caminante** por cinco mundos. A medida que aprendes, el mundo pasa de gris a color: cada palabra recuperada devuelve vida al territorio dentro del relato del juego.

- **75 palabras** organizadas en **5 mundos** temáticos.
- Sistema de progreso **gris → color** que premia el aprendizaje.
- Narrativa culturalmente situada, con la paleta Pasto (verde / dorado / tierra), fondos nocturnos y tarjetas claras para aprender.
- Ilustraciones vectoriales asociadas al término, con emojis de apoyo para las demás entradas, y un mapa con miniaturas de los escenarios.

| ID | Mundo | Subtítulo | IDs de vocabulario |
|----|-------|-----------|--------------------|
| 1 | Pud | Las Alturas | 1–15 |
| 2 | Piar | La Tierra que Alimenta | 16–30 |
| 3 | Paskal | La Fuerza de la Comunidad | 31–45 |
| 4 | In | El Fuego del Hogar | 46–60 |
| 5 | Cuasmal | El Camino del Agua | 61–75 |

### Modos y mecánicas

| Área | Qué ofrece |
|------|------------|
| **Misiones** | Quiz, Parejas, Dictado, Escucha y Memoria por cada mundo |
| **Reto diario** | Palabra del Día determinística + reto de 5 pasos con bono |
| **Práctica libre** | Repaso de las palabras aprendidas sin afectar la historia |
| **Diccionario** | Las 75 entradas consultables, con búsqueda, filtros, contextos y datos de procedencia |
| **Duelo de 2** | Partida local por turnos en el mismo dispositivo |
| **Cinemáticas** | Escenas narrativas entre mundos |
| **Avatar** | Personalización por capas con desbloqueos |
| **Estadísticas** | Racha diaria, progreso por mundo/categoría y calendario de actividad |

Incluye además logros declarativos, medallas, un ave mensajera, audio y vibración, y recordatorio diario opcional.

### Contenido y compatibilidad

Cada entrada conserva `id`, `p`, `e`, `cat`, `fon`, `ej`, `emoji` y `mundo`, y añade `tipo`, `respaldo`, `fuente` y `nota`. `respaldo: "pendiente_validacion"` distingue el listado recibido de una fuente cotejada. `fon` es una grafía de apoyo en minúsculas; la lectura sintética en español no acredita la pronunciación de la lengua.

Los ejemplos y diálogos están en español. La colección interna `frases` conserva sus IDs y campos, pero ahora contiene términos individuales, sus significados y contextos; no presenta oraciones construidas como traducciones.

Se conservan la clave de AsyncStorage, los IDs de palabras, mundos, misiones y logros, y los identificadores técnicos de la aplicación. La marca anterior se retira de los textos y recursos visibles. Las claves históricas de logros permanecen para reconocer las medallas guardadas.

El progreso se mantiene **por ID**, por decisión del propietario: una palabra marcada como aprendida sigue marcada aunque ese ID ahora represente otra entrada. No se migran equivalencias de significado ni se reinician puntos, mundos, medallas o atuendos.

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

`npm test` comprueba la tabla de 75 entradas, la distribución de 15 por mundo, las referencias narrativas, la conservación del progreso y los flujos de juego. Las pruebas de ilustraciones verifican que una entrada no herede un dibujo por reutilizar un ID. La revisión visual en Android debe realizarse con el APK de esta versión.

Resultado de esta actualización: 51 pruebas aprobadas y compilación `assembleRelease` correcta. La firma del APK y la coincidencia entre su bundle y el recién generado se verificaron. Queda pendiente la prueba visual en un teléfono Android.

---

## Nota cultural

El contenido lingüístico y narrativo requiere revisión documental y cultural. La referencia sugerida «Lengua de los Pastos» no incluye edición ni páginas en la solicitud recibida. Los metadatos registran esa limitación sin atribuir una revisión ya realizada a los sabedores y sabedoras del pueblo Pasto.

Repositorio **privado** mientras avanza esa revisión cultural.

---

## Propósito

Una herramienta de apoyo para acercarse al vocabulario y al territorio del pueblo Pasto, con respeto por sus conocimientos y sus procesos de revisión.
