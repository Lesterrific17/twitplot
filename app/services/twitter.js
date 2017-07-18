
export default['$q', function($q){

    var authorizationResult = false;

    return {

        /*  initialize OAuth.io with public key of the application  */
        initialize: function(){
            OAuth.initialize('5ySzGcSOfHjE7ouSylKxT35iklE', {
                cache: true
            });
            authorizationResult = OAuth.create("twitter");
        },

        isReady: function(){
            return (authorizationResult);
        },

        connectTwitter: function() {
            var deferred = $q.defer();
            OAuth.popup("twitter", {
                cache: true
            }, function(error, result) {
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                } else {

                }
            });
            return deferred.promise;
        },

        clearCache: function() {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },

        searchTweets: function(query, count){
            var deferred = $q.defer();
            var url = '/1.1/search/tweets.json?q=' + query + '&count=' + count;
            var promise = authorizationResult.get(url).done(function(data) {
                deferred.resolve(data);
            }).fail(function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

    }

}];