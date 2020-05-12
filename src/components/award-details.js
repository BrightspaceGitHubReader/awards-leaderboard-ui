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

import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import 'd2l-users/components/d2l-profile-image.js';
import './leaderboard-row.js';

import { bodyStandardStyles, labelStyles} from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { BaseMixin } from '../mixins/base-mixin.js';

class AwardDetails extends BaseMixin(LitElement) {

	static get styles() {
		return [
			bodyStandardStyles,
			labelStyles,
			css`
			.awardDetailsRow {
				display: flex;
				flex-direction: row;
			}
			.awardImage {
				overflow: auto;
				width: 20%;
			}
			.awardImage img{
				max-width: 85px;
			}
			.awardDescription {
				max-width: 70%;
			}
		`];
	}

	static get properties() {
		return {
			awardsDialogOpen: { type: Boolean },
			awardTitle: { type: String },
			issuerName: { type: String },
			awardDescription: { type: String },
			awardIssued: { type: String },
			awardCredit: { type: String },
			awardEvidence: { type: String },
			awardImage: { type: String },
			awardExpiry: { type: String }
		};
	}

	constructor() {
		super();
		this.awardsDialogOpen = false;
	}

	render() {
		return html`
				<d2l-dialog title-text="${this.awardTitle}" ?opened="${this.awardsDialogOpen}" @d2l-dialog-close="${this._closeDialog}">
					${this._renderDialogContents()}
					<d2l-button slot="footer" dialog-action>${this.localize('closeDialog')}</d2l-button>
				</d2l-dialog>
			`;
	}

	_renderDialogContents() {
		if (!this.awardsDialogOpen) {
			return;
		}

		const credits = this.awardCredit === null || this.awardCredit === undefined ?
			html`` :
			html`
				<div class="d2l-label-text">Credits:</div> 
				<div class="d2l-body-compact">${this.awardCredit}</div>
			`;
		const expiry = this.awardExpiry === null || this.awardExpiry === undefined ?
			html`` :
			html`
				<div class="d2l-label-text">Expiry Date:</div> 
				<div class="d2l-body-compact">${this.formatDateTime(this.awardExpiry)}</div>
			`;

		return html`
			<div class="awardDetailsRow">
				<div class="awardImage">	
					<img src="${this.awardImage}" alt="${this.awardTitle}" />
				</div>
				<div class="awardDescription">				
					<div class="d2l-label-text">Description:</div> 
					<div class="d2l-body-compact">${this.awardDescription}</div>

					${expiry}
					
					<div class="d2l-label-text">Issue Date:</div> 
					<div class="d2l-body-compact">${this.formatDateTime(this.awardIssued)}</div>
					
					<div class="d2l-label-text">Issuer:</div> 
					<div class="d2l-body-compact">${this.issuerName}</div>
					
					${credits}
					
					<div class="d2l-label-text">Evidence:</div> 
					<div class="d2l-body-compact">${this.awardEvidence}</div>
				</div>
			</div>
		`;
	}

	_closeDialog() {
		this.awardsDialogOpen = false;
		//When dialog closes, reset blur to hide tooltip
		requestAnimationFrame(() => document.activeElement.blur());
	}

	openDialog(e) {
		this.awardTitle = e.detail.awardTitle;
		this.issuerName = e.detail.issuerName;
		this.awardDescription = e.detail.awardDescription;
		this.awardIssued = e.detail.awardIssued;
		this.awardCredit = e.detail.awardCredit;
		this.awardEvidence = e.detail.awardEvidence;
		this.awardImage = e.detail.awardImage;
		this.awardExpiry = e.detail.awardExpiry;

		this.awardsDialogOpen = true;
	}
}

window.customElements.define('award-details', AwardDetails);
