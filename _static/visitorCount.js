// Save this as visitorCount.js and place it in the _static folder

// Load the Google Analytics API client library
gapi.load('client', start);

function start() {
  gapi.client.init({
    'apiKey': 'G-NXLDEYRREC',
    'discoveryDocs': ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    return gapi.client.request({
      'path': 'https://analyticsreporting.googleapis.com/v4/reports:batchGet',
      'method': 'POST',
      'body': {
        "reportRequests": [
          {
            "viewId": "YOUR_VIEW_ID",
            "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
            "metrics": [{"expression": "ga:sessions"}]
          }
        ]
      }
    })
  }).then(function(response) {
    var count = response.result.reports[0].data.totals[0].values[0];
    document.getElementById('visitorCount').innerText = count;
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
}
