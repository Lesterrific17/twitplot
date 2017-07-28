
export default['$q', function($q){

    let authorizationResult = false;

    return {

        /*  initialize OAuth.io with public key of the application  */
        initialize: function(){

            OAuth.initialize('5ySzGcSOfHjE7ouSylKxT35iklE', {
                cache: true
            });
            authorizationResult = OAuth.create("twitter");

        },

        /*  returns the Authorization object.
         *  if false / falsy, Twitter hasn't been authenticated
         *  if truthy (or object), contains the authentication
         *  response by OAuth */
        isReady: function(){
            return (authorizationResult);
        },

        /*  connects the application to Twitter using the OAuth JS library
        *   OAuth handles the authentication process */
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

        /*  clears the cached authentication cookie to reset OAuth credentials */
        clearCache: function() {

            OAuth.clearCache('twitter');
            authorizationResult = false;

        },

        /*  sends a query string to Twitter's Search API and returns the JSON response */
        searchTweets: function(query, count) {

            let deferred = $q.defer();
            let url = TWITTER_API + `?q=${query}&count=${count}`;

            let promise = authorizationResult.get(url).done(function(data) {
                deferred.resolve(data);
            }).fail(function(err) {
                deferred.reject(err);
            });

            return deferred.promise;

        }

    }

}];