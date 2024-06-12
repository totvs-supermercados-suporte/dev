document.getElementById('search-button').addEventListener('click', searchFinance);
document.getElementById('favorites-button').addEventListener('click', displayFavorites);
document.getElementById('search-input').addEventListener('input', autocomplete);

const token = 'kbaenouS7bvyzUZJDRx4Tx';

async function searchFinance() {
    const query = document.getElementById('search-input').value;
    const url = `https://brapi.dev/api/quote/${query}?token=${token}`;

    try {
        const response = await axios.get(url);
        const results = response.data.results;
        displayResults(results);
        saveHistory(query);
        updateDashboard();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'border p-4 mb-2 rounded bg-white flex justify-between items-center';
        
        resultElement.innerHTML = `
            <span>${result.symbol} - ${result.shortName} - R$${result.regularMarketPrice}</span>
            <button class="bg-yellow-500 text-white px-2 py-1 rounded" onclick="addFavorite('${result.symbol}', '${result.shortName}', '${result.regularMarketPrice}')">Favoritar</button>
        `;
        resultsDiv.appendChild(resultElement);
    });
}

function addFavorite(symbol, name, price) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ symbol, name, price });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Favorito adicionado!');
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    favorites.forEach(favorite => {
        const favoriteElement = document.createElement('div');
        favoriteElement.className = 'border p-4 mb-2 rounded bg-white flex justify-between items-center';
        
        favoriteElement.innerHTML = `
            <span>${favorite.symbol} - ${favorite.name} - R$${favorite.price}</span>
        `;
        resultsDiv.appendChild(favoriteElement);
    });
}

function saveHistory(query) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ query, timestamp: new Date().toISOString() });
    localStorage.setItem('history', JSON.stringify(history));
}

async function updateDashboard() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    if (history.length === 0) return;

    const allQueries = history.map(entry => entry.query);
    const uniqueQueries = [...new Set(allQueries)];
    let allPrices = [];

    for (const query of uniqueQueries) {
        const url = `https://brapi.dev/api/quote/${query}?token=${token}`;
        try {
            const response = await axios.get(url);
            const results = response.data.results;
            results.forEach(result => allPrices.push(result.regularMarketPrice));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    document.getElementById('min-price').textContent = `R$${minPrice.toFixed(2)}`;
    document.getElementById('max-price').textContent = `R$${maxPrice.toFixed(2)}`;
}

function autocomplete() {
    const query = document.getElementById('search-input').value.toUpperCase();
    if (query.length < 3) {
        document.getElementById('autocomplete-results').innerHTML = '';
        return;
    }
    const suggestions = ["MXRF11", "KNRI11", "HGLG11"]; // Exemplos de sugestões, você pode ampliar essa lista
    const filteredSuggestions = suggestions.filter(suggestion => suggestion.startsWith(query));

    const resultsDiv = document.getElementById('autocomplete-results');
    resultsDiv.innerHTML = '';
    filteredSuggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'p-2 cursor-pointer hover:bg-gray-200';
        suggestionElement.textContent = suggestion;
        suggestionElement.onclick = () => {
            document.getElementById('search-input').value = suggestion;
            resultsDiv.innerHTML = '';
        };
        resultsDiv.appendChild(suggestionElement);
    });
}

setInterval(() => {
    const minPrice = parseFloat(document.getElementById('min-price').textContent.replace('R$', ''));
    const maxPrice = parseFloat(document.getElementById('max-price').textContent.replace('R$', ''));
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        document.getElementById('min-price').textContent = `R$${(minPrice + 1).toFixed(2)}`;
        document.getElementById('max-price').textContent = `R$${(maxPrice - 1).toFixed(2)}`;
    }
}, 60000);
