angular.module('etherCrowdApp').controller('createProjectCtrl', ['$scope', '$routeParams', '$timeout', 'projectService', function($scope, $routeParams, $timeout, projectService){

    $scope.createProject = function(name, fundingTarget, deadline) {
        projectService.createProject(name, fundingTarget, deadline, function(err) {

            if(err) {
                console.log(err);
            } else {
                console.log("Project created!");
            }
        });
    };

}]);