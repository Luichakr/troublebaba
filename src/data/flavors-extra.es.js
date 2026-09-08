// Испанский текст страниц вкусов: повод, типичные ошибки, FAQ.
// Мерджится в FLAVOR_EXTRA в flavors-extra.js — той же схемой, что
// flavors.es.js мерджится в FLAVORS.
//
// ГРАНИЦА ТА ЖЕ, ЧТО В АНГЛИЙСКОМ ИСТОЧНИКЕ: ни граммов, ни температур,
// ни времени, ни шагов, ни пропорций. Ошибка называет боль, но не даёт
// решение — решение в платном PDF. Переводя, эту границу не сдвигать.
export const EXTRA_ES = {
  'oreo-bento-cake': {
    occasion: 'Una apuesta segura que gusta a todos: un cumpleaños, un regalo de consuelo o un postre con café «porque sí».',
    mistakes: [
      'La galleta Oreo se ablanda y se convierte en pasta tras una noche en la nevera.',
      'La crema de queso se desplaza hacia los lados y las capas crujientes desaparecen en el corte.',
      'El bizcocho de chocolate sale seco y se desmiga al cubrirlo.',
    ],
    faq: [
      { q: '¿Cuánto dura una tarta bento Oreo una vez montada?', a: 'La ventana que recomendamos antes de entregarla al cliente es de 24 horas. La conservación exacta y los límites están en el PDF.' },
      { q: '¿Puedo hornear el bizcocho con antelación?', a: 'Sí, de hecho ayuda a que la miga se asiente. Cuántas horas o días puede reposar antes del montaje se detalla en el PDF.' },
      { q: '¿Es apta para niños?', a: 'Sí: este sabor no lleva alcohol ni especias. Es una de las opciones más seguras para una fiesta infantil.' },
      { q: '¿Qué tamaño tiene la tarta bento Oreo?', a: 'El estándar son 12 cm de diámetro y unos 8 cm de alto. Para 2 personas. La conversión a 8, 10, 14 y 16 cm está en la tabla del PDF.' },
      { q: '¿Cuánto pesa la tarta bento Oreo?', a: 'Unos 650–700 g a 12 cm. Uno de los sabores más densos: bizcocho de chocolate con crema de queso y mantequilla la hace contundente.' },
    ],
  },
  'red-velvet-bento-cake': {
    occasion: 'Un clásico para San Valentín, un aniversario o una despedida de soltera. El bizcocho rojo contra la crema blanca fotografía de maravilla.',
    mistakes: [
      'El rojo se apaga en el horno y la miga sale de un marrón turbio.',
      'La crema de mascarpone llora en el corte y difumina las líneas de las capas.',
      'El coulis de fresa se filtra en el bizcocho y empapa el interior.',
    ],
    faq: [
      { q: '¿Se puede hacer sin colorante?', a: 'Técnicamente sí, pero se pierde el aspecto clásico del Red Velvet. Qué colorantes usamos y en qué proporciones está en el PDF.' },
      { q: '¿Aguanta el transporte?', a: 'Sí, con la estabilización de crema y la temperatura correctas. El PDF explica los detalles.' },
      { q: '¿Y si no encuentro mascarpone?', a: 'La colección enumera sustitutos probados y los criterios para elegir uno (materia grasa, textura).' },
      { q: '¿Qué tamaño tiene la tarta bento Red Velvet?', a: 'El estándar son 12 cm de diámetro y 7,5–8 cm de alto. Para 2 personas. La conversión a 8, 10 y 14 cm está en el PDF.' },
      { q: '¿Cuánto pesa la tarta bento Red Velvet?', a: 'Unos 580–650 g a 12 cm. Más ligera que Oreo, Snickers o Ferrero Rocher: el bizcocho de cacao es menos denso.' },
    ],
  },
  'poppy-seed-citrus-bento-cake': {
    occasion: 'Una elección de verano para quien no persigue el chocolate. Ligera y fresca: funciona para un brunch o una celebración prenupcial.',
    mistakes: [
      'La amapola amarga y arrasa con el sabor del curd.',
      'La crema de queso se corta cuando entra en contacto con el zumo de cítricos.',
      'El curd queda demasiado líquido y se desliza fuera de la tarta durante la conservación.',
    ],
    faq: [
      { q: '¿Puedo sustituir la amapola por otra cosa?', a: 'Sí: la colección incluye notas sobre sustituciones por alergias o preferencias de sabor.' },
      { q: '¿Qué cítrico funciona mejor?', a: 'Usamos una combinación concreta; el PDF explica el por qué y las proporciones.' },
      { q: '¿Cuánto dura el curd?', a: 'El curd se puede preparar con antelación. Su conservación exacta en la nevera está en el PDF.' },
    ],
  },
  'snickers-bento-cake': {
    occasion: 'El sabor «cumpleaños de chicos»: denso y generoso, encaja en la fiesta de un amigo, un pedido de empresa o un regalo del Día del Padre.',
    mistakes: [
      'El caramelo cristaliza y deja una textura arenosa en el corte.',
      'Los cacahuetes se ablandan dentro de la crema y pierden su crujido característico.',
      'La crema se vuelve demasiado dulce y la tarta deja de ser agradable al segundo bocado.',
    ],
    faq: [
      { q: '¿Puedo cambiar el cacahuete por otro fruto seco?', a: 'Sí: la colección indica qué frutos secos conservan el carácter de la tarta y cuáles evitar.' },
      { q: '¿Será demasiado dulce?', a: 'La proporción entre caramelo y crema es lo que lo equilibra. El PDF da números concretos.' },
      { q: '¿Puedo venderla para un pedido infantil?', a: 'De sabor sí, pero al llevar cacahuete conviene confirmar alergias con el cliente antes.' },
      { q: '¿Qué tamaño tiene la tarta bento Snickers?', a: 'El estándar son 12 cm de diámetro y unos 8 cm de alto. Para 2 personas. La conversión a otros diámetros está en el PDF.' },
      { q: '¿Cuánto pesa la tarta bento Snickers?', a: 'Unos 700–750 g a 12 cm. La más pesada de los sabores base: la capa de caramelo y cacahuete suma peso.' },
    ],
  },
  'raffaello-bento-cake': {
    occasion: 'La suave y femenina. Encaja en un aniversario, una mesa dulce de boda, un regalo de primavera.',
    mistakes: [
      'El coco deja hilos fibrosos que se quedan entre los dientes.',
      'El crujiente de almendra se ablanda bajo la crema y desaparece.',
      'La tarta se ve «pálida» y la estructura de capas se pierde en las fotos.',
    ],
    faq: [
      { q: '¿Se puede hacer sin coco?', a: 'Entonces deja de ser Raffaello. La colección tiene otros 9 sabores si el coco no es lo tuyo.' },
      { q: '¿Será demasiado dulce?', a: 'La leche condensada más el coco aportan el dulzor característico. Las proporciones exactas están en el PDF.' },
      { q: '¿Puedo cambiar las almendras?', a: 'Sí: el PDF enumera qué frutos secos aguantan en sabor y textura.' },
    ],
  },
  'ferrero-rocher-bento-cake': {
    occasion: 'La presentación premium: un aniversario, un pedido de empresa, un regalo para un cliente importante. Se ve caro y fotografía como trabajo de marca.',
    mistakes: [
      'La ganache queda demasiado líquida y la capa de barquillo empieza a flotar.',
      'El chocolate con leche lleva el dulzor demasiado lejos y el carácter se pierde.',
      'La ganache cristaliza en la nevera y el corte pierde el brillo.',
    ],
    faq: [
      { q: '¿Puedo usar chocolate negro en lugar de con leche?', a: 'Sí, pero cambia el carácter. El PDF explica cómo reequilibrar las proporciones para que no amargue.' },
      { q: '¿Aguanta un reparto con calor?', a: 'Sí, con la estabilización correcta de la ganache. Las condiciones y la franja de temperatura segura están en la colección.' },
      { q: '¿Necesito equipo especial para la ganache?', a: 'No. Hace falta un manejo cuidadoso de la temperatura, nada extremo. Los pasos están detallados en el PDF.' },
    ],
  },
  'cinnabon-bento-cake': {
    occasion: 'Una elección de temporada fría. Va bien para un cumpleaños de otoño, una merienda acogedora o una mesa de fiestas.',
    mistakes: [
      'La canela raspa la garganta si te pasas con la cantidad.',
      'La crema de mascarpone resbala sobre un bizcocho aún tibio.',
      'El caramelo del interior cuaja como un tofe y corta el labio al primer bocado.',
    ],
    faq: [
      { q: '¿Cuánta canela es «la correcta»?', a: 'El margen es estrecho. Los gramos exactos por porción son uno de los números que te damos en el PDF.' },
      { q: '¿Sirve la canela molida de supermercado?', a: 'Sí: la colección nombra marcas que dan un aroma potente sin amargor.' },
      { q: '¿Resultará pesada la tarta?', a: 'No, con el montaje adecuado. El PDF muestra cómo mantenerla aérea a pesar de la crema densa.' },
    ],
  },
  'pistachio-raspberry-bento-cake': {
    occasion: 'Uno de los pedidos premium de 2026. Encaja en una mesa dulce de boda, una sesión de fotos de estudio, un regalo pensado para Instagram.',
    mistakes: [
      'La pasta de pistacho se apaga hacia el gris y el sabor se vuelve herbáceo.',
      'El coulis de frambuesa se filtra en el bizcocho y tiñe la crema de un rosa turbio.',
      'La crema se vuelve demasiado dulce y ahoga el pistacho, que es delicado.',
    ],
    faq: [
      { q: '¿Puedo usar pasta de pistacho comprada?', a: 'Sí, pero no todas las marcas aguantan. El PDF nombra las probadas y cómo valorar un sustituto.' },
      { q: '¿Puedo cambiar la frambuesa por otra fruta?', a: 'Sí: la colección explica qué frutos rojos mantienen la forma y acompañan la acidez.' },
      { q: '¿El coste por tarta será bastante más alto?', a: 'Sí: el pistacho hace eso. El PDF muestra cómo calcular el coste y fijar un precio de mercado.' },
    ],
  },
  'pina-colada-bento-cake': {
    occasion: 'Ambiente de vacaciones. Encaja en una sesión de playa, una fiesta infantil de temática marinera (en versión sin alcohol) o un pedido de pícnic de verano.',
    mistakes: [
      'El coulis de piña queda demasiado líquido y se extiende bajo el bizcocho.',
      'El coco rallado acapara el sabor y silencia la piña.',
      'El corte se ve «húmedo» por el exceso de jugo.',
    ],
    faq: [
      { q: '¿La receta lleva alcohol?', a: 'La versión que vendemos como tarta infantil, no. La versión para adultos, sí, con una nota breve. Ambas están en el PDF.' },
      { q: '¿Puedo usar piña en conserva?', a: 'Sí: el PDF explica cómo construir la capa sin arrastrar el líquido de más.' },
      { q: '¿Cuánto se mantiene el sabor?', a: 'Con la estabilización correcta, hasta 48 horas. Las condiciones están en el PDF.' },
    ],
  },
  'cherry-chocolate-bento-cake': {
    occasion: 'La Selva Negra en versión bento. Encaja en una mesa de Nochevieja, un cumpleaños de invierno, un regalo para mamá.',
    mistakes: [
      'El coulis de cereza se filtra en el bizcocho de chocolate y el corte se ve turbio.',
      'La ganache tira del bizcocho hacia dentro al enfriarse y la tarta se hunde.',
      'El chocolate se impone a la cereza y el postre pierde su chispa.',
    ],
    faq: [
      { q: '¿Puedo usar cerezas frescas?', a: 'Sí: la colección indica cuándo funciona la fresca, cuándo es mejor la congelada y cómo afecta esa elección a la estructura.' },
      { q: '¿Puedo cambiar el chocolate con leche por negro?', a: 'Sí, y es más tradicional. El PDF explica cómo reequilibrar el dulzor de la crema.' },
      { q: '¿Cuántas horas debe reposar la tarta en la nevera antes de servir?', a: 'El mínimo y el máximo están en el PDF, junto con el motivo de esa franja concreta.' },
    ],
  },
};

export const SECTIONS_ES = {
  reviews: 'Lo que dicen los compradores sobre este sabor',
  occasion: 'Cuándo funciona',
  mistakes: 'Fallos habituales con este sabor',
  mistakesHelp: 'Los puntos de dolor son conocidos; las soluciones exactas (gramos, temperatura, estabilización) están en la colección PDF de pago.',
  faq: 'Preguntas frecuentes sobre esta tarta',
  related: 'También te puede gustar',
  difficulty: 'Dificultad',
  time: 'Tiempo de montaje',
  pdfCta: 'Consigue la receta completa en el PDF',
};

export const DIFFICULTY_ES = { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' };
export const TIME_ES = { short: 'menos de 2 h', medium: '2–3 h', long: 'más de 3 h' };
