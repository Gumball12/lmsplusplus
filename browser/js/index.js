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
    async function videoPageInit() {
      // get content id
      const contentId = url.match(/content_id=(.*?)\&/)[1];

      // get media information
      const mediaInfo = (await (await fetch(`https://commons.sch.ac.kr/viewer/ssplayer/uniplayer_support/content.php?content_id=${contentId}`)).text());
      const mediaUri = mediaInfo.match(/\<media_uri\>(.*?)\<\/media_uri\>/)[1];
      const ext = mediaUri.split('').reverse().join('').match(/^(.*?)\./)[1].split('').reverse().join('');
      const title = mediaInfo.match(/\<title\>(.*?)\<\/title\>/)[1].replace('<![CDATA[', '').replace(']]>', '').replace(/[\s]|[\t]/g, '_');
      const safeTitle = title.replace(/\\|\/|\?|\%|\*|\:|\||\"|\<|\>|\./g, '-');

      // set video link
      const videoLinkTarget = document.querySelector('h4[video-link] > input');
      videoLinkTarget.value = mediaUri;
      videoLinkTarget.addEventListener('click', () => videoLinkTarget.select());

      // video download
      document.querySelector('h3[video-download]')
        .addEventListener('click', () => {
          // download
          chrome.downloads.download({
            url: mediaUri,
            filename: `${safeTitle}.${ext}`,
          });
        });
    }
  });
});
