import MvvmHTMLElement from '../wrapper/MvvmHTMLElement.js';

const html = `
<footer>
  <p @click="gotoManual">어떻게 사용하나요?</p>
  <p @click="gotoGitHub">소스 코드</p>
</footer>

<style scoped>
@import url('./src/styles/typo.css');
@import url('./src/styles/component.css');

footer {
  display: flex;
  justify-content: space-between;
}

footer > p {
  color: var(--grey-color);
  cursor: pointer;
  transition: color 0.2s ease;
}

footer > p:hover {
  color: var(--grey-dark-color);
}
</style>
`;

window.customElements.define(
  'l-footer',
  class extends MvvmHTMLElement {
    constructor() {
      super({
        html,
        methods: {
          gotoManual() {
            chrome.tabs.create({
              url: 'http://lpp.shj.rip',
            });
          },
          gotoGitHub() {
            chrome.tabs.create({
              url: 'https://github.com/Gumball12/lmsplusplus',
            });
          },
        },
      });
    }
  },
);
