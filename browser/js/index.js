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

      // download button render target
      const downloadRenderer = document.querySelector('div[video-download]');

      // download button generator
      const downloadButtonGen = (uri, ind) => {
        const el = document.createElement('h3');

        el.classList.add('btn');
        el.innerText = `${ind} 번째 강의 영상 다운로드`;

        el.addEventListener('click', () =>
          chrome.downloads.download({
            url: uri,
            filename: `lms-video-${ind}.mp4`,
          }));

        return el;
      };

      // get video files uri
      mediaInfo
        // parse video uri
        .replace(/>/g, '\n')
        .match(/sch1000001.*?\.mp4/gm) // assume video ext is mp4

        // distinct uri
        .reduce((r, uri) => {
          r.push(r.includes(uri) ? undefined : uri);
          return r;
        }, [])
        .filter((uri) => uri !== undefined)
        .map((uri) => `https://sch.commonscdn.com/contents4/${uri}`) // assume domain and dir name

        // set download button
        .forEach((uri, ind) => downloadRenderer.appendChild(downloadButtonGen(uri, ind + 1)));
    }
  });
});
