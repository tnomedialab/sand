var sandApp = angular.module('sandApp', []);

sandApp.controller('sandDashCtrl', ['$scope', '$sce', function($scope, $sce) {
    $scope.mpd_url = $sce.trustAsResourceUrl("http://dash.edgesuite.net/dash264/TestCases/1a/sony/SNE_DASH_SD_CASE1A_REVISED.mpd");

    //var client_id = uuid.v4();
    var client_id = "allo-123";

    // SAND channel set-up
    var ws = new WebSocket('ws://localhost:8080?client_id=' + client_id);

    var DANE_connection = false;
    ws.onopen = function () {
        console.log('DASH|INFO|Connected to DANE !');
        DANE_connection = true;
    };

    // Log errors
    ws.onerror = function (e) {
        console.log('DASH|WebSocket Error ' + e);
    };

    // Log messages from the server
    ws.onmessage = function (e) {
        console.log('DASH|DANE: ' + e.data);
    };
  
    function onError(e) {
        console.log("DASH|ERROR|" + e);
    }

    /*function metricChanged(e) {
        var metrics = player.getMetricsFor("video");
        console.log(metrics);
        if(DANE_connection) ws.send(JSON.stringify(metrics));
    }*/
}]);

sandApp.directive('dashPlayer', function() {
    function link(scope, element, attrs) {
        var player = dashjs.MediaPlayerFactory.create(element);
        //player.addEventListener(MediaPlayer.events.ERROR, onError.bind(this));
        //player.addEventListener(MediaPlayer.events.METRIC_CHANGED, $.throttle(1000, metricChanged.bind(this)) );
    }
    
    return {
        link: link
    };
});
