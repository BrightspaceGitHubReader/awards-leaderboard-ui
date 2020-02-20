export const BasVersion = 1.1;

export class LeaderboardRoutes {
	static ClasslistLeaderboard(orgUnitId) { return `/d2l/api/bas/${BasVersion}/orgunits/${orgUnitId}/classlist/`; }
}
