import MvvmHTMLElement from '../wrapper/MvvmHTMLElement.js';
import state from '../state.js';
import './l-card.js';

const html = `
<section m-ref="renderTarget" @click="getVideo"></section>

<style scoped>
@import url('./src/styles/component.css');

section l-card {
  margin-bottom: 12px;
}

section l-card:last-child {
  margin-bottom: 0;
}

section l-card::part(card) {
  background-color: var(--white-color);
  color: var(--black-color);
}
</style>
`;

window.customElements.define(
  'l-video-down-btn',
  class extends MvvmHTMLElement {
    constructor() {
      super({
        html,
        data: {
          title: 'test',
        },
        methods: {
          getVideo: ({ target }) => {
            if (
              target.nodeName === 'L-CARD'
              && target.dataset.url !== undefined
            ) {
              const uri = target.dataset.url;

              chrome.downloads.download({
                url: uri,
                filename: `lms-video.mp4`,
              })
            }
          },
        },
        mounted: () => {
          console.log(this);
          state.$watcher.videoUrls.push((oldValue, urls) => {
            this.$ref.renderTarget.innerHTML = '';

            urls.forEach((url, ind) => {
              const lCard = document.createElement('l-card');
              lCard.setAttribute('m-data-title', `${ind + 1} 번째 영상 다운로드`);
              lCard.setAttribute('data-url', url);

              this.$ref.renderTarget.appendChild(lCard);
            });
          });
        },
      });
    }
  },
);
