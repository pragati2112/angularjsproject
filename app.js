console.log("App.js loaded");
var myapp = angular.module('myModule',[])
.controller('myController',function($scope,$http){
    console.log("myController loaded");
    function loadSchools(){
        $http({
            method:'GET',
            url:'http://localhost:4202/api/schools'
        }).then(function(response)
        {
            console.log(response);
            $scope.schools = response.data.docs;
        });
    }
    loadSchools();
});



    