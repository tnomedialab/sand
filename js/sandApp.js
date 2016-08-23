var sandApp = angular.module('sandApp', []);

sandApp.controller('sandDashCtrl', ['$scope', '$sce', function($scope, $sce) {
    $scope.mpd_url = $sce.trustAsResourceUrl("http://dash.edgesuite.net/dash264/TestCases/1a/sony/SNE_DASH_SD_CASE1A_REVISED.mpd");

    $scope.video = [];
    player = [];
    
    $scope.startVideo = function() {
        player.play();
    };
    
    var client_id = uuid.v4();

    // SAND channel set-up
    var ws = new WebSocket('ws://dane-demo.herokuapp.com?client_id=' + client_id);

    var DANE_connection = false;
    ws.onopen = function () {
        console.log('SAND|INFO|Connected to DANE !');
        DANE_connection = true;
    };

    // Log errors
    ws.onerror = function (e) {
        console.log('SAND|ERROR|WebSocket Error ' + e);
    };

    // Log messages from the server
    ws.onmessage = function (e) {
        console.log('SAND|INFO|DANE: ' + e.data);
    };
  
    function onError(e) {
        console.log("SAND|ERROR|" + e);
    }

    function sendMetric(e) {
        var metrics = player.getMetricsFor("video");
        if(DANE_connection) ws.send(JSON.stringify(metrics));
    }

    $scope.$watch('video', function() {
        player = dashjs.MediaPlayerFactory.create($scope.video[0]);
        player.on(dashjs.MediaPlayer.events['METRICS_CHANGED'], $.throttle(1000, sendMetric));
        player.on(dashjs.MediaPlayer.events['ERROR'], onError);
    });
}]);

sandApp.directive('dashPlayer', function() {
    function link(scope, element, attrs) {
        scope.video = element;
    }
    
    return {
        link: link,
        scope: false
    };
});
