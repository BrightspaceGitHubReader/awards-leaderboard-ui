import '@brightspace-ui/core/components/typography/typography.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { BaseMixin } from '../mixins/base-mixin.js';

class App extends BaseMixin(LitElement) {

	static get styles() {
		return [
			css`
        `];
	}

	render() {
		return html`<div>Hi</div>`;
	}

	static get properties() {
		return {
			label: { type: String }
		};
	}

}

window.customElements.define('d2l-awards-leaderboard-ui', App);
