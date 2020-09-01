import { ClasslistAwardSortByAwards, ClasslistAwardSortByCredits } from '../constants/constants';
import { LeaderboardRoutes } from '../helpers/leaderboardRoutes';

export class LeaderboardService {

	static getLeaderboard(orgUnitId, sortByCreditsConfig) {
		const classlistSort = sortByCreditsConfig ? ClasslistAwardSortByCredits : ClasslistAwardSortByAwards;
		return this.getRequest(LeaderboardRoutes.ClasslistLeaderboard(orgUnitId, classlistSort));
	}

	static getMyAwards(orgUnitId, userId) {
		return this.getRequest(LeaderboardRoutes.MyAwards(orgUnitId, userId));
	}

	static get getOptions() {
		return {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
			}),
			method: 'GET',
			mode: 'cors'
		};
	}

	static getRequest(url) {
		return fetch(url, this.getOptions).then(r => r.json());
	}
}
