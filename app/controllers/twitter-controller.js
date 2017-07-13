
app.controller('TwitterController', function($scope, $q, twitterService, gmapsService) {

    $scope.search = [];

    twitterService.initialize();

    $scope.getSearchResults = function(){
        twitterService.searchTweets().then(function(data){
            $scope.search = data.statuses;
            $scope.plotTweets();
        }, function(){

        });
    }

    $scope.plotTweets = function(){
        for(var i = 0; i < $scope.search.length; i++){
            //console.log($scope.search[i].user.location);
            gmapsService.plotAddress($scope.search[i].user.location);
        }
    }

    //if the user is a returning user, retrieve the tweets
    if (twitterService.isReady()) {
        $scope.connectedTwitter = true;
        $scope.getSearchResults();
    }
    else{
        //else, authenticate the user then retrieve the tweets
        twitterService.connectTwitter().then(function() {
            console.log("Successully connected to Twitter.");
            if (twitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
                $scope.getSearchResults();
                $scope.connectedTwitter = true;
            } else {
                console.log('Error establishing connection to Twitter.');
            }
        });
    }


});
