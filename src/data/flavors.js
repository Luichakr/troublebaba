// Per-flavor preview content for /recipes/<slug>/ SEO pages.
// PREVIEW ONLY — no actual recipe (no grams, no steps, no quantities).

// Localized flavor copy (es/de/fr/it/pt) lives in sibling files and is merged
// into each flavor's `t` + RECIPES_HUB at the bottom of this module.
import { FLAVORS_ES, HUB_ES } from './flavors.es.js';
import { FLAVORS_DE, HUB_DE } from './flavors.de.js';
import { FLAVORS_FR, HUB_FR } from './flavors.fr.js';
import { FLAVORS_IT, HUB_IT } from './flavors.it.js';
import { FLAVORS_PT, HUB_PT } from './flavors.pt.js';

export const FLAVORS = [
  {
    slug: 'oreo-bento-cake',
    image: '/images/q9.webp',
    bestseller: true,
    t: {
      uk: {
        name: 'Oreo',
        layers: 'Шоколадний бісквіт · крем-чиз з Oreo',
        lead: 'Бенто-торт Oreo — це глибокий шоколадний смак із делікатною вишневою кислинкою. Хрустка крихта печива, ніжний крем-чиз і яскраве кюлі роблять його незмінним фаворитом на замовлення. Один із найпопулярніших смаків збірника.',
        learn: ['Пропорції бісквіту та крему', 'Як зібрати рівні шари', 'Яке печиво обрати', 'Стабілізація й нарізка'],
        metaTitle: 'Бенто-торт Oreo — рецепт з пропорціями | TROUBLEBABA',
        metaDesc: 'Oreo бенто торт: шоколад, крем-чиз і вишневе кюлі. Повний рецепт із пропорціями та збіркою — у платному PDF-збірнику TROUBLEBABA.',
      },
      ru: {
        name: 'Oreo',
        layers: 'Шоколадный бисквит · крем-чиз с Oreo',
        lead: 'Бенто-торт Oreo — это насыщенный шоколадный вкус с лёгкой вишнёвой кислинкой. Хрустящая крошка печенья, нежный крем-чиз и яркое кюли делают его фаворитом на заказ. Один из самых продаваемых вкусов в сборнике.',
        learn: ['Точные граммовки бисквита и крема', 'Как собрать ровные слои', 'Какое печенье использовать', 'Стабилизация и нарезка'],
        metaTitle: 'Бенто-торт Oreo — рецепт с пропорциями | TROUBLEBABA',
        metaDesc: 'Oreo бенто торт: шоколад, крем-чиз и вишнёвое кюли. Полный рецепт с граммовками и сборкой — в платном PDF-сборнике TROUBLEBABA.',
      },
      pl: {
        name: 'Oreo',
        layers: 'Biszkopt czekoladowy · krem serowy · wiśniowe coulis',
        lead: 'Tort bento Oreo to głęboki smak czekolady z delikatną wiśniową nutą. Chrupiące okruchy ciastek, aksamitny krem serowy i wyraziste coulis czynią go ulubieńcem na zamówienie. Jeden z najchętniej wybieranych smaków w zbiorze.',
        learn: ['Proporcje biszkoptu i kremu', 'Jak złożyć równe warstwy', 'Które ciastka wybrać', 'Stabilizacja i krojenie'],
        metaTitle: 'Tort bento Oreo — przepis z proporcjami | TROUBLEBABA',
        metaDesc: 'Oreo tort bento: czekolada, krem serowy i wiśniowe coulis. Pełny przepis z proporcjami i montażem — w płatnym zbiorze PDF TROUBLEBABA.',
      },
      en: {
        name: 'Oreo',
        layers: 'Chocolate sponge · cream cheese · cherry coulis',
        lead: 'The Oreo bento cake delivers a deep chocolate flavour with a bright hint of cherry. Crunchy cookie crumbs, silky cream cheese and a vivid coulis make it a runaway favourite to order. One of the best-selling flavours in the collection.',
        learn: ['Sponge and cream proportions', 'How to build even layers', 'Which cookies to use', 'Stabilising and slicing'],
        metaTitle: 'Bento cake Oreo — recipe with proportions | TROUBLEBABA',
        metaDesc: 'Oreo bento cake: chocolate, cream cheese and cherry coulis. The full recipe with proportions and assembly lives in the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'red-velvet-bento-cake',
    image: '/images/q10.webp',
    t: {
      uk: {
        name: 'Червоний оксамит',
        layers: 'Бісквіт червоний оксамит · крем на основі маскарпоне · полуничне кюлі',
        lead: 'Бенто-торт «Червоний оксамит» закохує з першого погляду яскравим кольором і оксамитовою текстурою. Крем на маскарпоне та соковита полуниця додають свіжості, а ніжний м’якуш тане в роті. Чудовий вибір для романтичних приводів.',
        learn: ['Як отримати насичений колір', 'Текстура оксамитового бісквіту', 'Робота з маскарпоне', 'Складання й оздоблення'],
        metaTitle: 'Бенто-торт Червоний оксамит — рецепт | TROUBLEBABA',
        metaDesc: 'Червоний оксамит бенто торт із маскарпоне та полуницею. Повний рецепт із пропорціями та порадами — у платному PDF-збірнику TROUBLEBABA.',
      },
      ru: {
        name: 'Красный бархат',
        layers: 'Бисквит красный бархат · крем на основе маскарпоне · клубничное кюли',
        lead: 'Бенто-торт «Красный бархат» влюбляет с первого взгляда ярким цветом и бархатистой текстурой. Крем на маскарпоне и сочная клубника добавляют свежести, а нежный мякиш тает во рту. Отличный выбор для романтичных поводов.',
        learn: ['Как добиться насыщенного цвета', 'Текстура бархатного бисквита', 'Работа с маскарпоне', 'Сборка и оформление'],
        metaTitle: 'Бенто-торт Красный бархат — рецепт | TROUBLEBABA',
        metaDesc: 'Красный бархат бенто торт с маскарпоне и клубникой. Полный рецепт с граммовками и советами — в платном PDF-сборнике TROUBLEBABA.',
      },
      pl: {
        name: 'Czerwony aksamit',
        layers: 'Czerwony biszkopt · mascarpone · truskawka',
        lead: 'Tort bento Czerwony aksamit zachwyca od pierwszego spojrzenia intensywnym kolorem i aksamitną teksturą. Krem na mascarpone i soczysta truskawka dodają świeżości, a delikatny miękisz rozpływa się w ustach. Idealny na romantyczne okazje.',
        learn: ['Jak uzyskać głęboki kolor', 'Tekstura aksamitnego biszkoptu', 'Praca z mascarpone', 'Montaż i dekoracja'],
        metaTitle: 'Tort bento Red Velvet — przepis | TROUBLEBABA',
        metaDesc: 'Czerwony aksamit tort bento z mascarpone i truskawką. Pełny przepis z proporcjami i wskazówkami — w płatnym zbiorze PDF TROUBLEBABA.',
      },
      en: {
        name: 'Red Velvet',
        layers: 'Red velvet sponge · mascarpone · strawberry',
        lead: 'The Red Velvet bento cake wins hearts at first sight with its vivid colour and velvety crumb. Mascarpone cream and juicy strawberry add freshness, while the tender sponge melts in the mouth. A perfect pick for romantic occasions.',
        learn: ['How to get a deep colour', 'The velvet sponge texture', 'Working with mascarpone', 'Assembly and finishing'],
        metaTitle: 'Bento cake Red Velvet — recipe with proportions | TROUBLEBABA',
        metaDesc: 'Red Velvet bento cake with mascarpone and strawberry. The full recipe with proportions and tips is inside the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'poppy-seed-citrus-bento-cake',
    image: '/images/q3.webp',
    t: {
      uk: {
        name: 'Мак-цитрус',
        layers: 'Ванільний бісквіт з маком · цитрусовий крем-чиз · цитрусовий курд',
        lead: 'Бенто-торт «Мак-цитрус» дарує свіжий і трохи дорослий смак. Ароматний маковий бісквіт зустрічається з яскравим цитрусовим курдом, а крем-чиз пом’якшує кислинку. Легкий і незвичний десерт для тих, хто шукає щось особливе.',
        learn: ['Баланс маку та цитрусу', 'Як приготувати курд', 'Текстура макового бісквіту', 'Складання й подача'],
        metaTitle: 'Мак-цитрус бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Мак-цитрус бенто торт із цитрусовим курдом і крем-чизом. Повний рецепт із пропорціями — у платному PDF-збірнику TROUBLEBABA.',
      },
      ru: {
        name: 'Мак-цитрус',
        layers: 'Ванильный бисквит с маком · цитрусовый крем-чиз · цитрусовый курд',
        lead: 'Бенто-торт «Мак-цитрус» дарит свежий и чуть более взрослый вкус. Ароматный маковый бисквит встречается с ярким цитрусовым курдом, а крем-чиз смягчает кислинку. Лёгкий и необычный десерт для тех, кто ищет что-то особенное.',
        learn: ['Баланс мака и цитруса', 'Как приготовить курд', 'Текстура макового бисквита', 'Сборка и подача'],
        metaTitle: 'Мак-цитрус бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Мак-цитрус бенто торт с цитрусовым курдом и крем-чизом. Полный рецепт с граммовками — в платном PDF-сборнике TROUBLEBABA.',
      },
      pl: {
        name: 'Mak-cytrus',
        layers: 'Biszkopt makowy · lemon curd · krem serowy',
        lead: 'Tort bento Mak-cytrus oferuje świeży i nieco bardziej dojrzały smak. Aromatyczny biszkopt makowy spotyka się z wyrazistym lemon curd, a krem serowy łagodzi kwaskowatość. Lekki i nietypowy deser dla tych, którzy szukają czegoś wyjątkowego.',
        learn: ['Balans maku i cytrusów', 'Jak przygotować lemon curd', 'Tekstura biszkoptu makowego', 'Montaż i podanie'],
        metaTitle: 'Mak-cytrus tort bento — przepis | TROUBLEBABA',
        metaDesc: 'Mak-cytrus tort bento z lemon curd i kremem serowym. Pełny przepis z proporcjami — w płatnym zbiorze PDF TROUBLEBABA.',
      },
      en: {
        name: 'Poppy Seed & Citrus',
        layers: 'Poppy seed sponge · citrus curd · cream cheese',
        lead: 'The Poppy Seed & Citrus bento cake brings a fresh, slightly grown-up flavour. A fragrant poppy seed sponge meets a bright citrus curd, while cream cheese softens the tang. A light, unexpected dessert for anyone after something special.',
        learn: ['Balancing poppy and citrus', 'How to cook the curd', 'The poppy seed sponge texture', 'Assembly and serving'],
        metaTitle: 'Poppy Seed & Citrus bento cake — recipe | TROUBLEBABA',
        metaDesc: 'Poppy Seed & Citrus bento cake with citrus curd and cream cheese. The full recipe with proportions is inside the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'snickers-bento-cake',
    image: '/images/q8.webp',
    t: {
      uk: {
        name: 'Snickers',
        layers: 'Шоколадний бісквіт · шоколадний крем-чиз · солона карамель',
        lead: 'Бенто-торт Snickers — це сміливе поєднання шоколаду, солоного арахісу й тягучої карамелі. Крем-чиз урівноважує насиченість, а горіхи додають хрусткості. Ідеальний вибір для любителів ситних і яскравих десертів.',
        learn: ['Як зварити тягучу карамель', 'Підготовка арахісу', 'Баланс солодкого й солоного', 'Складання шарів'],
        metaTitle: 'Бенто-торт Snickers — рецепт | TROUBLEBABA',
        metaDesc: 'Snickers бенто торт: шоколад, арахіс і карамель. Повний рецепт із пропорціями та збіркою — у платному PDF-збірнику TROUBLEBABA.',
      },
      ru: {
        name: 'Snickers',
        layers: 'Шоколадный бисквит · шоколадный крем-чиз · солёная карамель',
        lead: 'Бенто-торт Snickers — это смелое сочетание шоколада, солёного арахиса и тягучей карамели. Крем-чиз уравновешивает насыщенность, а орехи добавляют хруста. Идеальный выбор для любителей сытных и ярких десертов.',
        learn: ['Как сварить тягучую карамель', 'Подготовка арахиса', 'Баланс сладкого и солёного', 'Сборка слоёв'],
        metaTitle: 'Бенто-торт Snickers — рецепт | TROUBLEBABA',
        metaDesc: 'Snickers бенто торт: шоколад, арахис и карамель. Полный рецепт с граммовками и сборкой — в платном PDF-сборнике TROUBLEBABA.',
      },
      pl: {
        name: 'Snickers',
        layers: 'Czekolada · orzeszki · karmel · krem serowy',
        lead: 'Tort bento Snickers to odważne połączenie czekolady, słonych orzeszków i ciągnącego się karmelu. Krem serowy równoważy intensywność, a orzeszki dodają chrupkości. Idealny wybór dla miłośników sytych i wyrazistych deserów.',
        learn: ['Jak ugotować ciągnący karmel', 'Przygotowanie orzeszków', 'Balans słodkiego i słonego', 'Montaż warstw'],
        metaTitle: 'Tort bento Snickers — przepis | TROUBLEBABA',
        metaDesc: 'Snickers tort bento: czekolada, orzeszki i karmel. Pełny przepis z proporcjami i montażem — w płatnym zbiorze PDF TROUBLEBABA.',
      },
      en: {
        name: 'Snickers',
        layers: 'Chocolate · peanuts · caramel · cream cheese',
        lead: 'The Snickers bento cake is a bold mix of chocolate, salted peanuts and stretchy caramel. Cream cheese balances the richness while the nuts add crunch. The ideal choice for fans of indulgent, full-flavoured desserts.',
        learn: ['How to cook stretchy caramel', 'Preparing the peanuts', 'Balancing sweet and salty', 'Layering it all together'],
        metaTitle: 'Bento cake Snickers — recipe | TROUBLEBABA',
        metaDesc: 'Snickers bento cake: chocolate, peanuts and caramel. The full recipe with proportions and assembly lives in the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'raffaello-bento-cake',
    image: '/images/q1.webp',
    t: {
      uk: {
        name: 'Raffaello',
        layers: 'Кокосово-мигдальний бісквіт · крем Raffaello · хрусткий шар',
        lead: 'Бенто-торт Raffaello — це ніжний кокосовий смак із делікатними нотками мигдалю. Повітряний бісквіт і шовковистий вершковий крем нагадують улюблені цукерки, але в форматі святкового десерту. Легкий, елегантний і дуже фотогенічний.',
        learn: ['Як домогтися кокосової текстури', 'Робота з вершковим кремом', 'Підготовка мигдалю', 'Оздоблення кокосовою стружкою'],
        metaTitle: 'Raffaello бенто-торт — рецепт у збірнику | TROUBLEBABA',
        metaDesc: 'Raffaello бенто торт: кокос, вершковий крем і мигдаль. Повний рецепт із пропорціями — у платному PDF-збірнику TROUBLEBABA.',
      },
      ru: {
        name: 'Raffaello',
        layers: 'Кокосово-миндальный бисквит · крем Raffaello · хрустящий слой',
        lead: 'Бенто-торт Raffaello — это нежный кокосовый вкус с деликатными нотками миндаля. Воздушный бисквит и шелковистый сливочный крем напоминают любимые конфеты, но в формате праздничного десерта. Лёгкий, элегантный и очень фотогеничный.',
        learn: ['Как добиться кокосовой текстуры', 'Работа со сливочным кремом', 'Подготовка миндаля', 'Оформление кокосовой стружкой'],
        metaTitle: 'Raffaello бенто-торт — рецепт в сборнике | TROUBLEBABA',
        metaDesc: 'Raffaello бенто торт: кокос, сливочный крем и миндаль. Полный рецепт с граммовками — в платном PDF-сборнике TROUBLEBABA.',
      },
      pl: {
        name: 'Raffaello',
        layers: 'Biszkopt kokosowy · krem śmietankowy · migdał',
        lead: 'Tort bento Raffaello to delikatny smak kokosa z subtelną nutą migdału. Puszysty biszkopt i jedwabisty krem śmietankowy przypominają ulubione praliny, ale w formie świątecznego deseru. Lekki, elegancki i bardzo fotogeniczny.',
        learn: ['Jak uzyskać teksturę kokosa', 'Praca z kremem śmietankowym', 'Przygotowanie migdałów', 'Dekoracja wiórkami kokosowymi'],
        metaTitle: 'Raffaello tort bento — przepis w zbiorze | TROUBLEBABA',
        metaDesc: 'Raffaello tort bento: kokos, krem śmietankowy i migdał. Pełny przepis z proporcjami — w płatnym zbiorze PDF TROUBLEBABA.',
      },
      en: {
        name: 'Raffaello',
        layers: 'Coconut sponge · cream · almond',
        lead: 'The Raffaello bento cake offers a gentle coconut flavour with a delicate almond note. An airy sponge and silky cream echo the beloved candy, reimagined as a celebration dessert. Light, elegant and wonderfully photogenic.',
        learn: ['How to nail the coconut texture', 'Working with the cream', 'Preparing the almonds', 'Finishing with coconut flakes'],
        metaTitle: 'Raffaello bento cake — recipe in the collection | TROUBLEBABA',
        metaDesc: 'Raffaello bento cake: coconut, cream and almond. The full recipe with proportions is inside the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'ferrero-rocher-bento-cake',
    image: '/images/q5.webp',
    t: {
      uk: {
        name: 'Ferrero Rocher',
        layers: 'Шоколадний бісквіт · ганаш на молочному шоколаді · хрусткий шар',
        lead: 'Бенто-торт Ferrero Rocher — справжня насолода для шанувальників горіхів і шоколаду. Насичений какао-бісквіт, ароматне праліне й хрусткий лісовий горіх створюють розкішний смак знаменитих цукерок. Вишуканий десерт для особливих моментів.',
        learn: ['Як приготувати праліне', 'Обробка лісового горіха', 'Насиченість шоколадного шару', 'Складання й декор'],
        metaTitle: 'Ferrero Rocher бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Ferrero Rocher бенто торт: шоколад, лісовий горіх і праліне. Повний рецепт із пропорціями — у платному PDF-збірнику TROUBLEBABA.',
      },
      ru: {
        name: 'Ferrero Rocher',
        layers: 'Шоколадный бисквит · ганаш на молочном шоколаде · хрустящий слой',
        lead: 'Бенто-торт Ferrero Rocher — настоящее наслаждение для поклонников орехов и шоколада. Насыщенный какао-бисквит, ароматное пралине и хрустящий лесной орех воссоздают роскошный вкус знаменитых конфет. Изысканный десерт для особых моментов.',
        learn: ['Как приготовить пралине', 'Обработка лесного ореха', 'Насыщенность шоколадного слоя', 'Сборка и декор'],
        metaTitle: 'Ferrero Rocher бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Ferrero Rocher бенто торт: шоколад, лесной орех и пралине. Полный рецепт с граммовками — в платном PDF-сборнике TROUBLEBABA.',
      },
      pl: {
        name: 'Ferrero Rocher',
        layers: 'Czekolada · orzech laskowy · praliny',
        lead: 'Tort bento Ferrero Rocher to prawdziwa rozkosz dla miłośników orzechów i czekolady. Intensywny biszkopt kakaowy, aromatyczne praliny i chrupiący orzech laskowy odtwarzają luksusowy smak słynnych pralinek. Wykwintny deser na wyjątkowe chwile.',
        learn: ['Jak przygotować praliny', 'Obróbka orzecha laskowego', 'Intensywność warstwy czekolady', 'Montaż i dekoracja'],
        metaTitle: 'Ferrero Rocher tort bento — przepis | TROUBLEBABA',
        metaDesc: 'Ferrero Rocher tort bento: czekolada, orzech laskowy i praliny. Pełny przepis z proporcjami — w płatnym zbiorze PDF TROUBLEBABA.',
      },
      en: {
        name: 'Ferrero Rocher',
        layers: 'Chocolate · hazelnut · praliné',
        lead: 'The Ferrero Rocher bento cake is pure bliss for nut and chocolate lovers. A rich cocoa sponge, fragrant praliné and crunchy hazelnut recreate the luxurious taste of the famous chocolates. A refined dessert for special moments.',
        learn: ['How to make the praliné', 'Prepping the hazelnuts', 'Getting the chocolate layer rich', 'Assembly and decoration'],
        metaTitle: 'Ferrero Rocher bento cake — recipe | TROUBLEBABA',
        metaDesc: 'Ferrero Rocher bento cake: chocolate, hazelnut and praliné. The full recipe with proportions is inside the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'cinnabon-bento-cake',
    image: '/images/q6.webp',
    t: {
      uk: {
        name: 'Cinnabon',
        layers: 'Ванільний бісквіт · крем на основі маскарпоне · солона карамель',
        lead: 'Бенто-торт Cinnabon переносить у затишок свіжої випічки з корицею. Теплий пряний смак, горіхові нотки й ніжний вершковий крем-чиз нагадують знамениті булочки. Ароматний десерт, який особливо смакує прохолодними вечорами.',
        learn: ['Збірка відрізняється — описана окремо', 'Як збалансувати корицю', 'Підготовка горіхів', 'Робота з крем-чизом'],
        metaTitle: 'Cinnabon бенто-торт — рецепт у збірнику | TROUBLEBABA',
        metaDesc: 'Cinnabon бенто торт: кориця, горіхи й вершковий крем-чиз. Повний рецепт із пропорціями — у платному PDF-збірнику TROUBLEBABA.',
      },
      ru: {
        name: 'Cinnabon',
        layers: 'Ванильный бисквит · крем на основе маскарпоне · солёная карамель',
        lead: 'Бенто-торт Cinnabon переносит в уют свежей выпечки с корицей. Тёплый пряный вкус, ореховые нотки и нежный сливочный крем-чиз напоминают знаменитые булочки. Ароматный десерт, который особенно хорош прохладными вечерами.',
        learn: ['Сборка отличается — описана отдельно', 'Как сбалансировать корицу', 'Подготовка орехов', 'Работа с крем-чизом'],
        metaTitle: 'Cinnabon бенто-торт — рецепт в сборнике | TROUBLEBABA',
        metaDesc: 'Cinnabon бенто торт: корица, орехи и сливочный крем-чиз. Полный рецепт с граммовками — в платном PDF-сборнике TROUBLEBABA.',
      },
      pl: {
        name: 'Cinnabon',
        layers: 'Cynamonowo-orzechowy · krem serowy',
        lead: 'Tort bento Cinnabon przenosi w przytulny świat świeżych wypieków z cynamonem. Ciepły, korzenny smak, orzechowe nuty i aksamitny krem serowy przypominają słynne bułeczki. Aromatyczny deser, który najlepiej smakuje chłodnymi wieczorami.',
        learn: ['Montaż jest inny — opisany osobno', 'Jak zbalansować cynamon', 'Przygotowanie orzechów', 'Praca z kremem serowym'],
        metaTitle: 'Cinnabon tort bento — przepis w zbiorze | TROUBLEBABA',
        metaDesc: 'Cinnabon tort bento: cynamon, orzechy i krem serowy. Pełny przepis z proporcjami — w płatnym zbiorze PDF TROUBLEBABA.',
      },
      en: {
        name: 'Cinnabon',
        layers: 'Cinnamon-nut · cream cheese',
        lead: 'The Cinnabon bento cake brings the cosy comfort of fresh cinnamon baking. Warm spice, nutty notes and a tender cream cheese frosting echo the famous rolls. A fragrant dessert that tastes especially good on cool evenings.',
        learn: ['Assembly differs — covered separately', 'How to balance the cinnamon', 'Preparing the nuts', 'Working with cream cheese'],
        metaTitle: 'Cinnabon bento cake — recipe in the collection | TROUBLEBABA',
        metaDesc: 'Cinnabon bento cake: cinnamon, nuts and cream cheese frosting. The full recipe with proportions is inside the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'pistachio-raspberry-bento-cake',
    image: '/images/q2.webp',
    t: {
      uk: {
        name: 'Фісташка-малина',
        layers: 'Фісташковий бісквіт · фісташковий крем · малинове кюлі',
        lead: 'Бенто-торт «Фісташка-малина» — стильна класика кондитерських трендів. М’який фісташковий бісквіт із горіховою глибиною чудово грає з кислинкою малинового кюлі. Витончений смак і впізнавана зелено-рожева естетика.',
        learn: ['Як підкреслити смак фісташки', 'Приготування малинового кюлі', 'Контраст кольорів і смаків', 'Складання й нарізка'],
        metaTitle: 'Фісташка-малина бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Фісташка-малина бенто торт із фісташковим бісквітом і малиновим кюлі. Повний рецепт із пропорціями — у платному PDF TROUBLEBABA.',
      },
      ru: {
        name: 'Фисташка-малина',
        layers: 'Фисташковый бисквит · фисташковый крем · малиновое кюли',
        lead: 'Бенто-торт «Фисташка-малина» — стильная классика кондитерских трендов. Мягкий фисташковый бисквит с ореховой глубиной прекрасно играет с кислинкой малинового кюли. Утончённый вкус и узнаваемая зелёно-розовая эстетика.',
        learn: ['Как подчеркнуть вкус фисташки', 'Приготовление малинового кюли', 'Контраст цветов и вкусов', 'Сборка и нарезка'],
        metaTitle: 'Фисташка-малина бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Фисташка-малина бенто торт с фисташковым бисквитом и малиновым кюли. Полный рецепт с граммовками — в платном PDF TROUBLEBABA.',
      },
      pl: {
        name: 'Pistacja-malina',
        layers: 'Biszkopt pistacjowy · malinowe coulis',
        lead: 'Tort bento Pistacja-malina to stylowa klasyka cukierniczych trendów. Miękki biszkopt pistacjowy z orzechową głębią pięknie współgra z kwaskowatością malinowego coulis. Wyrafinowany smak i rozpoznawalna zielono-różowa estetyka.',
        learn: ['Jak podkreślić smak pistacji', 'Przygotowanie malinowego coulis', 'Kontrast kolorów i smaków', 'Montaż i krojenie'],
        metaTitle: 'Pistacja-malina tort bento — przepis | TROUBLEBABA',
        metaDesc: 'Pistacja-malina tort bento z biszkoptem pistacjowym i malinowym coulis. Pełny przepis z proporcjami — w płatnym PDF TROUBLEBABA.',
      },
      en: {
        name: 'Pistachio & Raspberry',
        layers: 'Pistachio sponge · raspberry coulis',
        lead: 'The Pistachio & Raspberry bento cake is a chic pastry-trend classic. A soft pistachio sponge with nutty depth plays beautifully against the tang of raspberry coulis. A refined flavour wrapped in that signature green-and-pink look.',
        learn: ['How to bring out the pistachio', 'Making the raspberry coulis', 'Contrasting colour and flavour', 'Assembly and slicing'],
        metaTitle: 'Pistachio & Raspberry bento cake — recipe | TROUBLEBABA',
        metaDesc: 'Pistachio & Raspberry bento cake with pistachio sponge and raspberry coulis. The full recipe with proportions is in the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'pina-colada-bento-cake',
    image: '/images/q7.webp',
    t: {
      uk: {
        name: 'Pina Colada',
        layers: 'Кокосовий бісквіт · кокосовий крем · ананасове кюлі',
        lead: 'Бенто-торт Pina Colada — це смак тропічної відпустки в кожному шматочку. Соковитий ананас, кокос і легка нотка рому в ніжних вершках створюють святковий коктейльний настрій. Освіжаючий десерт для теплих вечірок.',
        learn: ['Як збалансувати ром', 'Робота з ананасом', 'Кокосово-вершкова текстура', 'Складання й подача'],
        metaTitle: 'Pina Colada бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Pina Colada бенто торт: кокос, ананас і ром у вершках. Повний рецепт із пропорціями — у платному PDF-збірнику TROUBLEBABA.',
      },
      ru: {
        name: 'Pina Colada',
        layers: 'Кокосовый бисквит · кокосовый крем · ананасовое кюли',
        lead: 'Бенто-торт Pina Colada — это вкус тропического отпуска в каждом кусочке. Сочный ананас, кокос и лёгкая нотка рома в нежных сливках создают праздничное коктейльное настроение. Освежающий десерт для тёплых вечеринок.',
        learn: ['Как сбалансировать ром', 'Работа с ананасом', 'Кокосово-сливочная текстура', 'Сборка и подача'],
        metaTitle: 'Pina Colada бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Pina Colada бенто торт: кокос, ананас и ром в сливках. Полный рецепт с граммовками — в платном PDF-сборнике TROUBLEBABA.',
      },
      pl: {
        name: 'Pina Colada',
        layers: 'Kokos · ananas · rum · śmietana',
        lead: 'Tort bento Pina Colada to smak tropikalnych wakacji w każdym kęsie. Soczysty ananas, kokos i delikatna nuta rumu w aksamitnej śmietanie tworzą świąteczny, koktajlowy nastrój. Orzeźwiający deser na ciepłe przyjęcia.',
        learn: ['Jak zbalansować rum', 'Praca z ananasem', 'Tekstura kokosowo-śmietankowa', 'Montaż i podanie'],
        metaTitle: 'Pina Colada tort bento — przepis | TROUBLEBABA',
        metaDesc: 'Pina Colada tort bento: kokos, ananas i rum w śmietanie. Pełny przepis z proporcjami — w płatnym zbiorze PDF TROUBLEBABA.',
      },
      en: {
        name: 'Pina Colada',
        layers: 'Coconut · pineapple · rum · cream',
        lead: 'The Pina Colada bento cake is a tropical getaway in every bite. Juicy pineapple, coconut and a gentle hint of rum folded into soft cream set a festive cocktail mood. A refreshing dessert for warm-weather celebrations.',
        learn: ['How to balance the rum', 'Working with the pineapple', 'The coconut-cream texture', 'Assembly and serving'],
        metaTitle: 'Pina Colada bento cake — recipe | TROUBLEBABA',
        metaDesc: 'Pina Colada bento cake: coconut, pineapple and rum in cream. The full recipe with proportions is inside the paid TROUBLEBABA PDF.',
      },
    },
  },
  {
    slug: 'cherry-chocolate-bento-cake',
    image: '/images/q4.webp',
    t: {
      uk: {
        name: 'Вишня в шоколаді',
        layers: 'Шоколадний бісквіт · ганаш на молочному шоколаді · вишневе кюлі',
        lead: 'Бенто-торт «Вишня в шоколаді» — це класичний дует, який ніколи не виходить із моди. Насичений шоколадний бісквіт, соковите вишневе кюлі та оксамитовий ганаш створюють глибокий і благородний смак. Десерт для справжніх поціновувачів шоколаду.',
        learn: ['Як приготувати вишневе кюлі', 'Робота з ганашем', 'Баланс шоколаду й вишні', 'Складання й нарізка'],
        metaTitle: 'Вишня в шоколаді бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Вишня в шоколаді бенто торт: шоколад, вишневе кюлі й ганаш. Повний рецепт із пропорціями — у платному PDF TROUBLEBABA.',
      },
      ru: {
        name: 'Вишня в шоколаде',
        layers: 'Шоколадный бисквит · ганаш на молочном шоколаде · вишнёвое кюли',
        lead: 'Бенто-торт «Вишня в шоколаде» — это классический дуэт, который никогда не выходит из моды. Насыщенный шоколадный бисквит, сочное вишнёвое кюли и бархатистый ганаш создают глубокий и благородный вкус. Десерт для настоящих ценителей шоколада.',
        learn: ['Как приготовить вишнёвое кюли', 'Работа с ганашем', 'Баланс шоколада и вишни', 'Сборка и нарезка'],
        metaTitle: 'Вишня в шоколаде бенто-торт — рецепт | TROUBLEBABA',
        metaDesc: 'Вишня в шоколаде бенто торт: шоколад, вишнёвое кюли и ганаш. Полный рецепт с граммовками — в платном PDF TROUBLEBABA.',
      },
      pl: {
        name: 'Wiśnia w czekoladzie',
        layers: 'Biszkopt czekoladowy · wiśniowe coulis · ganache',
        lead: 'Tort bento Wiśnia w czekoladzie to klasyczny duet, który nigdy nie wychodzi z mody. Intensywny biszkopt czekoladowy, soczyste wiśniowe coulis i aksamitne ganache tworzą głęboki, szlachetny smak. Deser dla prawdziwych miłośników czekolady.',
        learn: ['Jak przygotować wiśniowe coulis', 'Praca z ganache', 'Balans czekolady i wiśni', 'Montaż i krojenie'],
        metaTitle: 'Wiśnia w czekoladzie tort bento — przepis | TROUBLEBABA',
        metaDesc: 'Wiśnia w czekoladzie tort bento: czekolada, wiśniowe coulis i ganache. Pełny przepis z proporcjami — w płatnym PDF TROUBLEBABA.',
      },
      en: {
        name: 'Cherry in Chocolate',
        layers: 'Chocolate sponge · cherry coulis · ganache',
        lead: 'The Cherry in Chocolate bento cake is a timeless duo that never goes out of style. A rich chocolate sponge, juicy cherry coulis and velvety ganache build a deep, sophisticated flavour. A dessert for true chocolate devotees.',
        learn: ['How to make the cherry coulis', 'Working with ganache', 'Balancing chocolate and cherry', 'Assembly and slicing'],
        metaTitle: 'Cherry in Chocolate bento cake — recipe | TROUBLEBABA',
        metaDesc: 'Cherry in Chocolate bento cake: chocolate, cherry coulis and ganache. The full recipe with proportions is inside the paid TROUBLEBABA PDF.',
      },
    },
  },
];

export const FLAVOR_BY_SLUG = Object.fromEntries(FLAVORS.map(f => [f.slug, f]));

// Ingredient NAMES ONLY per flavor (uk + ru). No quantities on purpose — grams
// live inside the paid PDF. Kept in a separate map so the main FLAVORS array
// stays trim; other locales fall back to uk on the flavor page.
export const INGREDIENTS_BY_SLUG = {
  'oreo-bento-cake': {
    uk: ['борошно', 'цукор', 'ванільний цукор', 'розпушувач', 'сіль', 'яйце', 'молоко', 'вершкове масло', 'соняшникова олія', 'цукрова пудра', 'крохмаль'],
    ru: ['мука', 'сахар', 'ванильный сахар', 'разрыхлитель', 'соль', 'яйцо', 'молоко', 'сливочное масло', 'подсолнечное масло', 'сахарная пудра', 'крахмал'],
    pl: ['mąka', 'cukier', 'cukier wanilinowy', 'proszek do pieczenia', 'sól', 'jajko', 'mleko', 'masło', 'olej słonecznikowy', 'cukier puder', 'skrobia'],
    en: ['flour', 'sugar', 'vanilla sugar', 'baking powder', 'salt', 'egg', 'milk', 'butter', 'sunflower oil', 'powdered sugar', 'starch'],
    es: ['harina', 'azúcar', 'azúcar vanillado', 'polvo de hornear', 'sal', 'huevo', 'leche', 'mantequilla', 'aceite de girasol', 'azúcar glas', 'almidón'],
    de: ['Mehl', 'Zucker', 'Vanillezucker', 'Backpulver', 'Salz', 'Ei', 'Milch', 'Butter', 'Sonnenblumenöl', 'Puderzucker', 'Speisestärke'],
    fr: ['farine', 'sucre', 'sucre vanillé', 'levure chimique', 'sel', 'œuf', 'lait', 'beurre', 'huile de tournesol', 'sucre glace', 'fécule'],
    it: ['farina', 'zucchero', 'zucchero vanigliato', 'lievito per dolci', 'sale', 'uovo', 'latte', 'burro', 'olio di girasole', 'zucchero a velo', 'amido'],
    pt: ['farinha', 'açúcar', 'açúcar de baunilha', 'fermento em pó', 'sal', 'ovo', 'leite', 'manteiga', 'óleo de girassol', 'açúcar de confeiteiro', 'amido'],
  },
  'red-velvet-bento-cake': {
    uk: ['борошно', 'цукор', 'розпушувач', 'сода', 'сіль', 'яйце', 'молоко', 'рослинна олія', 'оцет', 'ванільний цукор', 'цукрова пудра'],
    ru: ['мука', 'сахар', 'разрыхлитель', 'сода', 'соль', 'яйцо', 'молоко', 'растительное масло', 'уксус', 'ванильный сахар', 'сахарная пудра'],
    pl: ['mąka', 'cukier', 'proszek do pieczenia', 'soda', 'sól', 'jajko', 'mleko', 'olej roślinny', 'ocet', 'cukier wanilinowy', 'cukier puder'],
    en: ['flour', 'sugar', 'baking powder', 'baking soda', 'salt', 'egg', 'milk', 'vegetable oil', 'vinegar', 'vanilla sugar', 'powdered sugar'],
    es: ['harina', 'azúcar', 'polvo de hornear', 'bicarbonato', 'sal', 'huevo', 'leche', 'aceite vegetal', 'vinagre', 'azúcar vanillado', 'azúcar glas'],
    de: ['Mehl', 'Zucker', 'Backpulver', 'Natron', 'Salz', 'Ei', 'Milch', 'Pflanzenöl', 'Essig', 'Vanillezucker', 'Puderzucker'],
    fr: ['farine', 'sucre', 'levure chimique', 'bicarbonate de soude', 'sel', 'œuf', 'lait', 'huile végétale', 'vinaigre', 'sucre vanillé', 'sucre glace'],
    it: ['farina', 'zucchero', 'lievito per dolci', 'bicarbonato', 'sale', 'uovo', 'latte', 'olio vegetale', 'aceto', 'zucchero vanigliato', 'zucchero a velo'],
    pt: ['farinha', 'açúcar', 'fermento em pó', 'bicarbonato de sódio', 'sal', 'ovo', 'leite', 'óleo vegetal', 'vinagre', 'açúcar de baunilha', 'açúcar de confeiteiro'],
  },
  'poppy-seed-citrus-bento-cake': {
    uk: ['борошно', 'цукор', 'розпушувач', 'яйце', 'молоко', 'рослинна олія', 'вершкове масло', 'цукрова пудра'],
    ru: ['мука', 'сахар', 'разрыхлитель', 'яйцо', 'молоко', 'растительное масло', 'сливочное масло', 'сахарная пудра'],
    pl: ['mąka', 'cukier', 'proszek do pieczenia', 'jajko', 'mleko', 'olej roślinny', 'masło', 'cukier puder'],
    en: ['flour', 'sugar', 'baking powder', 'egg', 'milk', 'vegetable oil', 'butter', 'powdered sugar'],
    es: ['harina', 'azúcar', 'polvo de hornear', 'huevo', 'leche', 'aceite vegetal', 'mantequilla', 'azúcar glas'],
    de: ['Mehl', 'Zucker', 'Backpulver', 'Ei', 'Milch', 'Pflanzenöl', 'Butter', 'Puderzucker'],
    fr: ['farine', 'sucre', 'levure chimique', 'œuf', 'lait', 'huile végétale', 'beurre', 'sucre glace'],
    it: ['farina', 'zucchero', 'lievito per dolci', 'uovo', 'latte', 'olio vegetale', 'burro', 'zucchero a velo'],
    pt: ['farinha', 'açúcar', 'fermento em pó', 'ovo', 'leite', 'óleo vegetal', 'manteiga', 'açúcar de confeiteiro'],
  },
  'snickers-bento-cake': {
    uk: ['борошно', 'цукор', 'ванільний цукор', 'розпушувач', 'сіль', 'яйце', 'молоко', 'соняшникова олія', 'вершкове масло', 'цукрова пудра'],
    ru: ['мука', 'сахар', 'ванильный сахар', 'разрыхлитель', 'соль', 'яйцо', 'молоко', 'подсолнечное масло', 'сливочное масло', 'сахарная пудра'],
    pl: ['mąka', 'cukier', 'cukier wanilinowy', 'proszek do pieczenia', 'sól', 'jajko', 'mleko', 'olej słonecznikowy', 'masło', 'cukier puder'],
    en: ['flour', 'sugar', 'vanilla sugar', 'baking powder', 'salt', 'egg', 'milk', 'sunflower oil', 'butter', 'powdered sugar'],
    es: ['harina', 'azúcar', 'azúcar vanillado', 'polvo de hornear', 'sal', 'huevo', 'leche', 'aceite de girasol', 'mantequilla', 'azúcar glas'],
    de: ['Mehl', 'Zucker', 'Vanillezucker', 'Backpulver', 'Salz', 'Ei', 'Milch', 'Sonnenblumenöl', 'Butter', 'Puderzucker'],
    fr: ['farine', 'sucre', 'sucre vanillé', 'levure chimique', 'sel', 'œuf', 'lait', 'huile de tournesol', 'beurre', 'sucre glace'],
    it: ['farina', 'zucchero', 'zucchero vanigliato', 'lievito per dolci', 'sale', 'uovo', 'latte', 'olio di girasole', 'burro', 'zucchero a velo'],
    pt: ['farinha', 'açúcar', 'açúcar de baunilha', 'fermento em pó', 'sal', 'ovo', 'leite', 'óleo de girassol', 'manteiga', 'açúcar de confeiteiro'],
  },
  'raffaello-bento-cake': {
    uk: ['яйце', 'цукор', 'ванільний або кокосовий цукор', 'борошно', 'рослинна олія', 'розпушувач'],
    ru: ['яйцо', 'сахар', 'ванильный или кокосовый сахар', 'мука', 'растительное масло', 'разрыхлитель'],
    pl: ['jajko', 'cukier', 'cukier wanilinowy lub kokosowy', 'mąka', 'olej roślinny', 'proszek do pieczenia'],
    en: ['egg', 'sugar', 'vanilla or coconut sugar', 'flour', 'vegetable oil', 'baking powder'],
    es: ['huevo', 'azúcar', 'azúcar vanillado o de coco', 'harina', 'aceite vegetal', 'polvo de hornear'],
    de: ['Ei', 'Zucker', 'Vanille- oder Kokoszucker', 'Mehl', 'Pflanzenöl', 'Backpulver'],
    fr: ['œuf', 'sucre', 'sucre vanillé ou de coco', 'farine', 'huile végétale', 'levure chimique'],
    it: ['uovo', 'zucchero', 'zucchero vanigliato o di cocco', 'farina', 'olio vegetale', 'lievito per dolci'],
    pt: ['ovo', 'açúcar', 'açúcar de baunilha ou de coco', 'farinha', 'óleo vegetal', 'fermento em pó'],
  },
  'ferrero-rocher-bento-cake': {
    uk: ['борошно', 'цукор', 'ванільний цукор', 'розпушувач', 'сіль', 'яйце', 'молоко', 'соняшникова олія', 'вершкове масло'],
    ru: ['мука', 'сахар', 'ванильный сахар', 'разрыхлитель', 'соль', 'яйцо', 'молоко', 'подсолнечное масло', 'сливочное масло'],
    pl: ['mąka', 'cukier', 'cukier wanilinowy', 'proszek do pieczenia', 'sól', 'jajko', 'mleko', 'olej słonecznikowy', 'masło'],
    en: ['flour', 'sugar', 'vanilla sugar', 'baking powder', 'salt', 'egg', 'milk', 'sunflower oil', 'butter'],
    es: ['harina', 'azúcar', 'azúcar vanillado', 'polvo de hornear', 'sal', 'huevo', 'leche', 'aceite de girasol', 'mantequilla'],
    de: ['Mehl', 'Zucker', 'Vanillezucker', 'Backpulver', 'Salz', 'Ei', 'Milch', 'Sonnenblumenöl', 'Butter'],
    fr: ['farine', 'sucre', 'sucre vanillé', 'levure chimique', 'sel', 'œuf', 'lait', 'huile de tournesol', 'beurre'],
    it: ['farina', 'zucchero', 'zucchero vanigliato', 'lievito per dolci', 'sale', 'uovo', 'latte', 'olio di girasole', 'burro'],
    pt: ['farinha', 'açúcar', 'açúcar de baunilha', 'fermento em pó', 'sal', 'ovo', 'leite', 'óleo de girassol', 'manteiga'],
  },
  'cinnabon-bento-cake': {
    uk: ['борошно', 'цукор', 'розпушувач', 'сіль', 'яйце', 'молоко', 'рослинна олія', 'вершкове масло', 'цукрова пудра'],
    ru: ['мука', 'сахар', 'разрыхлитель', 'соль', 'яйцо', 'молоко', 'растительное масло', 'сливочное масло', 'сахарная пудра'],
    pl: ['mąka', 'cukier', 'proszek do pieczenia', 'sól', 'jajko', 'mleko', 'olej roślinny', 'masło', 'cukier puder'],
    en: ['flour', 'sugar', 'baking powder', 'salt', 'egg', 'milk', 'vegetable oil', 'butter', 'powdered sugar'],
    es: ['harina', 'azúcar', 'polvo de hornear', 'sal', 'huevo', 'leche', 'aceite vegetal', 'mantequilla', 'azúcar glas'],
    de: ['Mehl', 'Zucker', 'Backpulver', 'Salz', 'Ei', 'Milch', 'Pflanzenöl', 'Butter', 'Puderzucker'],
    fr: ['farine', 'sucre', 'levure chimique', 'sel', 'œuf', 'lait', 'huile végétale', 'beurre', 'sucre glace'],
    it: ['farina', 'zucchero', 'lievito per dolci', 'sale', 'uovo', 'latte', 'olio vegetale', 'burro', 'zucchero a velo'],
    pt: ['farinha', 'açúcar', 'fermento em pó', 'sal', 'ovo', 'leite', 'óleo vegetal', 'manteiga', 'açúcar de confeiteiro'],
  },
  'pistachio-raspberry-bento-cake': {
    uk: ['борошно', 'цукор', 'розпушувач', 'яйце', 'молоко', 'рослинна олія', 'крохмаль'],
    ru: ['мука', 'сахар', 'разрыхлитель', 'яйцо', 'молоко', 'растительное масло', 'крахмал'],
    pl: ['mąka', 'cukier', 'proszek do pieczenia', 'jajko', 'mleko', 'olej roślinny', 'skrobia'],
    en: ['flour', 'sugar', 'baking powder', 'egg', 'milk', 'vegetable oil', 'starch'],
    es: ['harina', 'azúcar', 'polvo de hornear', 'huevo', 'leche', 'aceite vegetal', 'almidón'],
    de: ['Mehl', 'Zucker', 'Backpulver', 'Ei', 'Milch', 'Pflanzenöl', 'Speisestärke'],
    fr: ['farine', 'sucre', 'levure chimique', 'œuf', 'lait', 'huile végétale', 'fécule'],
    it: ['farina', 'zucchero', 'lievito per dolci', 'uovo', 'latte', 'olio vegetale', 'amido'],
    pt: ['farinha', 'açúcar', 'fermento em pó', 'ovo', 'leite', 'óleo vegetal', 'amido'],
  },
  'pina-colada-bento-cake': {
    uk: ['борошно', 'цукор', 'розпушувач', 'яйце', 'молоко', 'рослинна олія'],
    ru: ['мука', 'сахар', 'разрыхлитель', 'яйцо', 'молоко', 'растительное масло'],
    pl: ['mąka', 'cukier', 'proszek do pieczenia', 'jajko', 'mleko', 'olej roślinny'],
    en: ['flour', 'sugar', 'baking powder', 'egg', 'milk', 'vegetable oil'],
    es: ['harina', 'azúcar', 'polvo de hornear', 'huevo', 'leche', 'aceite vegetal'],
    de: ['Mehl', 'Zucker', 'Backpulver', 'Ei', 'Milch', 'Pflanzenöl'],
    fr: ['farine', 'sucre', 'levure chimique', 'œuf', 'lait', 'huile végétale'],
    it: ['farina', 'zucchero', 'lievito per dolci', 'uovo', 'latte', 'olio vegetale'],
    pt: ['farinha', 'açúcar', 'fermento em pó', 'ovo', 'leite', 'óleo vegetal'],
  },
  'cherry-chocolate-bento-cake': {
    uk: ['борошно', 'цукор', 'ванільний цукор', 'розпушувач', 'сіль', 'яйце', 'молоко', 'вершкове масло', 'соняшникова олія', 'крохмаль'],
    ru: ['мука', 'сахар', 'ванильный сахар', 'разрыхлитель', 'соль', 'яйцо', 'молоко', 'сливочное масло', 'подсолнечное масло', 'крахмал'],
    pl: ['mąka', 'cukier', 'cukier wanilinowy', 'proszek do pieczenia', 'sól', 'jajko', 'mleko', 'masło', 'olej słonecznikowy', 'skrobia'],
    en: ['flour', 'sugar', 'vanilla sugar', 'baking powder', 'salt', 'egg', 'milk', 'butter', 'sunflower oil', 'starch'],
    es: ['harina', 'azúcar', 'azúcar vanillado', 'polvo de hornear', 'sal', 'huevo', 'leche', 'mantequilla', 'aceite de girasol', 'almidón'],
    de: ['Mehl', 'Zucker', 'Vanillezucker', 'Backpulver', 'Salz', 'Ei', 'Milch', 'Butter', 'Sonnenblumenöl', 'Speisestärke'],
    fr: ['farine', 'sucre', 'sucre vanillé', 'levure chimique', 'sel', 'œuf', 'lait', 'beurre', 'huile de tournesol', 'fécule'],
    it: ['farina', 'zucchero', 'zucchero vanigliato', 'lievito per dolci', 'sale', 'uovo', 'latte', 'burro', 'olio di girasole', 'amido'],
    pt: ['farinha', 'açúcar', 'açúcar de baunilha', 'fermento em pó', 'sal', 'ovo', 'leite', 'manteiga', 'óleo de girassol', 'amido'],
  },
};


// Copy for the ingredients section on each flavor page (uk + ru only —
// requested first). Other locales silently skip the section for now.
export const INGREDIENTS_COPY = {
  uk: {
    heading:  'З чого готуємо',
    subline:  'Показані лише базові продукти. Ключові інгредієнти та точні грамажі — у PDF-збірнику.',
    pdfNote:  'У PDF-збірнику ти отримаєш: точні грамажі кожного інгредієнта, рекомендації по брендах (борошно, шоколад, вершки, крем-сир), таблицю перерахунку на будь-який діаметр форми, а також список кухонних приладів, які знадобляться. Плюс детальна збірка з фото — крок за кроком.',
    ctaHint:  'Хочеш приготувати цей торт? Забирай повний рецепт із точними грамами у збірнику.',
  },
  ru: {
    heading:  'Из чего готовим',
    subline:  'Показаны только базовые продукты. Ключевые ингредиенты и точные граммовки — в PDF-сборнике.',
    pdfNote:  'В PDF-сборнике ты получишь: точные граммовки каждого ингредиента, рекомендации по брендам (мука, шоколад, сливки, крем-сыр), таблицу пересчёта на любой диаметр формы, а также список кухонных приборов, которые понадобятся. Плюс подробная сборка с фото — шаг за шагом.',
    ctaHint:  'Хочешь приготовить этот торт? Забирай полный рецепт с точными граммами в сборнике.',
  },
  pl: {
    heading:  'Z czego pieczemy',
    subline:  'Pokazane są tylko podstawowe produkty. Kluczowe składniki i dokładne gramatury — w PDF.',
    pdfNote:  'W zbiorze PDF otrzymasz: dokładne gramatury każdego składnika, rekomendacje marek (mąka, czekolada, śmietana, serek), tabelę przeliczeń na dowolną średnicę formy oraz listę potrzebnych akcesoriów. Plus szczegółowy montaż ze zdjęciami — krok po kroku.',
    ctaHint:  'Chcesz upiec ten tort? Odbierz pełny przepis z dokładnymi gramaturami w zbiorze.',
  },
  en: {
    heading:  'What goes in',
    subline:  'Only the basics are listed. Key ingredients and exact grams are in the PDF.',
    pdfNote:  'In the PDF collection you get: exact grams for every ingredient, brand recommendations (flour, chocolate, cream, cream cheese), a scaling table for any pan diameter, and a list of the tools you will need. Plus a detailed photo walkthrough — step by step.',
    ctaHint:  'Want to bake this cake? Get the full recipe with exact grams in the collection.',
  },
  es: {
    heading:  'Con qué lo hacemos',
    subline:  'Solo se muestran los productos básicos. Los ingredientes clave y los gramajes exactos están en el PDF.',
    pdfNote:  'En la colección PDF obtienes: gramajes exactos de cada ingrediente, recomendaciones de marcas (harina, chocolate, nata, queso crema), una tabla de conversión para cualquier diámetro de molde y la lista de utensilios necesarios. Además, el montaje detallado con fotos — paso a paso.',
    ctaHint:  '¿Quieres hacer esta tarta? Consigue la receta completa con gramajes exactos en la colección.',
  },
  de: {
    heading:  'Woraus wir backen',
    subline:  'Gezeigt werden nur die Grundprodukte. Die wichtigsten Zutaten und exakte Grammangaben stehen im PDF.',
    pdfNote:  'In der PDF-Sammlung bekommst du: exakte Grammangaben für jede Zutat, Markenempfehlungen (Mehl, Schokolade, Sahne, Frischkäse), eine Umrechnungstabelle für jeden Formdurchmesser sowie die Liste der benötigten Geräte. Dazu der ausführliche Aufbau mit Fotos — Schritt für Schritt.',
    ctaHint:  'Willst du diese Torte backen? Hol dir das komplette Rezept mit exakten Grammangaben in der Sammlung.',
  },
  fr: {
    heading:  'Avec quoi on le fait',
    subline:  'Seuls les produits de base sont affichés. Les ingrédients clés et les grammages exacts sont dans le PDF.',
    pdfNote:  'Dans le recueil PDF vous obtenez : les grammages exacts de chaque ingrédient, des recommandations de marques (farine, chocolat, crème, cream cheese), un tableau de conversion pour tout diamètre de moule, ainsi que la liste du matériel nécessaire. Plus le montage détaillé en photos — étape par étape.',
    ctaHint:  'Envie de réaliser ce gâteau ? Récupérez la recette complète avec les grammages exacts dans le recueil.',
  },
  it: {
    heading:  'Con cosa la prepariamo',
    subline:  'Sono elencati solo i prodotti base. Gli ingredienti chiave e le grammature esatte sono nel PDF.',
    pdfNote:  'Nella raccolta PDF trovi: le grammature esatte di ogni ingrediente, i consigli sulle marche (farina, cioccolato, panna, formaggio fresco), una tabella di conversione per qualsiasi diametro di teglia e l\'elenco degli attrezzi necessari. Più il montaggio dettagliato con foto — passo per passo.',
    ctaHint:  'Vuoi preparare questa torta? Prendi la ricetta completa con le grammature esatte nella raccolta.',
  },
  pt: {
    heading:  'Com o que fazemos',
    subline:  'Só aparecem os produtos básicos. Os ingredientes principais e as gramaturas exatas estão no PDF.',
    pdfNote:  'Na coleção em PDF você recebe: gramaturas exatas de cada ingrediente, recomendações de marcas (farinha, chocolate, creme de leite, cream cheese), uma tabela de conversão para qualquer diâmetro de forma e a lista de utensílios necessários. Além da montagem detalhada com fotos — passo a passo.',
    ctaHint:  'Quer fazer este bolo? Pegue a receita completa com gramaturas exatas na coleção.',
  },
};

// /recipes/ hub page copy
export const RECIPES_HUB = {
  uk: {
    metaTitle: '10 рецептів бенто-тортів — смаки збірника | TROUBLEBABA',
    metaDesc: 'Збірник із 10 рецептів бенто-тортів у форматі PDF: Oreo, Raffaello, Snickers та інші. Точні пропорції, збірка й поради від TROUBLEBABA.',
    heading: '10 рецептів бенто-тортів — усі смаки збірника',
    intro: 'Колекція з десяти авторських бенто-тортів — від хітового Oreo до тропічної Pina Colada. Кожен рецепт перевірений на практиці й описаний крок за кроком. Оберіть смак, щоб дізнатися більше.',
    cta: 'Купити збірник — 800 ₴',
    back: 'На головну',
    allLabel: 'Усі смаки',
    seoIntro: 'Усі 10 рецептів бенто-тортів розраховані на діаметр 12 см і йдуть із таблицею перерахунку на 8–16 см. Для кожного смаку вказано рівень складності, час приготування, типові помилки та відповіді на часті запитання. Перед покупкою корисно почитати в блозі, який розмір бенто обрати, скільки коштує бенто-торт і скільки він зберігається.',
  },
  ru: {
    metaTitle: '10 рецептов бенто-тортов — вкусы сборника | TROUBLEBABA',
    metaDesc: 'Сборник из 10 рецептов бенто-тортов в формате PDF: Oreo, Raffaello, Snickers и другие. Точные граммовки, сборка и советы от TROUBLEBABA.',
    heading: '10 рецептов бенто-тортов — все вкусы сборника',
    intro: 'Коллекция из десяти авторских бенто-тортов — от хитового Oreo до тропической Pina Colada. Каждый рецепт проверен на практике и расписан шаг за шагом. Выберите вкус, чтобы узнать больше.',
    cta: 'Купить сборник — $20',
    back: 'На главную',
    allLabel: 'Все вкусы',
    seoIntro: 'Все 10 рецептов бенто-тортов рассчитаны на диаметр 12 см и идут с таблицей пересчёта на 8–16 см. Для каждого вкуса указаны уровень сложности, время приготовления, частые ошибки и ответы на вопросы. Перед покупкой полезно прочитать в блоге, какой размер бенто выбрать, сколько стоит бенто-торт и сколько он хранится.',
  },
  pl: {
    metaTitle: 'Torty bento — 10 przepisów, proporcje i smaki | TROUBLEBABA',
    metaDesc: 'Zbiór 10 przepisów na torty bento w formacie PDF: Oreo, Raffaello, Snickers i inne. Dokładne proporcje, montaż i wskazówki od TROUBLEBABA.',
    heading: '10 przepisów na torty bento — wszystkie smaki zbioru',
    intro: 'Kolekcja dziesięciu autorskich tortów bento — od hitowego Oreo po tropikalną Pina Coladę. Każdy przepis sprawdzony w praktyce i opisany krok po kroku. Wybierz smak, aby dowiedzieć się więcej.',
    cta: 'Kup zbiór — 80 zł',
    back: 'Strona główna',
    allLabel: 'Wszystkie smaki',
    seoIntro: 'Wszystkie 10 przepisów na torty bento jest przeliczone na średnicę 12 cm i zawiera tabelę przeliczeń na 8–16 cm. Dla każdego smaku podano poziom trudności, czas przygotowania, typowe błędy i odpowiedzi na częste pytania. Przed zakupem warto przeczytać na blogu, jaki rozmiar tortu bento wybrać, ile kosztuje tort bento i jak długo się przechowuje.',
  },
  en: {
    metaTitle: '10 bento cake recipes — flavours in the collection | TROUBLEBABA',
    metaDesc: 'A collection of 10 bento cake recipes in PDF: Oreo, Raffaello, Snickers and more. Exact proportions, assembly and tips from TROUBLEBABA.',
    heading: '10 bento cake flavours',
    intro: 'A collection of ten signature bento cakes — from the best-selling Oreo to a tropical Pina Colada. Every recipe is kitchen-tested and laid out step by step. Pick a flavour to learn more.',
    cta: 'Buy the collection — €18',
    back: 'Back home',
    allLabel: 'All flavours',
  },
};

// --- Merge localized flavor copy (es/de/fr/it/pt) ---------------------------
// FLAVOR_BY_SLUG references the same flavor objects, so mutating f.t here also
// applies there. Falls back to en at render time if a slug is missing.
const _LOCALE_FLAVORS = { es: FLAVORS_ES, de: FLAVORS_DE, fr: FLAVORS_FR, it: FLAVORS_IT, pt: FLAVORS_PT };
const _LOCALE_HUBS    = { es: HUB_ES,     de: HUB_DE,     fr: HUB_FR,     it: HUB_IT,     pt: HUB_PT };
for (const f of FLAVORS) {
  for (const [lang, table] of Object.entries(_LOCALE_FLAVORS)) {
    if (table && table[f.slug]) f.t[lang] = table[f.slug];
  }
}
for (const [lang, hub] of Object.entries(_LOCALE_HUBS)) {
  if (hub) RECIPES_HUB[lang] = hub;
}
