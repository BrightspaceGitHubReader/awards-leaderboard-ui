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
import './award-issued.js';
import 'd2l-resize-aware/d2l-resize-aware.js';
import { BadgeImageSize, PanelPadding, TopStyleLimit } from '../constants/constants';
import { bodyCompactStyles, bodySmallStyles  } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement, unsafeCSS } from 'lit-element/lit-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { BaseMixin } from '../mixins/base-mixin.js';
import { LeaderboardRoutes } from '../helpers/leaderboardRoutes';

const mobileWidthMax = 700;
const fullWidthMin = 950;
const maxMobileBadges = 8;
const maxFullBadges = 10;

class LeaderboardRow extends BaseMixin(LitElement) {
	static get styles() {
		return [
			bodyCompactStyles,
			bodySmallStyles,
			css`
			d2l-resize-aware {
				width: 100%;
			}
            .awardRow {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.profileImage {
				border-radius: 5px;
				margin-left: 12px;
			}
			:host([dir="rtl"]) .profileImage {
				margin-right: 12px;
				margin-left: 0;
			}
			.awardRank {
				border-radius: 15px;
				background-color: #E3E9F1;
				border: 1px solid #E3E9F1;
				height: 21px;
				width: 21px;
				padding: 9px;
				margin-left: 17px;
				align-items: center;
				display: flex;
				justify-content: center;
				-moz-border-radius:50%;
				-webkit-border-radius:50%;
			}
			:host([dir="rtl"]) .awardRank {
				margin-right: 17px;
				margin-left: 0px;
			}
			.awardRank[topRank] {
				background-color: white;
				border: 1px solid var(--d2l-color-ferrite);
			}
			.awardRow[myAward] .awardRank[topRank],
			.awardRow[myAward] .awardRank {
				border: 1px solid var(--d2l-color-celestine);
			}
			.creditCount {
				display:flex;
				flex-direction: column;
				padding-left: 10px;
			}
			:host([dir="rtl"]) .creditCount {
				padding-right: 10px;
				padding-left: 0px;
			}
			.resizeContainer[full] .creditCount {
				flex-direction: row;
				width: 35%;
			}
			.resizeContainer[full] .displayName {
				width: 70%;
			}
			.resizeContainer[full] .displayNumber {
				width: 30%;
			}
			.panel {
				display: none;
				overflow: hidden;
				max-height: 0px;
				margin-top: 11px;
				margin-bottom: -20px;
				transition: max-height 0.2s ease-out;
				padding-left: ${unsafeCSS(PanelPadding)}px;
				background-color: var(--d2l-color-sylvite);
				border-top: 1px solid var(--d2l-color-mica);
				padding-top: 12px;
				padding-bottom: 12px;
			}
			:host([dir="rtl"]) .panel {
				padding-right: ${unsafeCSS(PanelPadding)}px;
				padding-left: 0px;
			}
			.noMargin {
				margin: unset  !important;
			}
			.side {
				margin-left: auto;
				margin-right: 25px;
			}
			:host([dir="rtl"]) .side {
				margin-right: auto;
				margin-left: 25px;
			}
			.expandButton {
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
		this._maxBadges = maxMobileBadges;
	}

	connectedCallback() {
		super.connectedCallback();
		afterNextRender(this, () => {
			const resizeAware = this.shadowRoot.querySelector('d2l-resize-aware');
			resizeAware.addEventListener('d2l-resize-aware-resized', this._onResize.bind(this));
			resizeAware._onResize();
		});
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		const resizeAware = this.shadowRoot.querySelector('d2l-resize-aware');
		resizeAware.removeEventListener('d2l-resize-aware-resized', this._onResize.bind(this));
	}

	render() {
		const userAwards = html`${this._getAwardsDisplay()}`;

		let expandPanel;
		if (this._mobile) {
			expandPanel = html`
				<div id="ExpandPanel" class="panel"> 
					${userAwards}
				</div>
			`;
		}
		let sidePanel;
		if (this._mobile) {
			sidePanel = html`
				<img id="ExpandIcon" class="expandButton" text="Expand" src="${this.fullURLExpand.toString()}"></img>
			`;
		} else {
			sidePanel = userAwards;
		}

		let displayNumber;
		if (this._full) {
			displayNumber = html`
				<div class='d2l-body-standard noMargin displayNumber'>${this._getDisplayNumber()}</div>
			`;
		} else {
			displayNumber = html`
				<div class='d2l-body-small noMargin'>${this._getDisplayNumber()}</div>
			`;
		}

		const fontStyle = this._full ? 'd2l-body-standard' : 'd2l-body-compact';

		return html`
			<d2l-resize-aware id="resize-detector" class="resizeContainer" ?mobile="${this._mobile}" ?full="${this._full}">
				<div class='awardRow' id="$Expandable" @click="${this._expandClicked}" ?myAward="${this.myAward}">
					<div 
						class="awardRank ${fontStyle}" 
						?topRank="${this.userData.Rank <= TopStyleLimit}" 
						aria-label="${this.localize('rankingAria', {rank:`${this.userData.Rank}`})}">
						${this.userData.Rank}
					</div>
					<d2l-profile-image
						class="profileImage"
						href="${LeaderboardRoutes.ProfileImage(this.userData.UserId)}"
						medium
						token="token"
						aria-hidden="true">
					</d2l-profile-image>
					<div class='creditCount'>
						<div class='${fontStyle} noMargin displayName'>${this.userData.DisplayName}</div>
						${displayNumber}
					</div>
					<div class="side">
						${sidePanel}
					</div>
				</div>
				${expandPanel}
			</d2l-resize-aware>
    	`;
	}

	_createAwardEntry(award) {
		if (this._displayedBadges > (this._maxBadges - 1)) {
			return html``;
		}
		this._displayedBadges = this._displayedBadges + 1;

		return html`
			<award-issued 
				awardId=${award.Award.AwardId} 
				awardTitle=${award.Award.Title}
				awardImageUrl=${award.Award.ImageData.Path}
				issuedId=${award.IssuedId}>
			</award-issued>
		`;
	}

	_expandClicked() {
		if (!this._mobile) {
			return;
		}
		const panel = this.shadowRoot.getElementById('ExpandPanel');
		const icon = this.shadowRoot.getElementById('ExpandIcon');
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
			panel.style.display = 'none';
			icon.classList.remove('expandButtonRotated');
			icon.src = this.fullURLExpand.toString();
		} else {
			panel.style.display = 'block';
			panel.style.maxHeight = `${panel.scrollHeight}px`;
			icon.classList.add('expandButtonRotated');
			icon.src = '../images/arrow-collapsed.svg';
			icon.src = this.fullURLCollapse.toString();
		}
	}

	_getAwardsDisplay() {
		let additionalAwards;
		if (this.userData.TotalAwardCount > this._maxBadges) {
			const extraCount = this.userData.TotalAwardCount - this._maxBadges;
			additionalAwards = html`
				+${extraCount}
			`;
		}
		this._displayedBadges = 0;

		if (this.userData.IssuedAwards.Objects.length) {
			return html`
				${this.userData.IssuedAwards.Objects.map(award => this._createAwardEntry(award))}
				${additionalAwards}
			`;
		} else {
			return html``;
		}
	}

	_getAwardCountText() {
		if (this.userData.TotalAwardCount === 1) {
			return this.localize('awards.one');
		}
		return this.localize('awards.many', {numawards:`${this.userData.TotalAwardCount}`});
	}

	_getCreditCountText() {
		if (this.userData.TotalCreditCount === 1) {
			return this.localize('credits.one');
		}
		return this.localize('credits.many', {numcredits:`${this.userData.TotalCreditCount}`});
	}

	_getDisplayNumber() {
		if (this.sortByCreditsConfig) {
			return this._getCreditCountText();
		}
		return this._getAwardCountText();
	}

	_onResize(e) {
		const currentWidth = e.detail.current.width;
		this._mobile = currentWidth <= mobileWidthMax;
		this._full = currentWidth > fullWidthMin;
		if (!this._full) {
			const awardMaxWidth = Math.floor((currentWidth - PanelPadding * 2 - BadgeImageSize + 10) / (BadgeImageSize + 10));
			this._maxBadges = awardMaxWidth > maxMobileBadges ? maxMobileBadges : awardMaxWidth;
		} else {
			this._maxBadges = maxFullBadges;
		}
	}

	static get properties() {
		return {
			userData: { type: Object },
			myAward: { type: Boolean },
			sortByCreditsConfig: { type: Boolean },
			_mobile: {
				type: Boolean,
				value: false
			},
			_full: {
				type: Boolean,
				value: false
			},
			_maxBadges: { type: Number },
			_displayedBadges: { type: Number }
		};
	}
}

window.customElements.define('leaderboard-row', LeaderboardRow);
