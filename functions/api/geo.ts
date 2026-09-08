/**
 * Страна посетителя по IP — двухбуквенный код от Cloudflare.
 *
 * Зачем отдельным эндпоинтом: главная страница статическая и лежит в кеше
 * (public, max-age=300 в public/_headers), поэтому страну нельзя подставить
 * при сборке — один и тот же HTML уходит всем. Значит спрашиваем её
 * отдельным запросом и решаем на клиенте.
 *
 * Кому это нужно: модалка выбора языка PDF. Посетителю из России не
 * предлагаются украинская и польская версии — только русская и английская.
 *
 * Ответ не кешируется: иначе первый посетитель зафиксировал бы свою страну
 * для всех следующих на этом краю сети.
 */
export const onRequestGet: PagesFunction = ({ request }) => {
  const cf = (request as unknown as { cf?: { country?: string } }).cf ?? {};
  const country =
    String(cf.country ?? request.headers.get('CF-IPCountry') ?? '')
      .slice(0, 2)
      .toUpperCase();

  return new Response(JSON.stringify({ country }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
};
