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
import 'd2l-tooltip/d2l-tooltip.js';
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
			.badgeEntry {
				height: ${unsafeCSS(BadgeImageSize)}px;
				width: ${unsafeCSS(BadgeImageSize)}px;
				padding-right: 3px;
				vertical-align: middle;
				padding-top: 12px;
				padding-bottom: 12px;
			}
			`
		];
	}

	render() {
		this.badgeId = `Badge_${this.award.Award.AwardId}`;
		return html`
			<a @click="${this._awardClick}" class="awardBtn">
				<img id="${this.badgeId}" src=${this.award.Award.ImageData.Path} class='badgeEntry'></img>
			</a>
			<d2l-tooltip for="${this.badgeId}">${this.award.Award.Title}</d2l-tooltip>
    	`;
	}

	static get properties() {
		return {
			award: {type: Object}
		};
	}

	_awardClick() {
		console.log(this.award);
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
