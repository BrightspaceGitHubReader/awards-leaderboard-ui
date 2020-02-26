const BAS_VERSION = 1.1;
const MAX_USERS = 10;

export class LeaderboardRoutes {
	static ClasslistLeaderboard = (orgUnitId) => `/d2l/api/bas/${BAS_VERSION}/orgunits/${orgUnitId}/classlist/?limit=${MAX_USERS}`;
	static MyAwards = (orgUnitId, userId) => `/d2l/api/bas/${BAS_VERSION}/orgunits/${orgUnitId}/classlist/users/${userId}`;
	static MyConfigs = (orgUnitId) => `/d2l/api/bas/${BAS_VERSION}/orgunits/${orgUnitId}/myConfiguration`;
	static ProfileImage = (userId) => `/d2l/api/hm/users/${userId}`;
}
