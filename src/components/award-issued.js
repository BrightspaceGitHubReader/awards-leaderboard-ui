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

	static get properties() {
		return {
			award: {type: Object}
		};
	}

	static get styles() {
		return [
			css`
			.awardBtn:hover, .awardBtn:focus-within {
				cursor: pointer;
			}
			.awardBtn {
				background-color: transparent;
				background-size: ${unsafeCSS(BadgeImageSize)}px;
				border: 0px;
				display: inline-block;
				height: ${unsafeCSS(BadgeImageSize)}px;
				margin-right: 3px;
				text-decoration: none;
				vertical-align: middle;
				width: ${unsafeCSS(BadgeImageSize)}px;
			}
			:host([dir="rtl"]) .awardBtn {
				margin-left: 3px;
				margin-right: 0px;
				text-decoration: none;
			}
			d2l-tooltip {
				word-break: break-all;
			}
			`
		];
	}

	render() {
		if (this.award.Award === undefined ||
			this.award.Award.AwardId === undefined
		) {
			return;
		}

		this.badgeId = `Badge_${this.award.Award.AwardId}`;
		return html`
			<button
				id="${this.badgeId}"
				style="background-image:url(${this.award.Award.ImageData.Path})"
				tabindex="0"
				@click="${this._awardClick}"
				class="awardBtn"
			>
			</button>
			<d2l-tooltip for="${this.badgeId}" for-type="label">${this.award.Award.Title}</d2l-tooltip>
    	`;
	}

	_awardClick() {
		const event = new CustomEvent('award-issued-dialog', {
			bubbles: true,
			composed: true,
			detail: {
				awardTitle: this.award.Award.Title,
				issuerName: this.award.Award.IssuerName,
				awardDescription: this.award.Award.Description,
				awardIssued: this.award.IssuedDate,
				awardExpiry: this.award.ExpiryDate,
				awardCredit: this.award.Credit,
				awardEvidence: this.award.Evidence,
				awardImage: this.award.Award.ImageData.Path
			}
		});
		this.dispatchEvent(event);
	}
}

window.customElements.define('award-issued', AwardIssued);
