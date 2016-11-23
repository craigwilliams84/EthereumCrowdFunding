angular.module('etherCrowdApp').controller('projectListCtrl', ['$scope', '$routeParams', '$timeout', 'projectService', function($scope, $routeParams, $timeout, projectService){
    $scope.projects = [];

    $scope.refreshProjects = function() {
        $scope.projects = [];
        init();
    };

    var init = function() {
        projectService.getProjects(function(err, projects) {
            if (err) {
                console.error(err);
            } else {
                $timeout(function() {
                    $scope.projects = projects;
                });
            }
        });
    };

    init();

}]);