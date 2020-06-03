export class DemoService {

	static get GetOptions() {
		return {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*'
			}),
			method: 'GET',
			mode: 'cors'
		};
	}

	static getLeaderboard() {
		return fetch('../demo/data/leaderboard.json', this.GetOptions).then(r => r.json());
	}

	static getMyAwards() {
		return fetch('../demo/data/awards.json', this.GetOptions).then(r => r.json());
	}

	static getRequest(url) {
		return fetch(url, this.GetOptions).then(r => r.json());
	}

}
