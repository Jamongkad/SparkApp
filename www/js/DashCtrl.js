angular.module('starter.controllers')
.controller('DashCtrl', function($scope, TasksSQLite, $ionicPlatform, $ionicPopup, $ionicLoading) {

    $scope.shouldShowReorder = false;

    $scope.tasks = [];
    $ionicPlatform.ready(function() {
        loadData();
    });

    function loadData() { 
        var myTasks = [];
        $scope.tasks = null; 
        TasksSQLite.getAllTasks().then(function(tasks) {
             for(var x = 0; x < tasks.rows.length; x++) {
                console.log("Title: " + tasks.rows.item(x).title + ", isFinished: " + tasks.rows.item(x).isfinished + ", id: " + tasks.rows.item(x).id + ", order: " + tasks.rows.item(x).listOrder);
                var data = {
                    'id': tasks.rows.item(x).id, 
                    'title': tasks.rows.item(x).title, 
                    'isFinished': (tasks.rows.item(x).isfinished == "true") ? true : false,
                };
                myTasks.push(data);
            } 
            $scope.tasks = myTasks;
        });
    }

    $scope.deleteTask = function(task) {
         var confirmPopup = $ionicPopup.confirm({
             title: 'Delete this Task?',
             template: 'Are you sure you want to delete this task?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                TasksSQLite.deleteTask(task).then(function() {     
                    $scope.tasks.splice($scope.tasks.indexOf(task), 1);
                });
            } else {
                console.log('You are not sure');
            }
        });
    }

    $scope.reorderList = function(item, fromIndex, toIndex) {
        $scope.tasks.splice(fromIndex, 1);
        $scope.tasks.splice(toIndex, 0, item);     
        $scope.tasks.forEach(function(item, index) {
            console.log(item);
            console.log(index);
            TasksSQLite.reorderTask(item.id, index);
        });
    }

    $scope.toggleReorder = function() {
        $scope.shouldShowReorder = !$scope.shouldShowReorder;
    }

    $scope.updateTaskStatus = function(task) {
        //this is hacky as fuck...
        var isFinished = task.isFinished;
        if(isFinished) {
            isFinished = false;     
        } else {
            isFinished = true;     
        }

        var newData = {
            'id': task.id,
            'isfinished': isFinished, 
            'title': task.title,
        };

        TasksSQLite.updateTask(newData).then(function() {
            console.log("Status Update Successful");
        });
    }
})
