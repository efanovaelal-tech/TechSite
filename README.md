# ИнжКотел Сервис: статический B2B-лендинг

## Запуск

Откройте `index.html` напрямую в браузере. Сборщик, CDN и внешние UI-библиотеки не требуются.

## Публикация на GitHub Pages

Публикуйте всю папку проекта целиком, а не только `index.html`. В репозитории должны лежать:

- `index.html`
- `.nojekyll`
- папки `css/`, `js/`, `assets/`
- `privacy.html`, `robots.txt`, `sitemap.xml`

Если на GitHub Pages виден только черный текст на белом фоне, значит страница открылась без CSS. Проверьте, что файлы `css/reset.css`, `css/variables.css`, `css/style.css` и `css/responsive.css` есть в опубликованной ветке рядом с `index.html`.

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
