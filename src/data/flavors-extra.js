// Non-recipe enrichment for /recipes/<slug>/ pages.
// STRICT: no grams, no temperatures, no times, no method steps, no proportions.
// Only positioning, occasion, common problems (naming the pain, NOT the fix),
// and FAQ that doesn't reveal recipe truths. The full craft lives in the paid PDF.

// Global metadata (same across locales).
// difficulty: 1 (easy), 2 (medium), 3 (hard) — based on how tricky the assembly is.
// timeLabel: qualitative bucket, not exact time.
export const FLAVOR_META = {
  'oreo-bento-cake':                { difficulty: 1, timeBucket: 'short'  },
  'red-velvet-bento-cake':          { difficulty: 2, timeBucket: 'medium' },
  'poppy-seed-citrus-bento-cake':   { difficulty: 2, timeBucket: 'medium' },
  'snickers-bento-cake':            { difficulty: 3, timeBucket: 'long'   },
  'raffaello-bento-cake':           { difficulty: 2, timeBucket: 'medium' },
  'ferrero-rocher-bento-cake':      { difficulty: 3, timeBucket: 'long'   },
  'cinnabon-bento-cake':            { difficulty: 2, timeBucket: 'medium' },
  'pistachio-raspberry-bento-cake': { difficulty: 3, timeBucket: 'long'   },
  'pina-colada-bento-cake':         { difficulty: 2, timeBucket: 'medium' },
  'cherry-chocolate-bento-cake':    { difficulty: 1, timeBucket: 'short'  },
};

// Labels for difficulty + time bucket, per language.
// The badge itself carries the meaning — no need to explain elsewhere.
export const DIFFICULTY_LABEL = {
  uk: { 1: 'Простий',   2: 'Середній',    3: 'Складний'    },
  ru: { 1: 'Простой',   2: 'Средний',     3: 'Сложный'     },
  pl: { 1: 'Łatwy',     2: 'Średni',      3: 'Zaawansowany'},
  en: { 1: 'Beginner',  2: 'Intermediate',3: 'Advanced'    },
};
export const TIME_LABEL = {
  uk: { short: 'до 2 годин', medium: '2–3 години',  long: '3+ години'  },
  ru: { short: 'до 2 часов', medium: '2–3 часа',    long: '3+ часа'    },
  pl: { short: 'do 2 h',     medium: '2–3 h',       long: 'ponad 3 h'  },
  en: { short: 'under 2 h',  medium: '2–3 h',       long: 'over 3 h'   },
};

