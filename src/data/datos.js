// ─────────────────────────────────────────────────────────────
// EL CAMINO DE LA LENGUA
// Vocabulario, mundos y narrativa del pueblo Pasto - Resguardo de Muellamués
//
// Fuentes:
//  · Lengua de los Pastos - Vocabulario Básico y Etimologías Sagradas
//    Academia Nariñense de Historia, Gobernación de Nariño, 2015
//  · Memoria oral del Pueblo Pasto del altiplano nariñense
//  · Asociación Indígena Agroecológica PUMA-MAKI
// ─────────────────────────────────────────────────────────────

export const personajes = [
  {
    id: 'kinti',
    nombre: 'Kinti',
    rol: 'Protagonista',
    emoji: '👦🏽',
    color: '#C49010',
    desc: 'Joven indígena de Muellamués. Curioso, valiente y respetuoso con los mayores. Es a quien tú controlas en el juego.',
    frase: '"¡Voy a recuperar las palabras de mi pueblo!"',
  },
  {
    id: 'taita-rimay',
    nombre: 'Taita Rimay',
    rol: 'Espíritu guía ancestral',
    emoji: '🧙🏽‍♂️',
    color: '#8B4513',
    desc: 'El padre de la palabra. Espíritu sabio envuelto en niebla dorada. Habla solo en pastoker y narra el inicio de cada mundo.',
    frase: '"Solo recuperando las palabras restaurarás el Tuta y el Pued."',
  },
  {
    id: 'uma',
    nombre: 'Uma',
    rol: 'Abuela tejedora',
    emoji: '👵🏽',
    color: '#7A1515',
    desc: 'Tejedora de Muellamués. Habla únicamente en pastoker y solo responde cuando usas las palabras correctas. Te enseña con cariño.',
    frase: '"Pas wawa, rimay Pastoquer."',
  },
  {
    id: 'pishku',
    nombre: 'Pishku',
    rol: 'Pájaro mensajero',
    emoji: '🦜',
    color: '#1A3A5C',
    desc: 'Pájaro de los Andes con plumas del color del quincha. Pronuncia cada palabra nueva y celebra tus logros con cantos.',
    frase: '"¡Pío pío! ¡Pas rimay!"',
  },
  {
    id: 'chutun',
    nombre: 'Los Chutún',
    rol: 'Espíritus traviesos',
    emoji: '👻',
    color: '#2D5A16',
    desc: 'Espíritus neblinosos del páramo. Representan las fuerzas del olvido y te desafían con acertijos lingüísticos.',
    frase: '"Si no sabes nuestra palabra... ¡no pasas!"',
  },
];

