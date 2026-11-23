(() => {
  'use strict';

  const KEY = 'luckzero-lang';
  const buttons = [...document.querySelectorAll('[data-set-lang]')];
  const titles = {
    en: 'BizManager | Offline Order, Inventory & Payment Software for Windows | LuckZero',
    si: 'BizManager | Offline ඇණවුම්, තොග සහ ගෙවීම් පද්ධතිය | LuckZero'
  };

  function setLang(lang, save) {
    if (lang !== 'en' && lang !== 'si') lang = 'en';
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang;
    document.title = titles[lang];
    buttons.forEach(b => b.classList.toggle('active', b.dataset.setLang === lang));
    if (save) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  }

  buttons.forEach(b => b.addEventListener('click', () => setLang(b.dataset.setLang, true)));

  let saved = 'en';
  try { saved = localStorage.getItem(KEY) || 'en'; } catch (e) {}
  setLang(saved, false);
})();
