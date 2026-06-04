# ИнжКотел Сервис: статический B2B-лендинг

## Запуск

Откройте `index.html` напрямую в браузере. Сборщик, CDN и внешние UI-библиотеки не требуются.

## Замена заглушек

- В `index.html`, `privacy.html`, `robots.txt` и `sitemap.xml` замените `example.ru`, реквизиты, адреса, телефон и email на реальные.
- В `assets/docs/` замените PDF-заглушки на финальные документы.
- В `assets/images/` замените WebP-заглушки на реальные изображения котельной и кейсов.

## Интеграция отправки заявок

Сейчас `sendLead` в `js/forms.js` логирует объект заявки в консоль и возвращает успешный `Promise`. Для реальной интеграции замените тело функции:

```js
function sendLead(payload) {
  return fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then((response) => {
    if (!response.ok) throw new Error('Lead send failed');
    return response.json();
  });
}
```

Не передавайте персональные данные через URL. Используйте POST-запрос, серверную валидацию и защищенное соединение.