export const palabras = [

  // ══════════════════════════════════════════════
  // MUNDO 1 — WARMI URKU (El Páramo, "la montaña madre")
  // ══════════════════════════════════════════════
  { id: 1, p: "Yal", e: "Sol", cat: "Naturaleza", fon: "yal", ej: "Yal pas = buen sol", emoji: "☀️", mundo: 1 },
  { id: 2, p: "Killa", e: "Luna", cat: "Naturaleza", fon: "ki-lla", ej: "Killa pas = hermosa luna", emoji: "🌙", mundo: 1 },
  { id: 3, p: "Izhi", e: "Agua", cat: "Naturaleza", fon: "i-zhi", ej: "Izhi pas = agua limpia", emoji: "💧", mundo: 1 },
  { id: 4, p: "Wayra", e: "Viento / Aire", cat: "Naturaleza", fon: "way-ra", ej: "Wayra pas = buen viento", emoji: "🌬️", mundo: 1 },
  { id: 5, p: "Rumi", e: "Piedra / Roca", cat: "Naturaleza", fon: "ru-mi", ej: "Rumi kwaspi = piedra del cerro", emoji: "🪨", mundo: 1 },
  { id: 6, p: "Nina", e: "Fuego / Candela", cat: "Naturaleza", fon: "ni-na", ej: "Nina pas = buen fuego", emoji: "🔥", mundo: 1 },
  { id: 7, p: "Puyu", e: "Nube", cat: "Naturaleza", fon: "pu-yu", ej: "Puyu killa = nube en la luna", emoji: "☁️", mundo: 1 },
  { id: 8, p: "Pishku", e: "Pájaro", cat: "Naturaleza", fon: "pish-ku", ej: "Pishku pas = hermoso pájaro", emoji: "🐦", mundo: 1 },
  { id: 9, p: "Sacha", e: "Árbol / Bosque", cat: "Naturaleza", fon: "sa-cha", ej: "Sacha kampu = bosque de la tierra", emoji: "🌳", mundo: 1 },
  { id: 10, p: "Kwaspi", e: "Montaña / Cerro", cat: "Naturaleza", fon: "kwas-pi", ej: "Kwaspi alta = cerro alto", emoji: "⛰️", mundo: 1 },
  { id: 51, p: "Pud", e: "Cerro / Loma alta", cat: "Naturaleza", fon: "pud", ej: "Pud kwaspi = loma del cerro", emoji: "🗻", mundo: 1 },
  { id: 52, p: "Imba", e: "Fuego sagrado", cat: "Naturaleza", fon: "im-ba", ej: "Imba nina = fuego sagrado", emoji: "🔥", mundo: 1 },
  { id: 53, p: "Cuas", e: "Agua profunda", cat: "Naturaleza", fon: "cuas", ej: "Cuas izhi = agua profunda", emoji: "🌊", mundo: 1 },
  { id: 54, p: "Ina", e: "Viento grande", cat: "Naturaleza", fon: "i-na", ej: "Ina wayra = gran viento", emoji: "🌪️", mundo: 1 },
  { id: 55, p: "Frailejón", e: "Frailejón del páramo", cat: "Naturaleza", fon: "frai-le-jón", ej: "Frailejón sacha = frailejón sagrado", emoji: "🌵", mundo: 1 },

  // ══════════════════════════════════════════════
  // MUNDO 2 — CHAKRA (La Chagra, "jardín de la vida")
  // ══════════════════════════════════════════════
  { id: 11, p: "Kampu", e: "Tierra / Campo", cat: "Trabajo", fon: "kam-pu", ej: "Kampu pas = buena tierra", emoji: "🌄", mundo: 2 },
  { id: 12, p: "Ural", e: "Alimento / Comida", cat: "Alimentos", fon: "u-ral", ej: "Ural pas = buena comida", emoji: "🍽️", mundo: 2 },
  { id: 13, p: "Rura", e: "Trabajar / Hacer", cat: "Verbos", fon: "ru-ra", ej: "Rura kampu = trabajar la tierra", emoji: "🛠️", mundo: 2 },
  { id: 14, p: "Allpa", e: "Suelo / Barro", cat: "Naturaleza", fon: "all-pa", ej: "Allpa kampu = barro de la tierra", emoji: "🪨", mundo: 2 },
  { id: 15, p: "Yaku", e: "Río / Corriente", cat: "Naturaleza", fon: "ya-ku", ej: "Yaku izhi = río de agua", emoji: "🏞️", mundo: 2 },
  { id: 16, p: "Sisa", e: "Flor del páramo", cat: "Naturaleza", fon: "si-sa", ej: "Sisa pas = flor hermosa", emoji: "🌸", mundo: 2 },
  { id: 17, p: "Kutna", e: "Caminar / Ir", cat: "Verbos", fon: "kut-na", ej: "Kutna kampu = caminar la tierra", emoji: "🚶", mundo: 2 },
  { id: 18, p: "Pas", e: "Bueno / Bien", cat: "Adjetivos", fon: "pas", ej: "Pas awa = buena persona", emoji: "✅", mundo: 2 },
  { id: 19, p: "Izhipa", e: "Lluvia", cat: "Naturaleza", fon: "i-zhi-pa", ej: "Izhipa kampu = lluvia en la tierra", emoji: "🌧️", mundo: 2 },
  { id: 20, p: "Kawsay", e: "Vida / Vivir", cat: "Conceptos", fon: "kaw-say", ej: "Kawsay pas = buena vida", emoji: "🌱", mundo: 2 },
  { id: 56, p: "Piar", e: "Maíz / Grano", cat: "Alimentos", fon: "pi-ar", ej: "Piar ural = alimento de maíz", emoji: "🌽", mundo: 2 },
  { id: 57, p: "Papa", e: "Papa nativa", cat: "Alimentos", fon: "pa-pa", ej: "Papa pas = buena papa", emoji: "🥔", mundo: 2 },
  { id: 58, p: "Chu", e: "Leña / Madera", cat: "Trabajo", fon: "chu", ej: "Chu nina = leña para el fuego", emoji: "🪵", mundo: 2 },
  { id: 59, p: "Minka", e: "Trabajo comunitario", cat: "Trabajo", fon: "min-ka", ej: "Minka awa = trabajo del pueblo", emoji: "🤲", mundo: 2 },
  { id: 60, p: "Tarpuy", e: "Sembrar", cat: "Verbos", fon: "tar-puy", ej: "Tarpuy piar = sembrar maíz", emoji: "🌱", mundo: 2 },

  // ══════════════════════════════════════════════
  // MUNDO 3 — TIYANAKU (El Mercado, "lugar del encuentro")
  // ══════════════════════════════════════════════
  { id: 21, p: "Maza", e: "Uno", cat: "Números", fon: "ma-za", ej: "Maza awa = una persona", emoji: "1️⃣", mundo: 3 },
  { id: 22, p: "Mazta", e: "Dos", cat: "Números", fon: "maz-ta", ej: "Mazta awa = dos personas", emoji: "2️⃣", mundo: 3 },
  { id: 23, p: "Kimsa", e: "Tres", cat: "Números", fon: "kim-sa", ej: "Kimsa awa = tres personas", emoji: "3️⃣", mundo: 3 },
  { id: 24, p: "Tawa", e: "Cuatro", cat: "Números", fon: "ta-wa", ej: "Tawa awa = cuatro personas", emoji: "4️⃣", mundo: 3 },
  { id: 25, p: "Pichka", e: "Cinco", cat: "Números", fon: "pich-ka", ej: "Pichka awa = cinco personas", emoji: "5️⃣", mundo: 3 },
  { id: 26, p: "Sukta", e: "Seis", cat: "Números", fon: "suk-ta", ej: "Sukta awa = seis personas", emoji: "6️⃣", mundo: 3 },
  { id: 27, p: "Kanchis", e: "Siete", cat: "Números", fon: "kan-chis", ej: "Kanchis = siete", emoji: "7️⃣", mundo: 3 },
  { id: 28, p: "Tama", e: "Nombre", cat: "Saludos", fon: "ta-ma", ej: "¿Tama kinti? = ¿cómo te llamas?", emoji: "🏷️", mundo: 3 },
  { id: 29, p: "Pasna", e: "Feliz / Contento", cat: "Emociones", fon: "pas-na", ej: "Minta pasna = estamos felices", emoji: "😊", mundo: 3 },
  { id: 30, p: "Rimay", e: "Lengua / Idioma", cat: "Conceptos", fon: "ri-may", ej: "Rimay Pastoquer = habla Pastoquer", emoji: "🗣️", mundo: 3 },
  { id: 61, p: "Allinllu", e: "¿Cómo estás?", cat: "Saludos", fon: "a-llin-llu", ej: "Allinllu, kimu = ¿cómo estás, hermano?", emoji: "👋", mundo: 3 },
  { id: 62, p: "Yupaychay", e: "Gracias", cat: "Saludos", fon: "yu-pay-chay", ej: "Yupaychay, uma = gracias, madre", emoji: "🙏", mundo: 3 },
  { id: 63, p: "Rantiy", e: "Comprar / Intercambiar", cat: "Verbos", fon: "ran-tiy", ej: "Rantiy ural = comprar comida", emoji: "🛒", mundo: 3 },
  { id: 64, p: "Quri", e: "Oro / Dorado", cat: "Adjetivos", fon: "qu-ri", ej: "Quri yal = sol dorado", emoji: "✨", mundo: 3 },
  { id: 65, p: "Puka", e: "Rojo", cat: "Colores", fon: "pu-ka", ej: "Puka sisa = flor roja", emoji: "🔴", mundo: 3 },

  // ══════════════════════════════════════════════
  // MUNDO 4 — TULPA (El Fogón, "fuego sagrado")
  // ══════════════════════════════════════════════
  { id: 31, p: "Uma", e: "Madre", cat: "Familia", fon: "u-ma", ej: "Uma pas = buena madre", emoji: "👩", mundo: 4 },
  { id: 32, p: "Taita", e: "Padre / Señor", cat: "Familia", fon: "tai-ta", ej: "Taita awa = padre del pueblo", emoji: "👨", mundo: 4 },
  { id: 33, p: "Wawa", e: "Niño / Niña", cat: "Familia", fon: "wa-wa", ej: "Wawa awa = niño del pueblo", emoji: "👶", mundo: 4 },
  { id: 34, p: "Kimu", e: "Hermano", cat: "Familia", fon: "ki-mu", ej: "Kimu awa = mi hermano", emoji: "👦", mundo: 4 },
  { id: 35, p: "Pana", e: "Hermana", cat: "Familia", fon: "pa-na", ej: "Pana pas = buena hermana", emoji: "👧", mundo: 4 },
  { id: 36, p: "Munay", e: "Amor / Querer", cat: "Emociones", fon: "mu-nay", ej: "Munay awa = amar al pueblo", emoji: "💖", mundo: 4 },
  { id: 37, p: "Shina", e: "Corazón", cat: "Cuerpo", fon: "shi-na", ej: "Shina pas = buen corazón", emoji: "❤️", mundo: 4 },
  { id: 38, p: "Kuyay", e: "Cariño", cat: "Emociones", fon: "ku-yay", ej: "Kuyay uma = querer a mamá", emoji: "🤗", mundo: 4 },
  { id: 39, p: "Pit", e: "Hablar / Decir", cat: "Verbos", fon: "pit", ej: "Minta pit = nosotros hablamos", emoji: "💬", mundo: 4 },
  { id: 40, p: "Minta", e: "Nosotros", cat: "Pronombres", fon: "min-ta", ej: "Minta awa = somos el pueblo", emoji: "🤝", mundo: 4 },
  { id: 66, p: "Tulpa", e: "Fogón sagrado", cat: "Lugares", fon: "tul-pa", ej: "Tulpa nina = fuego del hogar", emoji: "🔥", mundo: 4 },
  { id: 67, p: "Hawi", e: "Canción / Canto", cat: "Cultura", fon: "ha-wi", ej: "Hawi uma = canto de la madre", emoji: "🎵", mundo: 4 },
  { id: 68, p: "Willay", e: "Contar historia", cat: "Verbos", fon: "wi-llay", ej: "Willay taita = contar al padre", emoji: "📖", mundo: 4 },
  { id: 69, p: "Chumbe", e: "Faja tejida sagrada", cat: "Cultura", fon: "chum-be", ej: "Chumbe pana = faja de la hermana", emoji: "🧶", mundo: 4 },
  { id: 70, p: "Puñuy", e: "Dormir", cat: "Verbos", fon: "pu-ñuy", ej: "Puñuy wawa = dormir el niño", emoji: "😴", mundo: 4 },

  // ══════════════════════════════════════════════
  // MUNDO 5 — FUENTES DE VIDA("el espejo del tiempo")
  // ══════════════════════════════════════════════
  { id: 41, p: "Awa", e: "Gente / Pueblo", cat: "Personas", fon: "a-wa", ej: "Awa pas = buena gente", emoji: "👥", mundo: 5 },
  { id: 42, p: "Yachay", e: "Saber / Conocer", cat: "Verbos", fon: "ya-chay", ej: "Yachay pas = saber bien", emoji: "🧠", mundo: 5 },
  { id: 43, p: "Kinta", e: "Casa / Hogar", cat: "Lugares", fon: "kin-ta", ej: "Kinta pas = buena casa", emoji: "🏠", mundo: 5 },
  { id: 44, p: "Allkay", e: "Estar bien / Sanar", cat: "Verbos", fon: "all-kay", ej: "Minta allkay = estamos bien", emoji: "🙏", mundo: 5 },
  { id: 45, p: "Kausay", e: "Existir / Ser", cat: "Verbos", fon: "kau-say", ej: "Kausay awa = el pueblo existe", emoji: "✨", mundo: 5 },
  { id: 46, p: "Sumak", e: "Hermoso / Bello", cat: "Adjetivos", fon: "su-mak", ej: "Sumak kampu = hermosa tierra", emoji: "🌟", mundo: 5 },
  { id: 47, p: "Hatun", e: "Grande / Mayor", cat: "Adjetivos", fon: "ha-tun", ej: "Hatun awa = persona mayor", emoji: "🏔️", mundo: 5 },
  { id: 48, p: "Uchilla", e: "Pequeño / Chico", cat: "Adjetivos", fon: "u-chi-lla", ej: "Uchilla wawa = niño pequeño", emoji: "🌱", mundo: 5 },
  { id: 49, p: "Pacha", e: "Tiempo / Tierra sagrada", cat: "Conceptos", fon: "pa-cha", ej: "Pacha mama = madre tierra", emoji: "🌍", mundo: 5 },
  { id: 50, p: "Samay", e: "Respirar / Descansar", cat: "Verbos", fon: "sa-may", ej: "Samay pas = descansar bien", emoji: "🌿", mundo: 5 },
  { id: 71, p: "Tuta", e: "Espiral del centro / Sabiduría ancestral", cat: "Sagrado", fon: "tu-ta", ej: "Tuta awa = espiral del pueblo", emoji: "🌀", mundo: 5 },
  { id: 72, p: "Pued", e: "Círculo sagrado del territorio", cat: "Sagrado", fon: "pued", ej: "Pued kampu = círculo de la tierra", emoji: "⭕", mundo: 5 },
  { id: 73, p: "Muellamues", e: "Centro del tiempo y del espacio", cat: "Lugares", fon: "mue-lla-mues", ej: "Muellamues = origen del pueblo", emoji: "🏛️", mundo: 5 },
  { id: 74, p: "Cumbal", e: "Volcán sagrado", cat: "Lugares", fon: "cum-bal", ej: "Cumbal kwaspi = volcán sagrado", emoji: "🌋", mundo: 5 },
  { id: 75, p: "La Bolsa", e: "Laguna sagrada del territorio", cat: "Lugares", fon: "la-bol-sa", ej: "Laguna La Bolsa = espejo del tiempo", emoji: "🌊", mundo: 5 },
];

