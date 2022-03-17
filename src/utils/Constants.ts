export const CACHE_SET_VALUES = {
    USER_PLAYERS: { key: 'u/p', ttl: 5 * 60, paramCache: false },
    USER_CLANS: { key: 'u/c', ttl: 5 * 60, paramCache: false },
    LEAGUE_ADMINS: { key: 'l/ad', ttl: 0, paramCache: true },
    USER_LEAGUES: { key: 'u/ls', ttl: 0, paramCache: false },
    CHILD_SEASON_INFO: { key: 'ch/s/i', ttl: 7 * 24 * 60 * 60000, paramCache: true },
    SEASON_CHILD_CLANS: { key: 's/ch/c', ttl: 7 * 24 * 60 * 60000, paramCache: true }
};

export const ROUTES_PREFIX = {
    ACCOUNT: { CLAN: 'account/clan', PLAYER: 'account/player' },
    LEAGUE: { ADMIN: 'league/admin', CORE: 'league/core', REGISTER: 'league/register', SEASON: 'league/season' }
};

export const EVENT_VALUES = {
    LEAGUE_REGISTER: '1',
    UPDATE_CACHE_USER_PLAYER: '2',
    UPDATE_CACHE_USER_CLANS: '3',
    UPDATE_CACHE_LEAGUE_ADMINS: '4',
    UPDATE_CACHE_USER_LEAGUES: '5',
    UPDATE_CACHE_CHILD_SEASON_INFO: '6',
    UPDATE_CACHE_SEASON_CHILD_CLANS: '7'
};
