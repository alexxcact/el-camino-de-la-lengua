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
    id: 1, p: "Zon", e: "Frailejón", cat: "Naturaleza", fon: "zon", ej: "Zon: la raíz se asocia a 'poder, noble, espiritual'; el frailejón (Espeletia grandiflora) figura en esta sección.", emoji: "🌿", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 81–88; frailejón: Paz y Miño, 1940, p. 173", nota: "Asignación nombre–planta aproximada por el formato del libro."
  },
  {
    id: 2, p: "Ina", e: "Viento", cat: "Naturaleza", fon: "ina", ej: "Ina: raíz 'viento'.", emoji: "🌬️", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Jijón y Caamaño, 1943, p. 227; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual)", nota: "Coincide en ambos libros."
  },
  {
    id: 3, p: "Chill", e: "Cielo", cat: "Naturaleza", fon: "chill", ej: "Chill: sufijo/prefijo 'cielo'.", emoji: "🌌", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Nicolás Abasolo Narváez; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual)", nota: "Coincide."
  },
  {
    id: 4, p: "Chil", e: "Frío / helado", cat: "Naturaleza", fon: "chil", ej: "Chil: 'frío' o 'helado' (variante 'chi').", emoji: "❄️", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Jijón y Caamaño", nota: "Coincide."
  },
  {
    id: 5, p: "Pud", e: "Cerro / altura", cat: "Territorio", fon: "pud", ej: "Pud: sufijo 'cerro, altura'.", emoji: "⛰️", mundo: 1,
    tipo: "raiz", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, 1923: 27; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('el Pud… monte o altura')", nota: "Coincide en ambos libros."
  },
  {
    id: 6, p: "Put", e: "Volcán / altura", cat: "Territorio", fon: "put", ej: "Put: prefijo 'volcán, altura'.", emoji: "🌋", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · José Rafael Sañudo", nota: "Coincide."
  },
  {
    id: 7, p: "Pa", e: "Sol", cat: "Naturaleza", fon: "pa", ej: "Pa: prefijo 'sol'.", emoji: "☀️", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) (raíz awá pit) · AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('PA – SOL')", nota: "En la lista pasto–español del Aukusan 'Pa' figura además como 'hablar'."
  },
  {
    id: 8, p: "Pe", e: "Luna / media luna", cat: "Naturaleza", fon: "pe", ej: "Pe: sufijo/prefijo 'luna, media luna'.", emoji: "🌙", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Jijón y Caamaño, 1941, p. 131", nota: "Coincide."
  },
  {
    id: 9, p: "Pepe", e: "Luna llena", cat: "Naturaleza", fon: "pepe", ej: "Pepe: 'gran luna' o 'luna llena'.", emoji: "🌕", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Taller Lenguas Madres, Ipiales, 2015", nota: "Coincide."
  },
  {
    id: 10, p: "Pingal", e: "Arco iris", cat: "Naturaleza", fon: "pingal", ej: "Pingal: 'arco iris'.", emoji: "🌈", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Nicolás Abasolo, 1999; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual)", nota: "Coincide."
  },
  {
    id: 11, p: "Pue", e: "Redondo / círculo", cat: "Formas", fon: "pue", ej: "Pue: 'redondo, círculo'; también 'grano, semilla'.", emoji: "⭕", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Paz y Miño, 1940: 166–173; símbolos sagrados (Aldemar Ruano; L. I. Muñoz Cordero)", nota: "La variante 'Pued' = símbolo 'redondo/círculo'."
  },
  {
    id: 12, p: "Tuta", e: "Espiral / centro", cat: "Formas", fon: "tuta", ej: "Tuta: 'la espiral', 'el centro'; el cosmos o universo.", emoji: "🌀", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Símbolos sagrados: Taita Efrén Tarapués; L. I. Muñoz Cordero", nota: "En quechua/muisca 'tuta' = noche/oscuridad."
  },
  {
    id: 13, p: "Punch", e: "Blanco", cat: "Colores", fon: "punch", ej: "Punch: 'blanco' (variante 'puch').", emoji: "⚪", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Nicolás Abasolo, 1999; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('Puch')", nota: "Coincide."
  },
  {
    id: 14, p: "Pulan", e: "Amarillo", cat: "Colores", fon: "pulan", ej: "Pulan: 'amarillo' (variante 'palan').", emoji: "🟡", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Nicolás Abasolo, 1999; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('Palan')", nota: "Coincide."
  },
  {
    id: 15, p: "Cuanda", e: "Rojo", cat: "Colores", fon: "cuanda", ej: "Cuanda: 'rojo' (variante 'launda').", emoji: "🔴", mundo: 1,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, 1947, p. 17; Taller Lenguas Madres, Cumbal, 2015; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('Launda')", nota: "Atribución de columna aproximada por la extracción del PDF."
  },

  // MUNDO 2 — Piar · La Tierra que Alimenta
  {
    id: 16, p: "Piar", e: "Maíz", cat: "Alimentos", fon: "piar", ej: "Piar: sustantivo 'maíz' (idioma de Muellamués).", emoji: "🌽", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Tomás Hidalgo, 1913: 41; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('Piar es maíz en Muellamués')", nota: "También registrado 'piar' = 'humo' (Jijón y Caamaño, 1919, p. 343)."
  },
  {
    id: 17, p: "Piaran", e: "Desgranar maíz", cat: "Acciones", fon: "piaran", ej: "Piaran: de 'piar' (maíz) + 'an' (bajar/abajo).", emoji: "🌽", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 81, 87", nota: "Coincide."
  },
  {
    id: 18, p: "Turma", e: "Papa", cat: "Alimentos", fon: "turma", ej: "Turma: de 'to' (tierra/monte) + 'ma' (final): la papa del final de la tierra.", emoji: "🥔", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 87–88", nota: "Asignación de columna aproximada por la extracción del PDF."
  },
  {
    id: 19, p: "Yacuara", e: "Rama de la papa", cat: "Plantas", fon: "yacuara", ej: "Yacuara: 'rama de la papa' (de la casa, seca o verde).", emoji: "🌱", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Javier H. Cuacialpud, Taller Lenguas Madres, 2015", nota: "El libro precisa 'rama de la papa', no 'planta'."
  },
  {
    id: 20, p: "Caguara", e: "Bejuco del gran poder", cat: "Plantas", fon: "caguara", ej: "Caguara: de 'ca/gua' (grande, poder) + 'te' (bejuco): bejuco del gran poder.", emoji: "🌿", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, p. 81", nota: "Corrige el significado previo ('variedad de papa'), no documentado. Conviene revisar categoría e ilustración."
  },
  {
    id: 21, p: "Puli", e: "Fruto", cat: "Alimentos", fon: "puli", ej: "Puli: sustantivo 'fruto'.", emoji: "🍒", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · versión oral de Javier H. Cuacialpud, 2015", nota: "Coincide."
  },
  {
    id: 22, p: "Capulí", e: "Gran fruto", cat: "Alimentos", fon: "capulí", ej: "Capulí: de 'ca' (grande) + 'pulí' (fruto); también árbol del tamaño del cerezo.", emoji: "🍒", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 81–82; Grijalba, 1947, pp. 215–216", nota: "Coincide."
  },
  {
    id: 23, p: "Cun", e: "Yuca", cat: "Alimentos", fon: "cun", ej: "Cun: 'yuca'.", emoji: "🍠", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · tabla de etimologías (Ascuntar)", nota: "En el glosario de afijos 'cun' figura además como 'grande' (awá pit)."
  },
  {
    id: 24, p: "Cuat", e: "Comer", cat: "Acciones", fon: "cuat", ej: "Cuat: verbo 'comer, alimentar'.", emoji: "🍽️", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · tabla de etimologías (Pupiales); Taller Lenguas Madres, Ipiales, 2015", nota: "En el Aukusan, 'cuat' se asocia a 'hombre/pertenencia' (Cuatín)."
  },
  {
    id: 25, p: "Yan", e: "Sal", cat: "Alimentos", fon: "yan", ej: "Yan: 'sal'.", emoji: "🧂", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · tablas (Yanalá, Yanascual); AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('YAN – SAL')", nota: "Polisemia documentada: 'yan' también 'casa' / 'planta o alimento de la casa'."
  },
  {
    id: 26, p: "Yamata", e: "Rica sal", cat: "Alimentos", fon: "yamata", ej: "Yamata: de 'yan/yam' (sal) + 'ta' (alto, valioso).", emoji: "🧂", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 87–88", nota: "Asignación de columna aproximada."
  },
  {
    id: 27, p: "Yaguacha", e: "Alimento de la casa grande", cat: "Alimentos", fon: "yaguacha", ej: "Yaguacha: de 'ya/yal/yar' (casa) + 'gua' (grande) + 'cha' (alimento, sabroso).", emoji: "🍲", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 87–88", nota: "Coincide."
  },
  {
    id: 28, p: "Tarta", e: "Planta valiosa", cat: "Plantas", fon: "tarta", ej: "Tarta: de 'tar' (planta/árbol) + 'ta' (alto, valioso).", emoji: "🌿", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 87–88", nota: "Asignación de columna aproximada."
  },
  {
    id: 29, p: "Tar", e: "Planta / árbol", cat: "Plantas", fon: "tar", ej: "Tar: 'planta', 'árbol'.", emoji: "🌳", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Paz y Miño, 1940, p. 163; González Suárez, 1908; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('TAR… plantas nativas')", nota: "Coincide."
  },
  {
    id: 30, p: "Poyo", e: "Sitio para guardar la papa-semilla", cat: "Lugares", fon: "poyo", ej: "Poyo: de 'po' (redondo) + 'yo' (resguardo): sitio donde se guardan las papas-semilla para sembrarlas.", emoji: "🏠", mundo: 2,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Humberto J. Cuacialpud, Males (Córdoba), p. 97", nota: "Coincide."
  },

  // MUNDO 3 — Paskal · La Fuerza de la Comunidad
  {
    id: 31, p: "Pas", e: "Familia", cat: "Comunidad", fon: "pas", ej: "Pas: sustantivo 'familia'.", emoji: "👪", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba y Paz y Miño, 1940, pp. 163, 173; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('PAS – Familia')", nota: "En topónimos también 'pueblo'."
  },
  {
    id: 32, p: "Cal", e: "Trabajo / fuerza", cat: "Comunidad", fon: "cal", ej: "Cal: 'trabajo, fuerza' ('cuán grandioso es trabajar').", emoji: "💪", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Aquiles Pérez, 1980: 13; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('CAL – trabajar')", nota: "Coincide."
  },
  {
    id: 33, p: "Paskal", e: "Trabajo comunitario (minga)", cat: "Comunidad", fon: "paskal", ej: "Paskal: de 'pas' (familia) + 'cal' (trabajo): trabajo comunitario pasto, la minga.", emoji: "🤝", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) · nota lingüística", nota: "No figura en el vocabulario de la ANH; documentado en el Aukusan."
  },
  {
    id: 34, p: "Gua", e: "Hermano / hermana", cat: "Comunidad", fon: "gua", ej: "Gua: 'hermano/hermana'; también 'grande, bueno, hermoso'.", emoji: "🧑‍🤝‍🧑", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Nicolás Abasolo, 1999; Grijalba, 1940", nota: "Coincide."
  },
  {
    id: 35, p: "Au", e: "Voz / grito", cat: "Comunidad", fon: "au", ej: "Au: onomatopeya 'voz, grito'.", emoji: "🗣️", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · versión oral de Aldemar Ruano, 2015; L. I. Muñoz, 2015", nota: "Coincide."
  },
  {
    id: 36, p: "Car", e: "Traer / cargar", cat: "Acciones", fon: "car", ej: "Car: verbo 'traer'.", emoji: "📦", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · tabla de etimologías (Teguacar)", nota: "En el glosario, 'traer/cargar' se documenta sobre todo en 'cual/cuar' y 'mai/mar/mal'."
  },
  {
    id: 37, p: "Mal", e: "Ir", cat: "Acciones", fon: "mal", ej: "Mal: verbo 'ir'; también 'traer/cargar' (mai/mar/mal).", emoji: "🚶", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Nicolás Abasolo Narváez, 1999 ('Río de los viajes')", nota: "Coincide."
  },
  {
    id: 38, p: "Que", e: "Hacer / crear", cat: "Acciones", fon: "que", ej: "Que: verbo 'hacer'; en etimologías 'crear, tejer, fundar'.", emoji: "🛠️", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Jijón y Caamaño, 1919, p. 358", nota: "Coincide."
  },
  {
    id: 39, p: "Quer", e: "Pueblo / tierra / lugar", cat: "Territorio", fon: "quer", ej: "Quer: 'pueblo, tierra, sitio, lugar, llano'.", emoji: "🏘️", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Paz y Miño, 1940, pp. 163–173", nota: "Coincide."
  },
  {
    id: 40, p: "Guanga", e: "Telar de mano", cat: "Tejido", fon: "guanga", ej: "Guanga (Huanga): el cuadro de los cuatro maderos principales del telar de mano.", emoji: "🧵", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Objetos de labor; Grijalba, 1947, p. 222", nota: "El libro define la guanga como el armazón del telar de mano."
  },
  {
    id: 41, p: "Guango", e: "Atado / copo de lana", cat: "Tejido", fon: "guango", ej: "Guango (Huango): copo de lana o algodón escarmentado; haz o atado de algo.", emoji: "🧶", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, 1947, p. 222", nota: "Coincide."
  },
  {
    id: 42, p: "Cuenda", e: "Hilo / lana", cat: "Tejido", fon: "cuenda", ej: "Cuenda: de 'cue' (hilo, lana); el cordón de hebras que sujeta la madeja al lavarla.", emoji: "🧶", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, p. 216", nota: "Coincide en la raíz; la cuenda es el cordón para amarrar la madeja."
  },
  {
    id: 43, p: "Quinchil", e: "Instrumento del telar", cat: "Tejido", fon: "quinchil", ej: "Quinchil: de 'que/qui' (hacer, tejer): instrumento para acabar y pulir el tejido.", emoji: "🧵", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Objetos de labor", nota: "Columna de significado aproximada por la extracción."
  },
  {
    id: 44, p: "Chindé", e: "Cesta de bejuco o lana", cat: "Tejido", fon: "chindé", ej: "Chindé: cesta de bejuco o lana (en el Carchi, 'Chendé'); de 'chi' (alto) + 'te' (bejuco).", emoji: "🧺", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, pp. 36, 219", nota: "Coincide."
  },
  {
    id: 45, p: "Hopa", e: "Saludo de llegada a la visita", cat: "Comunidad", fon: "hopa", ej: "Hopa: saludo al llegar de visita ('¡hópa casero!', en Ospina).", emoji: "👋", mundo: 3,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Humberto J. Cuacialpud, Males (Córdoba)", nota: "Coincide."
  },

  // MUNDO 4 — In · El Fuego del Hogar
  {
    id: 46, p: "In", e: "Fuego / candela / tulpa", cat: "Hogar", fon: "in", ej: "In: 'fuego, candela, tulpa'; también 'calor, cocina'.", emoji: "🔥", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · idioma de Muellamués, S. E. Ortiz, 1965, p. 59; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('In – Fuego')", nota: "Coincide."
  },
  {
    id: 47, p: "Chu", e: "Leña", cat: "Hogar", fon: "chu", ej: "Chu: sustantivo 'leña' (chu/cho).", emoji: "🪵", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · glosario de afijos; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('Chu – Leña')", nota: "Coincide."
  },
  {
    id: 48, p: "Chula", e: "Haz de leña", cat: "Hogar", fon: "chula", ej: "Chula: de 'chu' (leña) + 'la' (ahí): hacecillo o guango de leña.", emoji: "🪵", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, p. 221", nota: "En el Aukusan 'Chula' figura como 'manto de mujer'; el hacecillo documentado es de trigo o cebada."
  },
  {
    id: 49, p: "Chular", e: "Hacer haces de leña", cat: "Acciones", fon: "chular", ej: "Chular: hacer chulas, formar hacecillos (documentado como espigar trigo/cebada).", emoji: "🪵", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, p. 221", nota: "Coincide por etimología."
  },
  {
    id: 50, p: "Imbuera", e: "Unión del fuego", cat: "Hogar", fon: "imbuera", ej: "Imbuera: de 'in/im' (fuego) + 'buera' (unir).", emoji: "🔥", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, p. 225", nota: "El objeto documentado es la pared lateral de las casas pajizas."
  },
  {
    id: 51, p: "Tacín", e: "Fuego de cama / abrigo", cat: "Hogar", fon: "tacín", ej: "Tacín: el libro registra el nombre pero no una traducción; raíz 'cha' (valioso).", emoji: "🛏️", mundo: 4,
    tipo: "entrada", respaldo: "pendiente_validacion", fuente: "Sin respaldo documental verificado: el nombre aparece en el libro sin traducción.", nota: "Significado 'fuego de cama/abrigo' no documentado; pendiente de validación comunitaria."
  },
  {
    id: 52, p: "Chapil", e: "Bebida sabrosa", cat: "Alimentos", fon: "chapil", ej: "Chapil: de 'cha' (sabroso) + 'pi' (bebida, agua).", emoji: "🥤", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Comidas, p. 94; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) (bebidas sagradas)", nota: "En el Aukusan es una bebida sagrada."
  },
  {
    id: 53, p: "Chicha", e: "Bebida tradicional", cat: "Alimentos", fon: "chicha", ej: "Chicha: bebida sagrada (de maíz/caña); raíz 'cha' (fuerza, energía).", emoji: "🥤", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) (bebidas sagradas); Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) (raíz 'cha')", nota: "El vocabulario de la ANH registra la raíz pero no traduce 'chicha'."
  },
  {
    id: 54, p: "Chara", e: "Sopa de cebada", cat: "Alimentos", fon: "chara", ej: "Chara: colada de arroz de cebada preparada en el Carchi; raíz 'cha' (sabroso).", emoji: "🥣", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Comidas; Grijalba, p. 218", nota: "Coincide."
  },
  {
    id: 55, p: "Canchape", e: "Bebida o alimento", cat: "Alimentos", fon: "canchape", ej: "Canchape: de 'ca/gua' (grande, noble): bebida o alimento para agradar al noble.", emoji: "🍵", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Comidas, p. 94", nota: "Coincide."
  },
  {
    id: 56, p: "Guamuca", e: "Planta sagrada de ofrenda", cat: "Alimentos", fon: "guamuca", ej: "Guamuca: planta sagrada; su pepa sirve para limpiar y fumigar; usada en ofrendas.", emoji: "🍵", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 85–86 (Octaviano Cuarán); AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual)", nota: "El vocabulario la describe como planta; el Aukusan la agrupa entre bebidas sagradas. Revisar categoría."
  },
  {
    id: 57, p: "Guanto", e: "Planta poderosa", cat: "Plantas", fon: "guanto", ej: "Guanto: planta de poder ('gran regalo de poder, por esto revela y puede mirar'); floripondio.", emoji: "🌿", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, pp. 85–86 (Octaviano Cuarán)", nota: "Coincide."
  },
  {
    id: 58, p: "Chuma", e: "Final de la leña", cat: "Hogar", fon: "chuma", ej: "Chuma: de 'chu' (leña) + 'ma' (final).", emoji: "🪵", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Comidas/Otros, p. 95", nota: "Atribución de columna aproximada."
  },
  {
    id: 59, p: "Pilche", e: "Vasija para beber", cat: "Hogar", fon: "pilche", ej: "Pilche: vasija semiesférica (corteza de coco u otro fruto) que reemplaza al vaso; de 'pi' (agua) + 'che' (espuma).", emoji: "🥣", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, p. 229", nota: "Coincide."
  },
  {
    id: 60, p: "Cumba", e: "Techo con respiradero", cat: "Hogar", fon: "cumba", ej: "Cumba: techo con respiradero, remate de casa de paja; haz de paja para el remate.", emoji: "🏠", mundo: 4,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Arteaga, 1910, p. 53; Grijalba, 1947, p. 25", nota: "Coincide."
  },

  // MUNDO 5 — Cuasmal · El Camino del Agua
  {
    id: 61, p: "Cual", e: "Agua / río", cat: "Agua", fon: "cual", ej: "Cual: 'agua, río, quebrada, húmeda'; verbo 'bañar, mojar'.", emoji: "💧", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · tablas de etimologías", nota: "En el glosario de afijos 'cual' figura como raíz homófona 'traer'."
  },
  {
    id: 62, p: "Cuar", e: "Agua / río / quebrada", cat: "Agua", fon: "cuar", ej: "Cuar: 'agua, río, quebrada'; también 'rana'.", emoji: "🏞️", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · tablas de etimologías", nota: "Coincide."
  },
  {
    id: 63, p: "Fuel", e: "Quebrada / agua", cat: "Agua", fon: "fuel", ej: "Fuel: 'quebrada, agua' (fuel/guel).", emoji: "🏞️", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Jijón y Caamaño, 1940; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('FUEL – AGUA')", nota: "Coincide exactamente en ambos libros."
  },
  {
    id: 64, p: "Pi", e: "Agua / río / líquido", cat: "Agua", fon: "pi", ej: "Pi: 'agua, río, líquido' (pi/pis/bi); también 'bebida'.", emoji: "💧", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) (raíz awá pit); Jijón y Caamaño, 1919: 344; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('Pi – Agua, río, líquido')", nota: "Coincide."
  },
  {
    id: 65, p: "Es", e: "Agua / río / lugar", cat: "Agua", fon: "es", ej: "Es: 'agua, río, pueblo, lugar'.", emoji: "💧", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Paz y Miño, 1940, p. 173", nota: "Coincide."
  },
  {
    id: 66, p: "Cuas", e: "Agua / planta de agua", cat: "Agua", fon: "cuas", ej: "Cuas: 'agua, planta de agua, madera roja, río, quebrada, manantial'.", emoji: "🌿", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Taller Lenguas Madres, Ipiales, 2015; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual)", nota: "En el Aukusan, 'Cuas' también es una planta y un pueblo (Cuaspud, 'colina de agua')."
  },
  {
    id: 67, p: "Gualte", e: "Bejuco de agua", cat: "Plantas", fon: "gualte", ej: "Gualte: de 'gual' (agua) + 'te' (bejuco): bejuco de agua.", emoji: "🌿", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, p. 86", nota: "Asignación de columna aproximada; verificar en el PDF."
  },
  {
    id: 68, p: "Gualguán", e: "Poder del agua", cat: "Agua", fon: "gualguán", ej: "Gualguán: de 'gual' (agua) + 'guan' (poder).", emoji: "🌊", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, p. 86", nota: "Asignación de columna aproximada; verificar en el PDF."
  },
  {
    id: 69, p: "Guapil", e: "Planta del agua grande", cat: "Plantas", fon: "guapil", ej: "Guapil: de 'gua' (grande) + 'pi' (agua): planta del agua grande.", emoji: "🌱", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, p. 87", nota: "Coincide."
  },
  {
    id: 70, p: "Cuarris", e: "Planta que va hacia el Sol", cat: "Plantas", fon: "cuarris", ej: "Cuarris: de 'cuar' (agua/río): '(planta que) va hacia el Sol'.", emoji: "🌱", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, p. 87", nota: "Corrige el significado previo ('planta del sitio del agua'), no documentado."
  },
  {
    id: 71, p: "Pipisiqui", e: "Fruto que hace agua", cat: "Alimentos", fon: "pipisiqui", ej: "Pipisiqui: de 'pi' (agua): '(fruto que) hace agua'; designa una papa de la provincia de los Pastos.", emoji: "🍒", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnofitónimos, p. 88; Grijalba, 1947, p. 105", nota: "El libro precisa que designa una papa."
  },
  {
    id: 72, p: "Chichacuas", e: "Animal de agua de lo alto", cat: "Animales", fon: "chichacuas", ej: "Chichacuas: '(animal) agradable de agua de lo alto'; al picar produce escozor.", emoji: "🐾", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnozoónimos, p. 89; Grijalba, p. 222", nota: "Coincide (animal + agua)."
  },
  {
    id: 73, p: "Cuatín", e: "El hombre de la tierra", cat: "Comunidad", fon: "cuatín", ej: "Cuatín: apellido/cacique pasto; en el Aukusan, 'el hombre de la tierra' (cuat, 'hombre').", emoji: "🧑🏽", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) · nota lingüística; Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Grijalba, 1947, pp. 18, 20", nota: "Corrige el significado previo ('animal del fuego y agua'); documentado como nombre/apellido. Revisar categoría e ilustración."
  },
  {
    id: 74, p: "Cusumbe", e: "Animal viejo del agua", cat: "Animales", fon: "cusumbe", ej: "Cusumbe: roedor mayor que el conejo que daña las sementeras; de 'cu' (animal). También apellido en el Carchi.", emoji: "🐾", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etnozoónimos, p. 90; Grijalba, pp. 26, 217", nota: "Asignación de columna aproximada; verificar en el PDF."
  },
  {
    id: 75, p: "Cuasmal", e: "Ir del agua / río", cat: "Agua", fon: "cuasmal", ej: "Cuasmal: de 'cuas' (agua) + 'mal' (ir): 'ir del agua'; como topónimo, el río Cuasmal.", emoji: "🌊", mundo: 5,
    tipo: "entrada", respaldo: "documentado", fuente: "Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas (Academia Nariñense de Historia, 2015) · Etimologías, p. 91; AUKUSAN – Nuestra Palabra Sagrada (Cabildo Indígena del Gran Tescual) ('CUAS – Agua, MAL – Ir')", nota: "Coincide en ambos libros."
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
  { id: 9, past: "Paskal", esp: "Trabajo comunitario (minga)", ctx: "Paskal presenta el trabajo comunitario de las familias.", cat: "Comunidad", mundo: 3 },
  { id: 10, past: "Hopa", esp: "Saludo de llegada a la visita", ctx: "Hopa se relaciona con el saludo al llegar de visita y con el encuentro entre personas.", cat: "Comunidad", mundo: 3 },
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