export const mundos = [
  { id: 1, titulo: "Warmi Urku", subtitulo: "La Montaña Madre", emoji: "🏔️", color: "#1E4010", desc: "Páramo del altiplano. Aprende los nombres de la naturaleza.", palabrasIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 51, 52, 53, 54, 55] },
  { id: 2, titulo: "Chakra", subtitulo: "Jardín de la Vida", emoji: "🌱", color: "#2D5A16", desc: "Chagra comunitaria. Aprende plantas, alimentos y trabajo colectivo.", palabrasIds: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 56, 57, 58, 59, 60] },
  { id: 3, titulo: "Tiyanaku", subtitulo: "Lugar del Encuentro", emoji: "🛒", color: "#8B4513", desc: "Mercado de Guachucal. Aprende números, saludos y colores.", palabrasIds: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 61, 62, 63, 64, 65] },
  { id: 4, titulo: "Tulpa", subtitulo: "Fuego Sagrado", emoji: "🔥", color: "#7A1515", desc: "El fogón familiar. Aprende familia, emociones y narración oral.", palabrasIds: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 66, 67, 68, 69, 70] },
  { id: 5, titulo: "Fuentes de vida", subtitulo: "Madre agua", emoji: "💧", color: "#1A3A5C", desc: "Sitio sagrado. Restaura el Tuta y el Pued con todo lo aprendido.", palabrasIds: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 71, 72, 73, 74, 75] },
];

