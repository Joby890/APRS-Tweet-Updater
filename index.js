var updates = 0;
var notSame = true;
var sent = false;

//Replace values below with your keys
//APRS Info
var aprskey = "";
var callsign = "";
//Twitter Info
var twitterKey = '';
var twitterSecret = '';
var twitterCallBack = ''; 
var accessToken = "";
var accessTokenSecret = "";


var getLocation = function() {
	
	client.get("http://api.aprs.fi/api/get?name="+callsign+"&what=loc&apikey="+aprskey+"&format=json", function(data, response){
    	notSame = true;
        
    	if((this.lat === data["entries"][0]["lat"])  && (this.lng === data["entries"][0]["lng"])) {
			notSame = false;
		}
   		// parsed response body as js object 
    	this.lat = data["entries"][0]["lat"];
    	this.lng = data["entries"][0]["lng"];
    	console.log("Update " + updates);
    	updates++;
   		if(notSame) {
      		sent = false;
       		sendToTwitter("~Current Location~ \n Latitude: "+this.lat + "\n Longitude: " + this.lng + "\n http://tinyurl.com/JagSat-Map \n #JagSat");
    	} else {
       		if(!sent) {
       			sent = true;
    	   		sendToTwitter("Likely over the Atlatic Ocean, updates will resume over land.");
       		}
    	}
	});
}
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: this.twitterKey,
    consumerSecret: this.twitterSecret,
    callback: this.twitterCallBack
});
var requestToken;
var requestTokenSecret;
twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
        console.log("Error getting OAuth request token : " + error);
    } else {
        this.requestToken = requestToken;
        this.requestTokenSecret = requestTokenSecret;
    }
});
var Client = require('node-rest-client').Client;
client = new Client();
var lat;
var lng;
getLocation();
setInterval(function() {
	getLocation();
}, (900000));

var sendToTwitter = function(stat) {
	if(accessToken) {
		twitter.statuses("update", {
        	status: stat
    		},
    		accessToken,
    		accessTokenSecret,
    		function(error, data, response) {
        		if (error) {
        			console.log(error);
        		} 
  			}
		);
	}

}