// Per-flavor, per-locale enrichment.
// - occasion: one honest sentence: for whom / when it fits.
// - mistakes: 2–3 concrete problems the baker will hit — problem only, NEVER
//   the fix. The fix is what the paid PDF sells.
// - faq: 2–3 Q&A pairs that stay above the recipe (storage, allergens,
//   audience, timing to bake ahead). Never grams, never temperature, never method.
// - related: sibling flavor slugs shown as "если сподобався цей — спробуй".
export const FLAVOR_EXTRA = {
  'oreo-bento-cake': {
    related: ['snickers-bento-cake', 'cherry-chocolate-bento-cake', 'ferrero-rocher-bento-cake'],
    t: {
      uk: {
        occasion: 'Універсальний фаворит на день народження, антистрес-подарунок для подруги або десерт «просто до кави».',
        mistakes: [
          'Крихта Oreo відсирає й перетворюється на кашу під час зберігання.',
          'Крем-чиз розтікається, і чіткі шари губляться на розрізі.',
          'Шоколадний бісквіт виходить сухим і кришиться при вирівнюванні.',
        ],
        faq: [
          { q: 'Скільки часу зберігається бенто-торт Oreo після збірки?',
            a: 'Оптимально подавати клієнту протягом 24 годин після збирання. Точні умови й максимальний строк зберігання розписані в PDF.' },
          { q: 'Чи можна пекти бісквіт заздалегідь?',
            a: 'Так, це навіть краще для стабільності. Скільки саме годин чи діб він може лежати перед збіркою — з деталями в PDF.' },
          { q: 'Чи підходить дітям?',
            a: 'Так, у цьому смаку немає алкоголю чи гострих спецій. Це один із найбезпечніших варіантів на дитячий святковий стіл.' },
        
          { q: 'Який розмір бенто-торта Oreo?',
            a: 'Стандарт — 12 см у діаметрі, висота близько 8 см. Порція на 2 людей. Розрахунок на 8, 10, 14 і 16 см — у таблиці всередині PDF.' },
          { q: 'Скільки важить бенто-торт Oreo?',
            a: 'Приблизно 650–700 г для 12 см. Це один із «важких» смаків — щільний шоколадний бісквіт і крем-чиз на маслі роблять його насиченим.' },
        ],
      },
      ru: {
        occasion: 'Универсальный фаворит на день рождения, антистресс-подарок подруге или десерт «просто к кофе».',
        mistakes: [
          'Крошка Oreo отсыревает и превращается в кашу при хранении.',
          'Крем-чиз растекается, и чёткие слои теряются на срезе.',
          'Шоколадный бисквит выходит сухим и крошится при выравнивании.',
        ],
        faq: [
          { q: 'Сколько хранится бенто-торт Oreo после сборки?',
            a: 'Оптимально отдавать клиенту в течение 24 часов после сборки. Точные условия и максимальный срок хранения — в PDF.' },
          { q: 'Можно ли печь бисквит заранее?',
            a: 'Да, это даже лучше для стабильности. Сколько часов или суток он может лежать перед сборкой — с деталями в PDF.' },
          { q: 'Подходит ли детям?',
            a: 'Да, в этом вкусе нет алкоголя и острых специй. Один из самых безопасных вариантов для детского стола.' },
        
          { q: 'Какого размера бенто-торт Oreo?',
            a: 'Стандарт — 12 см в диаметре, высота около 8 см. Порция на 2 человек. Расчёт на 8, 10, 14 и 16 см — в таблице внутри PDF.' },
          { q: 'Сколько весит бенто-торт Oreo?',
            a: 'Примерно 650–700 г для 12 см. Один из «плотных» вкусов — насыщенный шоколадный бисквит и крем-чиз на масле делают его сытным.' },
        ],
      },
      pl: {
        occasion: 'Uniwersalny hit na urodziny, antystresowy prezent dla przyjaciółki albo deser „po prostu do kawy”.',
        mistakes: [
          'Okruchy Oreo miękną i zmieniają się w papkę podczas przechowywania.',
          'Krem serowy rozpływa się, a wyraźne warstwy giną na przekroju.',
          'Czekoladowy biszkopt wychodzi suchy i kruszy się przy wyrównywaniu.',
        ],
        faq: [
          { q: 'Jak długo tort bento Oreo utrzymuje świeżość po złożeniu?',
            a: 'Najlepiej wydać klientowi w ciągu 24 godzin od złożenia. Dokładne warunki i maksymalny czas przechowywania są w PDF.' },
          { q: 'Czy można upiec biszkopt wcześniej?',
            a: 'Tak, to nawet lepsze dla stabilności. Ile godzin lub dni może odpoczywać przed złożeniem — szczegóły w PDF.' },
          { q: 'Czy tort jest odpowiedni dla dzieci?',
            a: 'Tak, w tym smaku nie ma alkoholu ani ostrych przypraw. To jeden z najbezpieczniejszych wariantów na stół dziecięcy.' },
        
          { q: 'Jaki jest rozmiar tortu bento Oreo?',
            a: 'Standard — 12 cm średnicy, wysokość około 8 cm. Porcja dla 2 osób. Przeliczenie na 8, 10, 14 i 16 cm — w tabeli w PDF.' },
          { q: 'Ile waży tort bento Oreo?',
            a: 'Około 650–700 g dla 12 cm. Jeden ze „gęstych" smaków — mocny czekoladowy biszkopt i krem serowy na maśle sprawiają, że jest sycący.' },
        ],
      },
      en: {
        occasion: 'A safe crowd-pleaser for a birthday, a small comfort gift, or a “just because” dessert with coffee.',
        mistakes: [
          'The Oreo crumb goes soft and turns into paste after a night in the fridge.',
          'The cream cheese spreads sideways and the crisp layers disappear on the cut.',
          'The chocolate sponge comes out dry and crumbles while you crumb-coat.',
        ],
        faq: [
          { q: 'How long does an Oreo bento cake keep after assembly?',
            a: 'The window we recommend before serving the client is inside 24 hours. Exact storage and hard limits are inside the PDF.' },
          { q: 'Can I bake the sponge in advance?',
            a: 'Yes, it actually helps the crumb settle. How many hours or days it can rest before assembly is detailed in the PDF.' },
          { q: 'Is it kid-friendly?',
            a: 'Yes — this flavour uses no alcohol or spice. It is one of the safer picks for a children’s party.' },
        
          { q: 'What size is the Oreo bento cake?',
            a: 'Standard is 12 cm diameter, about 8 cm tall. Serves 2. Conversion to 8, 10, 14 and 16 cm — in the table inside the PDF.' },
          { q: 'How much does the Oreo bento cake weigh?',
            a: 'Around 650–700 g at 12 cm. One of the denser flavours — chocolate sponge with cream-cheese-and-butter frosting makes it hearty.' },
        ],
      },
    },
  },

  'red-velvet-bento-cake': {
    related: ['oreo-bento-cake', 'pistachio-raspberry-bento-cake', 'cherry-chocolate-bento-cake'],
    t: {
      uk: {
        occasion: 'Класика для 14 лютого, річниці, дівич-вечора. Красивий контраст червоного бісквіту й білого крему працює на фото.',
        mistakes: [
          'Червоний колір під час випікання «сивіє» — торт виходить брудно-коричневий.',
          'Маскарпоне «плаче» на розрізі й псує вигляд шарів.',
          'Полуничне кюлі протікає через бісквіт і зволожує серцевину.',
        ],
        faq: [
          { q: 'Чи можна робити без харчового барвника?',
            a: 'Технічно можна, але тоді торт втрачає фірмовий вигляд Red Velvet. Які барвники ми використовуємо і в яких пропорціях — у PDF.' },
          { q: 'Чи витримає торт транспортування?',
            a: 'Так, за умови правильної стабілізації крему й температурного режиму — деталі в PDF-збірнику.' },
          { q: 'Що робити, якщо маскарпоне немає в магазині?',
            a: 'У збірнику є перелік перевірених аналогів і критерії, за якими їх обирати (жирність, консистенція).' },
        
          { q: 'Який розмір бенто-торта Червоний оксамит?',
            a: 'Стандарт — 12 см у діаметрі, висота 7,5–8 см. Порція на 2 людей. Розрахунок на 8, 10 і 14 см — у PDF.' },
          { q: 'Скільки важить бенто-торт Червоний оксамит?',
            a: 'Приблизно 580–650 г для 12 см. Легший за Oreo, ніж Snickers чи Ferrero Rocher — какао-бісквіт менш щільний.' },
        ],
      },
      ru: {
        occasion: 'Классика на 14 февраля, годовщину, девичник. Контраст красного бисквита и белого крема отлично работает на фото.',
        mistakes: [
          'Красный цвет при выпечке «седеет» — торт выходит грязно-коричневым.',
          'Маскарпоне «плачет» на срезе и портит вид слоёв.',
          'Клубничное кюли протекает через бисквит и размачивает сердцевину.',
        ],
        faq: [
          { q: 'Можно ли делать без пищевого красителя?',
            a: 'Технически да, но тогда торт теряет фирменный вид Red Velvet. Какие красители мы используем и в каких пропорциях — в PDF.' },
          { q: 'Выдержит ли торт транспортировку?',
            a: 'Да, при правильной стабилизации крема и температурном режиме. Детали — в PDF-сборнике.' },
          { q: 'Что делать, если маскарпоне нет в магазине?',
            a: 'В сборнике есть перечень проверенных аналогов и критерии, по которым их выбирать (жирность, консистенция).' },
        
          { q: 'Какого размера бенто-торт Красный бархат?',
            a: 'Стандарт — 12 см в диаметре, высота 7,5–8 см. Порция на 2 человек. Расчёт на 8, 10 и 14 см — в PDF.' },
          { q: 'Сколько весит бенто-торт Красный бархат?',
            a: 'Примерно 580–650 г для 12 см. Легче Oreo, чем Snickers или Ferrero Rocher — какао-бисквит менее плотный.' },
        ],
      },
      pl: {
        occasion: 'Klasyk na walentynki, rocznicę, wieczór panieński. Kontrast czerwonego biszkoptu i białego kremu doskonale wygląda na zdjęciach.',
        mistakes: [
          'Czerwony kolor „siwieje” podczas pieczenia — tort wychodzi brudno-brązowy.',
          'Mascarpone „płacze” na przekroju i psuje wygląd warstw.',
          'Truskawkowe coulis przecieka przez biszkopt i moczy środek.',
        ],
        faq: [
          { q: 'Czy można zrobić bez barwnika spożywczego?',
            a: 'Technicznie tak, ale tort straci charakterystyczny wygląd Red Velvet. Jakich barwników używamy i w jakich proporcjach — w PDF.' },
          { q: 'Czy tort zniesie transport?',
            a: 'Tak, przy odpowiedniej stabilizacji kremu i temperaturze. Szczegóły w zbiorze PDF.' },
          { q: 'Co jeśli w sklepie nie ma mascarpone?',
            a: 'Zbiór zawiera listę sprawdzonych zamienników i kryteria wyboru (tłuszcz, konsystencja).' },
        
          { q: 'Jaki jest rozmiar tortu bento Red Velvet?',
            a: 'Standard — 12 cm średnicy, wysokość 7,5–8 cm. Porcja dla 2 osób. Przeliczenie na 8, 10 i 14 cm — w PDF.' },
          { q: 'Ile waży tort bento Red Velvet?',
            a: 'Około 580–650 g dla 12 cm. Lżejszy niż Oreo, Snickers czy Ferrero Rocher — biszkopt kakaowy jest mniej gęsty.' },
        ],
      },
      en: {
        occasion: 'A classic for Valentine’s, an anniversary, a hen party. The red sponge against white cream photographs beautifully.',
        mistakes: [
          'The red colour dulls during baking and the crumb comes out muddy brown.',
          'The mascarpone cream weeps on the cut and blurs the layer lines.',
          'The strawberry coulis leaks into the sponge and soaks the core.',
        ],
        faq: [
          { q: 'Can I bake it without food colouring?',
            a: 'Technically yes, but the classic Red Velvet look is gone. Which colourings we use and at what ratios lives in the PDF.' },
          { q: 'Will it survive transport?',
            a: 'Yes, given the right cream stabilisation and temperature. The PDF walks through the details.' },
          { q: 'What if I can’t find mascarpone?',
            a: 'The collection lists tested substitutes and the criteria to pick one (fat content, texture).' },
        
          { q: 'What size is the Red Velvet bento cake?',
            a: 'Standard is 12 cm diameter, 7.5–8 cm tall. Serves 2. Conversion to 8, 10 and 14 cm — in the PDF.' },
          { q: 'How much does the Red Velvet bento cake weigh?',
            a: 'Around 580–650 g at 12 cm. Lighter than Oreo, Snickers or Ferrero Rocher — cocoa sponge is less dense.' },
        ],
      },
    },
  },

  'poppy-seed-citrus-bento-cake': {
    related: ['raffaello-bento-cake', 'pistachio-raspberry-bento-cake', 'pina-colada-bento-cake'],
    t: {
      uk: {
        occasion: 'Літній варіант «не для шоколадоманів». Легкий, свіжий, добре йде на дівочі свята й брантч.',
        mistakes: [
          'Мак дає гіркоту, і смак кюрду перебивається.',
          'Крем-чиз під цитрусовим соком розшаровується.',
          'Курд надто рідкий і стікає з торта під час зберігання.',
        ],
        faq: [
          { q: 'Чи можна замінити мак на щось інше?',
            a: 'Так, у збірнику є вкладки з ідеями заміни під алергію чи смакові переваги.' },
          { q: 'Який цитрус найкраще підходить?',
            a: 'Ми використовуємо конкретне поєднання — у PDF описано, чому саме воно й у яких пропорціях.' },
          { q: 'Скільки часу тримається курд?',
            a: 'Готовий курд можна зробити заздалегідь. Скільки саме він живе в холодильнику — з таймінгом у PDF.' },
        ],
      },
      ru: {
        occasion: 'Летний вариант «не для шоколадоманов». Лёгкий, свежий, хорош на девичниках и брантче.',
        mistakes: [
          'Мак даёт горечь, и вкус курда перебивается.',
          'Крем-чиз от цитрусового сока расслаивается.',
          'Курд слишком жидкий и стекает с торта при хранении.',
        ],
        faq: [
          { q: 'Можно ли заменить мак на что-то другое?',
            a: 'Да, в сборнике есть вкладки с идеями замены под аллергии и вкусовые предпочтения.' },
          { q: 'Какой цитрус лучше подходит?',
            a: 'Мы используем конкретное сочетание — в PDF описано, почему именно оно и в каких пропорциях.' },
          { q: 'Сколько живёт курд?',
            a: 'Готовый курд можно сделать заранее. Сколько именно он держится в холодильнике — с таймингом в PDF.' },
        ],
      },
      pl: {
        occasion: 'Letnia opcja „nie dla czekoladomanów”. Lekki, świeży, świetny na wieczór panieński i brunch.',
        mistakes: [
          'Mak nadaje goryczy i przebija smak lemon curd.',
          'Krem serowy rozwarstwia się od soku cytrusowego.',
          'Curd jest zbyt płynny i spływa z tortu przy przechowywaniu.',
        ],
        faq: [
          { q: 'Czy można zamienić mak na coś innego?',
            a: 'Tak, w zbiorze są sugestie zamian pod alergie i preferencje smakowe.' },
          { q: 'Który cytrus jest najlepszy?',
            a: 'Używamy konkretnej kombinacji — w PDF opisujemy, dlaczego właśnie ta i w jakich proporcjach.' },
          { q: 'Jak długo trzyma się curd?',
            a: 'Curd można przygotować z wyprzedzeniem. Jak długo utrzymuje się w lodówce, jest podane w PDF.' },
        ],
      },
      en: {
        occasion: 'A summer pick for the people who do not chase chocolate. Light, fresh — works for a bridal shower or brunch.',
        mistakes: [
          'The poppy seeds go bitter and steamroll the curd flavour.',
          'The cream cheese splits when the citrus juice hits it.',
          'The curd runs too thin and slides off the cake in storage.',
        ],
        faq: [
          { q: 'Can I swap the poppy seeds for something else?',
            a: 'Yes — the collection has notes on swaps for allergies and taste preferences.' },
          { q: 'Which citrus fruit works best?',
            a: 'We use a specific combo — the PDF walks through the why and the ratios.' },
          { q: 'How long does the curd keep?',
            a: 'The curd can be made ahead. Exact shelf life in the fridge is in the PDF.' },
        ],
      },
    },
  },

  'snickers-bento-cake': {
    related: ['ferrero-rocher-bento-cake', 'cinnabon-bento-cake', 'cherry-chocolate-bento-cake'],
    t: {
      uk: {
        occasion: '«Чоловічий» смак: щільний, ситний, добре йде на 23 лютого, день народження друга, корпоратив.',
        mistakes: [
          'Карамель кристалізується й дає піщану текстуру на розрізі.',
          'Арахіс розм’якшується у кремі і втрачає ту саму хрусткість.',
          'Крем виходить занадто солодким, і торт «б’є» на другому шматочку.',
        ],
        faq: [
          { q: 'Чи можна замінити арахіс на інший горіх?',
            a: 'Так, у збірнику показано, які горіхи не змінюють характеру торта, а які краще не брати.' },
          { q: 'Чи не буде торт занадто солодким?',
            a: 'Правильні пропорції карамелі до крему саме регулюють цей баланс. Ми показуємо це в PDF цифрами.' },
          { q: 'Чи підійде на замовлення для дитячого свята?',
            a: 'За смаком — так, але через горіхи в складі краще спочатку уточнити в клієнта наявність алергій.' },
        
          { q: 'Який розмір бенто-торта Snickers?',
            a: 'Стандарт — 12 см у діаметрі, висота близько 8 см. Порція на 2 людей. Розрахунок на інші діаметри — у PDF.' },
          { q: 'Скільки важить бенто-торт Snickers?',
            a: 'Приблизно 700–750 г для 12 см. Найважчий з базових вкусів — шар карамелі та арахісу додає ваги.' },
        ],
      },
      ru: {
        occasion: '«Мужской» вкус: плотный, сытный, хорош на 23 февраля, день рождения друга, корпоратив.',
        mistakes: [
          'Карамель кристаллизуется и даёт песочную текстуру на срезе.',
          'Арахис размягчается в креме и теряет ту самую хрусткость.',
          'Крем выходит слишком сладким, и торт «бьёт» на втором кусочке.',
        ],
        faq: [
          { q: 'Можно ли заменить арахис на другой орех?',
            a: 'Да, в сборнике показано, какие орехи не меняют характер торта, а какие лучше не брать.' },
          { q: 'Не будет ли торт слишком сладким?',
            a: 'Правильные пропорции карамели к крему как раз регулируют этот баланс. В PDF мы показываем это в цифрах.' },
          { q: 'Подойдёт ли на детский заказ?',
            a: 'По вкусу — да, но из-за орехов лучше уточнить у клиента про аллергии.' },
        
          { q: 'Какого размера бенто-торт Snickers?',
            a: 'Стандарт — 12 см в диаметре, высота около 8 см. Порция на 2 человек. Расчёт на другие диаметры — в PDF.' },
          { q: 'Сколько весит бенто-торт Snickers?',
            a: 'Примерно 700–750 г для 12 см. Самый тяжёлый из базовых вкусов — слой карамели и арахиса добавляют веса.' },
        ],
      },
      pl: {
        occasion: '„Męski” smak: gęsty, sycący, sprawdza się na urodziny kolegi, imprezę firmową, prezent dla ojca.',
        mistakes: [
          'Karmel krystalizuje się i daje piaskową teksturę na przekroju.',
          'Orzeszki miękną w kremie i tracą ten charakterystyczny chrupot.',
          'Krem wychodzi zbyt słodki i tort „przytłacza” już przy drugim kęsie.',
        ],
        faq: [
          { q: 'Czy można zamienić orzeszki ziemne na inne orzechy?',
            a: 'Tak — zbiór pokazuje, które orzechy zachowują charakter tortu, a których lepiej unikać.' },
          { q: 'Czy tort nie będzie za słodki?',
            a: 'Właściwe proporcje karmelu do kremu odpowiadają za balans. W PDF pokazujemy to liczbami.' },
          { q: 'Czy sprawdzi się na dziecięcą imprezę?',
            a: 'Smakowo tak, ale ze względu na orzechy zapytaj klienta o alergie.' },
        
          { q: 'Jaki jest rozmiar tortu bento Snickers?',
            a: 'Standard — 12 cm średnicy, wysokość około 8 cm. Porcja dla 2 osób. Przeliczenie na inne średnice — w PDF.' },
          { q: 'Ile waży tort bento Snickers?',
            a: 'Około 700–750 g dla 12 cm. Najcięższy z podstawowych smaków — warstwa karmelu i orzeszków dodaje wagi.' },
        ],
      },
      en: {
        occasion: 'A “boys’ birthday” flavour: dense, generous, at home for a mate’s party, a corporate order, a Father’s Day gift.',
        mistakes: [
          'The caramel crystallises and gives a sandy grit on the cut.',
          'The peanuts soften inside the cream and lose their signature crunch.',
          'The cream turns too sweet and the cake stops being pleasant after the second bite.',
        ],
        faq: [
          { q: 'Can I swap peanuts for another nut?',
            a: 'Yes — the collection shows which nuts preserve the cake’s character and which to avoid.' },
          { q: 'Will it be too sweet?',
            a: 'The caramel-to-cream ratio is what balances this. The PDF gives concrete numbers.' },
          { q: 'Can I sell it for a kids’ order?',
            a: 'Flavour-wise yes, but with peanuts on board, confirm allergies with the client first.' },
        
          { q: 'What size is the Snickers bento cake?',
            a: 'Standard is 12 cm diameter, about 8 cm tall. Serves 2. Conversion to other diameters — in the PDF.' },
          { q: 'How much does the Snickers bento cake weigh?',
            a: 'Around 700–750 g at 12 cm. The heaviest of the base flavours — the caramel and peanut layer adds weight.' },
        ],
      },
    },
  },

  'raffaello-bento-cake': {
    related: ['pina-colada-bento-cake', 'poppy-seed-citrus-bento-cake', 'ferrero-rocher-bento-cake'],
    t: {
      uk: {
        occasion: 'Ніжний, «жіночий» варіант. Ідеально на 8 березня, весільний столик, святковий брантч.',
        mistakes: [
          'Кокос дає волокна, які застряють між зубами.',
          'Хрустка нотка мигдалю розм’якшується під кремом.',
          'Торт виходить «блідим» — на фото не читається структура.',
        ],
        faq: [
          { q: 'Чи можна робити без кокосу?',
            a: 'Тоді це вже не Raffaello. Але у збірнику є 9 інших смаків, які краще підходять для тих, хто не любить кокос.' },
          { q: 'Чи буде торт достатньо солодким?',
            a: 'Так, крем на основі згущеного молока плюс кокос дає характерну солодкість. Пропорції — в PDF.' },
          { q: 'Чи можна замінити мигдаль?',
            a: 'Так, у збірнику зазначено, які горіхи підійдуть за смаком і текстурою.' },
        ],
      },
      ru: {
        occasion: 'Нежный, «женский» вариант. Идеально на 8 марта, свадебный столик, праздничный брантч.',
        mistakes: [
          'Кокос даёт волокна, которые застревают между зубов.',
          'Хрустящая миндальная нотка размягчается под кремом.',
          'Торт выходит «бледным» — на фото не читается структура.',
        ],
        faq: [
          { q: 'Можно ли делать без кокоса?',
            a: 'Тогда это уже не Raffaello. Но в сборнике есть 9 других вкусов для тех, кто не любит кокос.' },
          { q: 'Не будет ли торт слишком приторным?',
            a: 'Крем на сгущённом молоке плюс кокос даёт характерную сладость. Точные пропорции — в PDF.' },
          { q: 'Можно ли заменить миндаль?',
            a: 'Да, в сборнике указано, какие орехи подойдут по вкусу и текстуре.' },
        ],
      },
      pl: {
        occasion: 'Delikatny, „kobiecy” wariant. Idealny na 8 marca, weselny stół sweet table, świąteczny brunch.',
        mistakes: [
          'Kokos daje włókna, które utykają między zębami.',
          'Chrupiąca nuta migdałów mięknie pod kremem.',
          'Tort wychodzi „blady” — na zdjęciu ginie struktura warstw.',
        ],
        faq: [
          { q: 'Czy można zrobić bez kokosu?',
            a: 'To już nie będzie Raffaello. W zbiorze masz 9 innych smaków dla osób, które nie lubią kokosu.' },
          { q: 'Czy tort nie będzie za słodki?',
            a: 'Krem z mleka skondensowanego i kokos dają charakterystyczną słodycz. Proporcje są w PDF.' },
          { q: 'Czy można zamienić migdały?',
            a: 'Tak — zbiór wskazuje, które orzechy pasują smakowo i teksturalnie.' },
        ],
      },
      en: {
        occasion: 'The soft, feminine one. It fits an anniversary, a bridal sweet table, an 8 March gift, a spring brunch.',
        mistakes: [
          'The coconut gives fibrous threads that stick between the teeth.',
          'The almond crunch softens under the cream and disappears.',
          'The cake looks “pale” — the layer structure gets lost in the photos.',
        ],
        faq: [
          { q: 'Can I make it without coconut?',
            a: 'Then it stops being Raffaello. The collection has 9 other flavours if coconut is not your thing.' },
          { q: 'Will it be too sweet?',
            a: 'Sweetened condensed milk plus coconut delivers the signature sweetness. Exact ratios are in the PDF.' },
          { q: 'Can I swap the almonds?',
            a: 'Yes — the PDF lists which nuts hold up in flavour and texture.' },
        ],
      },
    },
  },

  'ferrero-rocher-bento-cake': {
    related: ['snickers-bento-cake', 'cinnabon-bento-cake', 'raffaello-bento-cake'],
    t: {
      uk: {
        occasion: 'Преміальна подача: річниця, корпоратив, подарунок «клієнту року». Виглядає дорого й читається на фото як бренд.',
        mistakes: [
          'Ганаш занадто рідкий — вафельний прошарок «плаває».',
          'Молочний шоколад дає надто солодку ноту, і смак губиться.',
          'Ганаш кристалізується у холодильнику й втрачає гладкість на розрізі.',
        ],
        faq: [
          { q: 'Чи можна використати темний шоколад замість молочного?',
            a: 'Так, але це змінить характер торта. Ми пояснюємо в PDF, як скоригувати пропорції, щоб не було гірко.' },
          { q: 'Чи витримає торт спекотну доставку?',
            a: 'Так, при правильній стабілізації ганашу. Умови й температурний коридор — у збірнику.' },
          { q: 'Чи потрібне спеціальне обладнання для ганашу?',
            a: 'Ні. Потрібен акуратний темперний режим (без фанатизму). Кроки описані в PDF.' },
        ],
      },
      ru: {
        occasion: 'Премиальная подача: годовщина, корпоратив, подарок «клиенту года». Смотрится дорого и читается на фото как бренд.',
        mistakes: [
          'Ганаш слишком жидкий — вафельная прослойка «плавает».',
          'Молочный шоколад даёт слишком сладкую ноту, и вкус теряется.',
          'Ганаш кристаллизуется в холодильнике и теряет гладкость на срезе.',
        ],
        faq: [
          { q: 'Можно ли использовать тёмный шоколад вместо молочного?',
            a: 'Да, но это меняет характер торта. В PDF мы объясняем, как скорректировать пропорции, чтобы не было горько.' },
          { q: 'Выдержит ли торт жаркую доставку?',
            a: 'Да, при правильной стабилизации ганаша. Условия и температурный коридор — в сборнике.' },
          { q: 'Нужно ли специальное оборудование для ганаша?',
            a: 'Нет. Нужен аккуратный температурный режим (без фанатизма). Шаги — в PDF.' },
        ],
      },
      pl: {
        occasion: 'Premium wydanie: rocznica, wydarzenie firmowe, prezent dla „klienta roku”. Wygląda drogo i buduje wizerunek marki na foto.',
        mistakes: [
          'Ganache jest zbyt płynny — warstwa waflowa „pływa”.',
          'Mleczna czekolada daje zbyt słodką nutę i smak ginie.',
          'Ganache krystalizuje w lodówce i traci gładkość na przekroju.',
        ],
        faq: [
          { q: 'Czy można użyć gorzkiej czekolady zamiast mlecznej?',
            a: 'Tak, ale to zmienia charakter tortu. W PDF tłumaczymy, jak skorygować proporcje, żeby nie było gorzko.' },
          { q: 'Czy tort zniesie transport w upale?',
            a: 'Tak, przy prawidłowej stabilizacji ganache. Warunki i zakres temperatur są w zbiorze.' },
          { q: 'Czy potrzebny jest specjalny sprzęt do ganache?',
            a: 'Nie. Wystarczy staranny reżim temperatury (bez fanatyzmu). Kroki opisane są w PDF.' },
        ],
      },
      en: {
        occasion: 'The premium presentation: an anniversary, a corporate order, a “top client” gift. It looks expensive and photographs like brand work.',
        mistakes: [
          'The ganache runs too thin and the wafer layer starts floating.',
          'Milk chocolate pushes the sweetness too far and the character disappears.',
          'The ganache crystallises in the fridge and the cut loses its gloss.',
        ],
        faq: [
          { q: 'Can I use dark chocolate instead of milk?',
            a: 'Yes, but it changes the character. The PDF explains how to rebalance the ratios so it does not turn bitter.' },
          { q: 'Will it survive delivery in the heat?',
            a: 'Yes, with the right ganache stabilisation. Conditions and the safe temperature window are in the collection.' },
          { q: 'Do I need special equipment for the ganache?',
            a: 'No. You need a careful temperature routine (nothing extreme). Steps are laid out in the PDF.' },
        ],
      },
    },
  },

  'cinnabon-bento-cake': {
    related: ['snickers-bento-cake', 'ferrero-rocher-bento-cake', 'oreo-bento-cake'],
    t: {
      uk: {
        occasion: 'Зимово-осінній варіант. Ідеально на осінні дні народження, «cosy» подачу з кавою, святковий стіл.',
        mistakes: [
          'Кориця дає ефект «пилу в горлі», якщо переборщити.',
          'Крем-чиз на маскарпоне «пливе» під теплим бісквітом.',
          'Карамель усередині твердне до консистенції ірису й ріже губи.',
        ],
        faq: [
          { q: 'Скільки кориці — це «нормально»?',
            a: 'Дуже вузьке вікно. Скільки саме грамів на порцію — у PDF-збірнику з конкретними цифрами.' },
          { q: 'Чи можна використовувати молоту корицю з магазину?',
            a: 'Так, у збірнику є рекомендації, які саме бренди дають насичену ноту без гіркоти.' },
          { q: 'Чи буде торт «важким»?',
            a: 'Ні, за умови правильної збірки. Ми показуємо в PDF, як зберегти повітряність, попри щільний крем.' },
        ],
      },
      ru: {
        occasion: 'Зимне-осенний вариант. Идеально на осенние дни рождения, «cosy» подачу с кофе, праздничный стол.',
        mistakes: [
          'Корица даёт эффект «пыли в горле», если переборщить.',
          'Крем-чиз на маскарпоне «плывёт» под тёплым бисквитом.',
          'Карамель внутри твердеет до консистенции ириса и режет губы.',
        ],
        faq: [
          { q: 'Сколько корицы — это «нормально»?',
            a: 'Очень узкое окно. Сколько именно граммов на порцию — в PDF-сборнике с конкретными цифрами.' },
          { q: 'Можно ли брать молотую корицу из магазина?',
            a: 'Да, в сборнике есть рекомендации, какие именно бренды дают насыщенную ноту без горечи.' },
          { q: 'Не будет ли торт «тяжёлым»?',
            a: 'Нет, при правильной сборке. В PDF мы показываем, как сохранить воздушность, несмотря на плотный крем.' },
        ],
      },
      pl: {
        occasion: 'Zimowo-jesienna wersja. Świetnie sprawdza się na jesienne urodziny, „cosy” podanie z kawą, świąteczny stół.',
        mistakes: [
          'Cynamon daje efekt „pyłu w gardle”, jeśli przesadzisz.',
          'Krem serowy z mascarpone „pływa” pod ciepłym biszkoptem.',
          'Karmel w środku twardnieje do konsystencji krówki i rani wargi.',
        ],
        faq: [
          { q: 'Ile cynamonu to „w sam raz”?',
            a: 'Okno jest bardzo wąskie. Ile dokładnie gramów na porcję — jest w PDF z konkretnymi liczbami.' },
          { q: 'Czy można użyć zwykłego mielonego cynamonu ze sklepu?',
            a: 'Tak — zbiór wskazuje marki, które dają nasycony aromat bez goryczy.' },
          { q: 'Czy tort nie będzie „ciężki”?',
            a: 'Nie, przy właściwym montażu. PDF pokazuje, jak zachować lekkość mimo gęstego kremu.' },
        ],
      },
      en: {
        occasion: 'A cold-season pick. Right for an autumn birthday, a cosy coffee spread, a holiday table.',
        mistakes: [
          'The cinnamon coats the throat if you overshoot the amount.',
          'The mascarpone cream slides under a still-warm sponge.',
          'The caramel inside sets to toffee and cuts the lip on the first bite.',
        ],
        faq: [
          { q: 'How much cinnamon is “right”?',
            a: 'The window is narrow. Exact grams per portion is one of the numbers we hand you in the PDF.' },
          { q: 'Can I use supermarket ground cinnamon?',
            a: 'Yes — the collection names brands that deliver a strong aroma without bitterness.' },
          { q: 'Will the cake feel heavy?',
            a: 'No, with the right assembly. The PDF shows how to keep it airy despite the dense cream.' },
        ],
      },
    },
  },

  'pistachio-raspberry-bento-cake': {
    related: ['red-velvet-bento-cake', 'poppy-seed-citrus-bento-cake', 'raffaello-bento-cake'],
    t: {
      uk: {
        occasion: 'Топ преміум-замовлень 2026 року. Ідеально на весільний столик, професійне фото, «інстаграмний» подарунок.',
        mistakes: [
          'Фісташкова паста «сивіє» і смак стає травʼянистим.',
          'Малинове кюлі протікає в бісквіт і зафарбовує крем у брудно-рожевий.',
          'Крем виходить надто солодким і забиває тонку фісташкову ноту.',
        ],
        faq: [
          { q: 'Чи можна використати готову фісташкову пасту з магазину?',
            a: 'Так, але не всі бренди підходять. У PDF ми називаємо перевірені й пояснюємо, як обрати аналог.' },
          { q: 'Чи можна замінити малину на іншу ягоду?',
            a: 'Так, у збірнику є пояснення, які ягоди тримають форму й дають кислотний баланс.' },
          { q: 'Чи буде торт помітно дорожчим у собівартості?',
            a: 'Так, через фісташку. Ми в PDF показуємо, як рахувати собівартість і ставити ринкову ціну.' },
        ],
      },
      ru: {
        occasion: 'Топ премиум-заказов 2026 года. Идеально на свадебный столик, профессиональное фото, «инстаграмный» подарок.',
        mistakes: [
          'Фисташковая паста «седеет» и вкус становится травянистым.',
          'Малиновое кюли протекает в бисквит и красит крем в грязно-розовый.',
          'Крем выходит слишком сладким и забивает тонкую фисташковую ноту.',
        ],
        faq: [
          { q: 'Можно ли использовать готовую фисташковую пасту из магазина?',
            a: 'Да, но не все бренды подходят. В PDF мы называем проверенные и объясняем, как выбрать аналог.' },
          { q: 'Можно ли заменить малину на другую ягоду?',
            a: 'Да, в сборнике есть пояснение, какие ягоды держат форму и дают кислотный баланс.' },
          { q: 'Не выйдет ли торт заметно дороже по себестоимости?',
            a: 'Да, из-за фисташки. В PDF мы показываем, как считать себестоимость и ставить рыночную цену.' },
        ],
      },
      pl: {
        occasion: 'Top premium zamówień 2026 roku. Idealny na weselny sweet table, sesję zdjęciową, „instagramowy” prezent.',
        mistakes: [
          'Pasta pistacjowa „siwieje” i smak staje się trawiasty.',
          'Malinowe coulis przecieka do biszkoptu i barwi krem na brudny róż.',
          'Krem wychodzi zbyt słodki i przytłacza subtelną nutę pistacji.',
        ],
        faq: [
          { q: 'Czy można użyć gotowej pasty pistacjowej ze sklepu?',
            a: 'Tak, ale nie każda marka się nadaje. W PDF wskazujemy sprawdzone i pokazujemy, jak wybrać zamiennik.' },
          { q: 'Czy można zamienić maliny na inne owoce?',
            a: 'Tak — zbiór wyjaśnia, które owoce trzymają formę i dają odpowiednią kwasowość.' },
          { q: 'Czy koszt tortu będzie zauważalnie wyższy?',
            a: 'Tak, ze względu na pistacje. W PDF pokazujemy, jak liczyć koszt własny i ustawić cenę rynkową.' },
        ],
      },
      en: {
        occasion: 'A top premium order of 2026. It fits a wedding sweet table, a studio shoot, an Instagram-first gift.',
        mistakes: [
          'The pistachio paste dulls to grey and the flavour turns grassy.',
          'The raspberry coulis leaks into the sponge and stains the cream a muddy pink.',
          'The cream turns too sweet and drowns the delicate pistachio.',
        ],
        faq: [
          { q: 'Can I use shop-bought pistachio paste?',
            a: 'Yes, but not every brand holds up. The PDF names tested brands and how to judge a substitute.' },
          { q: 'Can I swap raspberries for another berry?',
            a: 'Yes — the collection walks you through which berries hold shape and match the acidity.' },
          { q: 'Will the cost per cake be noticeably higher?',
            a: 'Yes — pistachio does that. The PDF shows how to cost it out and set a market price.' },
        ],
      },
    },
  },

  'pina-colada-bento-cake': {
    related: ['raffaello-bento-cake', 'poppy-seed-citrus-bento-cake', 'red-velvet-bento-cake'],
    t: {
      uk: {
        occasion: 'Літній «відпустковий» настрій. Ідеально на морську тематику, дитячий день народження без алкоголю, замовлення на пляж.',
        mistakes: [
          'Ананасове кюлі надто рідке — «розповзається» під бісквіт.',
          'Кокосова стружка перетягує увагу й забиває смак ананасу.',
          'Торт має «мокрий» вигляд на розрізі через надлишок соку.',
        ],
        faq: [
          { q: 'Чи є в рецепті алкоголь?',
            a: 'У версії, яку ми продаємо як «дитячу», — ні. У «дорослій» — так, з невеликою нотою. Обидві версії у PDF.' },
          { q: 'Чи можна взяти консервований ананас?',
            a: 'Так, ми пояснюємо, як зробити з нього шар без надлишку рідини.' },
          { q: 'Чи довго тримається смак?',
            a: 'Із правильною стабілізацією — до 48 годин. Умови — у PDF.' },
        ],
      },
      ru: {
        occasion: 'Летнее «отпускное» настроение. Идеально на морскую тематику, детский день рождения без алкоголя, заказ на пляж.',
        mistakes: [
          'Ананасовое кюли слишком жидкое — «расползается» под бисквит.',
          'Кокосовая стружка перетягивает внимание и забивает вкус ананаса.',
          'Торт выглядит «мокрым» на срезе из-за избытка сока.',
        ],
        faq: [
          { q: 'Есть ли в рецепте алкоголь?',
            a: 'В версии, которую мы продаём как «детскую», — нет. Во «взрослой» — да, с лёгкой нотой. Обе версии в PDF.' },
          { q: 'Можно ли взять консервированный ананас?',
            a: 'Да, мы объясняем, как сделать из него слой без избытка жидкости.' },
          { q: 'Долго ли держится вкус?',
            a: 'С правильной стабилизацией — до 48 часов. Условия — в PDF.' },
        ],
      },
      pl: {
        occasion: 'Letnie „wakacyjne” wydanie. Świetny na tematykę morską, dziecięce urodziny bez alkoholu, zamówienie na plażę.',
        mistakes: [
          'Coulis ananasowe jest zbyt płynne i „rozłazi się” pod biszkoptem.',
          'Wiórki kokosowe kradną uwagę i tłumią smak ananasa.',
          'Tort wygląda „mokro” na przekroju przez nadmiar soku.',
        ],
        faq: [
          { q: 'Czy w przepisie jest alkohol?',
            a: 'W wersji „dziecięcej” — nie. W „dorosłej” — tak, z delikatną nutą. Obie wersje są w PDF.' },
          { q: 'Czy można użyć ananasa z puszki?',
            a: 'Tak — pokazujemy, jak zrobić z niego warstwę bez nadmiaru płynu.' },
          { q: 'Jak długo trzyma się smak?',
            a: 'Przy właściwej stabilizacji — do 48 godzin. Warunki są w PDF.' },
        ],
      },
      en: {
        occasion: 'A holiday mood. It fits a beach shoot, a nautical-theme kids’ party (alcohol-free version), a summer picnic order.',
        mistakes: [
          'The pineapple coulis runs too thin and sprawls under the sponge.',
          'The coconut shreds hog the flavour and mute the pineapple.',
          'The cut looks “wet” from excess juice.',
        ],
        faq: [
          { q: 'Is there alcohol in the recipe?',
            a: 'The version we sell as a kids’ cake — no. The adult version — yes, with a small note. Both are in the PDF.' },
          { q: 'Can I use canned pineapple?',
            a: 'Yes — the PDF walks through how to build the layer without carrying the excess liquid.' },
          { q: 'How long does the flavour hold?',
            a: 'With correct stabilisation — up to 48 hours. Conditions live in the PDF.' },
        ],
      },
    },
  },

  'cherry-chocolate-bento-cake': {
    related: ['oreo-bento-cake', 'red-velvet-bento-cake', 'ferrero-rocher-bento-cake'],
    t: {
      uk: {
        occasion: 'Класика «Чорний ліс» у бенто-форматі. Ідеально на новорічний стіл, зимовий день народження, подарунок мамі.',
        mistakes: [
          'Вишневе кюлі протікає в шоколадний бісквіт і робить розріз брудним.',
          'Ганаш «стягує» бісквіт при охолодженні — торт «сідає».',
          'Смак вишні перекривається шоколадом — «десерт без родзинки».',
        ],
        faq: [
          { q: 'Чи можна робити зі свіжої вишні?',
            a: 'Так, у збірнику є нотатки, коли брати свіжу, коли заморожену й чому вибір впливає на структуру.' },
          { q: 'Чи можна замінити молочний шоколад темним?',
            a: 'Так, це навіть класичніше. У PDF пояснюємо, як відкоригувати солодкість крему.' },
          { q: 'Скільки годин до подачі торт має пробути в холодильнику?',
            a: 'Мінімум і максимум ми даємо в PDF з поясненням, чому саме такий діапазон.' },
        ],
      },
      ru: {
        occasion: 'Классика «Чёрный лес» в бенто-формате. Идеально на новогодний стол, зимний день рождения, подарок маме.',
        mistakes: [
          'Вишнёвое кюли протекает в шоколадный бисквит и делает срез грязным.',
          'Ганаш «стягивает» бисквит при охлаждении — торт «садится».',
          'Вкус вишни перекрывается шоколадом — «десерт без изюминки».',
        ],
        faq: [
          { q: 'Можно ли делать из свежей вишни?',
            a: 'Да, в сборнике есть заметки, когда брать свежую, когда замороженную и как это влияет на структуру.' },
          { q: 'Можно ли заменить молочный шоколад тёмным?',
            a: 'Да, это даже классичнее. В PDF объясняем, как отрегулировать сладость крема.' },
          { q: 'Сколько часов до подачи торт должен стоять в холодильнике?',
            a: 'Минимум и максимум мы даём в PDF с объяснением, почему именно такой диапазон.' },
        ],
      },
      pl: {
        occasion: 'Klasyka „Czarny las” w formacie bento. Idealny na stół sylwestrowy, zimowe urodziny, prezent dla mamy.',
        mistakes: [
          'Wiśniowe coulis przecieka do czekoladowego biszkoptu i przekrój staje się „brudny”.',
          'Ganache „ściąga” biszkopt podczas chłodzenia i tort „siada”.',
          'Smak wiśni ginie pod czekoladą — deser bez charakteru.',
        ],
        faq: [
          { q: 'Czy można użyć świeżej wiśni?',
            a: 'Tak — zbiór wyjaśnia, kiedy świeża, kiedy mrożona, i jak wybór wpływa na strukturę.' },
          { q: 'Czy można zamienić czekoladę mleczną na gorzką?',
            a: 'Tak, to nawet bardziej klasyczne. W PDF pokazujemy, jak skorygować słodkość kremu.' },
          { q: 'Ile godzin przed podaniem tort powinien stać w lodówce?',
            a: 'Minimum i maksimum podajemy w PDF razem z wyjaśnieniem, dlaczego akurat taki zakres.' },
        ],
      },
      en: {
        occasion: 'Black Forest, done as a bento. It fits a New Year’s table, a winter birthday, a gift for mum.',
        mistakes: [
          'The cherry coulis leaks into the chocolate sponge and the cut looks muddy.',
          'The ganache pulls the sponge inward as it cools and the cake slumps.',
          'The chocolate overpowers the cherry and the dessert loses its lift.',
        ],
        faq: [
          { q: 'Can I use fresh cherries?',
            a: 'Yes — the collection notes when fresh works, when frozen is better, and how the choice affects structure.' },
          { q: 'Can I swap milk chocolate for dark?',
            a: 'Yes, and it is more traditional. The PDF explains how to rebalance the cream sweetness.' },
          { q: 'How many hours should the cake sit in the fridge before serving?',
            a: 'Minimum and maximum are in the PDF, with the reasoning for that specific window.' },
        ],
      },
    },
  },
};

