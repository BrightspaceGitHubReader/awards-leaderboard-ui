export class DemoService {

	static getLeaderboard() {
		return fetch('../demo/data/leaderboard.json', this.getOptions).then(r => r.json());
	}

	static getMyAwards() {
		return fetch('../demo/data/awards.json', this.getOptions).then(r => r.json());
	}

	static get getOptions() {
		return {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*'
			}),
			method: 'GET',
			mode: 'cors'
		};
	}

	static getRequest(url) {
		return fetch(url, this.getOptions).then(r => r.json());
	}

}
