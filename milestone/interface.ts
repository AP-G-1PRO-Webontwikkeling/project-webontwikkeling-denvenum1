export interface Valorant {
    characters: Character[];
}

export interface Character {
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
    teams:          Teams;
}

export interface Teams {
    id:      string;
    name:    string;
    logo:    string;
    players: string[];
}
