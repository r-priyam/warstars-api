export enum Permission {
    MANAGE_CHILD_DIVISIONS = 1 << 1,
    MANAGE_CHILD_LEAGUES = 1 << 2,
    ADMINISTRATOR = 1 << 3,
    MANAGE_CLANS = 1 << 4,
    MANAGE_WAR_DATA = 1 << 5,
    MANAGE_SEASON = 1 << 6,
    MANAGE_LEAGUE = 1 << 7
}

export class AdminPermissions {
    constructor(value: number) {
        this.permissionsValue = value;
    }

    private readonly permissionsValue: number;
    private MANAGE_CHILD_DIVISIONS = 1 << 1;
    private MANAGE_CHILD_LEAGUES = 1 << 2;
    private ADMINISTRATOR = 1 << 3;
    private MANAGE_CLANS = 1 << 4;
    private MANAGE_WAR_DATA = 1 << 5;
    private MANAGE_SEASON = 1 << 6;
    private MANAGE_LEAGUE = 1 << 7;

    public get administrator(): boolean {
        return (this.permissionsValue & this.ADMINISTRATOR) === this.ADMINISTRATOR;
    }

    public get manageChildLeagues(): boolean {
        return (this.permissionsValue & this.MANAGE_CHILD_LEAGUES) === this.MANAGE_CHILD_LEAGUES || this.administrator;
    }

    public get manageChildDivisions(): boolean {
        return (this.permissionsValue & this.MANAGE_CHILD_DIVISIONS) === this.MANAGE_CHILD_DIVISIONS || this.administrator;
    }

    public get manageClans(): boolean {
        return (this.permissionsValue & this.MANAGE_CLANS) === this.MANAGE_CLANS || this.administrator;
    }

    public get manageWarData(): boolean {
        return (this.permissionsValue & this.MANAGE_WAR_DATA) === this.MANAGE_WAR_DATA || this.administrator;
    }

    public get manageSeason(): boolean {
        return (this.permissionsValue & this.MANAGE_SEASON) === this.MANAGE_SEASON || this.administrator;
    }

    public get manageLeague(): boolean {
        return (this.permissionsValue & this.MANAGE_LEAGUE) === this.MANAGE_LEAGUE || this.administrator;
    }
}