export const frases = [
  { id: 1, past: "Pas rimay", esp: "Buenas palabras", ctx: "Saludo de bienvenida", cat: "Saludos", mundo: 1 },
  { id: 2, past: "Minta kawsay pas", esp: "Nuestra vida es buena", ctx: "Expresión de bienestar comunitario", cat: "Saludos", mundo: 1 },
  { id: 3, past: "Yal pas killa pas", esp: "El sol y la luna son buenos", ctx: "Aprecio por la naturaleza andina", cat: "Naturaleza", mundo: 1 },
  { id: 4, past: "Cuas izhi kwaspi", esp: "Agua profunda del cerro sagrado", ctx: "Saber del agua del páramo", cat: "Naturaleza", mundo: 1 },
  { id: 5, past: "Kampu pas kawsay", esp: "La tierra es vida buena", ctx: "Filosofía del pueblo Pasto", cat: "Identidad", mundo: 2 },
  { id: 6, past: "Piar ural pas", esp: "El maíz es buen alimento", ctx: "Alimento sagrado del pueblo", cat: "Alimentos", mundo: 2 },
  { id: 7, past: "Minta minka rura kampu", esp: "Trabajamos juntos la tierra (minga)", ctx: "Trabajo comunitario sagrado", cat: "Trabajo", mundo: 2 },
  { id: 8, past: "Allinllu, kimu", esp: "¿Cómo estás, hermano?", ctx: "Saludo entre comuneros del pueblo", cat: "Saludos", mundo: 3 },
  { id: 9, past: "Yupaychay, uma", esp: "Gracias, madre", ctx: "Agradecimiento ritual a la abuela", cat: "Saludos", mundo: 3 },
  { id: 10, past: "Maza minta awa", esp: "Somos un solo pueblo", ctx: "Identidad comunitaria", cat: "Identidad", mundo: 3 },
  { id: 11, past: "Tulpa nina uma", esp: "El fuego del hogar es la madre", ctx: "Cosmovisión del fogón sagrado", cat: "Familia", mundo: 4 },
  { id: 12, past: "Munay shina kawsay", esp: "Vivir con amor en el corazón", ctx: "Filosofía de vida Pasto", cat: "Sabiduría", mundo: 4 },
  { id: 13, past: "Hawi uma wawa", esp: "Canto de la madre al niño", ctx: "Cantos de cuna ancestrales", cat: "Cultura", mundo: 4 },
  { id: 14, past: "Tuta Pued kawsay", esp: "La espiral y el círculo dan vida", ctx: "Restauración del territorio sagrado", cat: "Sagrado", mundo: 5 },
  { id: 15, past: "Muellamues pacha awa", esp: "Muellamués es el origen del pueblo", ctx: "Centro del tiempo y del espacio", cat: "Identidad", mundo: 5 },
  { id: 16, past: "Cumbal yal hatun", esp: "El volcán Cumbal es el gran sol", ctx: "Sitio sagrado del territorio", cat: "Naturaleza", mundo: 5 },
  { id: 17, past: "Minta pit Pastoquer", esp: "Nosotros hablamos Pastoquer", ctx: "Identidad lingüística", cat: "Lengua", mundo: 5 },
  { id: 18, past: "Yachay rimay sumak", esp: "Saber hablar es hermoso", ctx: "Valor del conocimiento", cat: "Sabiduría", mundo: 5 },
];

