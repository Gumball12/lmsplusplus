window.addEventListener('load', () => {
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
