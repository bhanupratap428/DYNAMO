// Dynamo Music Search Engine - Real-time iTunes API Integration
const searchInput = document.getElementById('searchInput');
const searchForm = document.querySelector('.search-form');
const searchResults = document.getElementById('searchResults');
let debounceTimeout = null;

searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimeout);
    const query = searchInput.value.trim();
    if (!query) {
        searchResults.style.display = 'none';
        return;
    }
    debounceTimeout = setTimeout(() => {
        fetchResults(query);
    }, 400);
});

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchResults(query);
});

function fetchResults(query) {
    searchResults.innerHTML = '<p style="text-align:center;opacity:0.7;">Searching...</p>';
    searchResults.style.display = 'block';
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                renderResults(data.results);
            } else {
                searchResults.innerHTML = '<p style="text-align:center;opacity:0.7;">No results found. Try another song, artist, or album.</p>';
            }
        })
        .catch(() => {
            searchResults.innerHTML = '<p style="text-align:center;opacity:0.7;">Error fetching results. Please try again.</p>';
        });
}

function renderResults(results) {
    searchResults.innerHTML = results.map(song => `
        <div class="search-result-item">
            <img class="song-cover" src="${song.artworkUrl100}" alt="${song.trackName} cover">
            <div class="song-info">
                <div class="song-title">${song.trackName}</div>
                <div class="song-artist">${song.artistName}</div>
                <div class="song-album">${song.collectionName}</div>
            </div>
            <a href="${song.previewUrl}" target="_blank" class="play-btn" title="Play Preview">
                <span class="material-icons">play_arrow</span>
            </a>
        </div>
    `).join('');
    searchResults.style.display = 'block';
}
