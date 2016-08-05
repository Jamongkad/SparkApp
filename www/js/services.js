angular.module('starter.services', ['ngCordova'])
.factory('TasksSQLite', function($q, $cordovaSQLite) { 
    var _db;    
    var _tasks;

    return {
            initDB: initDB,
       getAllTasks: getAllTasks,
        createTask: createTask,
        deleteTask: deleteTask,
       getTaskById: getTaskById,
        updateTask: updateTask,
       reorderTask: reorderTask,
    };

    function initDB() {
        
        if (window.cordova) {
            _db = $cordovaSQLite.openDB({ name: "tasks.db", location: 2, createFromLocation: 1 }); //device
        } else {
            _db = window.openDatabase("tasks.db", '1', 'my', 655367); // browser
        }

        $cordovaSQLite.execute(_db, "CREATE TABLE Task (id integer primary key, title text, isfinished text, listOrder integer)");
    }

    function getAllTasks() {
        return $cordovaSQLite.execute(_db, 'SELECT * FROM Task ORDER BY listOrder ASC, id DESC');
    }

    function createTask(task) {
        return $cordovaSQLite.execute(_db, 'INSERT INTO Task (title, isfinished) VALUES (?, ?)', [task.title, task.finished]);
    }

    function updateTask(task) {
        return $cordovaSQLite.execute(_db, 'UPDATE Task SET title = ?, isfinished = ? WHERE id = ?', [task.title, task.isfinished, task.id]); 
    }

    function deleteTask(task) {
        return $cordovaSQLite.execute(_db, 'DELETE FROM Task WHERE id = ?', [task.id]);
    }

    function getTaskById(taskId) {
        return $cordovaSQLite.execute(_db, 'SELECT * FROM Task WHERE id = ?', [taskId]); 
    }

    function reorderTask(taskId, index) {
        return $cordovaSQLite.execute(_db, 'UPDATE Task SET listOrder = ? WHERE id = ?', [parseInt(index) + 1, taskId]).then(function() {
            console.log("Reorder Success!");
        }); 
    }

})
