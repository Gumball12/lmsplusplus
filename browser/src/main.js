import MvvmHTMLElement from './wrapper/MvvmHTMLElement.js';
import state from './state.js';
import './components/l-header.js';
import './components/l-main.js';
import './components/l-footer.js';

const html = `
<l-header></l-header>
<l-main></l-main>
<l-footer></l-footer>

<style scoped>
@import url('./src/styles/component.css');

l-header {
  margin-bottom: 12px;
}

l-main {
  margin-bottom: 16px;
}
</style>
`;

window.customElements.define(
  'lms-app',
  class extends MvvmHTMLElement {
    constructor() {
      super({
        html,
        async mounted() {
          await state.$methods.init();
          await state.$methods.setActivatedStateFromStorage();
          await state.$methods.getVideos();
        },
      });
    }
  },
);
