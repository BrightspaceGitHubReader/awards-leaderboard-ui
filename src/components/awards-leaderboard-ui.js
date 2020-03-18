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

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { BaseMixin } from '../mixins/base-mixin.js';

import { LeaderboardService } from '../services/awards-leaderboard-service.js';

class App extends BaseMixin(LitElement) {

	static get styles() {
		return [

			css`
			.myAwardItem {
				background-color: var(--d2l-color-celestine-plus-2);
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
			awardsDialogOpen: { type: Boolean }
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
			<d2l-button id="open" @click="${this.handleClick}">Show Dialog</d2l-button>

			<d2l-dialog title-text="Badge 1" ?opened="${this.awardsDialogOpen}" @d2l-dialog-close="${this.closeDialog}">
				<iframe frameBorder="0" width="100%" height="100%" scrolling="no"
					src="${LeaderboardService.getIssuedAward(175, 8)}">
				</iframe>
				<d2l-button slot="footer" dialog-action>Close</d2l-button>
			</d2l-dialog>
			${this.createLeaderboardEntry(this.myAwards, true)}
			${this.sortedLeaderboardArray.map(item => this.createLeaderboardEntry(item, false))}
		</d2l-list>`;
	}

	firstUpdated() {
		this._getLeaderboard();
		this._getMyAwards();
	}

	async _getLeaderboard() {
		const myLeaderboard = await LeaderboardService.getLeaderboard(this.orgUnitId, this.sortByCreditsConfig);
		console.log(myLeaderboard); // eslint-disable-line no-console
		this.sortedLeaderboardArray = myLeaderboard.Objects;
		this.doneLoading = true;
	}

	async _getMyAwards() {
		const myAwards = await LeaderboardService.getMyAwards(this.orgUnitId, this.userId);
		if (myAwards === undefined || myAwards === null) {
			return;
		}
		if (Object.prototype.hasOwnProperty.call(myAwards, 'Message')) {
			return;
		}
		this.myAwards = myAwards;
	}

	createLeaderboardEntry(item, isMyAward) {
		if (item.UserId === undefined) {
			return;
		}
		if (item.UserId === this.userId) {
			isMyAward = true;
		}
		return html`
			<d2l-list-item class="${ isMyAward ? 'myAwardItem' : '' }">
			<leaderboard-row ?myAward=${isMyAward} userData=${JSON.stringify(item)} ?sortByCreditsConfig=${this.sortByCreditsConfig}></leaderboard-row>
		</d2l-list-item>`;
	}

	handleClick(){
		this.awardsDialogOpen = true;
	}
	closeDialog(){
		this.awardsDialogOpen = false;
	}
}

window.customElements.define('d2l-awards-leaderboard-ui', App);
