function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	// Earliest and latest dates
	const times = tweet_array.map(t => t.time.getTime());
	const minTime = new Date(Math.min.apply(null, times));
	const maxTime = new Date(Math.max.apply(null, times));
	const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = minTime.toLocaleDateString(undefined, opts);
	document.getElementById('lastDate').innerText = maxTime.toLocaleDateString(undefined, opts);

	// Category counts
	const counts = { completed_event: 0, live_event: 0, achievement: 0, miscellaneous: 0 };
	tweet_array.forEach(t => {
		if (t.source in counts) {
			counts[t.source]++;
		} else {
			counts.miscellaneous++;
		}
	});
	const total = tweet_array.length;
	const pct = (n) => math.format((n / total) * 100, {notation: 'fixed', precision: 2}) + '%';

	Array.from(document.getElementsByClassName('completedEvents')).forEach(el => el.innerText = counts.completed_event);
	Array.from(document.getElementsByClassName('completedEventsPct')).forEach(el => el.innerText = pct(counts.completed_event));
	Array.from(document.getElementsByClassName('liveEvents')).forEach(el => el.innerText = counts.live_event);
	Array.from(document.getElementsByClassName('liveEventsPct')).forEach(el => el.innerText = pct(counts.live_event));
	Array.from(document.getElementsByClassName('achievements')).forEach(el => el.innerText = counts.achievement);
	Array.from(document.getElementsByClassName('achievementsPct')).forEach(el => el.innerText = pct(counts.achievement));
	Array.from(document.getElementsByClassName('miscellaneous')).forEach(el => el.innerText = counts.miscellaneous);
	Array.from(document.getElementsByClassName('miscellaneousPct')).forEach(el => el.innerText = pct(counts.miscellaneous));

	// Written text stats among completed events
	const completed = tweet_array.filter(t => t.source === 'completed_event');
	const writtenCount = completed.filter(t => t.written).length;
	Array.from(document.getElementsByClassName('written')).forEach(el => el.innerText = writtenCount);
	Array.from(document.getElementsByClassName('writtenPct')).forEach(el => el.innerText = pct(writtenCount));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});