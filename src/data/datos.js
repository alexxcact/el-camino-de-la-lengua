// ─────────────────────────────────────────────────────────────
// EL CAMINO DE LA LENGUA
// Vocabulario, mundos y narrativa del pueblo Pasto - Resguardo de Muellamués
//
// Corpus: listado de 75 entradas aportado para esta actualización.
// La referencia sugerida «Lengua de los Pastos» no incluye edición ni páginas.
// El cotejo documental y la revisión cultural siguen pendientes; no se atribuye
// este contenido a una organización ni se presenta como validación comunitaria.
// ─────────────────────────────────────────────────────────────

export const personajes = [
  {
    id: 'kinti',
    nombre: 'Caminante',
    rol: 'Protagonista',
    emoji: '👦🏽',
    color: '#C49010',
    desc: 'Personaje del juego que recorre el territorio con curiosidad y respeto. Tú acompañas sus pasos mientras exploras el vocabulario.',
    frase: '"¡Cada palabra me ayuda a conocer este camino!"',
  },
  {
    id: 'taita-rimay',
    nombre: 'El guía',
    rol: 'Guía del recorrido',
    emoji: '🧙🏽‍♂️',
    color: '#8B4513',
    desc: 'Personaje del juego que presenta cada mundo y explica en español los significados del vocabulario. Invita a observar el paisaje y a aprender con calma.',
    frase: '"Observa el territorio y descubre las palabras que lo nombran."',
  },
  {
    id: 'uma',
    nombre: 'La tejedora',
    rol: 'Abuela tejedora',
    emoji: '👵🏽',
    color: '#7A1515',
    desc: 'Personaje del juego que acompaña el aprendizaje de las palabras del tejido, la familia y el hogar. Sus explicaciones están escritas en español.',
    frase: '"Con paciencia, cada palabra encuentra su lugar en el tejido."',
  },
  {
    id: 'pishku',
    nombre: 'Ave mensajera',
    rol: 'Pájaro mensajero',
    emoji: '🦜',
    color: '#1A3A5C',
    desc: 'Ave que acompaña la aventura y celebra tus avances. Sus mensajes animan a observar, practicar y volver a intentar.',
    frase: '"¡Pío, pío! ¡Sigamos aprendiendo!"',
  },
  {
    id: 'chutun',
    nombre: 'Niebla juguetona',
    rol: 'Retos del camino',
    emoji: '👻',
    color: '#2D5A16',
    desc: 'Personaje de fantasía creado para el juego. Aparece entre la niebla con desafíos de vocabulario que puedes resolver a tu ritmo.',
    frase: '"¡Observa las pistas y prueba otra vez!"',
  },
];

