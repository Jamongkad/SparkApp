angular.module('starter.controllers')
.directive('buttonFooter', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/button-footer.html',
        controller: function($scope, $ionicModal, $ionicPopup, TasksSQLite, $state) {
    
            $scope.newTask = {};

            $scope.tapity = function() {
                var myPop = $ionicPopup.show({
                    templateUrl: 'templates/create-task.html',
                    title: 'Create Task',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                if($scope.newTask.title) { 
                                    $scope.newTask.finished = false;
                                    TasksSQLite.initDB();
                                    TasksSQLite.createTask($scope.newTask);
                                    myPop.close();
                                    $state.go($state.current, {}, {reload: true});
                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Warning!',
                                        template: 'You must enter a task!'
                                    });     
                                }
                                e.preventDefault();
                            }
                        }
                    ]
                });
            }
        }
    };
});
