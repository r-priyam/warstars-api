import { LeagueAdmin } from './entities/league/Admin';
import { ChildLeague } from './entities/league/ChildLeague';
import { ChildLeagueSeason } from './entities/league/ChildSeason';
import { LeagueClan } from './entities/league/Clan';
import { Division } from './entities/league/Division';
import { League } from './entities/league/League';
import { LeagueSeason } from './entities/league/LeagueSeason';
import { LeagueMatches } from './entities/league/Matches';
import { LeagueSchedule } from './entities/league/Schedule';
import { LeagueWarAttacks } from './entities/league/war/Attacks';
import { LeagueLeaderBoard } from './entities/league/war/Leaderboard';
import { DatabaseSession } from './entities/Session';
import { User } from './entities/User';
import { UserClan } from './entities/user/Clan';
import { UserPlayer } from './entities/user/Player';

const coreEntities = [DatabaseSession, User];
const userEntities = [User, UserClan, UserPlayer];
const leagueEntities = [
    LeagueAdmin,
    ChildLeague,
    ChildLeagueSeason,
    LeagueClan,
    Division,
    League,
    LeagueSeason,
    LeagueMatches,
    LeagueSchedule,
    LeagueWarAttacks,
    LeagueLeaderBoard
];

export const entities = [...coreEntities, ...userEntities, ...leagueEntities];

export {
    DatabaseSession,
    User,
    UserClan,
    UserPlayer,
    LeagueAdmin,
    ChildLeague,
    ChildLeagueSeason,
    LeagueClan,
    Division,
    League,
    LeagueSeason,
    LeagueMatches,
    LeagueSchedule
};
