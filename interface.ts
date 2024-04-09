export interface Characters {
    id:             string;
    name:           string;
    description:    string;
    age:            number;
    available:      boolean;
    birthdate:      string;
    country:        string;
    profilePicture: string;
    avatar:         string;
    abilities:      string[];
    role:           string;
    roleSymbol:     string;
    teams:          Teams;
}

export interface Teams {
    id:      string;
    name:    string;
    logo:    string;
    founded: number;
}
