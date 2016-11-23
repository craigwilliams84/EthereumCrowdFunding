angular.module('etherCrowdApp').controller('projectDetailsCtrl', ['$scope', '$routeParams', '$timeout', 'projectService', function($scope, $routeParams, $timeout, projectService){
    $scope.project = {};

    $scope.refreshProject = function() {
        $scope.project = {};
        init();
    };

    $scope.contribute = function(contributionAmount) {
        projectService.contribute($scope.project.address, contributionAmount, function(err) {
            if (err) {
                console.error(err);
            }
        });
    }

    var init = function() {
        projectService.getProjectDetails($routeParams.projectAddress, function(err, project) {
            if (err) {
                console.error(err);
            } else {
                $timeout(function() {
                    $scope.project = project;
                });
            }
        });
    };

    init();

}]);