// Las grafías y significados se transcriben del listado aportado. `fon` conserva
// una grafía de apoyo; no representa una transcripción fonética validada.
export const palabras = [

  // MUNDO 1 — Pud · Las Alturas
  {
    id: 1, p: "Zon", e: "Frailejón", cat: "Naturaleza", fon: "zon", ej: "Observa la forma del frailejón y recuerda la entrada Zon.", emoji: "🌿", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 2, p: "Ina", e: "Viento", cat: "Naturaleza", fon: "ina", ej: "Ina acompaña el recorrido por los paisajes donde sentimos el viento.", emoji: "🌬️", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 3, p: "Chill", e: "Cielo", cat: "Naturaleza", fon: "chill", ej: "Mira hacia el cielo para recordar el significado de Chill.", emoji: "🌌", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 4, p: "Chil", e: "Frío / helado", cat: "Naturaleza", fon: "chil", ej: "Chil permite repasar la idea de frío o helado en las alturas.", emoji: "❄️", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 5, p: "Pud", e: "Cerro / altura", cat: "Territorio", fon: "pud", ej: "Pud representa las alturas del territorio.", emoji: "⛰️", mundo: 1,
    tipo: "raiz", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Entrada relacionada con cerro y altura. Referencia sugerida: Lengua de los Pastos; falta cotejar edición y página."
  },
  {
    id: 6, p: "Put", e: "Volcán / altura", cat: "Territorio", fon: "put", ej: "Put se relaciona con el volcán y la altura en este recorrido.", emoji: "🌋", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 7, p: "Pa", e: "Sol", cat: "Naturaleza", fon: "pa", ej: "Pa se relaciona con el sol dentro de este vocabulario.", emoji: "☀️", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 8, p: "Pe", e: "Luna / media luna", cat: "Naturaleza", fon: "pe", ej: "Pe se presenta con los significados de luna y media luna.", emoji: "🌙", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 9, p: "Pepe", e: "Luna llena", cat: "Naturaleza", fon: "pepe", ej: "Pepe es la entrada para repasar la luna llena.", emoji: "🌕", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 10, p: "Pingal", e: "Arco iris", cat: "Naturaleza", fon: "pingal", ej: "Los colores del arco iris ayudan a recordar Pingal.", emoji: "🌈", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 11, p: "Pue", e: "Redondo / círculo", cat: "Formas", fon: "pue", ej: "Un círculo dibujado en papel ayuda a repasar Pue.", emoji: "⭕", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 12, p: "Tuta", e: "Espiral / centro", cat: "Formas", fon: "tuta", ej: "Tuta se relaciona con la espiral y el centro.", emoji: "🌀", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 13, p: "Punch", e: "Blanco", cat: "Colores", fon: "punch", ej: "Una muestra de color blanco ayuda a recordar Punch.", emoji: "⚪", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 14, p: "Pulan", e: "Amarillo", cat: "Colores", fon: "pulan", ej: "Una muestra de color amarillo ayuda a recordar Pulan.", emoji: "🟡", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 15, p: "Cuanda", e: "Rojo", cat: "Colores", fon: "cuanda", ej: "Una muestra de color rojo ayuda a recordar Cuanda.", emoji: "🔴", mundo: 1,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },

  // MUNDO 2 — Piar · La Tierra que Alimenta
  {
    id: 16, p: "Piar", e: "Maíz", cat: "Alimentos", fon: "piar", ej: "Piar acompaña el recorrido dedicado al maíz y los alimentos.", emoji: "🌽", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 17, p: "Piaran", e: "Desgranar maíz", cat: "Acciones", fon: "piaran", ej: "Piaran se relaciona con la acción de desgranar maíz.", emoji: "🌽", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 18, p: "Turma", e: "Papa", cat: "Alimentos", fon: "turma", ej: "Turma permite repasar el nombre de la papa.", emoji: "🥔", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 19, p: "Yacuara", e: "Rama o planta de papa", cat: "Plantas", fon: "yacuara", ej: "Yacuara se presenta junto a la rama o planta de papa.", emoji: "🌱", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 20, p: "Caguara", e: "Variedad de papa", cat: "Alimentos", fon: "caguara", ej: "Caguara se relaciona con una variedad de papa.", emoji: "🥔", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 21, p: "Puli", e: "Fruto", cat: "Alimentos", fon: "puli", ej: "Puli se usa en este listado para repasar la idea de fruto.", emoji: "🍒", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 22, p: "Capulí", e: "Gran fruto", cat: "Alimentos", fon: "capulí", ej: "Capulí aparece en el listado con el significado de gran fruto.", emoji: "🍒", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 23, p: "Cun", e: "Yuca", cat: "Alimentos", fon: "cun", ej: "Cun acompaña el repaso de alimentos como la yuca.", emoji: "🍠", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 24, p: "Cuat", e: "Comer", cat: "Acciones", fon: "cuat", ej: "Cuat se relaciona con la acción de comer.", emoji: "🍽️", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 25, p: "Yan", e: "Sal", cat: "Alimentos", fon: "yan", ej: "Yan es la entrada asociada a la sal.", emoji: "🧂", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 26, p: "Yamata", e: "Rica sal", cat: "Alimentos", fon: "yamata", ej: "Yamata aparece en el listado con el significado de rica sal.", emoji: "🧂", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 27, p: "Yaguacha", e: "Alimento de la casa grande", cat: "Alimentos", fon: "yaguacha", ej: "Yaguacha se presenta como alimento de la casa grande.", emoji: "🍲", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 28, p: "Tarta", e: "Planta valiosa", cat: "Plantas", fon: "tarta", ej: "Tarta se relaciona con una planta valiosa.", emoji: "🌿", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 29, p: "Tar", e: "Planta / árbol", cat: "Plantas", fon: "tar", ej: "Tar permite repasar las ideas de planta y árbol.", emoji: "🌳", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 30, p: "Poyo", e: "Lugar para guardar papa-semilla", cat: "Lugares", fon: "poyo", ej: "Poyo se relaciona con el lugar para guardar papa-semilla.", emoji: "🏠", mundo: 2,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },

  // MUNDO 3 — Paskal · La Fuerza de la Comunidad
  {
    id: 31, p: "Pas", e: "Familia", cat: "Comunidad", fon: "pas", ej: "Pas se relaciona con la familia dentro de este vocabulario.", emoji: "👪", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 32, p: "Cal", e: "Trabajo / fuerza", cat: "Comunidad", fon: "cal", ej: "Cal reúne las ideas de trabajo y fuerza.", emoji: "💪", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 33, p: "Paskal", e: "Trabajo comunitario de las familias", cat: "Comunidad", fon: "paskal", ej: "Paskal se relaciona con el trabajo comunitario de las familias.", emoji: "🤝", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 34, p: "Gua", e: "Hermano / hermana", cat: "Comunidad", fon: "gua", ej: "Gua permite repasar los significados de hermano y hermana.", emoji: "🧑‍🤝‍🧑", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 35, p: "Au", e: "Voz / grito", cat: "Comunidad", fon: "au", ej: "Au se relaciona con la voz y el grito.", emoji: "🗣️", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 36, p: "Car", e: "Traer / cargar", cat: "Acciones", fon: "car", ej: "Car permite repasar las acciones de traer y cargar.", emoji: "📦", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 37, p: "Mal", e: "Ir", cat: "Acciones", fon: "mal", ej: "Mal se presenta con el significado de ir.", emoji: "🚶", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 38, p: "Que", e: "Hacer / crear", cat: "Acciones", fon: "que", ej: "Que se relaciona con las acciones de hacer y crear.", emoji: "🛠️", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 39, p: "Quer", e: "Pueblo / tierra / lugar", cat: "Territorio", fon: "quer", ej: "Quer reúne las ideas de pueblo, tierra y lugar.", emoji: "🏘️", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 40, p: "Guanga", e: "Telar de mano", cat: "Tejido", fon: "guanga", ej: "Guanga se relaciona con el telar de mano.", emoji: "🧵", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 41, p: "Guango", e: "Atado / copo", cat: "Tejido", fon: "guango", ej: "Guango se presenta con los significados de atado y copo.", emoji: "🧶", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 42, p: "Cuenda", e: "Hilo / lana", cat: "Tejido", fon: "cuenda", ej: "Cuenda permite repasar el hilo y la lana.", emoji: "🧶", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 43, p: "Quinchil", e: "Elemento del telar", cat: "Tejido", fon: "quinchil", ej: "Quinchil aparece como un elemento del telar.", emoji: "🧵", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 44, p: "Chindé", e: "Cesta de bejuco o lana", cat: "Tejido", fon: "chindé", ej: "Chindé se relaciona con una cesta de bejuco o lana.", emoji: "🧺", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 45, p: "Hopa", e: "Saludo al llegar de visita", cat: "Comunidad", fon: "hopa", ej: "Hopa se presenta como saludo al llegar de visita.", emoji: "👋", mundo: 3,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },

  // MUNDO 4 — In · El Fuego del Hogar
  {
    id: 46, p: "In", e: "Fuego / candela / tulpa", cat: "Hogar", fon: "in", ej: "In se relaciona con el fuego, la candela y la tulpa.", emoji: "🔥", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 47, p: "Chu", e: "Leña", cat: "Hogar", fon: "chu", ej: "Chu es la entrada asociada a la leña.", emoji: "🪵", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 48, p: "Chula", e: "Haz de leña", cat: "Hogar", fon: "chula", ej: "Chula se presenta con el significado de haz de leña.", emoji: "🪵", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 49, p: "Chular", e: "Hacer haces de leña", cat: "Acciones", fon: "chular", ej: "Chular se relaciona con hacer haces de leña.", emoji: "🪵", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 50, p: "Imbuera", e: "Unión del fuego", cat: "Hogar", fon: "imbuera", ej: "Imbuera aparece en el listado como unión del fuego.", emoji: "🔥", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 51, p: "Tacín", e: "Fuego de cama / abrigo", cat: "Hogar", fon: "tacín", ej: "Tacín se presenta con los significados de fuego de cama y abrigo.", emoji: "🛏️", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 52, p: "Chapil", e: "Bebida sabrosa", cat: "Alimentos", fon: "chapil", ej: "Chapil se relaciona con una bebida sabrosa.", emoji: "🥤", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 53, p: "Chicha", e: "Bebida tradicional", cat: "Alimentos", fon: "chicha", ej: "Chicha se presenta como una bebida tradicional.", emoji: "🥤", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 54, p: "Chara", e: "Sopa de cebada", cat: "Alimentos", fon: "chara", ej: "Chara se relaciona con la sopa de cebada.", emoji: "🥣", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 55, p: "Canchape", e: "Bebida o alimento", cat: "Alimentos", fon: "canchape", ej: "Canchape aparece como bebida o alimento.", emoji: "🍵", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 56, p: "Guamuca", e: "Bebida de ofrenda / poder", cat: "Alimentos", fon: "guamuca", ej: "Guamuca se presenta como bebida de ofrenda o poder.", emoji: "🍵", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 57, p: "Guanto", e: "Planta poderosa", cat: "Plantas", fon: "guanto", ej: "Guanto aparece en este vocabulario como planta poderosa.", emoji: "🌿", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 58, p: "Chuma", e: "Final de la leña", cat: "Hogar", fon: "chuma", ej: "Chuma se presenta con el significado de final de la leña.", emoji: "🪵", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 59, p: "Pilche", e: "Vasija para beber", cat: "Hogar", fon: "pilche", ej: "Pilche se relaciona con una vasija para beber.", emoji: "🥣", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 60, p: "Cumba", e: "Techo con respiradero", cat: "Hogar", fon: "cumba", ej: "Cumba se presenta como techo con respiradero.", emoji: "🏠", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },

  // MUNDO 5 — Cuasmal · El Camino del Agua
  {
    id: 61, p: "Cual", e: "Agua / río", cat: "Agua", fon: "cual", ej: "Cual se relaciona con el agua y el río.", emoji: "💧", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 62, p: "Cuar", e: "Agua / río / quebrada", cat: "Agua", fon: "cuar", ej: "Cuar reúne los significados de agua, río y quebrada.", emoji: "🏞️", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 63, p: "Fuel", e: "Quebrada / agua", cat: "Agua", fon: "fuel", ej: "Fuel se relaciona con la quebrada y el agua.", emoji: "🏞️", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 64, p: "Pi", e: "Agua / líquido / río", cat: "Agua", fon: "pi", ej: "Pi reúne las ideas de agua, líquido y río.", emoji: "💧", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 65, p: "Es", e: "Agua / río / lugar", cat: "Agua", fon: "es", ej: "Es aparece en el listado con los significados de agua, río y lugar.", emoji: "💧", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 66, p: "Cuas", e: "Agua / planta de agua", cat: "Agua", fon: "cuas", ej: "Cuas se relaciona con el agua y la planta de agua.", emoji: "🌿", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 67, p: "Gualte", e: "Bejuco de agua", cat: "Plantas", fon: "gualte", ej: "Gualte se presenta como bejuco de agua.", emoji: "🌿", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 68, p: "Gualguán", e: "Poder del agua", cat: "Agua", fon: "gualguán", ej: "Gualguán se presenta con el significado de poder del agua.", emoji: "🌊", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 69, p: "Guapil", e: "Planta del agua grande", cat: "Plantas", fon: "guapil", ej: "Guapil se relaciona con una planta del agua grande.", emoji: "🌱", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 70, p: "Cuarris", e: "Planta del sitio del agua", cat: "Plantas", fon: "cuarris", ej: "Cuarris aparece como una planta del sitio del agua.", emoji: "🌱", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 71, p: "Pipisiqui", e: "Fruto que hace agua", cat: "Alimentos", fon: "pipisiqui", ej: "Pipisiqui se presenta con el significado de fruto que hace agua.", emoji: "🍒", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 72, p: "Chichacuas", e: "Animal asociado al agua", cat: "Animales", fon: "chichacuas", ej: "Chichacuas se presenta como animal asociado al agua.", emoji: "🐾", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 73, p: "Cuatín", e: "Animal del fuego y agua", cat: "Animales", fon: "cuatín", ej: "Cuatín se relaciona con un animal del fuego y agua.", emoji: "🐾", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 74, p: "Cusumbe", e: "Animal viejo del agua", cat: "Animales", fon: "cusumbe", ej: "Cusumbe se presenta como animal viejo del agua.", emoji: "🐾", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
  {
    id: 75, p: "Cuasmal", e: "Ir del agua / río", cat: "Agua", fon: "cuasmal", ej: "Cuasmal se presenta con el significado de ir del agua o río.", emoji: "🌊", mundo: 5,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Listado de vocabulario aportado para esta actualización", nota: "Significado transcrito del listado aportado; pendiente de cotejo documental. El ejemplo es un contexto en español y la grafía de apoyo no acredita pronunciación."
  },
];

export const mundos = [
  { id: 1, titulo: "Pud", subtitulo: "Las Alturas", emoji: "🏔️", color: "#1E4010", desc: "Un camino entre cerros, volcanes, viento, cielo y símbolos del territorio.", palabrasIds: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
  { id: 2, titulo: "Piar", subtitulo: "La Tierra que Alimenta", emoji: "🌱", color: "#2D5A16", desc: "Un recorrido por la chagra, el maíz, la papa, las plantas y los alimentos.", palabrasIds: [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] },
  { id: 3, titulo: "Paskal", subtitulo: "La Fuerza de la Comunidad", emoji: "🤝", color: "#8B4513", desc: "Un mundo dedicado a la familia, el trabajo comunitario, el tejido y el encuentro.", palabrasIds: [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45] },
  { id: 4, titulo: "In", subtitulo: "El Fuego del Hogar", emoji: "🔥", color: "#7A1515", desc: "El espacio del fuego, la tulpa, la cocina, la leña y los saberes alrededor del hogar.", palabrasIds: [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60] },
  { id: 5, titulo: "Cuasmal", subtitulo: "El Camino del Agua", emoji: "💧", color: "#1A3A5C", desc: "Un recorrido por ríos, quebradas, plantas y seres relacionados con el agua.", palabrasIds: [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75] },
];

// Se conservan el nombre del export y los IDs para compatibilidad. Cada ficha
// combina una entrada individual con un contexto en español, sin traducir oraciones.
export const frases = [
  { id: 1, past: "Zon", esp: "Frailejón", ctx: "Zon nombra el frailejón en este recorrido por las alturas.", cat: "Territorio", mundo: 1 },
  { id: 2, past: "Ina", esp: "Viento", ctx: "Ina se relaciona con el viento que acompaña el paisaje.", cat: "Territorio", mundo: 1 },
  { id: 3, past: "Pa", esp: "Sol", ctx: "Pa es la entrada del vocabulario para el sol.", cat: "Territorio", mundo: 1 },
  { id: 4, past: "Pe", esp: "Luna / media luna", ctx: "Pe permite explorar los significados luna y media luna.", cat: "Territorio", mundo: 1 },
  { id: 5, past: "Piar", esp: "Maíz", ctx: "Piar nombra el maíz en el recorrido por la chagra.", cat: "Alimentos", mundo: 2 },
  { id: 6, past: "Turma", esp: "Papa", ctx: "Turma es la entrada para la papa entre las palabras de los alimentos.", cat: "Alimentos", mundo: 2 },
  { id: 7, past: "Cuat", esp: "Comer", ctx: "Cuat se relaciona con la acción de comer.", cat: "Acciones", mundo: 2 },
  { id: 8, past: "Pas", esp: "Familia", ctx: "Pas se relaciona con la familia en el vocabulario de la comunidad.", cat: "Comunidad", mundo: 3 },
  { id: 9, past: "Paskal", esp: "Trabajo comunitario de las familias", ctx: "Paskal presenta el trabajo comunitario de las familias.", cat: "Comunidad", mundo: 3 },
  { id: 10, past: "Hopa", esp: "Saludo al llegar de visita", ctx: "Hopa se relaciona con el saludo al llegar de visita y con el encuentro entre personas.", cat: "Comunidad", mundo: 3 },
  { id: 11, past: "In", esp: "Fuego / candela / tulpa", ctx: "In reúne las referencias al fuego, la candela y la tulpa en este vocabulario.", cat: "Hogar", mundo: 4 },
  { id: 12, past: "Chu", esp: "Leña", ctx: "Chu nombra la leña en el recorrido por el hogar.", cat: "Hogar", mundo: 4 },
  { id: 13, past: "Pilche", esp: "Vasija para beber", ctx: "Pilche se relaciona con una vasija para beber.", cat: "Hogar", mundo: 4 },
  { id: 14, past: "Cual", esp: "Agua / río", ctx: "Cual reúne los significados agua y río.", cat: "Agua", mundo: 5 },
  { id: 15, past: "Cuas", esp: "Agua / planta de agua", ctx: "Cuas se relaciona con el agua y las plantas de agua.", cat: "Agua", mundo: 5 },
  { id: 16, past: "Gualte", esp: "Bejuco de agua", ctx: "Gualte se presenta con el significado bejuco de agua.", cat: "Agua", mundo: 5 },
  { id: 17, past: "Pipisiqui", esp: "Fruto que hace agua", ctx: "Pipisiqui se presenta con el significado fruto que hace agua.", cat: "Agua", mundo: 5 },
  { id: 18, past: "Cuasmal", esp: "Ir del agua / río", ctx: "Cuasmal da nombre al último mundo del recorrido.", cat: "Agua", mundo: 5 },
];

// Los IDs históricos son claves de progreso guardado; las etiquetas son actuales.
export const logros = [
  { id: "primera-palabra", nom: "Primera palabra", desc: "Aprende tu primera palabra", emoji: "🌱", cond: (e) => e.palabrasVistas.size >= 1 },
  { id: "explorador", nom: "Explorador", desc: "10 palabras aprendidas", emoji: "🔍", cond: (e) => e.palabrasVistas.size >= 10 },
  { id: "warmi-urku", nom: "Caminante de las Alturas", desc: "Completa Pud", emoji: "🏔️", cond: (e) => e.mundosCompletados.has(1) },
  { id: "chakra", nom: "Caminante de la Chagra", desc: "Completa Piar", emoji: "🌱", cond: (e) => e.mundosCompletados.has(2) },
  { id: "tiyanaku", nom: "Fuerza de la Comunidad", desc: "Completa Paskal", emoji: "🤝", cond: (e) => e.mundosCompletados.has(3) },
  { id: "tulpa", nom: "Fuego del Hogar", desc: "Completa In", emoji: "🔥", cond: (e) => e.mundosCompletados.has(4) },
  { id: "la-bolsa", nom: "Caminante del Agua", desc: "Completa Cuasmal", emoji: "💧", cond: (e) => e.mundosCompletados.has(5) },
  { id: "quiz-master", nom: "Quiz Master", desc: "Juega 3 partidas de quiz", emoji: "🧠", cond: (e) => e.quizJugados >= 3 },
  { id: "constante", nom: "Constante", desc: "Completa 7 retos diarios", emoji: "📅", cond: (e) => (e.retosDiariosTotal || 0) >= 7 },
  { id: "oido-fino", nom: "Oído fino", desc: "Completa 5 retos de Escucha", emoji: "👂", cond: (e) => [...e.misionesCompletadas].filter(id => String(id).startsWith('escucha-')).length >= 5 },
  { id: "buena-memoria", nom: "Buena memoria", desc: "Gana Memoria sin errores", emoji: "🧩", cond: (e) => e.memoriaPerfecta === true },
  { id: "estilo-propio", nom: "Estilo propio", desc: "Personaliza tu avatar", emoji: "🎨", cond: (e) => e.avatarPersonalizado === true },
  { id: "guardian-elegante", nom: "Guardián elegante", desc: "Desbloquea todos los atuendos", emoji: "👑", cond: (e) => CATS_AVATAR.reduce((n, c) => n + atuendosDesbloqueados(e, c).length, 0) >= TOTAL_ATUENDOS },
  { id: "consultor", nom: "Consultor", desc: "Abre el diccionario 10 veces", emoji: "📚", cond: (e) => (e.diccionarioAbierto || 0) >= 10 },
  { id: "repaso-constante", nom: "Repaso constante", desc: "Completa 10 prácticas libres", emoji: "🔁", cond: (e) => (e.practicasTotal || 0) >= 10 },
  { id: "mes-vivo", nom: "Mes vivo", desc: "30 días activos registrados", emoji: "📆", cond: (e) => (e.diasActivos || []).length >= 30 },
  { id: "duelo-competitivo", nom: "Espíritu competitivo", desc: "Juega 5 duelos de 2", emoji: "⚔️", cond: (e) => (e.duelosJugados || 0) >= 5 },
  { id: "50-palabras", nom: "Vocabulario Rico", desc: "50 palabras aprendidas", emoji: "🌟", cond: (e) => e.palabrasVistas.size >= 50 },
  { id: "75-palabras", nom: "Vocabulario completo", desc: "75 palabras aprendidas", emoji: "📚", cond: (e) => e.palabrasVistas.size >= 75 },
  { id: "camino-completo", nom: "El Camino Completo", desc: "Completa los 5 mundos", emoji: "🏆", cond: (e) => e.mundosCompletados.size >= 5 },
  { id: "taita-lengua", nom: "Guardián de las Palabras", desc: "Aprende las 75 palabras y completa los 5 mundos", emoji: "👑", cond: (e) => e.palabrasVistas.size >= 75 && e.mundosCompletados.size >= 5 },
];

export const categorias = ["Todas", ...new Set(palabras.map(p => p.cat))];

// Tipos de misión por mundo (orden de aparición). Cada mundo se completa al
// terminar las 5. Derivar SIEMPRE de aquí: no escribir el número fijo en otro lado.
export const TIPOS_MISION = ['quiz', 'parejas', 'dictado', 'escucha', 'memoria'];

// ─────────────────────────────────────────────────────────────
// AVATAR PERSONALIZABLE (cosmético, no afecta el juego)
// Construido por capas SVG planas. La piel siempre está disponible;
// ropa/sombrero/accesorio se desbloquean con el progreso (idx 0 = inicial).
// `cond(estado)` decide si una opción ya se ganó. Sin cond ⇒ siempre disponible.
// ─────────────────────────────────────────────────────────────
export const AVATAR_OPCIONES = {
  piel: [
    { nombre: 'Tono claro',  color: '#E8B894' },
    { nombre: 'Tono medio',  color: '#C68642' },
    { nombre: 'Tono cálido', color: '#8D5524' },
  ],
  ropa: [
    { nombre: 'Ruana sencilla',    color: '#B86B2E', patron: 'franjas', pista: 'Atuendo inicial' },
    { nombre: 'Ruana del páramo',  color: '#2D5A16', patron: 'rombos',  pista: 'Completa el Mundo 1', cond: (e) => e.mundosCompletados.has(1) },
    { nombre: 'Ruana del encuentro', color: '#1A3A5C', patron: 'franjas', pista: 'Completa el Mundo 3', cond: (e) => e.mundosCompletados.has(3) },
    { nombre: 'Ruana del fogón',   color: '#7A1515', patron: 'rombos',  pista: 'Completa el Mundo 4', cond: (e) => e.mundosCompletados.has(4) },
    { nombre: 'Ruana dorada',      color: '#C49010', patron: 'rombos',  pista: 'Completa los 5 mundos', cond: (e) => e.mundosCompletados.size >= 5 },
  ],
  sombrero: [
    { nombre: 'Sin sombrero',     pista: 'Atuendo inicial' },
    { nombre: 'Sombrero de lana', pista: 'Aprende 10 palabras', cond: (e) => e.palabrasVistas.size >= 10 },
    { nombre: 'Con pluma',        pista: 'Completa el Mundo 2',  cond: (e) => e.mundosCompletados.has(2) },
    { nombre: 'Capucha de ruana', pista: 'Aprende 40 palabras',  cond: (e) => e.palabrasVistas.size >= 40 },
  ],
  accesorio: [
    { nombre: 'Ninguno',          pista: 'Atuendo inicial' },
    { nombre: 'Ave al hombro',    pista: 'Racha de 7 días',     cond: (e) => (e.racha || 0) >= 7 },
    { nombre: 'Faja tejida',      pista: 'Completa el Mundo 4', cond: (e) => e.mundosCompletados.has(4) },
    { nombre: 'Mochila tejida',   pista: 'Aprende 30 palabras', cond: (e) => e.palabrasVistas.size >= 30 },
  ],
};

// Categorías con desbloqueo (la piel queda fuera: siempre disponible)
export const CATS_AVATAR = ['ropa', 'sombrero', 'accesorio'];

// Conserva lo ya ganado aunque baje la racha; también admite partidas antiguas
// sin historial de atuendos. Solo devuelve índices que existen en la categoría.
export function atuendosDesbloqueados(estado, cat) {
  const historial = estado.avatarDesbloqueados?.[cat];
  const ganados = new Set(Array.isArray(historial) ? historial : []);
  return AVATAR_OPCIONES[cat]
    .map((o, i) => (i === 0 || ganados.has(i) || (o.cond ? o.cond(estado) : true)) ? i : -1)
    .filter(i => i >= 0);
}

// Total de atuendos desbloqueables (para el logro "Guardián elegante")
export const TOTAL_ATUENDOS = CATS_AVATAR.reduce((n, c) => n + AVATAR_OPCIONES[c].length, 0);

export const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

// ─────────────────────────────────────────────────────────────
// CINEMATICAS NARRATIVAS entre mundos
// Se muestran la PRIMERA vez que se entra a cada mundo (luego, directo).
// Cada escena: { personaje, fondo, texto, resaltar }.
//  · personaje: clave de assets/images/personajes/ (taita_rimay | uma | pishku | kinti | chutun)
//  · fondo: número de mundo (usa su escenario en color) o 'aurora' (gradiente)
//  · texto: narrativo en español. Las palabras de `resaltar` se pintan en dorado.
//  · resaltar: entradas del listado de `palabras` que aparecen en el texto.
//
// CONTENIDO NARRATIVO — ficción del juego y contextos explicativos en español.
// Las entradas proceden del listado aportado; no se crean traducciones de
// oraciones ni se atribuye al guion una validación cultural o lingüística.
// ─────────────────────────────────────────────────────────────
export const CINEMATICAS = {
  mundo1: {
    titulo: 'Pud · Las Alturas',
    escenas: [
      { personaje: 'taita_rimay', fondo: 1, resaltar: ['Pud', 'Put'],
        texto: 'Nuestro recorrido comienza en las alturas. Pud se relaciona con cerro y altura; Put, con volcán y altura. Observa las formas del paisaje mientras aprendes.' },
      { personaje: 'uma', fondo: 1, resaltar: ['Pa', 'Pe', 'Pepe'],
        texto: 'Mira hacia el cielo: Pa nombra el sol. Pe se relaciona con la luna o media luna, y Pepe con la luna llena. Cada entrada tiene su propio significado.' },
      { personaje: 'pishku', fondo: 1, resaltar: ['Zon', 'Ina'],
        texto: '¡Pío! Zon es la palabra para frailejón e Ina se relaciona con el viento. ¡Exploremos juntos las palabras de este mundo!' },
    ],
  },
  mundo2: {
    titulo: 'Piar · La Tierra que Alimenta',
    escenas: [
      { personaje: 'taita_rimay', fondo: 2, resaltar: ['Piar', 'Turma'],
        texto: 'La chagra nos acerca a las plantas y los alimentos. Piar nombra el maíz y Turma la papa. Sus significados dan inicio a este mundo.' },
      { personaje: 'uma', fondo: 2, resaltar: ['Piaran', 'Poyo'],
        texto: 'También aprenderás acciones y espacios: Piaran se relaciona con desgranar maíz y Poyo con el lugar para guardar papa-semilla.' },
      { personaje: 'pishku', fondo: 2, resaltar: ['Cun', 'Cuat'],
        texto: '¡Sigamos! Cun nombra la yuca y Cuat se relaciona con comer. Observa las imágenes y practica cada entrada a tu ritmo.' },
    ],
  },
  mundo3: {
    titulo: 'Paskal · La Fuerza de la Comunidad',
    escenas: [
      { personaje: 'taita_rimay', fondo: 3, resaltar: ['Pas', 'Cal', 'Paskal'],
        texto: 'El encuentro nos lleva a las palabras de la comunidad. Pas se relaciona con familia; Cal, con trabajo o fuerza; Paskal, con el trabajo comunitario de las familias.' },
      { personaje: 'uma', fondo: 3, resaltar: ['Guanga', 'Cuenda'],
        texto: 'El tejido también tiene sus palabras: Guanga se presenta como telar de mano y Cuenda como hilo o lana. Descubre los elementos que acompañan esta labor.' },
      { personaje: 'pishku', fondo: 3, resaltar: ['Hopa'],
        texto: '¡Una visita abre un nuevo encuentro! Hopa se presenta como saludo al llegar de visita. Vamos a practicarlo junto con las otras entradas de este mundo.' },
    ],
  },
  mundo4: {
    titulo: 'In · El Fuego del Hogar',
    escenas: [
      { personaje: 'taita_rimay', fondo: 4, resaltar: ['In'],
        texto: 'Nos acercamos al hogar y a sus saberes. In reúne los significados fuego, candela y tulpa. Este mundo recorre las palabras del fuego y la cocina.' },
      { personaje: 'uma', fondo: 4, resaltar: ['Chu', 'Chula', 'Chular'],
        texto: 'Presta atención a estas entradas: Chu es leña; Chula, un haz de leña; Chular, hacer haces de leña. Compararlas ayuda a recordar sus diferencias.' },
      { personaje: 'kinti', fondo: 4, resaltar: [],
        texto: 'Cada objeto y cada actividad amplían el recorrido. Voy a repasar las palabras del hogar y sus significados antes de continuar.' },
    ],
  },
  mundo5: {
    titulo: 'Cuasmal · El Camino del Agua',
    escenas: [
      { personaje: 'taita_rimay', fondo: 5, resaltar: ['Cuasmal', 'Cual', 'Cuar'],
        texto: 'Cuasmal da nombre al camino del agua. Cual se relaciona con agua y río; Cuar también incluye quebrada. Observa cada significado mientras recorres este último mundo.' },
      { personaje: 'uma', fondo: 5, resaltar: ['Cuas', 'Gualte'],
        texto: 'Las plantas forman parte de este recorrido. Cuas se relaciona con agua o planta de agua, y Gualte con bejuco de agua.' },
      { personaje: 'pishku', fondo: 5, resaltar: ['Chichacuas'],
        texto: '¡También hay seres por descubrir! Chichacuas se presenta como animal asociado al agua. Consulta el diccionario para repasar cada entrada.' },
      { personaje: 'taita_rimay', fondo: 'aurora', resaltar: [],
        texto: 'Has recorrido las alturas, la chagra, la comunidad, el hogar y el agua. Sigue practicando las palabras y compartiendo tu curiosidad por el territorio.' },
    ],
  },
};
