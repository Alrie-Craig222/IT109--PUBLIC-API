// Cocktail DB API URLs
const searchCocktailByNameURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const randomCocktailURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
const filterByAlcoholicURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=';
const lookupDrinkURL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

// Function to search cocktails by name
async function searchCocktailByName() {
    const drinkName = document.getElementById('drink-name').value;
    const response = await fetch(searchCocktailByNameURL + drinkName);
    const data = await response.json();
    if (data.drinks) {
        displayDrinkDetails(data.drinks[0]);
    } else {
        alert('No cocktails found');
    }
}

// Function to get a random cocktail
async function getRandomCocktail() {
    const response = await fetch(randomCocktailURL);
    const data = await response.json();
    if (data.drinks) {
        displayDrinkDetails(data.drinks[0]);
    } else {
        alert('No cocktails found');
    }
}

// Function to filter drinks by alcoholic or non-alcoholic
async function filterDrinks() {
    const alcoholicFilter = document.getElementById('alcoholic-filter').value;
    if (!alcoholicFilter) return;

    const response = await fetch(filterByAlcoholicURL + alcoholicFilter);
    const data = await response.json();
    displayFilteredDrinks(data.drinks);
}

// Display drink details (name, category, instructions, and ingredients)
function displayDrinkDetails(drink) {
    const drinkDetails = document.getElementById('drink-details');
    // Get ingredients and measures
    let ingredientsHtml = '';
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
            ingredientsHtml += `<li>${measure ? measure : ''} ${ingredient}</li>`;
        }
    }
    
    drinkDetails.innerHTML = `
        <div class="result-item">
            <h3>${drink.strDrink}</h3>
            <p><strong>Category:</strong> ${drink.strCategory}</p>
            <p><strong>Ingredients:</strong></p>
            <ul>${ingredientsHtml}</ul>
            <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
            <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}">
        </div>
    `;
}

// Fetch and display drink details by ID
async function fetchDrinkDetails(drinkId) {
    const response = await fetch(lookupDrinkURL + drinkId);
    const data = await response.json();
    if (data.drinks) {
        displayDrinkDetails(data.drinks[0]);
    } else {
        alert('No details found');
    }
}

// Display a list of filtered drinks (by alcoholic or non-alcoholic)
function displayFilteredDrinks(drinks) {
    const drinkDetails = document.getElementById('drink-details');
    drinkDetails.innerHTML = drinks.map(drink => `
        <div class="result-item" onclick="fetchDrinkDetails(${drink.idDrink})">
            <h3>${drink.strDrink}</h3>
            <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}">
        </div>
    `).join('');
}

// Determine if a drink is hard or light
function isHardDrink(drink) {
    return drink.strAlcoholic === "Alcoholic" && (drink.strCategory.includes("Cocktail") || drink.strCategory.includes("Punch"));
}
