export const CACHE_SET_VALUES = {
    USER_PLAYERS: { key: 'u/p', ttl: 5 * 60, paramCache: false },
    USER_CLANS: { key: 'u/c', ttl: 5 * 60, paramCache: false },
    LEAGUE_ADMINS: { key: 'l/ad', ttl: 0, paramCache: true },
    USER_LEAGUES: { key: 'u/ls', ttl: 0, paramCache: true },
    CHILD_SEASON_INFO: { key: 'ch/s/i', ttl: 7 * 24 * 60 * 60000, paramCache: true },
    SEASON_CHILD_CLANS: { key: 's/ch/c', ttl: 7 * 24 * 60 * 60000, paramCache: true }
};

export const ROUTES_PREFIX = {
    ACCOUNT: { CLAN: 'account/clan', PLAYER: 'account/player' },
    LEAGUE: { ADMIN: 'league/admin', CORE: 'league/core', REGISTER: 'league/register', SEASON: 'league/season' }
};
