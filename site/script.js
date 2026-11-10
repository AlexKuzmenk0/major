/* =========================================================
   MAJOR PRO — LOGIKA KATALOGU
   Główne ustawienia i działania są opisane komentarzami.
   ========================================================= */

// ZMIEŃ numer na swój numer WhatsApp: kraj + numer, tylko cyfry.
const WHATSAPP_NUMBER = "48000000000"; // <-- ZMIEŃ na numer WhatsApp (kraj + numer, same cyfry)

// Klucze localStorage — dane klienta i język zapisują się w przeglądarce.
const CUSTOMER_STORAGE_KEY = "majorProCustomerPdf2026";
const LANGUAGE_STORAGE_KEY = "majorProLanguagePdf2026";

// Dane pobrane z products.json.
let allProducts = [];
let selectedCategory = "Wszystkie produkty";

// Koszyk przechowuje identyfikatory produktów i liczbę sztuk.
let cart = JSON.parse(localStorage.getItem("majorProCartV3") || "{}");

// Język polski jest domyślny. Można przełączyć na ukraiński przyciskiem UA.
let language = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "pl";

// Tłumaczenia tekstów interfejsu.
const TEXT = {
  pl: {
    brandline:"PROFESJONALNE PRODUKTY DLA SALONÓW", eyebrow:"KATALOG PRODUKTÓW UNIC • 2026",
    headline:"Profesjonalne produkty dla fryzjerów",
    subtitle:"Przeglądaj produkty, sprawdzaj opisy i wysyłaj zamówienie bezpośrednio przez WhatsApp.",
    categories:"KATEGORIE", all:"Wszystkie produkty", priceNote:"Ceny z katalogu UNIC Polska z 14.06.2026. Pozycje bez ceny wycenimy po zapytaniu przez WhatsApp.",
    search:"Szukaj produktu lub kodu…", cartTitle:"TWOJE ZAMÓWIENIE", customerTitle:"DANE KLIENTA",
    total:"Suma", priceInquiry:"Do ustalenia", company:"Nazwa firmy / salonu", person:"Imię i nazwisko",
    phone:"Telefon", email:"E-mail", city:"Miasto", postal:"Kod pocztowy", address:"Ulica i numer",
    notes:"Uwagi do zamówienia", remember:"Zapamiętaj dane na tym urządzeniu",
    sendOrder:"Zamów przez WhatsApp",
    privacy:"Dane są zapisywane tylko w tej przeglądarce. Zamówienie otworzy się w WhatsApp — trzeba je wysłać ręcznie.",
    footer:"Katalog produktów 2026", noResults:"Nie znaleziono produktów.", add:"Dodaj",
    details:"Pełny opis z PDF (oryginał rosyjski)", hideDetails:"Ukryj opis", code:"Kod",
    remove:"Usuń", empty:"Koszyk jest pusty. Dodaj produkty z katalogu.",
    saved:"Dane zapisane", loaded:"Dane klienta wczytane", notSaved:"Zapisywanie danych wyłączone",
    orderIntro:"Dzień dobry! Chciałbym zamówić następujące produkty:",
    item:"Produkt", quantity:"Ilość", price:"Cena", sourcePage:"Strona PDF", required:"Uzupełnij wymagane dane i dodaj co najmniej jeden produkt.",
    priceMissing:"Cena do potwierdzenia", orderNotes:"Uwagi", languageName:"Polski", details:"Opis produktu", minNote:"Minimalna wartość zamówienia: {min}. Brakuje jeszcze {left}.", minOk:"Minimalna wartość zamówienia ({min}) osiągnięta.", minAlert:"Minimalna wartość zamówienia to {min}. Dodaj produkty za co najmniej {left}.", palette:"Paleta odcieni", close:"Zamknij", shade:"Odcień", shadePlaceholder:"Odcień, np. 9/63", shadeNeeded:"Podaj odcień (np. 9/63) przed dodaniem do zamówienia.", priceRequest:"Cena na zapytanie", quote:"wycena", photo:"Zdjęcie", totalLabel:"Suma orientacyjna"
  },
  uk: {
    brandline:"ПРОФЕСІЙНІ ТОВАРИ ДЛЯ САЛОНІВ", eyebrow:"КАТАЛОГ UNIC • 2026",
    headline:"Професійні товари для перукарів",
    subtitle:"Переглядайте товари, читайте описи та надсилайте замовлення безпосередньо через WhatsApp.",
    categories:"КАТЕГОРІЇ", all:"Усі товари", priceNote:"Ціни з каталогу UNIC Polska від 14.06.2026. Позиції без ціни уточнюємо через WhatsApp.",
    search:"Пошук товару або коду…", cartTitle:"ВАШЕ ЗАМОВЛЕННЯ", customerTitle:"ДАНІ КЛІЄНТА",
    total:"Разом", priceInquiry:"Уточнюється", company:"Назва компанії / салону", person:"Ім’я та прізвище",
    phone:"Телефон", email:"Електронна пошта", city:"Місто", postal:"Поштовий індекс", address:"Вулиця та номер",
    notes:"Коментар до замовлення", remember:"Запам’ятати дані на цьому пристрої",
    sendOrder:"Замовити через WhatsApp",
    privacy:"Дані зберігаються лише в цьому браузері. Замовлення відкриється у WhatsApp — його потрібно надіслати вручну.",
    footer:"Каталог товарів 2026", noResults:"Товарів не знайдено.", add:"Додати",
    details:"Повний опис із PDF (оригінал російською)", hideDetails:"Приховати опис", code:"Код",
    remove:"Видалити", empty:"Кошик порожній. Додайте товари з каталогу.",
    saved:"Дані збережено", loaded:"Дані клієнта завантажено", notSaved:"Збереження даних вимкнено",
    orderIntro:"Добрий день! Хочу замовити такі товари:",
    item:"Товар", quantity:"Кількість", price:"Ціна", sourcePage:"Сторінка PDF", required:"Заповніть обов’язкові дані та додайте хоча б один товар.",
    priceMissing:"Ціну потрібно уточнити", orderNotes:"Коментар", languageName:"Українська", details:"Опис товару", minNote:"Мінімальна сума замовлення: {min}. Не вистачає ще {left}.", minOk:"Мінімальну суму замовлення ({min}) досягнуто.", minAlert:"Мінімальна сума замовлення — {min}. Додайте товарів щонайменше на {left}.", palette:"Палітра відтінків", close:"Закрити", shade:"Відтінок", shadePlaceholder:"Відтінок, напр. 9/63", shadeNeeded:"Вкажіть відтінок (напр. 9/63) перед додаванням до замовлення.", priceRequest:"Ціна за запитом", quote:"уточнюється", photo:"Фото", totalLabel:"Орієнтовна сума"
  }
};

