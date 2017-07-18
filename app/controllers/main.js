
export default ['$scope', '$q', 'TwitterService', function($scope, $q, TwitterService){

    $scope.locations = [];
    $scope.tweets = [];
    $scope.queries = [];
    $scope.tweetCount = 100;

    TwitterService.initialize();

    if (TwitterService.isReady()) {
        $scope.connectedTwitter = true;
    }
    else{
        TwitterService.connectTwitter().then(function() {
            if (TwitterService.isReady()) {
                $scope.connectedTwitter = true;
            } else {

            }
        });
    }

    /*  retrieves tweets relevant to the query string
        using Twitter's Search API   */
    $scope.getTweets = function(){
        TwitterService.searchTweets('manila', $scope.tweetCount).then(function(data){
            $scope.tweets = data.statuses;
            //console.log($scope.tweets);
            //organizeTweets();
        }, function(){

        });
    };

    /*  builds the URL query string (to be sent to Twitter's Search API)
        from the array of queries   */
    function buildQueryString(){

    }

    function organizeTweets(){
        for(var i = 0; i < $scope.tweets.length; i++){
            if($scope.tweets[i].coordinates != null){
                console.log($scope.tweets[i].coordinates);
            }
            if($scope.tweets[i].place != null){
                console.log($scope.tweets[i].place);
            }
        }
    }

}];