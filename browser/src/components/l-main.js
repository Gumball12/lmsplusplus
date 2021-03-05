import MvvmHTMLElement from '../wrapper/MvvmHTMLElement.js';
import state from '../state.js';
import './l-toggle-btn.js';
import './l-video-down-btn.js';
import './l-card.js';

const html = `
<main>
  <l-toggle-btn m-ref="toggleBtn"></l-toggle-btn>
  <l-video-down-btn m-ref="videoDownBtn"></l-toggle-btn>
</main>

<style scoped>
@import url('./src/styles/component.css');

.hide {
  display: none;
}
</style>
`;

window.customElements.define(
  'l-main',
  class extends MvvmHTMLElement {
    constructor() {
      super({
        html,
        mounted() {
          state.$watcher.isVideoPage.push((oldValue, isVideoPage) => {
            if (isVideoPage) {
              this.$ref.videoDownBtn.classList.remove('hide');
              this.$ref.toggleBtn.classList.add('hide');
            } else {
              this.$ref.videoDownBtn.classList.add('hide');
              this.$ref.toggleBtn.classList.remove('hide');
            }
          });
        },
      });
    }
  },
);