export const logros = [
  { id: "primera-palabra", nom: "Primera palabra", desc: "Aprende tu primera palabra", emoji: "🌱", cond: (e) => e.palabrasVistas.size >= 1 },
  { id: "explorador", nom: "Explorador", desc: "10 palabras aprendidas", emoji: "🔍", cond: (e) => e.palabrasVistas.size >= 10 },
  { id: "warmi-urku", nom: "Hijo del Páramo", desc: "Completa Warmi Urku", emoji: "🏔️", cond: (e) => e.mundosCompletados.has(1) },
  { id: "chakra", nom: "Hijo de la Chagra", desc: "Completa Chakra", emoji: "🌱", cond: (e) => e.mundosCompletados.has(2) },
  { id: "tiyanaku", nom: "Comerciante del Pueblo", desc: "Completa Tiyanaku", emoji: "🛒", cond: (e) => e.mundosCompletados.has(3) },
  { id: "tulpa", nom: "Fuego del Hogar", desc: "Completa Tulpa", emoji: "🔥", cond: (e) => e.mundosCompletados.has(4) },
  { id: "la-bolsa", nom: "Guardián de La Bolsa", desc: "Completa Laguna La Bolsa", emoji: "💧", cond: (e) => e.mundosCompletados.has(5) },
  { id: "quiz-master", nom: "Quiz Master", desc: "Juega 3 partidas de quiz", emoji: "🧠", cond: (e) => e.quizJugados >= 3 },
  { id: "50-palabras", nom: "Vocabulario Rico", desc: "50 palabras aprendidas", emoji: "🌟", cond: (e) => e.palabrasVistas.size >= 50 },
  { id: "75-palabras", nom: "Conocedor del Pastoker", desc: "75 palabras aprendidas", emoji: "📚", cond: (e) => e.palabrasVistas.size >= 75 },
  { id: "camino-completo", nom: "El Camino Completo", desc: "Completa los 5 mundos", emoji: "🏆", cond: (e) => e.mundosCompletados.size >= 5 },
  { id: "taita-lengua", nom: "Taita de la Lengua", desc: "Restaura el Tuta y el Pued", emoji: "👑", cond: (e) => e.palabrasVistas.size >= 75 && e.mundosCompletados.size >= 5 },
];

export const categorias = ["Todas", ...new Set(palabras.map(p => p.cat))];

export const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