// Skrót do tekstu w bieżącym języku.
function t(key) { return TEXT[language][key] || TEXT.pl[key] || key; }

// Zabezpieczenie tekstu przed wstawieniem znaków HTML jako kodu.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
}

// Pobieranie nazwy/opisu/kategorii w języku, który wybrał klient.
function productField(product, field) {
  if (language === "uk" && product[field + "Uk"]) return product[field + "Uk"];
  return product[field] || "";
}

// Zapis koszyka w pamięci przeglądarki.
function saveCart() {
  localStorage.setItem("majorProCartV3", JSON.stringify(cart));
}

// Zmienia wszystkie stałe teksty strony i odświeża katalog/koszyk.
function applyLanguage() {
  document.documentElement.lang = language === "uk" ? "uk" : "pl";
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (TEXT[language][key]) element.textContent = TEXT[language][key];
  });

  document.getElementById("langPL").classList.toggle("active", language === "pl");
  document.getElementById("langUK").classList.toggle("active", language === "uk");
  document.getElementById("langPL").setAttribute("aria-pressed", String(language === "pl"));
  document.getElementById("langUK").setAttribute("aria-pressed", String(language === "uk"));
  document.getElementById("search").placeholder = t("search");

  // Przy zmianie języka wracamy do kategorii „Wszystkie / Усі”.
  selectedCategory = t("all");
  renderCategories();
  renderProducts();
  renderCart();
}

