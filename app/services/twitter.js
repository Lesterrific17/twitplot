
export default () => {
    let authorizationResult = false;

    return {

        /*  initialize OAuth.io with public key of the application  */
        initialize: () => {
            OAuth.initialize('5ySzGcSOfHjE7ouSylKxT35iklE', {
                cache: true
            });
            authorizationResult = OAuth.create("twitter");
        },

        /*  returns the Authorization object.
         *  if false / falsy, Twitter hasn't been authenticated
         *  if truthy (or object), contains the authentication
         *  response by OAuth */
        isReady: () => (authorizationResult),

        /*  connects the application to Twitter using the OAuth JS library
        *   OAuth handles the authentication process */
        connectTwitter: () =>
            new Promise((resolve, reject) => {
                OAuth.popup("twitter", {
                    cache: true
                }, function(error, result) {
                    if (!error) {
                        authorizationResult = result;
                        resolve();
                    }
                    else {
                        reject(error);
                    }
                })
            }),

        /*  clears the cached authentication cookie to reset OAuth credentials */
        clearCache: () => {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },

        /*  sends a query string to Twitter's Search API and returns the JSON response */
        searchTweets: (query, count) =>
          new Promise((resolve, reject) => {
              let url = `${TWITTER_API}?q=${query}&count=${count}`;
              authorizationResult.get(url)
                .done(resolve)
                .fail(reject);
          })
    }
}
