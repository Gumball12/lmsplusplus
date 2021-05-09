import MvvmHTMLElement from './wrapper/MvvmHTMLElement.js';
import { LMS_PAGE_URLS } from './utils/constants.js';

window.customElements.define(
  'mvvm-bus-component',
  class extends MvvmHTMLElement {
    constructor() {
      super({
        html: '',
        data: {
          /**
           * activated state
           */
          activated: false,
          /**
           * whether on availalbe page
           */
          disabled: false,
          /**
           * whether on video page
           */
          isVideoPage: false,
          /**
           * current url
           */
          url: '',
          /**
           * video url list
           */
          videoUrls: [],
        },
        watch: {
          activated: [
            /**
             * save activation state
             */
            (oldValue, newValue) => chrome.storage.sync.set({
              'activated': newValue,
            }),
          ],
        },
        methods: {
          /**
           * initialization
           * 
           * - check on available page
           * - update isVideoPage, disabled, and url state
           */
          init: () => new Promise((res) => chrome.tabs.query({
              active: true,
              lastFocusedWindow: true,
            }, ([{ url: curUrl }]) => {
              let isAvailablePage = false;

              for (const name in LMS_PAGE_URLS) {
                const url = LMS_PAGE_URLS[name];
                isAvailablePage = curUrl.startsWith(url);

                if (isAvailablePage) {
                  this.$data.isVideoPage = name === 'video';
                  break;
                }
              }

              this.$data.disabled = !isAvailablePage;
              this.$data.url = curUrl;
              res(); // explicit call the resolve function
            })),
          /**
           * set activated state from storage
           */
          setActivatedStateFromStorage: async () =>
            chrome.storage.sync.get(['activated'], ({ activated }) =>
              this.$data.activated = activated ?? false),
          /**
           * get video urls
           */
          getVideos: async () => {
            if (!this.$data.isVideoPage) {
              return;
            }

            // get content id
            const contentId = this.$data.url.match(/content_id=(.*?)\&/)[1];

            // get media information
            const mediaInfo = await (
              await fetch(
                `https://commons.sch.ac.kr/viewer/ssplayer/uniplayer_support/content.php?content_id=${contentId}`
              )
            ).text();

            const mediaFileName = mediaInfo
              .replace(/>|</g, '\n')
              .match(/.*?\.mp4/gm);

            // get video files uri
            mediaInfo
              // parse video uri
              .replace(/>|</g, '\n')
              .match(/https:\/\/commons\.sch\.ac\.kr.*?(\[MEDIA_FILE\]|\.mp4)/gm)

              // remove duplicated uris
              .reduce((r, targetUri) => {
                if (r.every((uri) => uri !== targetUri)) {
                  r.push(targetUri);
                }

                return r;
              }, [])

              // change [MEDIA_FILE] to real file name
              .map((uri, ind) => {
                if (uri.endsWith('[MEDIA_FILE]')) {
                  return uri.replace('[MEDIA_FILE]', mediaFileName[ind]);
                }

                return uri;
              })
              .forEach((uri) =>
                this.$data.videoUrls = [...this.$data.videoUrls, uri]);
          },
          /**
           * toggling the activation state
           */
          toggleActivation: () => {
            if (!this.$data.disabled) {
              this.$data.activated = !this.$data.activated;

              chrome.storage.sync.set({
                session: this.$data.activated,
                playback: this.$data.activated,
              });

              chrome.tabs.getSelected(null, ({ id }) =>
                chrome.tabs.executeScript(id, {
                  code: 'window.location.reload();',
                }));
            }
          },
        },
      });
    }
  },
);

const bus = document.createElement('mvvm-bus-component');

export default bus;