// Obsługa przycisków PL i UA.
document.getElementById("langPL").addEventListener("click", () => {
  language = "pl";
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  applyLanguage();
});
document.getElementById("langUK").addEventListener("click", () => {
  language = "uk";
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  applyLanguage();
});

// Wyświetla listę kategorii i liczbę produktów w każdej z nich.
function renderCategories() {
  const categoryMap = new Map();
  allProducts.forEach(product => {
    const category = productField(product, "category");
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  const categories = [[t("all"), allProducts.length], ...categoryMap.entries()];
  document.getElementById("categoryList").innerHTML = categories.map(([name, count]) => `
    <button type="button" class="category-button ${selectedCategory === name ? "active" : ""}"
      data-category="${escapeHTML(name)}">
      <span>${escapeHTML(name)}</span><span class="category-count">${count}</span>
    </button>`).join("");

  document.querySelectorAll(".category-button").forEach(button => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

// Filtruje produkty według kategorii i frazy wyszukiwania.
function getVisibleProducts() {
  const query = document.getElementById("search").value.trim().toLocaleLowerCase();
  return allProducts.filter(product => {
    const categoryMatches = selectedCategory === t("all") || productField(product, "category") === selectedCategory;
    const searchable = [
      productField(product, "name"), product.name, product.code,
      productField(product, "category"), productField(product, "description")
    ].join(" ").toLocaleLowerCase();
    return categoryMatches && searchable.includes(query);
  });
}

const CURRENCY = "PLN"; // waluta z katalogu — zmień, jeśli ceny są w innej walucie
function money(n) { return n.toFixed(2).replace(".", ",") + " " + CURRENCY; }
const MIN_ORDER = 400; // minimalna wartość zamówienia (w CURRENCY); 0 = bez limitu
function minText(key, sum) { return t(key).replace("{min}", money(MIN_ORDER)).replace("{left}", money(Math.max(0, MIN_ORDER - sum))); }
// Komunikat pod sumą + blokada przycisku WhatsApp poniżej minimum.
function updateMin(sum) {
  let note = document.getElementById("minNote");
  if (!note) {
    note = document.createElement("p");
    note.id = "minNote";
    note.className = "min-note";
    document.querySelector(".cart-footer").after(note);
  }
  const low = MIN_ORDER > 0 && sum < MIN_ORDER;
  note.textContent = MIN_ORDER > 0 ? minText(low ? "minNote" : "minOk", sum) : "";
  note.classList.toggle("low", low);
  document.querySelector(".whatsapp-button").disabled = low;
}
function priceLabel(p) { return p.price == null ? t("priceRequest") : money(p.price); }
function splitKey(key) { const i = key.indexOf("|"); return i < 0 ? [key, ""] : [key.slice(0, i), key.slice(i + 1)]; }
function findProduct(id) { return allProducts.find(p => p.id === id); }
// Klucz koszyka: "id" albo "id|odcień" (dla farb).
function cartEntries() { return Object.entries(cart).filter(([k, q]) => findProduct(splitKey(k)[0]) && Number(q) > 0); }

// Okno z fotografią palety odcieni (kliknięcie w zdjęcie = powiększenie).
function openPalette(srcs) {
  const box = document.createElement("div");
  box.className = "palette-modal";
  box.innerHTML = `<button type="button" class="palette-close" aria-label="${escapeHTML(t("close"))}">×</button>` +
    srcs.split("|").map(s => `<img src="${escapeHTML(s)}" alt="">`).join("");
  box.querySelectorAll("img").forEach(img => img.addEventListener("click", e => {
    e.stopPropagation();
    img.classList.toggle("zoom");
  }));
  box.addEventListener("click", () => box.remove());
  document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { box.remove(); document.removeEventListener("keydown", esc); } });
  document.body.appendChild(box);
}

// Okno z opisem produktu: zdjęcie, nazwa, kod, opis i cena (zamknięcie: ×, kliknięcie w tło lub Esc).
function openProduct(id) {
  const p = findProduct(id);
  if (!p) return;
  const box = document.createElement("div");
  box.className = "product-modal";
  box.innerHTML = `<div class="product-modal-box" role="dialog" aria-modal="true">
      <button type="button" class="product-modal-close" aria-label="${escapeHTML(t("close"))}">×</button>
      <div class="product-modal-image"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(productField(p, "name"))}"></div>
      <div class="product-modal-text">
        <span class="product-category">${escapeHTML(productField(p, "category"))}</span>
        <h3>${escapeHTML(productField(p, "name"))}</h3>
        <span class="product-code">${p.code ? escapeHTML(t("code")) + ": " + escapeHTML(p.code) + " · " : ""}${escapeHTML(p.size)}</span>
        <p class="product-modal-desc">${escapeHTML(productField(p, "description"))}</p>
        <strong class="price">${escapeHTML(priceLabel(p))}</strong>
      </div>
    </div>`;
  const close = () => { box.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") close(); };
  box.addEventListener("click", e => { if (e.target === box || e.target.closest(".product-modal-close")) close(); });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(box);
}

// Karty produktów: zdjęcie z katalogu, nazwa, kod, cena i przycisk dodania.
function renderProducts() {
  const visible = getVisibleProducts();
  document.getElementById("categoryTitle").textContent = selectedCategory;
  document.getElementById("productCount").textContent = `${visible.length} ${language === "uk" ? "товарів" : "produktów"}`;
  if (!visible.length) {
    document.getElementById("products").innerHTML = `<div class="no-results">${t("noResults")}</div>`;
    return;
  }
  document.getElementById("products").innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image-wrap${productField(p, "description") ? " has-info" : ""}" ${productField(p, "description") ? `data-info="${escapeHTML(p.id)}"` : ""}><img class="product-image" src="${escapeHTML(p.image)}" alt="${escapeHTML(productField(p, "name"))}" loading="lazy"></div>
      <div class="product-body">
        <span class="product-category">${escapeHTML(productField(p, "category"))}</span>
        <h3>${escapeHTML(productField(p, "name"))}</h3>
        <span class="product-code">${p.code ? escapeHTML(t("code")) + ": " + escapeHTML(p.code) + " · " : ""}${escapeHTML(p.size)}</span>
        ${productField(p, "description") ? `<button type="button" class="info-button" data-info="${escapeHTML(p.id)}">ⓘ ${escapeHTML(t("details"))}</button>` : ""}
        ${p.shade ? `<input class="shade-input" data-shade-for="${escapeHTML(p.id)}" list="shades-${escapeHTML(p.id)}" placeholder="${escapeHTML(p.placeholder || t("shadePlaceholder"))}" maxlength="40" aria-label="${escapeHTML(t("shade"))}">
        <datalist id="shades-${escapeHTML(p.id)}">${(p.shades || []).map(x => `<option value="${escapeHTML(x)}">`).join("")}</datalist>` : ""}
        ${p.palette ? `<button type="button" class="palette-button" data-palette="${escapeHTML([].concat(p.palette).join("|"))}">🎨 ${escapeHTML(t("palette"))}</button>` : ""}
        <div class="product-actions">
          <span class="price">${escapeHTML(priceLabel(p))}</span>
          <div class="add-group">
            <div class="qty-picker">
              <button type="button" data-qty="-1" aria-label="−">−</button>
              <input class="qty-input" type="number" min="1" max="999" value="1" inputmode="numeric" aria-label="${escapeHTML(t("quantity"))}">
              <button type="button" data-qty="1" aria-label="+">+</button>
            </div>
            <button type="button" class="add-button" data-add="${escapeHTML(p.id)}">＋ ${escapeHTML(t("add"))}</button>
          </div>
        </div>
      </div>
    </article>`).join("");

  document.querySelectorAll("[data-info]").forEach(el => el.addEventListener("click", () => openProduct(el.dataset.info)));
  document.querySelectorAll("[data-qty]").forEach(b => b.addEventListener("click", () => {
    const input = b.closest(".qty-picker").querySelector(".qty-input");
    input.value = Math.min(999, Math.max(1, (parseInt(input.value, 10) || 1) + Number(b.dataset.qty)));
  }));
  document.querySelectorAll("[data-palette]").forEach(button => button.addEventListener("click", () => openPalette(button.dataset.palette)));
  document.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.add;
      let key = id;
      if (findProduct(id).shade) {
        const input = document.querySelector(`[data-shade-for="${id}"]`);
        const shade = input.value.trim().replace(/\|/g, "/");
        if (!shade) { alert(t("shadeNeeded")); input.focus(); return; }
        key = id + "|" + shade;
      }
      const qtyInput = button.closest(".product-body").querySelector(".qty-input");
      const qty = Math.min(999, Math.max(1, parseInt(qtyInput.value, 10) || 1));
      cart[key] = (Number(cart[key]) || 0) + qty;
      qtyInput.value = 1;
      saveCart();
      renderCart();
    });
  });
}

// Koszyk: zmiana ilości, usuwanie i suma orientacyjna (pozycje bez ceny = wycena).
function renderCart() {
  const entries = cartEntries();
  cart = Object.fromEntries(entries);
  saveCart();
  const container = document.getElementById("cartItems");
  if (!entries.length) {
    container.innerHTML = `<p class="empty-cart">${escapeHTML(t("empty"))}</p>`;
    document.getElementById("cartTotal").textContent = money(0);
    updateMin(0);
    return;
  }
  let sum = 0, unpriced = false;
  container.innerHTML = entries.map(([key, quantity]) => {
    const [id, shade] = splitKey(key);
    const p = findProduct(id);
    if (p.price == null) unpriced = true; else sum += p.price * Number(quantity);
    return `<div class="cart-row">
      <div>
        <strong>${escapeHTML(productField(p, "name"))}${shade ? " · " + escapeHTML(shade) : ""}</strong>
        <small>${escapeHTML(p.code || p.size)} · ${escapeHTML(priceLabel(p))}</small>
      </div>
      <div class="quantity">
        <button type="button" data-change="${escapeHTML(key)}" data-delta="-1" aria-label="−">−</button>
        <span>${Number(quantity)}</span>
        <button type="button" data-change="${escapeHTML(key)}" data-delta="1" aria-label="+">+</button>
      </div>
      <button type="button" class="remove-button" data-remove="${escapeHTML(key)}">${escapeHTML(t("remove"))}</button>
    </div>`;
  }).join("");
  document.getElementById("cartTotal").textContent = money(sum) + (unpriced ? " + " + t("quote") : "");
  updateMin(sum);
  document.querySelectorAll("[data-change]").forEach(button => button.addEventListener("click", () => {
    const k = button.dataset.change;
    cart[k] = (Number(cart[k]) || 0) + Number(button.dataset.delta);
    if (cart[k] <= 0) delete cart[k];
    saveCart(); renderCart();
  }));
  document.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => {
    delete cart[button.dataset.remove];
    saveCart(); renderCart();
  }));
}

// Wczytuje zapisane dane klienta z tego samego urządzenia/przeglądarki.
function loadCustomerData() {
  const remember = document.getElementById("rememberData");
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}"); } catch (_) { saved = {}; }
  Object.entries(saved).forEach(([name, value]) => {
    const field = document.querySelector(`[name="${name}"]`);
    if (field) field.value = value;
  });
  document.getElementById("saveStatus").textContent = Object.keys(saved).length ? t("loaded") : t("saved");

  // Po zmianie pola dane są zapisywane, jeśli zaznaczono zgodę.
  document.getElementById("customerForm").addEventListener("input", () => {
    if (!remember.checked) return;
    saveCustomerData();
  });
  remember.addEventListener("change", () => {
    if (remember.checked) saveCustomerData();
    else {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      document.getElementById("saveStatus").textContent = t("notSaved");
    }
  });
}

// Zapisuje tylko pola formularza; dane nie są wysyłane na żaden serwer.
function saveCustomerData() {
  if (!document.getElementById("rememberData").checked) return;
  const data = {};
  new FormData(document.getElementById("customerForm")).forEach((value, key) => {
    if (key !== "remember") data[key] = String(value);
  });
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data));
  document.getElementById("saveStatus").textContent = t("saved");
}

// Wiadomość WhatsApp: nazwa, kod, ilość, cena i link do zdjęcia każdego produktu.
document.getElementById("customerForm").addEventListener("submit", event => {
  event.preventDefault();
  const selected = cartEntries();
  if (!selected.length) { alert(t("required")); return; }
  const form = new FormData(event.currentTarget);
  let sum = 0, unpriced = false;
  const items = selected.map(([key, quantity], index) => {
    const [id, shade] = splitKey(key);
    const p = findProduct(id);
    if (p.price == null) unpriced = true; else sum += p.price * Number(quantity);
    const photo = new URL(p.image, location.href).href;
    return `${index + 1}. ${productField(p, "name")}${shade ? " (" + shade + ")" : ""}\n   ${t("code")}: ${p.code || "-"} | ${p.size} | ${t("quantity")}: ${quantity} | ${t("price")}: ${priceLabel(p)}\n   ${t("photo")}: ${photo}`;
  });
  if (sum < MIN_ORDER) { alert(minText("minAlert", sum)); return; }
  const lines = [
    t("orderIntro"), "", ...items, "",
    `${t("totalLabel")}: ${money(sum)}${unpriced ? " + " + t("quote") : ""}`, "",
    `${t("company")}: ${form.get("company")}`,
    `${t("person")}: ${form.get("person")}`,
    `${t("phone")}: ${form.get("phone")}`,
    `${t("email")}: ${form.get("email") || "-"}`,
    `${t("city")}: ${form.get("city")}`,
    `${t("postal")}: ${form.get("postal")}`,
    `${t("address")}: ${form.get("address")}`,
    `${t("orderNotes")}: ${form.get("notes") || "-"}`
  ];
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  if (!window.open(url, "_blank")) location.href = url; // zapasowo, gdy przeglądarka blokuje nowe okno
});

// Wczytuje produkty z pliku JSON, a następnie uruchamia interfejs.
async function initCatalog() {
  try {
    const response = await fetch("products.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Nie udało się wczytać products.json");
    allProducts = await response.json();
    try { // opisy są w osobnym pliku; jeśli go brak, katalog działa bez opisów
      const descResponse = await fetch("descriptions.json", { cache: "no-store" });
      if (descResponse.ok) {
        const descriptions = await descResponse.json();
        allProducts.forEach(p => {
          const d = descriptions[p.id];
          if (d) { p.description = d.pl || ""; p.descriptionUk = d.uk || ""; } // descriptions.json ma pierwszeństwo
        });
      }
    } catch (e) { console.warn("descriptions.json", e); }
    selectedCategory = t("all");
    applyLanguage();
    loadCustomerData();
    document.getElementById("search").addEventListener("input", renderProducts);
  } catch (error) {
    document.getElementById("products").innerHTML =
      `<div class="no-results">Nie można wczytać katalogu. Upewnij się, że wszystkie pliki są razem na hostingu.</div>`;
    console.error(error);
  }
}

initCatalog();
