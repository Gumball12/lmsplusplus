import MvvmHTMLElement from '../wrapper/MvvmHTMLElement.js';
import msgs from '../utils/msgs.js';
import state from '../state.js';

const html = `
<l-card @click="toggleActivation"
  m-bidata-title="title" m-bidata-body="body"></l-card>

<style scoped>
@import url('./src/styles/typo.css');
@import url('./src/styles/component.css');

l-card::part(card) {
  background-color: var(--error-color);
  color: var(--white-color);
}

:host(.activated) l-card::part(card) {
  background-color: var(--success-color);
}

:host(.disabled) l-card::part(card) {
  background-color: var(--grey-color);
}
</style>
`;

window.customElements.define(
  'l-toggle-btn',
  class extends MvvmHTMLElement {
    constructor() {
      super({
        html,
        data: {
          title: msgs.helloTitleMsg,
          body: msgs.helloBodyMsg,
        },
        methods: {
          toggleActivation: state.$methods.toggleActivation.bind(state),
          setActivatedState: () => {
            this.$data.title = msgs.activatedTitleMsg;
            this.$data.body = msgs.activatedBodyMsg;
            this.classList.add('activated');
            this.classList.remove('disabled');
          },
          setInactivatedState: () => {
            this.$data.title = msgs.inactivatedTitleMsg;
            this.$data.body = msgs.inactivatedBodyMsg;
            this.classList.remove('activated');
            this.classList.remove('disabled');
          },
          setDisabledState: () => {
            this.$data.title = msgs.disabledTitleMsg;
            this.$data.body = msgs.disabledBodyMsg;
            this.classList.remove('activated');
            this.classList.add('disabled');
          },
        },
        mounted() {
          state.$watcher.activated.push((oldValue, activated) => {
            if (state.$data.disabled) {
              return;
            }

            if (activated) {
              this.$methods.setActivatedState();
            } else {
              this.$methods.setInactivatedState();
            }
          });

          state.$watcher.disabled.push((oldValue, disabled) => {
            if (disabled) {
              this.$methods.setDisabledState();
            } else {
              if (state.$data.activated) {
                this.$methods.setActivatedState();
              } else {
                this.$methods.setInactivatedState();
              }
            }
          });
        },
      });
    }
  },
);
