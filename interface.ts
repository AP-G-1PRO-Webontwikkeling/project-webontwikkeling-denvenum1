export interface Characters {
    id:             string;
    name:           string;
    description:    string;
    age:            number;
    onMission:      boolean;
    birthdate:      string;
    country:        string;
    profilePicture: string;
    abilities:      string[];
    role:           string;
    roleSymbol:     string;
    teams:          Teams;
}

export interface Teams {
    id:      string;
    name:    string;
    logo:    string;
    players: string[];
}