// Localised section titles used by the FlavorPage template.
export const SECTIONS = {
  uk: {
    occasion:    'Коли він працює',
    mistakes:    'Часті помилки з цим смаком',
    mistakesHelp:'Проблеми знайомі — а точні рішення (грамажі, температура, стабілізація) чекають на вас у платному PDF-збірнику.',
    faq:         'Часті питання про цей торт',
    related:     'Спробуйте також',
    difficulty:  'Складність',
    time:        'Час на збірку',
    pdfCta:      'Отримати повний рецепт у PDF',
  },
  ru: {
    occasion:    'Когда он работает',
    mistakes:    'Частые ошибки с этим вкусом',
    mistakesHelp:'Проблемы знакомы — а точные решения (граммовки, температура, стабилизация) ждут в платном PDF-сборнике.',
    faq:         'Частые вопросы об этом торте',
    related:     'Попробуйте также',
    difficulty:  'Сложность',
    time:        'Время на сборку',
    pdfCta:      'Получить полный рецепт в PDF',
  },
  pl: {
    occasion:    'Kiedy się sprawdza',
    mistakes:    'Częste błędy z tym smakiem',
    mistakesHelp:'Problemy są znane — konkretne rozwiązania (proporcje, temperatura, stabilizacja) czekają w płatnym zbiorze PDF.',
    faq:         'Częste pytania o ten tort',
    related:     'Wypróbuj także',
    difficulty:  'Trudność',
    time:        'Czas montażu',
    pdfCta:      'Odbierz pełny przepis w PDF',
  },
  en: {
    occasion:    'When it works',
    mistakes:    'Common failure modes for this flavour',
    mistakesHelp:'The pain points are familiar — the exact fixes (grams, temperature, stabilisation) live in the paid PDF collection.',
    faq:         'Frequently asked about this cake',
    related:     'You might also like',
    difficulty:  'Difficulty',
    time:        'Assembly time',
    pdfCta:      'Get the full recipe in the PDF',
  },
};

export function getExtra(slug, lang) {
  const extra = FLAVOR_EXTRA[slug];
  if (!extra) return null;
  return {
    related: extra.related || [],
    ...(extra.t[lang] || extra.t.uk),
  };
}
