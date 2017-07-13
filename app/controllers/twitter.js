export default ['$scope', '$q', 'TwitterService', 'GmapsService', function($scope, $q, TwitterService, GmapsService) {

    $scope.search = [];

    TwitterService.initialize();

    $scope.getSearchResults = function(){
        TwitterService.searchTweets().then(function(data){
            $scope.search = data.statuses;
            $scope.plotTweets();
        }, function(){

        });
    }

    $scope.plotTweets = function(){
        for(var i = 0; i < $scope.search.length; i++){
            //console.log($scope.search[i].user.location);
            GmapsService.plotAddress($scope.search[i].user.location);
        }
    }

    //if the user is a returning user, retrieve the tweets
    if (TwitterService.isReady()) {
        $scope.connectedTwitter = true;
        $scope.getSearchResults();
    }
    else{
        //else, authenticate the user then retrieve the tweets
        TwitterService.connectTwitter().then(function() {
            console.log("Successully connected to Twitter.");
            if (TwitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
                $scope.getSearchResults();
                $scope.connectedTwitter = true;
            } else {
                console.log('Error establishing connection to Twitter.');
            }
        });
    }
}];