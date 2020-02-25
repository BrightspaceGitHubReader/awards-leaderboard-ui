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
			
        `];
	}

	static get properties() {
		return {
			label: { type: String },
			orgUnitId: { type: Number },
			doneLoading: { type: Boolean}
		};
	}

	constructor() {
		super();
		this.label = '';
		this.orgUnitId = 0;
		this.sortedLeaderboardArray = [];
		this.doneLoading = false;

	}

	render() {
		return html`<d2l-list>
			${this.sortedLeaderboardArray.map(item => this.createLeaderboardEntry(item))}
		</d2l-list>`;
	}

	firstUpdated() {
		this._getLeaderboard();
	}

	async _getLeaderboard() {
		const myLeaderboard = await LeaderboardService.getLeaderboard(this.orgUnitId);
		console.log(myLeaderboard); // eslint-disable-line no-console
		this.sortedLeaderboardArray = myLeaderboard.Objects.slice(0, 10);
		this.doneLoading = true;
	}

	createLeaderboardEntry(item) {
		return html`
		<d2l-list-item>
			<leaderboard-row userData=${JSON.stringify(item)}></leaderboard-row>
		</d2l-list-item>`;
	}
}

window.customElements.define('d2l-awards-leaderboard-ui', App);
