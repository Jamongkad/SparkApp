angular.module('starter.controllers')
.controller('DetailCtrl', function($scope, TasksSQLite, $ionicPlatform, $ionicPopup, $stateParams, $state) {

    $ionicPlatform.ready(function() {
        TasksSQLite.getTaskById($stateParams.taskId).then(function(task) {
            $scope.task = {
                'id': task.rows.item(0).id,
                'title': task.rows.item(0).title,
                'isfinished': (task.rows.item(0).isfinished == "true") ? true : false,
            };
        });
    });
    
    //let's check if Android. If so then render a button!
    var isAndroid = ionic.Platform.isAndroid();
    $scope.isAndroid = isAndroid;

    $scope.updateTask = function(task) {
        TasksSQLite.updateTask(task).then(function() {
            $state.go('index', {'reload':true}) ;
        });
    }

    //iOS like editing!
    var hasEdited = false;
    $scope.$watchGroup(['task.title', 'task.isfinished'], function(newValue, oldValue) { 
        oldValue.forEach(function(item, index) {
            if (typeof item != 'undefined') {
                hasEdited = true;
            }
        });
    });

    //Once edits are made save to db on switching back to dash view
    $scope.$on("$ionicView.beforeLeave", function(event, data){ 
        if(hasEdited) {
            console.log("new shit ", $scope.task);     
            if($scope.task.title != "") { 
                TasksSQLite.updateTask($scope.task).then(function() {
                    $state.go($state.current, {}, {reload: true});
                });
            }
        } 
    });
});
