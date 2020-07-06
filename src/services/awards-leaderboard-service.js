import { ClasslistAwardSortByAwards, ClasslistAwardSortByCredits } from '../constants/constants';
import { d2lfetch } from 'd2l-fetch/src/index';
import fetchAuthFramed from 'd2l-fetch-auth/es6/d2lfetch-auth-framed';
import { LeaderboardRoutes } from '../helpers/leaderboardRoutes';

d2lfetch.use({
	name: 'auth',
	fn: fetchAuthFramed,
	options: {
		enableTokenCache: true
	}
});

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
