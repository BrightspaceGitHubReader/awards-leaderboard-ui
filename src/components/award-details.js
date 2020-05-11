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

import { bodyStandardStyles, heading2Styles, labelStyles} from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { BaseMixin } from '../mixins/base-mixin.js';

class AwardDetails extends BaseMixin(LitElement) {

	static get styles() {
		return [
			bodyStandardStyles,
			heading2Styles,
			labelStyles,
			css`
			d2l-list {
				max-height: 420px;
				overflow: hidden;
				overflow-y: scroll;
			}
			.myAwardItem {
				background-color: var(--d2l-color-celestine-plus-2);
				position: -webkit-sticky; /* Safari */
				position: sticky;
				bottom: 0;
			}
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
			@keyframes loadingPulse {
				0% { background-color: var(--d2l-color-sylvite); }
				50% { background-color: var(--d2l-color-regolith); }
				75% { background-color: var(--d2l-color-sylvite); }
				100% { background-color: var(--d2l-color-sylvite); }
			}
			.skeleton-awardRow{
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 3px;
			}
			.skeleton-awardRank{
				animation: loadingPulse 1.8s linear infinite;
				border-radius: 15px;
				height: 21px;
				width: 21px;
				padding: 9px;
				margin: 9px;
				-moz-border-radius:50%;
				-webkit-border-radius:50%;
			}
			.skeleton-profilePic {
				animation: loadingPulse 1.8s linear infinite;
				border-radius: 6px;
				width: 42px;
				height: 42px;
				margin-left: 7px;
			}
			:host([dir="rtl"]) .skeleton-profilePic {
				margin-right: 7px;
				margin-left: 0px;
			}
			.skeleton-info {
				display: flex;
				flex-direction: column;
				width: 50%;
				padding-left: 10px;
			}
			:host([dir="rtl"]) .skeleton-info {
				padding-right: 10px;
				padding-left: 0px;
			}
			.skeleton-name {
				animation: loadingPulse 1.8s linear infinite;
				height: 0.8rem;
				width: 60%;
				border-radius: 6px;
			}
			.skeleton-count {
				animation: loadingPulse 1.8s linear infinite;
				height: 0.7rem;
				width: 40%;
				margin-top: 4px;
				border-radius: 4px;
			}
			.emptyState {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.emptyImage {
				max-width: 100%;
				width: 255px;
			}
        `];
	}

	static get properties() {
		return {
			orgUnitId: { type: Number },
			userId: { type: Number },
			sortByCreditsConfig: { type: Boolean },
			doneLoading: { type: Boolean },
			isEmptyLeaderboard: { type: Boolean },
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
		this.label = '';
		this.orgUnitId = 0;
		this.userId = 0;
		this.sortedLeaderboardArray = [];
		this.myAwards = {};
		this.sortByCreditsConfig = false;
		this.doneLoading = false;
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
