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
import '@brightspace-ui-labs/accordion/accordion-collapse.js';
import 'd2l-resize-aware/d2l-resize-aware.js';
import { BadgeImageSize, PanelPadding, TopStyleLimit } from '../constants/constants';
import { bodyCompactStyles, bodySmallStyles  } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement, unsafeCSS } from 'lit-element/lit-element.js';
import { BaseMixin } from '../mixins/base-mixin.js';
import { LeaderboardRoutes } from '../helpers/leaderboardRoutes';

const mobileWidthMax = 700;
const fullWidthMin = 950;
const maxMobileBadges = 8;
const maxFullBadges = 10;

class LeaderboardRow extends BaseMixin(LitElement) {

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

	static get styles() {
		return [
			bodyCompactStyles,
			bodySmallStyles,
			css`
			d2l-resize-aware {
				width: 100%;
			}
            .awardRow {
				align-items: center;
				display: flex;
				flex-direction: row;
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
				align-items: center;
				background-color: #E3E9F1;
				border: 1px solid #E3E9F1;
				border-radius: 15px;
				display: flex;
				height: 21px;
				justify-content: center;
				margin-left: 17px;
				padding: 9px;
				width: 21px;
				-moz-border-radius:50%;
				-webkit-border-radius:50%;
			}
			:host([dir="rtl"]) .awardRank {
				margin-left: 0px;
				margin-right: 17px;
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
				padding-left: 0px;
				padding-right: 10px;
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
				background-color: var(--d2l-color-sylvite);
				border-top: 1px solid var(--d2l-color-mica);
				margin-top: 11px;
				margin-bottom: -20px;
				overflow: hidden;
				padding-bottom: 12px;
				padding-left: ${unsafeCSS(PanelPadding)}px;
				padding-top: 12px;
			}
			:host([dir="rtl"]) .panel {
				padding-left: 0px;
				padding-right: ${unsafeCSS(PanelPadding)}px;
			}
			.noMargin {
				margin: unset  !important;
			}
			.side {
				margin-left: auto;
				margin-right: 25px;
			}
			:host([dir="rtl"]) .side {
				margin-left: 25px;
				margin-right: auto;
			}
			d2l-labs-accordion-collapse::slotted(d2l-icon){
				padding-right: 10px;
			}
			`
		];
	}

	constructor() {
		super();

		this._maxBadges = maxMobileBadges;
	}

	render() {
		const userAwards = html`${this._getAwardsDisplay()}`;

		let expandPanel;
		if (this._mobile) {
			expandPanel = html`
				<div class="panel"> 
					${userAwards}
				</div>
			`;
		}
		let sidePanel;
		if (this._mobile) {
			sidePanel = html`
				
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

		const isDisabled = this.userData.TotalAwardCount === 0 ? true : false;

		if (this._mobile) {
			return html`
				<d2l-resize-aware class="resizeContainer" @d2l-resize-aware-resized=${this._handleResized} ?mobile="${this._mobile}" ?full="${this._full}">
					<d2l-labs-accordion>
						<d2l-labs-accordion-collapse flex icon-has-padding ?disabled="${isDisabled}">
							<div class='awardRow' ?myAward="${this.myAward}" slot="header">
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
						</d2l-labs-accordion-collapse>
					</d2l-labs-accordion>
				</d2l-resize-aware>
			`;
		}
		return html`
			<d2l-resize-aware class="resizeContainer" @d2l-resize-aware-resized=${this._handleResized} ?mobile="${this._mobile}" ?full="${this._full}">
				<div class='awardRow' ?myAward="${this.myAward}">
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
			<award-issued award=${JSON.stringify(award)} >
			</award-issued>
		`;
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

	async _handleResized(e) {
		if (!e || !e.detail || !e.detail.current) {
			return;
		}

		const currentWidth = e.detail.current.width;
		const mobile = currentWidth <= mobileWidthMax;
		const full = currentWidth > fullWidthMin;
		let maxBadges;
		if (!this._full) {
			const awardMaxWidth = Math.floor((currentWidth - PanelPadding * 2 - BadgeImageSize + 10) / (BadgeImageSize + 10));
			maxBadges = awardMaxWidth > maxMobileBadges ? maxMobileBadges : awardMaxWidth;
		} else {
			maxBadges = maxFullBadges;
		}
		if (this._mobile !== mobile || this._full !== full || this._maxBadges !== maxBadges) {
			this._mobile = mobile;
			this._full = full;
			this._maxBadges = maxBadges;

			await this.requestUpdate();
		}
	}
}

window.customElements.define('leaderboard-row', LeaderboardRow);
