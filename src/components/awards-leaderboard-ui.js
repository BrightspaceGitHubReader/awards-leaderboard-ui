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
import '@brightspace-ui/core/components/typography/typography.js';
import 'd2l-users/components/d2l-profile-image.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { BaseMixin } from '../mixins/base-mixin.js';
import { LeaderboardService } from '../services/awards-leaderboard-service.js';


class App extends BaseMixin(LitElement) {

	static get styles() {
		return [
			css`

			.awardRow {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.awardRow :last-child {
				margin-left: auto;
			}
			.profileImage {
				height: 45px;
				width: 45px;
				border-radius: 5px;
				margin: 9px;
			}
			.awardRank {
				border-radius: 15px;
				background-color: #E3E9F1;
				height: 15px;
				width: 15px;
				padding: 9px;
				margin: 9px;
				align-items: center;
				display: flex;
				justify-content: center;
				border-color: var(--d2l-color-ferrite);
			}
			.awardRank[topRank] {
				border-color: white;
			}
			.creditCount {
				display:flex;
				flex-direction: column;
			}
			.panel {
				display: block;
				overflow: hidden;
				max-height: 0;
				transition: max-height 0.2s ease-out;
			}
			.expandButton{
				transition: transform 0.2s;
			}
			.expandButtonRotated {
				transform: rotate(90deg);
			}
        `];
	}

	static get properties() {
		return {
			label: { type: String },
			orgUnitId: { type: Number },
			sortedLeaderboardArray: { type: Array }
		};
	}

	constructor() {
		super();
		this.label = '';
		this.orgUnitId = 0;
		this.sortedLeaderboardArray = [];

		const baseUrl = import.meta.url;

		this.fullURLExpand = new URL("../../images/arrow-expand.svg", baseUrl);
		this.fullURLCollapse = new URL("../../images/arrow-collapsed.svg", baseUrl);

	}

	render() {
		return html`<d2l-list>
			${this.sortedLeaderboardArray.map(item => this.createAwardEntry(item))}
		</d2l-list>`;
	}

	firstUpdated(changedProperties) {
		this._getLeaderboard();
	}

	async _getLeaderboard() {
		console.log(this.orgUnitId);
		const myLeaderboard = await LeaderboardService.getLeaderboard(this.orgUnitId);
		if (myLeaderboard === undefined) {
			console.log('nothing came back'); // eslint-disable-line no-console
		} else {
			console.log(myLeaderboard); // eslint-disable-line no-console
		}
		this.sortedLeaderboardArray = myLeaderboard.Objects.slice(0, 10);
		const baseUrl = import.meta.url;
		console.log(baseUrl);
	}

	createAwardEntry(item) {
		return html`
		<d2l-list-item>
			<div class='awardRow' id="${item.UserId}_Expand" @click="${this.expandClicked}">
				<div class="awardRank" ?topRank="${item.Rank > 4}">${item.Rank}</div>
				<img class='profileImage' src=${item.ProfileImage}></img>
				<div class='creditCount'>
					<div>${item.DisplayName}</div>
					<div>Award Count: ${item.TotalAwardCount}</div>
				</div>
				<img id="${item.UserId}_ExpandIcon" class="expandButton"  text="Expand" src="${this.fullURLExpand.toString()}"></img>
			</div>
			<div id="${item.UserId}_ExpandPanel" class="panel"> 
				Slide Out Panel!
			</div>
		</d2l-list-item>`;
	}

	expandClicked(event) {
		const panel = this.shadowRoot.getElementById(event.target.id + "Panel");
		const icon = this.shadowRoot.getElementById(event.target.id + "Icon");
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
			icon.classList.remove("expandButtonRotated");
			icon.src = this.fullURLExpand.toString();
		} else {
			panel.style.maxHeight = panel.scrollHeight + "px";
			icon.classList.add("expandButtonRotated");
			icon.src="../images/arrow-collapsed.svg";
			icon.src = this.fullURLCollapse.toString();
		}
	}
}

window.customElements.define('d2l-awards-leaderboard-ui', App);
