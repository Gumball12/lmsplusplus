import MvvmHTMLElement from '../wrapper/MvvmHTMLElement.js';

const html = `
<section
  part="card"
  m-ref="card"
  @mousedown="addMousedownAnimation"
  @mouseup="removeMousedownAnimation"
  @mouseout="removeMousedownAnimation">
  <h2 m-prop-text-content="title"></h2>
  <p m-prop-text-content="body"></p>
</section>

<style scoped>
@import url('./src/styles/typo.css');
@import url('./src/styles/component.css');

:host {
  display: block;
}

section {
  padding: 16px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  background-color: var(--grey-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

section.mousedown-animation:hover {
  box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.25);
  transform: translateY(-1px);
}

section:hover {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

h2 {
  margin-bottom: 4px;
}
</style>
`;

window.customElements.define(
  'l-card',
  class extends MvvmHTMLElement {
    constructor() {
      super({
        html,
        data: {
          title: '',
          body: '',
        },
        methods: {
          addMousedownAnimation() {
            this.$ref.card.classList.add('mousedown-animation');
          },
          removeMousedownAnimation() {
            this.$ref.card.classList.remove('mousedown-animation');
          },
        },
      });
    }
  },
);
