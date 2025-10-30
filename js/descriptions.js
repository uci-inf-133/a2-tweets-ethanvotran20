let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// Filter to just the written tweets
	const all = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	writtenTweets = all.filter(t => t.written);
}

function renderSearchResults(query) {
	const tableBody = document.getElementById('tweetTable');
	const searchCount = document.getElementById('searchCount');
	const searchText = document.getElementById('searchText');

	// Reset when empty string
	if (!query) {
		tableBody.innerHTML = '';
		searchCount.innerText = 0;
		searchText.innerText = '';
		return;
	}

	const qLower = query.toLowerCase();
	const matches = writtenTweets.filter(t => t.writtenText.toLowerCase().includes(qLower));
	searchCount.innerText = matches.length;
	searchText.innerText = query;

	// Populate table
	const rows = matches.map((t, idx) => t.getHTMLTableRow(idx + 1)).join('');
	tableBody.innerHTML = rows;
}

function addEventHandlerForSearch() {
	// Search the written tweets as text is entered into the search box, and add them to the table
	const input = document.getElementById('textFilter');
	input.addEventListener('input', (e) => {
		renderSearchResults(input.value);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});