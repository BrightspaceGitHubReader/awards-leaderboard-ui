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

import '@brightspace-ui/core/components/typography/typography.js';
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
			orgUnitId: { type: Number }
		};
	}

	constructor() {
		super();
		this.label = '';
		this.orgUnitId = 0;
		this._getLeaderboard();
	}

	render() {
		return html`<div>Hi there!</div>`;
	}

	_getLeaderboard() {
		const myLeaderboard = LeaderboardService.getLeaderboard(this.orgUnitId);
		if (myLeaderboard === undefined) {
			console.log('nothing came back'); // eslint-disable-line no-console
		} else {
			console.log(myLeaderboard); // eslint-disable-line no-console
		}
	}

}

window.customElements.define('d2l-awards-leaderboard-ui', App);
