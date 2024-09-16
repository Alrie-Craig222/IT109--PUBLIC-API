// Cocktail DB API URLs
const searchCocktailByNameURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const randomCocktailURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
const filterByAlcoholicURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=';

// Genius API (replace with your actual Genius API key)
const geniusAPIUrl = 'https://api.genius.com/search?q=';
const geniusAPIKey = 'Bearer YOUR_GENIUS_API_KEY';

// TMDb API (replace with your actual TMDb API key)
const tmdbAPIUrl = 'https://api.themoviedb.org/3/search/movie?api_key=YOUR_TMDB_API_KEY&query=';

// Function to search cocktails by name
async function searchCocktailByName() {
    const drinkName = document.getElementById('drink-name').value;
    const response = await fetch(searchCocktailByNameURL + drinkName);
    const data = await response.json();
    displayDrinkDetails(data.drinks[0]);
}

// Function to get a random cocktail
async function getRandomCocktail() {
    const response = await fetch(randomCocktailURL);
    const data = await response.json();
    displayDrinkDetails(data.drinks[0]);
}

// Function to filter drinks by alcoholic or non-alcoholic
async function filterDrinks() {
    const alcoholicFilter = document.getElementById('alcoholic-filter').value;
    if (!alcoholicFilter) return;

    const response = await fetch(filterByAlcoholicURL + alcoholicFilter);
    const data = await response.json();
    displayFilteredDrinks(data.drinks);
}

// Display drink details (name, category, instructions)
function displayDrinkDetails(drink) {
    const drinkDetails = document.getElementById('drink-details');
    drinkDetails.innerHTML = `
        <div class="result-item">
            <h3>${drink.strDrink}</h3>
            <p><strong>Category:</strong> ${drink.strCategory}</p>
            <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
            <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}">
        </div>
    `;

    // Suggest music and movies based on whether the drink is "hard" or "light"
    if (isHardDrink(drink)) {
        suggestHardDrinkContent();
    } else {
        suggestLightDrinkContent();
    }
}

// Display a list of filtered drinks (by alcoholic or non-alcoholic)
function displayFilteredDrinks(drinks) {
    const drinkDetails = document.getElementById('drink-details');
    drinkDetails.innerHTML = drinks.map(drink => `
        <div class="result-item">
            <h3>${drink.strDrink}</h3>
            <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}">
        </div>
    `).join('');
}

// Determine if a drink is hard or light
function isHardDrink(drink) {
    return drink.strAlcoholic === "Alcoholic" && (drink.strCategory.includes("Cocktail") || drink.strCategory.includes("Punch"));
}

// Suggest music for hard drinks
async function suggestHardDrinkContent() {
    const results = document.getElementById('suggestions');
    results.innerHTML = '<h3>Suggestions for a Hard Drink</h3>';

    await fetchGeniusSongs("sexy");
    await fetchMovies("action");
}

// Suggest music for light drinks
async function suggestLightDrinkContent() {
    const results = document.getElementById('suggestions');
    results.innerHTML = '<h3>Suggestions for a Light Drink</h3>';

    await fetchGeniusSongs("relaxing");
    await fetchMovies("comedy");
}

// Fetch songs from Genius API
async function fetchGeniusSongs(mood) {
    const response = await fetch(geniusAPIUrl + mood, {
        headers: { 'Authorization': geniusAPIKey }
    });
    const data = await response.json();
    displaySongs(data.response.hits);
}

// Fetch movies from TMDb API
async function fetchMovies(genre) {
    const response = await fetch(tmdbAPIUrl + genre);
    const data = await response.json();
    displayMovies(data.results);
}

// Display fetched songs
function displaySongs(songs) {
    const results = document.getElementById('suggestions');
    songs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.classList.add('result-item');
        songItem.innerHTML = `
            <h3>Song: ${song.result.title}</h3>
            <p><strong>Artist:</strong> ${song.result.primary_artist.name}</p>
        `;
        results.appendChild(songItem);
    });
}

// Display fetched movies
function displayMovies(movies) {
    const results = document.getElementById('suggestions');
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('result-item');
        movieItem.innerHTML = `
            <h3>Movie: ${movie.title}</h3>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Overview:</strong> ${movie.overview}</p>
        `;
        results.appendChild(movieItem);
    });
}
