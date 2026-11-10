MAJOR PRO — каталог заказов UNIC Professional (фиолетовая версия)

ПАПКИ
  site/            то, что публикуется (загрузить на Netlify / в репозиторий GitHub)
  tools/editor.html редактор цен и описаний — открывать у себя, НЕ загружать на сайт

ПЕРЕД ЗАПУСКОМ
1. Номер WhatsApp: site/script.js, строка  const WHATSAPP_NUMBER = "48000000000";
   (код страны + номер, только цифры, без + и пробелов).
2. Название сайта: site/index.html — заменить "MAJOR PRO" (в <title>, meta description,
   логотипе <span>MAJOR <b>PRO</b></span> и в подвале). Для другого цвета: site/styles.css, блок :root вверху.
3. Минимальная сумма заказа: site/script.js, const MIN_ORDER = 400;  (0 = без ограничения).
   Валюта: const CURRENCY = "PLN";  — проверьте, что цены в каталоге именно в этой валюте.

КАК МЕНЯТЬ ЦЕНЫ И ОПИСАНИЯ
Откройте tools/editor.html, выберите site/products.json и site/descriptions.json, внесите правки,
скачайте оба файла и замените ими файлы в папке site (на GitHub: Add file → Upload files).
Скачанные файлы должны называться точно products.json и descriptions.json.

ПУБЛИКАЦИЯ
Загрузите содержимое папки site (вместе с папкой assets) в репозиторий GitHub и подключите его к Netlify,
либо перетащите папку site на netlify.com/drop. Открывать index.html двойным кликом нельзя — товары не загрузятся
(для проверки на компьютере используйте Live Server в VS Code).
