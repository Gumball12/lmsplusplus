window.addEventListener('load', () => {
  chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT,
  }, ([{ url }]) => {
    // check available url
    const isAvailableUrl = [
      /lms\.sch\.ac\.kr/,
      /commons\.sch\.ac\.kr/,
    ].reduce((res, r) => res = (url.match(r) !== null) || res, false);

    if (!isAvailableUrl) {
      document.body.innerHTML = '순천향대학교 강의 페이지가 아닙니다 ㅡ.ㅜ';
      return false;
    }

    // declare link click evt for chrome extension app
    document.querySelectorAll('a').forEach((el) => {
      el.addEventListener('click', (evt) => {
        evt.preventDefault();
        chrome.tabs.create({ url: el.getAttribute('href') });
      });
    });

    // init btns
    ['session', 'playback', 'course'].forEach((name) => {
      // get el
      const target = document.querySelector(`span.btn[${name}]`);

      // get setting values
      chrome.storage.sync.get([name], (st) => {
        target.classList.add(!!st[name] ? 'on' : 'off');

        target.addEventListener('click', () => {
          // update setting value
          chrome.storage.sync.set({ [name]: !(!!st[name]) });

          // reload page
          chrome.tabs.getSelected(null, ({ id }) => {
            chrome.tabs.executeScript(id, {
              code: 'window.location.reload();',
            });
          });

          // reload extension
          window.location.reload();
        });
      });
    });
  });
});
