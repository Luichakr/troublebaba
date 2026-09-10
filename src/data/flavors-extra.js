// Non-recipe enrichment for /recipes/<slug>/ pages.
// STRICT: no grams, no temperatures, no times, no method steps, no proportions.
// Only positioning, occasion, common problems (naming the pain, NOT the fix),
// and FAQ that doesn't reveal recipe truths. The full craft lives in the paid PDF.

// Локализованный текст для es/de/fr/it/pt лежит в файлах-сиблингах и
// мерджится ниже — той же схемой, что flavors.<lang>.js в flavors.js.
// До 8 сентября этих пяти языков не было вовсе: страницы вкусов на них
// показывали английские FAQ, ошибки и подписи секций при остальном
// тексте на своём языке.
import { EXTRA_ES, SECTIONS_ES, DIFFICULTY_ES, TIME_ES } from './flavors-extra.es.js';
import { EXTRA_DE, SECTIONS_DE, DIFFICULTY_DE, TIME_DE } from './flavors-extra.de.js';
import { EXTRA_FR, SECTIONS_FR, DIFFICULTY_FR, TIME_FR } from './flavors-extra.fr.js';
import { EXTRA_IT, SECTIONS_IT, DIFFICULTY_IT, TIME_IT } from './flavors-extra.it.js';
import { EXTRA_PT, SECTIONS_PT, DIFFICULTY_PT, TIME_PT } from './flavors-extra.pt.js';

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
  es: DIFFICULTY_ES,
  de: DIFFICULTY_DE,
  fr: DIFFICULTY_FR,
  it: DIFFICULTY_IT,
  pt: DIFFICULTY_PT,
};
export const TIME_LABEL = {
  uk: { short: 'до 2 годин', medium: '2–3 години',  long: '3+ години'  },
  ru: { short: 'до 2 часов', medium: '2–3 часа',    long: '3+ часа'    },
  pl: { short: 'do 2 h',     medium: '2–3 h',       long: 'ponad 3 h'  },
  en: { short: 'under 2 h',  medium: '2–3 h',       long: 'over 3 h'   },
  es: TIME_ES,
  de: TIME_DE,
  fr: TIME_FR,
  it: TIME_IT,
  pt: TIME_PT,
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
        description: [
          'Oreo — найпопулярніший смак у збірнику й перший, який ми рекомендуємо для старту продажів. Щільний шоколадний бісквіт, ніжний крем-чиз на вершковому маслі та хрустка крихта печива дають знайомий смак, який не потребує пояснень клієнту. Вишневе кюлі додає легку кислинку й контраст на розрізі — саме тому фото цього торта збирають найбільше збережень.',
          'Замовляють на будь-що: дні народження, випускні, подарунки колегам, «просто для себе». Вікових обмежень немає — торт підходить дітям, бо в складі немає алкоголю та гострих спецій. Для домашнього кондитера це найбезпечніший перший замовлений торт: знайомий смак, терпимий до невеликих помилок при збірці, і клієнт заздалегідь розуміє, що отримає.',
          'Собівартість — одна з найнижчих у збірнику: основні інгредієнти є в будь-якому супермаркеті. Це дозволяє ставити конкурентну ціну й тренуватися на помилках без відчутних втрат. За статистикою наших покупців, саме Oreo приносить перші повторні замовлення.',
        ],
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
        description: [
          'Oreo — самый популярный вкус сборника и первый, который мы рекомендуем для старта продаж. Плотный шоколадный бисквит, нежный крем-чиз на сливочном масле и хрустящая крошка печенья дают знакомый вкус, который не нужно объяснять клиенту. Вишнёвое кюли добавляет лёгкую кислинку и контраст на срезе — именно поэтому фото этого торта собирают больше всего сохранений.',
          'Заказывают на что угодно: дни рождения, выпускные, подарки коллегам, «просто для себя». Возрастных ограничений нет — торт подходит детям, потому что в составе нет алкоголя и острых специй. Для домашнего кондитера это самый безопасный первый заказной торт: знакомый вкус, терпимый к небольшим ошибкам при сборке, и клиент заранее понимает, что получит.',
          'Себестоимость — одна из самых низких в сборнике: основные ингредиенты есть в любом супермаркете. Это позволяет ставить конкурентную цену и тренироваться на ошибках без ощутимых потерь. По статистике наших покупателей, именно Oreo приносит первые повторные заказы.',
        ],
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
        description: [
          'Oreo to najpopularniejszy smak w zbiorze i pierwszy, który polecamy na start sprzedaży. Gęsty czekoladowy biszkopt, delikatny krem serowy na maśle i chrupiąca okruszka ciastka dają znajomy smak, którego nie trzeba tłumaczyć klientowi. Wiśniowe coulis dodaje lekkiej kwaskowatości i kontrastu na przekroju — właśnie dlatego zdjęcia tego tortu zbierają najwięcej zapisów.',
          'Zamawiają na dosłownie wszystko: urodziny, zakończenie roku, prezenty dla współpracowników, „po prostu dla siebie”. Brak ograniczeń wiekowych — tort nadaje się dla dzieci, bo nie zawiera alkoholu ani ostrych przypraw. Dla domowego cukiernika to najbezpieczniejszy pierwszy tort na zamówienie: znajomy smak, tolerancyjny wobec drobnych błędów przy montażu, a klient z góry wie, czego się spodziewać.',
          'Koszt własny — jeden z najniższych w zbiorze: główne składniki kupisz w każdym supermarkecie. To pozwala ustawić konkurencyjną cenę i uczyć się na błędach bez dotkliwych strat. Według statystyk naszych kupujących to właśnie Oreo przynosi pierwsze powtórne zamówienia.',
        ],
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
        description: [
          'Oreo is the most popular flavour in the collection and the first one we recommend for starting sales. A dense chocolate sponge, smooth cream-cheese frosting on butter, and a crunchy biscuit crumb deliver a familiar taste that needs no explanation to the client. Cherry coulis adds a light tang and colour contrast on the cut — which is why photos of this cake collect the most saves.',
          'People order it for everything: birthdays, graduations, colleague gifts, “just because.” There are no age restrictions — the cake suits children since there is no alcohol or hot spices. For a home baker this is the safest first paid order: a familiar flavour, forgiving of minor assembly mistakes, and the client already knows what to expect.',
          'The cost per cake is among the lowest in the collection: the key ingredients are available at any supermarket. This lets you set a competitive price and learn from mistakes without painful losses. According to our buyers\' stats, Oreo is the flavour that brings the first repeat orders.',
        ],
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
        description: [
          'Червоний оксамит — це торт, який продається очима. Яскравий червоний бісквіт на контрасті з білим кремом на маскарпоне дає розріз, який клієнти фотографують і публікують самі. Полуничне кюлі додає свіжу ягідну ноту і працює як кислотний баланс до солодкості крему.',
          'Основна аудиторія — романтичні приводи: 14 лютого, річниці, пропозиції. Але добре продається і на дівич-вечори та жіночі свята. Саме Red Velvet найчастіше замовляють із написом на торті — його рівна біла поверхня ідеально підходить під надписи харчовим барвником.',
          'Рівень складності — середній: основна увага при збірці — робота з маскарпоне (крем вимагає певної температури й консистенції) та правильний колір бісквіту. Собівартість трохи вища за Oreo через маскарпоне та якісний барвник, але ціну можна ставити на 15–20% вище базової завдяки «преміальному» вигляду.',
        ],
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
        description: [
          'Красный бархат — это торт, который продаётся глазами. Яркий красный бисквит на контрасте с белым кремом на маскарпоне даёт срез, который клиенты фотографируют и публикуют сами. Клубничное кюли добавляет свежую ягодную ноту и работает как кислотный баланс к сладости крема.',
          'Основная аудитория — романтические поводы: 14 февраля, годовщины, предложения руки и сердца. Но хорошо продаётся и на девичники, и на женские праздники. Именно Red Velvet чаще всего заказывают с надписью на торте — его ровная белая поверхность идеально подходит под надписи пищевым красителем.',
          'Уровень сложности — средний: основное внимание при сборке — работа с маскарпоне (крем требует определённой температуры и консистенции) и правильный цвет бисквита. Себестоимость чуть выше, чем у Oreo, из-за маскарпоне и качественного красителя, но цену можно ставить на 15–20 % выше базовой благодаря «премиальному» виду.',
        ],
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
        description: [
          'Red Velvet to tort, który sprzedaje się oczami. Żywy czerwony biszkopt na kontraście z białym kremem mascarpone daje przekrój, który klienci fotografują i publikują sami. Truskawkowe coulis dodaje świeżej owocowej nuty i pełni rolę kwaśnego balansu do słodyczy kremu.',
          'Główna grupa odbiorców to okazje romantyczne: walentynki, rocznice, zaręczyny. Ale dobrze sprzedaje się też na wieczory panieńskie i Dzień Kobiet. To właśnie Red Velvet najczęściej zamawiają z napisem na torcie — jego gładka, biała powierzchnia idealnie nadaje się pod napisy barwnikiem spożywczym.',
          'Poziom trudności — średni: główna uwaga przy montażu to praca z mascarpone (krem wymaga odpowiedniej temperatury i konsystencji) oraz właściwy kolor biszkoptu. Koszt własny nieco wyższy niż Oreo ze względu na mascarpone i dobry barwnik, ale cenę można ustawić o 15–20 % wyżej od bazowej dzięki „premium” wyglądowi.',
        ],
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
        description: [
          'Red Velvet is a cake that sells through the eyes. A vivid red sponge against white mascarpone cream gives a cross-section that clients photograph and share on their own. Strawberry coulis adds a fresh berry note and works as an acid balance to the cream’s sweetness.',
          'The core audience is romantic occasions: Valentine’s Day, anniversaries, proposals. But it also sells well for hen parties and women’s holidays. Red Velvet is the most frequently ordered cake with a written message — its smooth white surface is perfect for food-colouring inscriptions.',
          'Difficulty is intermediate: the main focus during assembly is working with mascarpone (the cream demands a certain temperature and consistency) and getting the sponge colour right. Cost is slightly higher than Oreo because of mascarpone and quality food colouring, but you can price it 15–20 % above the base thanks to its “premium” look.',
        ],
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
        description: [
          'Мак-цитрус — найлегший смак збірника. Маковий бісквіт із ніжною структурою, яскравий цитрусовий курд і крем-чиз, що пом\'якшує кислинку, — це десерт для тих, хто не хоче нічого шоколадного. Смак свіжий, злегка «дорослий», без нав\'язливої солодкості.',
          'Найкращі місяці продажів — квітень-червень: коли клієнти перемикаються з зимових шоколадних смаків на щось легше. Добре йде на брантч-замовлення, дівич-вечори та подарунки жінкам старшого віку, які не їдять надто солодке. Мак-цитрус — це той смак, який виводить вашу лінійку за межі «ще один шоколадний торт».',
          'Собівартість — середня: мак і масло коштують помірно, основна стаття — якісні цитруси для курду. На фото торт виглядає акуратно й неординарно, тому клієнти часто замовляють повторно, навіть якщо спочатку обрали його «на спробу».',
        ],
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
        description: [
          'Мак-цитрус — самый лёгкий вкус сборника. Маковый бисквит с нежной структурой, яркий цитрусовый курд и крем-чиз, который смягчает кислинку, — десерт для тех, кто не хочет ничего шоколадного. Вкус свежий, слегка «взрослый», без навязчивой сладости.',
          'Лучшие месяцы продаж — апрель-июнь: клиенты переключаются с зимних шоколадных вкусов на что-то легче. Хорошо идёт на бранч-заказы, девичники и подарки женщинам постарше, которые не едят слишком сладкое. Мак-цитрус — тот вкус, который выводит вашу линейку за рамки «ещё один шоколадный торт».',
          'Себестоимость — средняя: мак и масло стоят умеренно, основная статья — качественные цитрусы для курда. На фото торт выглядит аккуратно и необычно, поэтому клиенты часто заказывают повторно, даже если изначально выбрали его «на пробу».',
        ],
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
        description: [
          'Mak-cytrus to najlżejszy smak w zbiorze. Makowy biszkopt o delikatnej strukturze, wyrazisty cytrusowy curd i krem serowy, który łagodzi kwaskowatość — deser dla tych, którzy nie chcą nic czekoladowego. Smak świeży, lekko „dorosły”, bez nachalnej słodyczy.',
          'Najlepsze miesiące sprzedażowe to kwiecień–czerwiec: klienci przechodzą z zimowych czekoladowych smaków na coś lżejszego. Świetnie sprawdza się na zamówienia brunchowe, wieczory panieńskie i prezenty dla starszych kobiet, które nie jedzą zbyt słodkich rzeczy. Mak-cytrus to smak, który wyciąga twoją ofertę poza schemat „kolejny czekoladowy tort”.',
          'Koszt własny — średni: mak i masło kosztują umiarkowanie, główna pozycja to jakościowe cytrusy na curd. Na zdjęciach tort wygląda schludnie i oryginalnie, dlatego klienci często zamawiają ponownie, nawet jeśli początkowo wybrali go „na próbę”.',
        ],
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
        description: [
          'Poppy-citrus is the lightest flavour in the collection. A poppy-seed sponge with a delicate crumb, bright citrus curd, and cream cheese that tames the tartness — a dessert for anyone who does not want anything chocolate. The taste is fresh, slightly "grown-up," free of cloying sweetness.',
          'The best selling months are April through June, when clients switch from winter chocolate flavours to something lighter. It works well for brunch orders, hen nights, and gifts for older women who do not eat overly sweet things. Poppy-citrus is the flavour that takes your line-up beyond "just another chocolate cake."',
          'Cost per cake is mid-range: poppy seeds and butter are moderate; the main expense is quality citrus for the curd. The cake photographs as tidy and distinctive, so clients often reorder even if they originally picked it "just to try."',
        ],
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
        description: [
          'Snickers — найситніший смак у збірнику. Шоколадний бісквіт, шар солоної карамелі, арахіс і шоколадний крем-чиз дають насичений «цукерковий» смак, який клієнти впізнають із першого шматочка. Це торт для тих, хто хоче великого десерту в маленькому форматі.',
          'У продажах Snickers стабільно займає другу-третю позицію після Oreo. Його найчастіше замовляють як «подарунок хлопцю» або «на корпоратив», де потрібен смак без ризику. Арахіс у складі — єдине обмеження: на дитячих замовленнях варто уточнювати алергії.',
          'Це один із найважчих бенто-тортів: карамель і горіхи додають вагу, тому 12-сантиметрова порція відчувається ситною. Собівартість — на рівні базових смаків (шоколад, арахіс, цукор для карамелі), що дає хорошу маржу при середній ринковій ціні.',
        ],
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
        description: [
          'Snickers — самый сытный вкус сборника. Шоколадный бисквит, слой солёной карамели, арахис и шоколадный крем-чиз дают насыщенный «конфетный» вкус, который клиенты узнают с первого кусочка. Это торт для тех, кто хочет большой десерт в маленьком формате.',
          'В продажах Snickers стабильно занимает вторую-третью позицию после Oreo. Его чаще всего заказывают как «подарок парню» или «на корпоратив», где нужен вкус без риска. Арахис в составе — единственное ограничение: на детских заказах стоит уточнять аллергии.',
          'Это один из самых тяжёлых бенто-тортов: карамель и орехи добавляют веса, поэтому 12-сантиметровая порция ощущается сытной. Себестоимость — на уровне базовых вкусов (шоколад, арахис, сахар для карамели), что даёт хорошую маржу при средней рыночной цене.',
        ],
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
        description: [
          'Snickers to najbardziej sycący smak w zbiorze. Czekoladowy biszkopt, warstwa słonego karmelu, orzeszki ziemne i czekoladowy krem serowy dają intensywny „cukierkowy” smak, który klienci rozpoznają od pierwszego kęsa. To tort dla tych, którzy chcą dużego deseru w małym formacie.',
          'W sprzedaży Snickers stabilnie zajmuje drugą–trzecią pozycję po Oreo. Najczęściej zamawiają go jako „prezent dla chłopaka” albo „na firmową imprezę”, gdzie potrzebny smak bez ryzyka. Orzeszki w składzie — jedyne ograniczenie: przy zamówieniach na imprezy dziecięce warto dopytać o alergie.',
          'To jeden z najcięższych tortów bento: karmel i orzechy dodają wagi, więc 12-centymetrowa porcja jest naprawdę sycąca. Koszt własny — na poziomie podstawowych smaków (czekolada, orzeszki, cukier na karmel), co daje dobrą marżę przy średniej cenie rynkowej.',
        ],
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
        description: [
          'Snickers is the most filling flavour in the collection. A chocolate sponge, a layer of salted caramel, peanuts, and chocolate cream cheese deliver a rich “candy-bar” taste that clients recognise from the first bite. This is a cake for those who want a big dessert in a small format.',
          'In sales, Snickers consistently holds second or third place after Oreo. It is most often ordered as a “gift for a boyfriend” or “for a corporate event” where a risk-free flavour is needed. The peanuts are the only limitation: for children’s orders it is worth checking allergies.',
          'This is one of the heaviest bento cakes: caramel and nuts add weight, so the 12 cm portion feels substantial. Cost per cake is on par with the base flavours (chocolate, peanuts, sugar for caramel), which gives a healthy margin at an average market price.',
        ],
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
        description: [
          'Raffaello — торт із впізнаваним смаком кокосу й мигдалю. Ванільний бісквіт, ніжний кокосовий крем і ціла цукерка Raffaello зверху роблять його одним із найбільш «подарункових» смаків у збірнику. Смак делікатний і солодкий — без шоколаду, без кислинки, без контрастів.',
          'Пік замовлень — весна: 8 березня, весільні столики, святкові брантчі. Raffaello стабільно в топ-3 за кількістю замовлень, особливо в сезон весіль. Клієнти, які обирають цей смак, зазвичай вже знають, чого хочуть — їх не потрібно переконувати.',
          'Собівартість — вища за середню через кокос, мигдаль і згущене молоко. Але «преміальне» сприйняття смаку дозволяє без зусиль ставити ціну на 20–30% вище за базову лінійку. На фото торт виглядає елегантно — білий, чистий, з текстурою кокосової стружки.',
        ],
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
        description: [
          'Raffaello — торт с узнаваемым вкусом кокоса и миндаля. Ванильный бисквит, нежный кокосовый крем и целая конфета Raffaello сверху делают его одним из самых «подарочных» вкусов в сборнике. Вкус деликатный и сладкий — без шоколада, без кислинки, без контрастов.',
          'Пик заказов — весна: 8 марта, свадебные столики, праздничные бранчи. Raffaello стабильно в топ-3 по количеству заказов, особенно в свадебный сезон. Клиенты, которые выбирают этот вкус, обычно уже знают, чего хотят — их не нужно убеждать.',
          'Себестоимость — выше средней из-за кокоса, миндаля и сгущённого молока. Но «премиальное» восприятие вкуса позволяет без усилий ставить цену на 20–30 % выше базовой линейки. На фото торт выглядит элегантно — белый, чистый, с текстурой кокосовой стружки.',
        ],
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
        description: [
          'Raffaello to tort o natychmiast rozpoznawalnym smaku kokosa i migdałów. Waniliowy biszkopt, delikatny krem kokosowy i cały cukierek Raffaello na wierzchu czynią go jednym z najbardziej „prezentowych” smaków w zbiorze. Smak jest delikatny i słodki — bez czekolady, bez kwaskowatości, bez kontrastów.',
          'Szczyt zamówień — wiosna: Dzień Kobiet, weselne sweet table, świąteczne brunche. Raffaello stabilnie trzyma się w top 3 pod względem liczby zamówień, szczególnie w sezonie ślubnym. Klienci wybierający ten smak zwykle już wiedzą, czego chcą — nie trzeba ich przekonywać.',
          'Koszt własny — powyżej średniej ze względu na kokos, migdały i mleko skondensowane. Ale „premium” postrzeganie smaku pozwala bez trudu ustawić cenę o 20–30 % wyżej od bazowej oferty. Na zdjęciach tort wygląda elegancko — biały, czysty, z fakturą wiórków kokosowych.',
        ],
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
        description: [
          'Raffaello is a cake with the instantly recognisable taste of coconut and almond. A vanilla sponge, a gentle coconut cream, and a whole Raffaello truffle on top make it one of the most "gift-worthy" flavours in the collection. The taste is delicate and sweet — no chocolate, no tang, no contrasts.',
          'Peak orders come in spring: International Women’s Day, wedding sweet tables, celebration brunches. Raffaello sits firmly in the top 3 by order count, especially during wedding season. Clients who choose this flavour usually already know what they want — you do not need to convince them.',
          'Cost per cake is above average because of coconut, almonds, and condensed milk. But the "premium" perception of the flavour lets you price it 20–30 % above the base line-up without pushback. In photos the cake looks elegant — white, clean, with the texture of coconut shavings.',
        ],
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
        description: [
          'Ferrero Rocher — найдорожчий і найскладніший смак збірника. Шоколадний бісквіт, ганаш із фундука, вафельна прошарка й ціла цукерка Ferrero Rocher зверху створюють текстурний десерт, де кожен шар відрізняється від попереднього. Смак — глибокий шоколадно-горіховий, без зайвої солодкості.',
          'Це «корпоративний» торт: його замовляють на річниці компаній, подарунки партнерам, VIP-привітання. Ferrero Rocher виглядає преміально на фото — золоті акценти, складна структура — і клієнт готовий платити за це більше. За нашою статистикою, середній чек замовлень із цим смаком на 30–40% вищий за базову лінійку.',
          'Складність збірки — найвища зі всіх десяти смаків: ганаш вимагає точного температурного режиму, вафельна прошарка — правильного тайміну. Але саме ця складність робить торт тим, що клієнт не зможе повторити вдома, — а значить, повертається до вас.',
        ],
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
        description: [
          'Ferrero Rocher — самый дорогой и самый сложный вкус сборника. Шоколадный бисквит, ганаш из фундука, вафельная прослойка и целая конфета Ferrero Rocher сверху создают текстурный десерт, где каждый слой отличается от предыдущего. Вкус — глубокий шоколадно-ореховый, без лишней сладости.',
          'Это «корпоративный» торт: его заказывают на годовщины компаний, подарки партнёрам, VIP-поздравления. Ferrero Rocher выглядит премиально на фото — золотые акценты, сложная структура — и клиент готов платить за это больше. По нашей статистике, средний чек заказов с этим вкусом на 30–40 % выше базовой линейки.',
          'Сложность сборки — самая высокая из всех десяти вкусов: ганаш требует точного температурного режима, вафельная прослойка — правильного тайминга. Но именно эта сложность делает торт тем, что клиент не сможет повторить дома, — а значит, возвращается к вам.',
        ],
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
        description: [
          'Ferrero Rocher to najdroższy i najtrudniejszy smak w zbiorze. Czekoladowy biszkopt, ganache z orzechów laskowych, warstwa waflowa i cały cukierek Ferrero Rocher na wierzchu tworzą teksturalny deser, w którym każda warstwa różni się od poprzedniej. Smak — głęboki czekoladowo-orzechowy, bez nadmiernej słodyczy.',
          'To tort „korporacyjny”: zamawiają go na rocznice firm, prezenty dla partnerów biznesowych, życzenia VIP. Ferrero Rocher wygląda premium na zdjęciach — złote akcenty, złożona struktura — i klient jest gotów za to zapłacić więcej. Według naszych statystyk średnia wartość zamówień z tym smakiem jest o 30–40 % wyższa od bazowej oferty.',
          'Trudność montażu — najwyższa ze wszystkich dziesięciu smaków: ganache wymaga precyzyjnej kontroli temperatury, warstwa waflowa — odpowiedniego timingu. Ale to właśnie ta trudność sprawia, że tort jest czymś, czego klient nie odtworzy w domu — a więc wraca do ciebie.',
        ],
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
        description: [
          'Ferrero Rocher is the most expensive and most complex flavour in the collection. A chocolate sponge, hazelnut ganache, a wafer layer, and a whole Ferrero Rocher truffle on top create a textured dessert where every layer feels different from the last. The taste is deep chocolate-and-hazelnut, without excess sweetness.',
          'This is the “corporate” cake: ordered for company anniversaries, partner gifts, VIP greetings. Ferrero Rocher looks premium in photos — gold accents, complex structure — and the client is willing to pay more. By our stats, the average ticket for orders with this flavour is 30–40 % above the base line-up.',
          'Assembly difficulty is the highest of all ten flavours: the ganache demands precise temperature control, the wafer layer demands correct timing. But that very difficulty makes the cake something the client cannot replicate at home — which means they come back to you.',
        ],
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
        description: [
          'Cinnabon — єдиний «пряний» смак у збірнику. Теплий бісквіт із корицею, крем-чиз на маскарпоне та тонка карамельна спіраль дають ефект булки Cinnabon, перетвореної в торт. Смак затишний, солодкий, з легкою пряною нотою — ідеальний під каву чи гарячий шоколад.',
          'Сезон продажів — жовтень-грудень: осінні дні народження, Хелловін, новорічні замовлення. У холодну пору Cinnabon стабільно входить у топ-5, а влітку попит падає майже до нуля. Це робить його ідеальним сезонним доповненням до лінійки — не потрібно тримати інгредієнти цілий рік.',
          'Собівартість — одна з найнижчих: кориця, маскарпоне й карамель коштують помірно. Єдиний виклик — точне дозування кориці: різниця між «затишно» і «пече в горлі» — це кілька грамів. Саме цю точність і дає PDF-рецепт.',
        ],
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
        description: [
          'Cinnabon — единственный «пряный» вкус в сборнике. Тёплый бисквит с корицей, крем-чиз на маскарпоне и тонкая карамельная спираль дают эффект булочки Cinnabon, превращённой в торт. Вкус уютный, сладкий, с лёгкой пряной нотой — идеален под кофе или горячий шоколад.',
          'Сезон продаж — октябрь-декабрь: осенние дни рождения, Хэллоуин, новогодние заказы. В холодное время Cinnabon стабильно входит в топ-5, а летом спрос падает почти до нуля. Это делает его идеальным сезонным дополнением к линейке — не нужно держать ингредиенты круглый год.',
          'Себестоимость — одна из самых низких: корица, маскарпоне и карамель стоят умеренно. Единственный вызов — точная дозировка корицы: разница между «уютно» и «печёт в горле» — это несколько граммов. Именно эту точность и даёт PDF-рецепт.',
        ],
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
        description: [
          'Cinnabon to jedyny „korzenny” smak w zbiorze. Ciepły biszkopt z cynamonem, krem serowy na mascarpone i cienka spirala karmelowa dają efekt bułki Cinnabon zamienionej w tort. Smak przytulny, słodki, z lekką korzenną nutą — idealny do kawy lub gorącej czekolady.',
          'Sezon sprzedażowy — październik–grudzień: jesienne urodziny, Halloween, zamówienia noworoczne. W zimnych miesiącach Cinnabon stabilnie wchodzi do top 5, a latem popyt spada niemal do zera. To czyni go idealnym sezonowym uzupełnieniem oferty — nie musisz trzymać składników przez cały rok.',
          'Koszt własny — jeden z najniższych: cynamon, mascarpone i karmel kosztują umiarkowanie. Jedyne wyzwanie — precyzyjne dawkowanie cynamonu: różnica między „przytulnie” a „piecze w gardle” to kilka gramów. Właśnie tę precyzję daje przepis z PDF.',
        ],
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
        description: [
          'Cinnabon is the only "spiced" flavour in the collection. A warm cinnamon sponge, mascarpone cream cheese, and a thin caramel spiral deliver the effect of a Cinnabon roll turned into a cake. The taste is cosy, sweet, with a light spiced note — ideal with coffee or hot chocolate.',
          'The selling season is October through December: autumn birthdays, Halloween, New Year’s orders. In the cold months Cinnabon reliably makes the top 5, while in summer demand drops to nearly zero. This makes it an ideal seasonal addition to your line-up — no need to stock ingredients year-round.',
          'Cost per cake is among the lowest: cinnamon, mascarpone, and caramel are affordable. The sole challenge is precise cinnamon dosing: the difference between "cosy" and "burning throat" is a matter of grams. That precision is exactly what the PDF recipe provides.',
        ],
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
        description: [
          'Фісташка-малина — головний преміум-смак збірника і абсолютний лідер за фотогенічністю. Фісташковий бісквіт, крем-чиз із натуральною фісташковою пастою та малинове конфі дають яскравий контраст кольорів і смаків: горіхова солодкість зустрічається з ягідною кислинкою. Розріз — зелений, рожевий, білий — виглядає як обкладинка кондитерського журналу.',
          'Це найпопулярніший смак для весільних столиків і «інстаграмних» замовлень. Клієнти, які обирають фісташку-малину, зазвичай вже бачили цей торт у когось в стрічці й хочуть саме такий. Середній чек — найвищий серед усіх десяти смаків, і клієнти не торгуються.',
          'Собівартість — найвища у збірнику через фісташкову пасту: якісна коштує в рази дорожче за будь-який інший інгредієнт. Але маржа теж найвища — позиціонування «преміум» дозволяє ставити ціну на 40–60% вище базової. Саме на цьому смаку домашній кондитер може відчути різницю між «підробіток» і «бізнес».',
        ],
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
        description: [
          'Фисташка-малина — главный премиум-вкус сборника и абсолютный лидер по фотогеничности. Фисташковый бисквит, крем-чиз с натуральной фисташковой пастой и малиновое конфи дают яркий контраст цветов и вкусов: ореховая сладость встречается с ягодной кислинкой. Срез — зелёный, розовый, белый — выглядит как обложка кондитерского журнала.',
          'Это самый популярный вкус для свадебных столиков и «инстаграмных» заказов. Клиенты, которые выбирают фисташку-малину, обычно уже видели этот торт у кого-то в ленте и хотят именно такой. Средний чек — самый высокий среди всех десяти вкусов, и клиенты не торгуются.',
          'Себестоимость — самая высокая в сборнике из-за фисташковой пасты: качественная стоит в разы дороже любого другого ингредиента. Но маржа тоже самая высокая — позиционирование «премиум» позволяет ставить цену на 40–60 % выше базовой. Именно на этом вкусе домашний кондитер может почувствовать разницу между «подработка» и «бизнес».',
        ],
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
        description: [
          'Pistacja-malina to flagowy smak premium w zbiorze i bezkonkurencyjny lider pod względem fotogeniczności. Pistacjowy biszkopt, krem serowy z naturalną pastą pistacjową i malinowe confit dają żywy kontrast kolorów i smaków: orzechowa słodycz spotyka się z owocową kwaskowatością. Przekrój — zielony, różowy, biały — wygląda jak okładka magazynu cukierniczego.',
          'To najpopularniejszy smak na weselne sweet table i zamówienia „na Instagrama”. Klienci wybierający pistację-malinę zwykle już widzieli ten tort u kogoś w feedzie i chcą dokładnie takiego. Średnia wartość zamówienia — najwyższa ze wszystkich dziesięciu smaków, a klienci się nie targują.',
          'Koszt własny — najwyższy w zbiorze ze względu na pastę pistacjową: jakościowa kosztuje wielokrotnie więcej niż jakikolwiek inny składnik. Ale marża też jest najwyższa — pozycjonowanie „premium” pozwala ustawić cenę o 40–60 % powyżej bazowej. To właśnie na tym smaku domowy cukiernik może poczuć różnicę między „dorabianiem” a „biznesem”.',
        ],
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
        description: [
          'Pistachio-raspberry is the flagship premium flavour of the collection and the undisputed leader in photogenicity. A pistachio sponge, cream cheese with natural pistachio paste, and raspberry confit deliver a vivid contrast of colour and taste: nutty sweetness meets berry tartness. The cross-section — green, pink, white — looks like a pastry-magazine cover.',
          'This is the most popular flavour for wedding sweet tables and "Instagram-first" orders. Clients who choose pistachio-raspberry have usually already seen this cake in someone’s feed and want exactly that. The average ticket is the highest of all ten flavours, and clients do not haggle.',
          'Cost per cake is the highest in the collection because of pistachio paste: a quality one costs several times more than any other ingredient. But the margin is also the highest — "premium" positioning lets you price it 40–60 % above the base. This is the flavour where a home baker can feel the difference between "side hustle" and "business."',
        ],
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
        description: [
          'Піна колада — літній хіт збірника. Кокосовий бісквіт, ананасове конфі та вершковий крем створюють тропічний настрій, який найкраще працює в спекотні місяці. Смак легкий, свіжий, із кислинкою ананасу й ніжністю кокосу — повна протилежність зимовим шоколадним варіантам.',
          'У збірнику є дві версії: «дитяча» (без алкоголю) та «доросла» (з легкою ромовою нотою). Це робить Піна коладу універсальною для літніх замовлень: дитячі дні народження, пляжні вечірки, тропічні тематичні свята. Попит — виключно сезонний: червень-серпень, потім замовлення падають до нуля.',
          'Собівартість — середня, але є нюанс з ананасом: консервований дешевший, свіжий дає кращий смак. У PDF пояснюється, як працювати з обома варіантами. На фото торт виглядає яскраво й незвично — жовтий конфі на білому кремі — що відрізняє його від решти лінійки.',
        ],
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
        description: [
          'Пина колада — летний хит сборника. Кокосовый бисквит, ананасовое конфи и сливочный крем создают тропическое настроение, которое лучше всего работает в жаркие месяцы. Вкус лёгкий, свежий, с кислинкой ананаса и нежностью кокоса — полная противоположность зимним шоколадным вариантам.',
          'В сборнике две версии: «детская» (без алкоголя) и «взрослая» (с лёгкой ромовой нотой). Это делает Пина коладу универсальной для летних заказов: детские дни рождения, пляжные вечеринки, тропические тематические праздники. Спрос — исключительно сезонный: июнь-август, потом заказы падают до нуля.',
          'Себестоимость — средняя, но есть нюанс с ананасом: консервированный дешевле, свежий даёт лучший вкус. В PDF объясняется, как работать с обоими вариантами. На фото торт выглядит ярко и необычно — жёлтый конфи на белом креме — что выделяет его из остальной линейки.',
        ],
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
        description: [
          'Piña Colada to letni hit zbioru. Kokosowy biszkopt, ananasowe confit i śmietankowy krem tworzą tropikalny nastrój, który najlepiej działa w upalne miesiące. Smak lekki i świeży, z kwaskowatością ananasa i delikatnością kokosa — pełne przeciwieństwo zimowych czekoladowych wariantów.',
          'W zbiorze są dwie wersje: „dziecięca” (bez alkoholu) i „dorosła” (z lekką nutą rumu). To czyni Piña Coladę uniwersalną na letnie zamówienia: dziecięce urodziny, imprezy plażowe, tropikalne przyjęcia tematyczne. Popyt — wyłącznie sezonowy: czerwiec–sierpień, potem zamówienia spadają do zera.',
          'Koszt własny — średni, ale jest niuans z ananasem: z puszki jest tańszy, świeży daje lepszy smak. W PDF wyjaśniamy, jak pracować z oboma wariantami. Na zdjęciach tort wygląda jasno i nietypowo — żółte confit na białym kremie — co odróżnia go od reszty oferty.',
        ],
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
        description: [
          'Pina Colada is the summer hit of the collection. A coconut sponge, pineapple confit, and cream create a tropical mood that works best in the hot months. The taste is light and fresh, with pineapple tang and coconut softness — the polar opposite of winter chocolate options.',
          'The collection offers two versions: a "kids’" version (no alcohol) and an "adult" version (with a light rum note). This makes Pina Colada versatile for summer orders: children’s birthdays, beach parties, tropical-themed celebrations. Demand is strictly seasonal: June through August, then orders drop to zero.',
          'Cost per cake is mid-range, but there is a nuance with pineapple: canned is cheaper, fresh gives a better flavour. The PDF explains how to work with both. In photos the cake looks bright and unusual — yellow confit on white cream — setting it apart from the rest of the line-up.',
        ],
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
        description: [
          'Вишня-шоколад — класика «Чорний ліс» у бенто-форматі. Шоколадний бісквіт, вишневе кюлі та крем-чиз дають знайомий з дитинства смак: глибокий шоколад із кислою вишневою нотою. Це торт для тих, хто любить перевірені поєднання без експериментів.',
          'Основна аудиторія — зимові замовлення: Новий рік, Різдво, зимові дні народження. Також стабільно замовляють як подарунок мамі чи бабусі — це смак, який знайомий старшому поколінню. На фото розріз виглядає ефектно: темний бісквіт, яскраве вишневе кюлі, білий крем.',
          'Складність — одна з найнижчих: Вишня-шоколад — хороший другий торт після Oreo. Собівартість залежить від сезону: влітку свіжа вишня дешева, взимку доведеться брати заморожену. У PDF описано, як працювати з обома варіантами й чому вибір впливає на структуру конфі.',
        ],
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
        description: [
          'Вишня-шоколад — классика «Чёрный лес» в бенто-формате. Шоколадный бисквит, вишнёвое кюли и крем-чиз дают знакомый с детства вкус: глубокий шоколад с кислой вишнёвой нотой. Это торт для тех, кто любит проверенные сочетания без экспериментов.',
          'Основная аудитория — зимние заказы: Новый год, Рождество, зимние дни рождения. Также стабильно заказывают как подарок маме или бабушке — это вкус, знакомый старшему поколению. На фото срез выглядит эффектно: тёмный бисквит, яркое вишнёвое кюли, белый крем.',
          'Сложность — одна из самых низких: Вишня-шоколад — хороший второй торт после Oreo. Себестоимость зависит от сезона: летом свежая вишня дешёвая, зимой придётся брать замороженную. В PDF описано, как работать с обоими вариантами и почему выбор влияет на структуру конфи.',
        ],
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
        description: [
          'Wiśnia-czekolada to klasyka „Czarnego lasu” w formacie bento. Czekoladowy biszkopt, wiśniowe coulis i krem serowy dają smak znany z dzieciństwa: głęboka czekolada z kwaśną nutą wiśni. To tort dla tych, którzy lubią sprawdzone połączenia bez eksperymentów.',
          'Główna grupa odbiorców — zamówienia zimowe: Sylwester, Boże Narodzenie, zimowe urodziny. Stale zamawiany również jako prezent dla mamy lub babci — smak rozpoznawalny dla starszego pokolenia. Na zdjęciach przekrój wygląda efektownie: ciemny biszkopt, żywe wiśniowe coulis, biały krem.',
          'Trudność — jedna z najniższych: Wiśnia-czekolada to dobry drugi tort po Oreo. Koszt własny zależy od sezonu: latem świeża wiśnia jest tania, zimą trzeba sięgnąć po mrożoną. W PDF opisujemy, jak pracować z oboma wariantami i dlaczego wybór wpływa na strukturę confit.',
        ],
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
        description: [
          'Cherry-chocolate is the classic Black Forest reworked as a bento. A chocolate sponge, cherry coulis, and cream cheese deliver a taste familiar from childhood: deep chocolate with a tart cherry note. This is a cake for people who prefer proven combinations without experiments.',
          'The core audience is winter orders: New Year’s, Christmas, winter birthdays. It is also steadily ordered as a gift for mum or grandma — a flavour the older generation recognises. In photos the cross-section looks striking: dark sponge, bright cherry coulis, white cream.',
          'Difficulty is among the lowest: Cherry-chocolate is a good second cake after Oreo. Cost depends on the season: in summer fresh cherries are cheap, in winter you will need frozen ones. The PDF covers how to work with both and why the choice affects the confit’s structure.',
        ],
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
    reviews:     'Що кажуть покупці про цей смак',
    about:       'Про цей смак',
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
    reviews:     'Что говорят покупатели об этом вкусе',
    about:       'Об этом вкусе',
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
    reviews:     'Co mówią kupujący o tym smaku',
    about:       'O tym smaku',
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
    reviews:     'What buyers say about this flavour',
    about:       'About this flavour',
  },
  es: SECTIONS_ES,
  de: SECTIONS_DE,
  fr: SECTIONS_FR,
  it: SECTIONS_IT,
  pt: SECTIONS_PT,
};

// Вливаем локализованный текст в FLAVOR_EXTRA[slug].t.<lang>.
// Мутируем при загрузке модуля, а не в getExtra: слияние на каждый вызов
// пересобирало бы объекты 90 раз за сборку.
for (const [lang, table] of Object.entries({ es: EXTRA_ES, de: EXTRA_DE, fr: EXTRA_FR, it: EXTRA_IT, pt: EXTRA_PT })) {
  for (const [slug, node] of Object.entries(table)) {
    if (FLAVOR_EXTRA[slug]) FLAVOR_EXTRA[slug].t[lang] = node;
  }
}

export function getExtra(slug, lang) {
  const extra = FLAVOR_EXTRA[slug];
  if (!extra) return null;
  return {
    related: extra.related || [],
    // Фолбэк на uk намеренно оставлен последним: у всех девяти языков
    // текст есть, и если фолбэк однажды сработает — это баг, а не норма.
    ...(extra.t[lang] || extra.t.uk),
  };
}
