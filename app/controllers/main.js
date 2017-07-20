
export default ['$scope', '$q', 'TwitterService', function($scope, $q, TwitterService) {

    let vm = this;

    vm.locations = [];
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
        TwitterService.searchTweets(getQueryString(), $scope.tweetCount).then(function(data){
            $scope.tweets = data.statuses;
            console.log($scope.tweets.length);
        }, function(){

        });
    };

    this.onToggle = $value => {
        // todo

    };

    const getQueryString = () => {
        for(var i = 0; i < this.queries.length; i++){
        }
    };

    const activate = () => {



    };

    activate();


    if($scope.connectedTwitter){
        //$scope.getTweets();
    }

}];