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
import { bodyCompactStyles, bodySmallStyles  } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { BaseMixin } from '../mixins/base-mixin.js';
import { LeaderboardRoutes } from '../helpers/leaderboardRoutes';
import { TopStyleLimit } from '../constants/Constants';

class LeaderboardRow extends BaseMixin(LitElement) {
	static get styles() {
		return [
			bodyCompactStyles,
			bodySmallStyles,
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
			.awardRank[topRank=true] {
				border-color: white;
            }
            .badgeEntry {
                height: 30px;
                width: 30px;
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
			.noMargin {
				margin: unset  !important;
			}
			.expandButton{
                transition: transform 0.2s;
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -moz-user-select: none; /* Old versions of Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
			}
			.expandButtonRotated {
				transform: rotate(90deg);
			}
			`
		];
	}

	constructor() {
		super();
		const baseUrl = import.meta.url;

		this.fullURLExpand = new URL('../../images/arrow-expand.svg', baseUrl);
		this.fullURLCollapse = new URL('../../images/arrow-collapsed.svg', baseUrl);
	}

	render() {
		return html`
            <div class='awardRow' id="$Expandable" @click="${this.expandClicked}">
            <div class="awardRank" ?topRank="${this.userData.Rank >= TopStyleLimit}">${this.userData.Rank}</div>
            <d2l-profile-image
                class="profileImage"
                href="${LeaderboardRoutes.ProfileImage(this.userData.UserId)}"
                small=""
                token="token"
                aria-hidden="true">
            </d2l-profile-image>
            <div class='creditCount'>
                <div class='d2l-body-compact noMargin'>${this.userData.DisplayName}</div>
                <div class='d2l-body-small noMargin'>${this.getAwardText()}</div>
            </div>
            <img id="ExpandIcon" class="expandButton"  text="Expand" src="${this.fullURLExpand.toString()}"></img>
        </div>
        <div id="ExpandPanel" class="panel"> 
            ${this.getAwards()}
        </div>
    	`;
	}

	getAwardText() {
		if (this.userData.TotalAwardCount === 0) {
			return this.localize('awards.none');
		} else if (this.userData.TotalAwardCount === 1) {
			return this.localize('awards.one');
		} else
			return this.localize('awards.many', {numawards:`${this.userData.TotalAwardCount}`});
	}

	getAwards() {
		if (this.userData.IssuedAwards.Objects.length) {
			return html`${this.userData.IssuedAwards.Objects.map(award => this.createAwardEntry(award))}`;
		} else {
			return html``;
		}
	}

	createAwardEntry(award) {
		const awardImageUrl = award.Award.ImageData.Path;
		const badgeID = `Badge_${award.Award.AwardId}`;
		return html`<img id="${badgeID}" src=${awardImageUrl} class='badgeEntry'> </img>
        <d2l-tooltip for="${badgeID}">${award.Award.Title}</d2l-tooltip>`;
	}
	expandClicked() {
		const panel = this.shadowRoot.getElementById('ExpandPanel');
		const icon = this.shadowRoot.getElementById('ExpandIcon');
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
			icon.classList.remove('expandButtonRotated');
			icon.src = this.fullURLExpand.toString();
		} else {
			panel.style.maxHeight = `${panel.scrollHeight}px`;
			icon.classList.add('expandButtonRotated');
			icon.src = '../images/arrow-collapsed.svg';
			icon.src = this.fullURLCollapse.toString();
		}
	}

	static get properties() {
		return {
			userData: {type: Object}
		};
	}
}

window.customElements.define('leaderboard-row', LeaderboardRow);
