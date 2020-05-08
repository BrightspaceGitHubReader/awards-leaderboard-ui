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

import { LeaderboardService } from '../services/awards-leaderboard-service.js';

class App extends BaseMixin(LitElement) {

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
			label: { type: String },
			orgUnitId: { type: Number },
			userId: { type: Number },
			sortByCreditsConfig: { type: Boolean },
			doneLoading: { type: Boolean },
			awardsDialogOpen: { type: Boolean },
			dialogIssuedId: { type: Number },
			dialogAwardTitle: { type: String },
			dialogIssuedId: { type: Number },
			isEmptyLeaderboard: { type: Boolean },
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

		const baseUrl = import.meta.url;
		this.emptyImage = new URL('../../images/leaderboard-empty-state.svg', baseUrl);
	}

	render() {

		const dialog = html`
				<d2l-dialog title-text="${this.dialogAwardTitle}" ?opened="${this.awardsDialogOpen}" @d2l-dialog-close="${this._closeDialog}">
					${this._renderDialogContents()}
					<d2l-button slot="footer" dialog-action>${this.localize('closeDialog')}</d2l-button>
				</d2l-dialog>
			`;

		let listContent;
		if (!this.doneLoading) {
			const numberOfItems = 5;
			const itemsSkeleton = html`
				<d2l-list-item>
					<d2l-list-item-content>
						<div class="skeleton-awardRow">
							<div class="skeleton-awardRank"></div>
							<div class="skeleton-profilePic"></div>
							<div class="skeleton-info">
								<div class="skeleton-name"></div>
								<div class="skeleton-count"></div>
							</div>
						</div>					
					</d2l-list-item-content>
				</d2l-list-item>
			`;
			listContent = html`
				${(new Array(numberOfItems)).fill(itemsSkeleton)}
			`;
		} else if (this.isEmptyLeaderboard) {
			return this._displayEmptyLeaderboard();
		} else {
			listContent = html`
				${this.sortedLeaderboardArray.map(item => this._createLeaderboardEntry(item, false))}
				${this._createLeaderboardEntry(this.myAwards, true)}
			`;
		}
		return html`
			${dialog}
			<d2l-list aria-busy="${!this.doneLoading}">
				${listContent}
			</d2l-list>
		`;
	}

	_renderDialogContents() {
		if (!this.awardsDialogOpen) {
			return;
		}
		//parent.document.getElementById('dialogLoading')
		//this.shadowRoot.querySelector('d2l-resize-aware')
		// <!--<img src="http://localhost:44444/d2l/awards/v1/image/6606?imageId=45&v=20.20.4.0-11077716" id="dialogLoading" />
		// 	<iframe frameBorder="0" width="100%" height="100%" onload="console.log(this.shadowRoot, parent.document.shadowRoot);"
		// 		src="${LeaderboardService.getIssuedAward(this.dialogIssuedId)}">
		// 	</iframe>-->

		const credits = this.awardCredit === null || this.awardCredit === undefined ?
			html`` :
			html`
				<div>
					<span class="d2l-label-text">Credits:</span> 
					<span class="d2l-body-compact">${this.awardCredit}</span>
				</div>
			`;
		const expiry = this.awardExpiry === null || this.awardExpiry === undefined ?
			html`` :
			html`
			<div>
				<span class="d2l-label-text">Expiry Date:</span> 
				<span class="d2l-body-compact">${this.formatDateTime(this.awardExpiry)}</span>
			</div>
			`;

		return html`
			<div class="awardDetailsRow">
				<div class="awardImage">	
					<img src="${this.awardImage}" />
				</div>
				<div class="awardDescription">
					<div>
						<span class="d2l-label-text">Description:</span> 
						<span class="d2l-body-compact">${this.awardDescription}</span>
					</div>
					${expiry}
					<div>
						<span class="d2l-label-text">Issue Date:</span> 
						<span class="d2l-body-compact">${this.formatDateTime(this.awardIssued)}</span>
					</div>
					<div>
						<span class="d2l-label-text">Issuer:</span> 
						<span class="d2l-body-compact">${this.issuerName}</span>
					</div>
					${credits}
					<div>
						<span class="d2l-label-text">Evidence:</span> 
						<span class="d2l-body-compact">${this.awardEvidence}</span>
					</div>
				</div>
			</div>
		`;
	}

	firstUpdated() {
		this._getLeaderboard();
		this.addEventListener('award-issued-dialog', this._openDialog);
	}

	async _getLeaderboard() {
		const myLeaderboard = await LeaderboardService.getLeaderboard(this.orgUnitId, this.sortByCreditsConfig);
		this.sortedLeaderboardArray = myLeaderboard.Objects;
		this.isEmptyLeaderboard = this._isEmptyLeaderboard();
		if (this.isEmptyLeaderboard) {
			this.doneLoading = true;
			return;
		}

		const isUserIncluded = this._isLoggedInUserIncluded();
		if (isUserIncluded) {
			this.doneLoading = true;
			return;
		}
		await this._getMyAwards();

		this.doneLoading = true;
	}

	_createLeaderboardEntry(item, isMyAward) {
		if (item.UserId === undefined) {
			return;
		}
		if (item.UserId === this.userId) {
			isMyAward = true;
		}
		return html`
			<d2l-list-item class="${ isMyAward ? 'myAwardItem' : '' }">
				<leaderboard-row ?myAward=${isMyAward} userData=${JSON.stringify(item)} ?sortByCreditsConfig=${this.sortByCreditsConfig}></leaderboard-row>
			</d2l-list-item>
		`;
	}

	_closeDialog() {
		this.awardsDialogOpen = false;
	}

	_displayEmptyLeaderboard() {
		return html`
			<div class="emptyState">
				<img src="${this.emptyImage}" class="emptyImage" alt="" />
				<div class="d2l-heading-2">${this.localize('emptyHeading')}</div>
				<div class="d2l-body-standard">${this.localize('emptyBody')}</div>
			</div>
		`;
	}

	async _getMyAwards() {
		//Obtain the currently logged in user's awards
		const myAwards = await LeaderboardService.getMyAwards(this.orgUnitId, this.userId);
		if (myAwards === undefined || myAwards === null) {
			return;
		}
		if (Object.prototype.hasOwnProperty.call(myAwards, 'Message')) {
			return;
		}
		this.myAwards = myAwards;
	}

	_isEmptyLeaderboard() {
		if (this.sortedLeaderboardArray.some(awards => awards.TotalAwardCount > 0)) {
			return false;
		}
		return true;
	}

	_isLoggedInUserIncluded() {
		if (this.sortedLeaderboardArray.some(awards => awards.UserId === this.userId)) {
			return true;
		}
		return false;
	}

	_openDialog(e) {
		this.dialogAwardTitle = e.detail.awardTitle;
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

window.customElements.define('d2l-awards-leaderboard-ui', App);
