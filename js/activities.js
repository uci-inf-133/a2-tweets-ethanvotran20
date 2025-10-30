function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Filter completed tweets with parsed activity and distance
	const completed = tweet_array.filter(t => t.source === 'completed_event');
	const withActivity = completed.filter(t => t.activityType && t.activityType !== 'unknown');
	const withDistance = withActivity.filter(t => t.distance && t.distance > 0);

	// Count activities
	const activityCounts = {};
	withActivity.forEach(t => {
		const k = t.activityType;
		activityCounts[k] = (activityCounts[k] || 0) + 1;
	});
	const distinctActivities = Object.keys(activityCounts);
	document.getElementById('numberActivities').innerText = distinctActivities.length;

	// Top three activities
	distinctActivities.sort((a, b) => activityCounts[b] - activityCounts[a]);
	const top3 = distinctActivities.slice(0, 3);
	if (top3[0]) document.getElementById('firstMost').innerText = top3[0];
	if (top3[1]) document.getElementById('secondMost').innerText = top3[1];
	if (top3[2]) document.getElementById('thirdMost').innerText = top3[2];

	// Activity frequency visualization
	const activityFreqData = distinctActivities.map(name => ({ activityType: name, count: activityCounts[name] }));
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": { "values": activityFreqData },
	  "mark": "bar",
	  "encoding": {
	    "x": { "field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type" },
	    "y": { "field": "count", "type": "quantitative", "title": "Count" },
	    "tooltip": [ {"field":"activityType"}, {"field":"count"} ]
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// Distance visualizations for top 3
	const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	const distanceData = withDistance
		.filter(t => top3.includes(t.activityType))
		.map(t => ({
			day: dayNames[t.time.getDay()],
			weekdayIndex: t.time.getDay(),
			activityType: t.activityType,
			distance: t.distance
		}));

	const rawSpec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distances by day of week for top 3 activities.",
	  "data": { "values": distanceData },
	  "mark": {"type": "point", "filled": true, "opacity": 0.5},
	  "encoding": {
	    "x": { "field": "day", "type": "ordinal", "sort": dayNames, "title": "Day of week" },
	    "y": { "field": "distance", "type": "quantitative", "title": "Distance (mi)" },
	    "color": { "field": "activityType", "type": "nominal", "title": "Activity" },
	    "tooltip": [ {"field":"activityType"}, {"field":"day"}, {"field":"distance", "type":"quantitative", "format":".2f"} ]
	  }
	};

	const aggregatedSpec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance by day of week for top 3 activities.",
	  "data": { "values": distanceData },
	  "mark": {"type": "line", "point": true},
	  "encoding": {
	    "x": { "field": "day", "type": "ordinal", "sort": dayNames, "title": "Day of week" },
	    "y": { "aggregate":"mean", "field": "distance", "type": "quantitative", "title": "Mean distance (mi)" },
	    "color": { "field": "activityType", "type": "nominal", "title": "Activity" },
	    "tooltip": [ {"field":"activityType"}, {"field":"day"}, {"aggregate":"mean", "field":"distance", "type":"quantitative", "format":".2f", "title":"Mean distance"} ]
	  }
	};

	// Single dynamic chart: start with raw points
	let showingAggregated = false;
	const distanceContainer = document.getElementById('distanceVis');
	const aggBtn = document.getElementById('aggregate');
	const renderDistanceChart = () => {
		const spec = showingAggregated ? aggregatedSpec : rawSpec;
		vegaEmbed('#distanceVis', spec, {actions:false});
		aggBtn.innerText = showingAggregated ? 'Show points' : 'Show means';
	};
	// Hide the secondary container, since we use one dynamic chart
	const aggContainer = document.getElementById('distanceVisAggregated');
	if (aggContainer) { aggContainer.style.display = 'none'; }
	renderDistanceChart();
	aggBtn.addEventListener('click', () => { showingAggregated = !showingAggregated; renderDistanceChart(); });

	// Fill spans about longest/shortest activity type and weekday/weekend
	const byActivity = {};
	distanceData.forEach(d => {
		byActivity[d.activityType] = byActivity[d.activityType] || [];
		byActivity[d.activityType].push(d.distance);
	});
	const avg = arr => arr.reduce((a,b)=>a+b,0) / (arr.length || 1);
	const averages = Object.keys(byActivity).map(name => ({ name, mean: avg(byActivity[name]) }));
	averages.sort((a,b)=>b.mean - a.mean);
	if (averages[0]) document.getElementById('longestActivityType').innerText = averages[0].name;
	if (averages[averages.length-1]) document.getElementById('shortestActivityType').innerText = averages[averages.length-1].name;

	// Weekday vs weekend for longest activities (average across top3)
	const isWeekend = (idx) => idx === 0 || idx === 6;
	const weekdayDistances = distanceData.filter(d => !isWeekend(d.weekdayIndex)).map(d => d.distance);
	const weekendDistances = distanceData.filter(d => isWeekend(d.weekdayIndex)).map(d => d.distance);
	document.getElementById('weekdayOrWeekendLonger').innerText = (avg(weekendDistances) > avg(weekdayDistances)) ? 'weekends' : 'weekdays';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});