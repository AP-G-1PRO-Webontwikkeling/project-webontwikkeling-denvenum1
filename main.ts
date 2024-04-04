import * as readline from 'readline-sync';
import {Characters, Teams} from './interface';

async function main() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-denvenum1/main/milestone/characters.json");
        const data = await response.json();
        function viewAllData() {
            console.log("All valorant characters:");
            for (let i = 0; i < data.characters.length; i++) {
                console.log(`${data.characters[i].name} (${data.characters[i].id})`)
            }
        }

        function filterByID() {
            const characterID = readline.question("Please enter the character ID you want to filter by: ");

            const foundCharacter = data.characters.find((character: Characters) => character.id === characterID);

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
                    filterByID();
                    break;
                case 3:
                    console.log("Thanks, come again!");
                    break;
                default:
                    console.log("Invalid choice. Please choose again.");
            }
        }
        selectOption();

    } catch (error:any) {
        console.error("An error occurred:", error.message);
    }
}

main();
