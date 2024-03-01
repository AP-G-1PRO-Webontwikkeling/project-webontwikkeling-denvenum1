import * as readline from 'readline-sync';
import {Character} from './interface';
import * as valorantData from './characters.json';

const characters: Character[] = valorantData.characters;

function viewAllData() {
    console.log("All valorant characters:");
    characters.forEach(function(character) {
        console.log(`- ${character.name} (${character.id})`);
    });
}

function filterByID(characters: Character[]) {
    const characterID = readline.question("Please enter the character ID you want to filter by: ");

    let foundCharacter: Character | undefined;

    for (const character of characters) {
        if (character.id === characterID) {
            foundCharacter = character;
            break;
        }
    }
    if (foundCharacter) {
        console.log(`- ${foundCharacter.name} (${foundCharacter.id})`);
        console.log(`  - Description: ${foundCharacter.description}`);
        console.log(`  - Age: ${foundCharacter.age}`);
        console.log(`  - On Mission: ${foundCharacter.onMission}`);
        console.log(`  - Birthdate: ${foundCharacter.birthdate}`);
        console.log(`  - Country: ${foundCharacter.country}`);
        console.log(`  - Profile Picture: ${foundCharacter.profilePicture}`);
        console.log(`  - Abilities: ${foundCharacter.abilities.join(", ")}`);
        console.log(`  - Role: ${foundCharacter.role}`);
        console.log(`  - Team: ${foundCharacter.teams.name}`);
    } else {
        console.log("Character with provided ID not found.");
    }
}

function selectOption() {
    console.log("Welcome to the JSON data viewer!");
    const choice: number = readline.questionInt(
        "1. View all data\n" +
        "2. Filter by ID\n" +
        "3. Exit\n" +
        "Please enter your choice: "
    );

    switch (choice) {
        case 1:
            viewAllData();
            break;
        case 2:
            filterByID(characters);
            break;
        case 3:
            console.log("Thanks, come again!");
            break;
        default:
            console.log("Invalid choice. Please choose again.");
    }
}
selectOption();
