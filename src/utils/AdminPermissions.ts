export enum Permission {
    MANAGE_ADMINS = 1 << 0,
    MANAGE_PERMISSIONS = 1 << 1,
    ADMINISTRATOR = 1 << 3,
    MANAGE_CHILD_LEAGUES = 1 << 4,
    MANAGE_CHILD_DIVISIONS = 1 << 2,
    MANAGE_CLANS = 1 << 5,
    MANAGE_WAR_DATA = 1 << 6,
    MANAGE_SEASON = 1 << 7,
    MANAGE_LEAGUE = 1 << 8,
    HEAD_ADMIN = 1 << 10
}

export class AdminPermissions {
    constructor(value: number) {
        this.permissionsValue = value;
    }

    private readonly permissionsValue: number;
    private MANAGE_ADMINS = 1 << 0;
    private MANAGE_PERMISSIONS = 1 << 1;
    private ADMINISTRATOR = 1 << 3; // all powers, just below the boss
    private MANAGE_CHILD_LEAGUES = 1 << 4;
    private MANAGE_CHILD_DIVISIONS = 1 << 2;
    private MANAGE_CLANS = 1 << 5;
    private MANAGE_WAR_DATA = 1 << 6;
    private MANAGE_SEASON = 1 << 7;
    private MANAGE_LEAGUE = 1 << 8;
    private HEAD_ADMIN = 1 << 10; // League head, hoisted at 1024

    public get manageAdmins(): boolean {
        return (this.permissionsValue & this.MANAGE_ADMINS) === this.MANAGE_ADMINS;
    }

    public get managePermissions(): boolean {
        return (this.permissionsValue & this.MANAGE_PERMISSIONS) === this.MANAGE_PERMISSIONS;
    }

    public get administrator(): boolean {
        return (this.permissionsValue & this.ADMINISTRATOR) === this.ADMINISTRATOR;
    }

    public get manageChildLeagues(): boolean {
        return (this.permissionsValue & this.MANAGE_CHILD_LEAGUES) === this.MANAGE_CHILD_LEAGUES;
    }

    public get manageChildDivisions(): boolean {
        return (this.permissionsValue & this.MANAGE_CHILD_DIVISIONS) === this.MANAGE_CHILD_DIVISIONS;
    }

    public get manageClans(): boolean {
        return (this.permissionsValue & this.MANAGE_CLANS) === this.MANAGE_CLANS;
    }

    public get manageWarData(): boolean {
        return (this.permissionsValue & this.MANAGE_WAR_DATA) === this.MANAGE_WAR_DATA;
    }

    public get manageSeason(): boolean {
        return (this.permissionsValue & this.MANAGE_SEASON) === this.MANAGE_SEASON;
    }

    public get manageLeague(): boolean {
        return (this.permissionsValue & this.MANAGE_LEAGUE) === this.MANAGE_LEAGUE;
    }

    public get headAdmin(): boolean {
        return (this.permissionsValue & this.HEAD_ADMIN) === this.HEAD_ADMIN;
    }
}
