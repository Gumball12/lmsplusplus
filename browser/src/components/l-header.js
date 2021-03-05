import MvvmHTMLElement from '../wrapper/MvvmHTMLElement.js';

const html = `
<header>
  <h1>LMS++</h1>
</header>

<style scoped>
@import url('./src/styles/typo.css');
@import url('./src/styles/component.css');
</style>
`;

window.customElements.define(
  'l-header',
  class extends MvvmHTMLElement {
    constructor() {
      super({
        html,
      });
    }
  },
);
