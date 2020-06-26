window.addEventListener('load', () => {
  chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT,
  }, ([{ url }]) => {
    const pageName = [
      ['https://lms.sch.ac.kr/', 'course'],
      ['https://commons.sch.ac.kr/', 'video'],
    ].reduce((res, [uri, name]) => res = (url.startsWith(uri) && name) || res, '');

    // check available url
    if (pageName === '') {
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

    if (pageName === 'course') {
      // disable all the video page buttons
      document.querySelectorAll('[page-video]')
        .forEach((el) => el.classList.add('hide'));

      // course page tools init
      coursePageInit();
    } else if (pageName === 'video') {
      // disable all the course page buttons
      document.querySelectorAll('[page-course]')
        .forEach((el) => el.classList.add('hide'));

      // video page tools init
      videoPageInit();
    }

    /**
     * course page tools init
     */
    function coursePageInit() {
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
    }

    /**
     * video page tools init
     */
    function videoPageInit() {
      // video download
      document.querySelector('h3.btn[video-download]')
        .addEventListener('click', () => {
          // get contentId
          const contentId = url.match(/content_id=(.*?)\&/)[1];
  
          // download
          chrome.downloads.download({
            url: `https://sch.commonscdn.com/contents2/sch1000001/${contentId}/contents/media_files/mobile/ssmovie.mp4`,
          });
        });
    }
  });
});
