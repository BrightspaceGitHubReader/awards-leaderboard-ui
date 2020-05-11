// Copyright 2020 D2L Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { css, html, LitElement, unsafeCSS } from 'lit-element/lit-element.js';
import { BadgeImageSize } from '../constants/constants';
import { BaseMixin } from '../mixins/base-mixin.js';

class AwardIssued extends BaseMixin(LitElement) {
	static get styles() {
		return [
			css`
			.awardBtn:hover, .awardBtn:focus-within {
				cursor: pointer;
			}
			.awardBtn {
				text-decoration: none;
				margin-right: 3px;
				display: inline-block;
				width: ${unsafeCSS(BadgeImageSize)}px;
			}
			:host([dir="rtl"]) .awardBtn {
				text-decoration: none;
				margin-left: 3px;
				margin-right: 0px;
			}
			.badgeEntry {
				height: ${unsafeCSS(BadgeImageSize)}px;
				width: ${unsafeCSS(BadgeImageSize)}px;
				vertical-align: middle;
			}
			`
		];
	}

	render() {
		this.badgeId = `Badge_${this.awardId}`;
		return html`
			<a href="#" id="${this.badgeId}" @click="${this._awardClick}" class="awardBtn">
				<img src=${this.awardImageUrl} class='badgeEntry' alt='${this.awardTitle}'></img>
			</a>
			<d2l-tooltip for="${this.badgeId}" disable-focus-lock>
				${this.awardTitle}
			</d2l-tooltip>
    	`;
	}

	static get properties() {
		return {
			awardTitle: {type: String},
			awardId: { type: Number },
			awardImageUrl: { type: String },
			issuedId: { type: Number },
			badgeId: { type: String }
		};
	}

	_awardClick() {
		const event = new CustomEvent('award-issued-dialog', {
			bubbles: true,
			composed: true,
			detail: {
				awardTitle: this.awardTitle,
				issuedId: this.issuedId
			}
		});
		this.dispatchEvent(event);
	}
}

window.customElements.define('award-issued', AwardIssued);
