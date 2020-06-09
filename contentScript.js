(() => {
  window.addEventListener('load', () => {
    const tools = new Tools();

    // get chrome settings
    chrome.storage.sync.get(['session', 'playback', 'course'], async ({
      session,
      playback,
      course,
    }) => {
      // 1st (using video id)
      if (!!course && tools.pageName !== 'video') {
        (await tools.getCourseIds()).forEach(async (courseId) => {
          const videoInfos = await tools.getVideoInfos(courseId);

          if (videoInfos._length > 0) {
            const iter = (await tools.filterUnfinishedVideoIds(courseId, videoInfos)).values();
            let item = iter.next();

            const interval = setInterval(() => {
              if (item.done) {
                return clearInterval(interval);
              }

              tools.updateLearningTime(item.value);
              item = iter.next();

              return true;
            }, 100);
          }
        });
      }

      // 2nd (remove video id)
      if (!!playback) {
        tools
          .videoBtnReplacement()
          .videoCompletion()
          .displayPlayback();
      }

      if(!!session) {
        tools.maintainSession();
      }

      console.log('LMS Extension has been initialized! \'~^ (GitHub: https://git.io/JfiHe)');
    });
  });

  /**
   * lms tools
   */
  class Tools {
    constructor() {
      this.pageName = Tools.getPageName(window.location.href)[0];
    }

    /**
     * video button replacement
     * 
     * @return {Tools} lms tools
     */
    videoBtnReplacement() {
      console.log('> LOAD :: course button replacement module');

      if (this.pageName !== 'courses') {
        return this;
      }

      document.querySelectorAll('div.activityinstance > a > img[alt="동영상"]')
        .forEach(({ parentElement }) => {
          // get origin link
          const link = parentElement.outerHTML.match(/window\.open\('(.+?)'/)[1];

          // replacement
          const rpel = document.createElement('a');
          rpel.innerText = parentElement.textContent;
          rpel.href = '#';

          rpel.addEventListener('click', async (evt) => {
            evt.preventDefault();

            // get video link
            const videoLink = (await (await fetch(
              (await (await fetch(
                link
              )).text()).match(/\<iframe src="(.+?)"/)[1],
            )).text()).match(/xncommonsWin\.src.*?"(.+?)"/)[1];

            window.open(videoLink, '_blank');
          });

          parentElement.parentElement.replaceChild(rpel, parentElement);
        });

      return this;
    }

    /**
     * display and changeable playback-rate panel
     * 
     * @return {Tools} lms tools
     */
    displayPlayback() {
      console.log('> LOAD :: changeable playback-rate module');

      if (this.pageName !== 'video') {
        return this;
      }

      // page update observer
      new MutationObserver(function() {
        if (document.querySelector('div#front-screen')) {
          // update panel style
          document.querySelector('div#play-controller').style.display = 'block';
          document.querySelector('div#play-controller div.vc-pctrl-playback-rate-setbox').style.display = 'block';

          // set playback-rate changeable
          const s = document.createElement('script');
          s.setAttribute('type', 'text/javascript');
          s.innerHTML = 'window.uniPlayerConfig.getUniPlayerSettingsData().usePlaybackRate = true;';
          document.getElementsByTagName('body')[0].appendChild(s);

          // playback panel is always displayed
          new MutationObserver(([{ target }]) => {
            target.style.display = 'block';
          }).observe(document.querySelector('div#play-controller div.vc-pctrl-playback-rate-setbox'), {
            attributes: true,
          });

          this.disconnect();
        }
      }).observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });

      return this;
    }

    /**
     * maintain session
     * 
     * @return {Tools} lms tools
     */
    maintainSession() {
      console.log('> LOAD :: maintain session module');

      if (this.pageName === 'video') {
        return this;
      }

      // re-conn session each 30 seconds
      setInterval(() => fetch('https://lms.sch.ac.kr/course/index.php'), 30000);

      return this;
    }

    /**
     * video completion
     * 
     * @return {Tools} lms tools
     */
    videoCompletion() {
      console.log('> LOAD :: video completion module');

      if (this.pageName !== 'video') {
        return this;
      }

      new MutationObserver(function() {
        if ( // waitting for player inited
          document.querySelector('div.vc-pctrl-play-progress')
          && !!document.querySelector('div.vc-pctrl-play-progress').style.width
        ) {
          // execute completion module script
          const s = document.createElement('script');
          s.setAttribute('type', 'text/javascript');

          s.innerHTML = `
            (() => {
              const duration = bcPlayController.getPlayController()._duration;

              play_time = duration;
              SeekWithUpdateCumulativeTime(duration);

              uniPlayer.getVCUniPlayerLayout()._eventTarget.fire(VCUniPlayerLayoutEvent.PLAYER_RESTART);
            })();
          `;
    
          document.getElementsByTagName('body')[0].appendChild(s);

          this.disconnect();
        }
      }).observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });

      return this;
    }

    /**
     * update video watching time
     * 
     * @param {String|Number} id video id
     * @return {Tools} lms tools
     */
    async updateLearningTime(id) {
      // using attempt index = 4632
      const attempts = 4632;

      // get course track id
      const trackId = (await (await fetch(`https://lms.sch.ac.kr/mod/xncommons/viewer.php?id=${id}`)).text())
        .match(/\"track\".*?([\d]+?.*?),/)[1].trim();

      // update
      await fetch('https://lms.sch.ac.kr/mod/xncommons/action.php', {
        method: 'post',
        body: [
          'type=track_for_onwindow',
          `track=${trackId}`,
          'state=3',
          'position=0',
          `attempts=${attempts}`,
          'interval=60',
        ].join('&'),
      });

      return this;
    }

    /**
     * filter out unfinished videos
     * 
     * @param {String} courseId 
     * @param {Object} videoInfos video information
     * @param {String} videoInfos[videoName] video id
     * @returns {[String]} video ids
     */
    async filterUnfinishedVideoIds(courseId, videoInfos) {
      const titles = (await Tools.getIteratorItems((await Tools.fetchSelectorAll(
        `https://lms.sch.ac.kr/report/ubcompletion/user_progress_a.php?id=${courseId}`,
        'table.table.table-bordered.user_progress_table td.text-left',
      )).values()))
        .filter(({
          nextElementSibling: next,
          nextElementSibling: { nextElementSibling: next2 },
        }) => (
          next2.textContent === '-' ||
          next.textContent > next2.innerText.split('\n')[0]),
        )
        .map(({ textContent }) => textContent.trim());

      return titles.map((title) => {
        return videoInfos[title];
      });
    }

    /**
     * get a list of video informations from a course
     * 
     * @param {String} id course id
     * @returns {Object} video information ({ video name: video id })
     */
    async getVideoInfos(id) {
      const iter = (await Tools.fetchSelectorAll(
        `https://lms.sch.ac.kr/course/view.php?id=${id}`,
        'div.total_sections ul.weeks.ubsweeks li.activity.xncommons div.activityinstance a[onclick]',
      )).values();

      const els = await Tools.getIteratorItems(iter);

      return els.reduce((res, el) => {
        const key = el.querySelector('span.instancename').innerHTML.match(/^(.*?)</)[1];
        const value = el.getAttribute('href').match(/\.php\?id=([\d]+?)$/)[1];

        res[key] = value;
        res._length++;

        return res;
      }, { _length: 0 });
    }

    /**
     * get course id list
     * 
     * @returns {[String]} course id list
     */
    async getCourseIds() {
      const iter = (await Tools.fetchSelector(
        'https://lms.sch.ac.kr',
        'ul.my-course-lists.coursemos-layout-0',
      )).querySelectorAll('div.course_box > a').values();

      const els = await Tools.getIteratorItems(iter);

      return els.map((el) => el.getAttribute('href').match(/\?id=([\d]+)$/)[1]);
    }

    /**
     * get a list of iterator items
     * 
     * @param {Iterable} it iterator
     * @return {Promise} promise iterator items
     */
    static getIteratorItems(it) {
      return new Promise((res) => {
        let item = it.next();
        const result = [];

        while (!item.done) {
          result.push(item.value);
          item = it.next();
        }
        
        res(result);
      });
    }

    /**
     * get dom elements selected via selector
     * 
     * @param {String} url target url
     * @param {String} selector selector
     */
    static async fetchSelectorAll(url, selector) {
      return (await Tools.getFetchDom(url)).querySelectorAll(selector);
    }

    /**
     * get dom element slected via selector
     * 
     * @param {String} url target url
     * @param {String} selector selector
     */
    static async fetchSelector(url, selector) {
      return (await Tools.getFetchDom(url)).querySelector(selector);
    }

    /**
     * get dom elements throught fetch method
     * 
     * @param {String} url target url
     * @return {HTMLElement} fetched dom elements
     */
    static async getFetchDom(url) {
      const root = document.createElement('div');
      root.innerHTML = await (await fetch(url)).text();
      return root;
    }

    /**
     * get current page name
     * 
     * @param {String} href raw location href
     * @return {[String]} matched names
     */
    static getPageName(href) {
      const patterns = [
        [/lms\.sch\.ac\.kr\/course\/view\.php/, 'courses'],
        [/commons\.sch\.ac\.kr\/em\/.*/, 'video'],
      ];
  
      return patterns
        .map(([r, name]) => href.match(r) !== null ? name : undefined)
        .filter(v => v !== undefined);
    }
  }
})();
