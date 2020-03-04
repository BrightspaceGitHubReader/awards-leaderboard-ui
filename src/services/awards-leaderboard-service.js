
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

	static get Create() {
		return (type) => {
			return (object) => {
				return this.postJsonRequest(LeaderboardRoutes.RelativePath(type), object);
			};
		};
	}

	static get GetOptions() {
		return {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
			}),
			method: 'GET',
			mode: 'cors'
		};
	}

	static getLeaderboard(orgunitid, classlistSort) {
		return this.getRequest(LeaderboardRoutes.ClasslistLeaderboard(orgunitid, classlistSort));
	}

	static getMyAwards(orgunitid, userId) {
		return this.getRequest(LeaderboardRoutes.MyAwards(orgunitid, userId));
	}

	static getRequest(url) {
		return fetch(url, this.GetOptions).then(r => r.json());
	}

}
