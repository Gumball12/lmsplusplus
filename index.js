window.addEventListener('load', () => {
  if (document.querySelector('div#page') !== null) {
    // course lists page
    document.querySelectorAll('div.activityinstance > a > img[alt="동영상"]')
      .forEach(({ parentElement: el }) => {
        // get src
        const src = el.outerHTML.match(/window\.open\('(.+?)'/)[1];
        console.log(el.textContent, src);

        // replacement
        const rpel = document.createElement('a');
        rpel.innerText = el.textContent;
        rpel.href = src;

        rpel.addEventListener('click', async (evt) => {
          evt.preventDefault();

          const innerSrc = (await (await fetch(
            (await (await fetch(
              src
            )).text()).match(/\<iframe src="(.+?)"/)[1],
          )).text()).match(/xncommonsWin\.src.*?"(.+?)"/)[1];

          window.open(innerSrc, '_blank');
        });

        el.parentElement.replaceChild(rpel, el);
      });
  } else if (document.querySelector('div#player-area')) {
    // course viewer inner page
    new MutationObserver(function() {
      if (document.querySelector('div#front-screen')) {
        document.querySelector('div#play-controller').style.display = 'block';
        document.querySelector('div#play-controller div.vc-pctrl-playback-rate-setbox').style.display = 'block';
        window.uniPlayerConfig.getUniPlayerSettingsData().usePlaybackRate = true;

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
  }
});
