export default ['$q', function($q) {

    var authorizationResult = false;

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('5ySzGcSOfHjE7ouSylKxT35iklE', {
                cache: true
            });
            //try to create an authorization result when the page loads,
            //this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create("twitter");
        },
        isReady: function() {
            return (authorizationResult);
        },
        connectTwitter: function() {
            var deferred = $q.defer();
            OAuth.popup("twitter", {
                cache: true
            }, function(error, result) {
                // cache means to execute the callback if the tokens are already present
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                } else {
                    //do something if there's an error

                }
            });
            return deferred.promise;
        },
        clearCache: function() {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },
        searchTweets: function(query){
            var deferred = $q.defer();
            var url = '/1.1/search/tweets.json?q=' + query + '&count=20';
            var promise = authorizationResult.get(url).done(function(data) {
                deferred.resolve(data);
            }).fail(function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }
}]