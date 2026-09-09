# El Camino de la Lengua — aventura ilustrada andina

La interfaz acompaña el aprendizaje de palabras con paisajes del territorio y dibujos reconocibles. Mantiene la navegación, los personajes, la tipografía Baloo 2 y los verdes y dorados existentes.

- Colores: `src/theme/colors.js`; fondo `noche`, superficies `nocheCard`, texto `cielo` y `turquesaSuave`. Reservar `doradoNeon` para acciones principales, avance y recompensas.
- Lectura: frente de cartas `crema`, texto `noche` o `textoPapel`; parejas encontradas `cartaResuelta` con borde dorado y marca visible. Los estados nunca dependen únicamente del color.
- Tipografía: familias de `src/theme/fonts.js`; texto normal 16, secundario 14, títulos 21–28. Evitar etiquetas excesivamente espaciadas.
- Ritmo: separación de 12–16 entre elementos; bordes suaves, radios de 16–24 y sombras discretas. Botones principales y secundarios con área táctil mínima de 48.
- Memoria: tres columnas de cartas con dimensiones numéricas derivadas del tablero medido; ancho máximo de contenido 600. No usar caras absolutas como fuente de altura.
- Actividades: instrucción breve sobre el área de juego; ilustraciones comunes entre lección, pregunta y memoria; no mostrar la respuesta antes de contestar.
- Mapa: sendero y estados existentes, escenarios como miniaturas y paisaje discreto que no tape los controles. Ancho adaptable al contenedor.
- Ilustraciones: vectoriales locales del primer mundo, con formas distinguibles y una paleta común. Mantener el vocabulario y etiquetas necesarias para evitar ambigüedad.
- Movimiento: conservar el volteo y las celebraciones existentes; no agregar animaciones permanentes a las nuevas ilustraciones ni al paisaje.

Revisión Hallmark: filosofía 4, jerarquía 4, ejecución 4, especificidad 5, contención 4, variedad 4. La comprobación visual del dispositivo es independiente de las pruebas de componentes.
