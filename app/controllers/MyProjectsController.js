angular.module('etherCrowdApp').controller('myProjectsCtrl', ['$scope', '$routeParams', '$timeout', 'projectService', function($scope, $routeParams, $timeout, projectService){
    $scope.projects = [];

    $scope.refreshL = function() {
        $scope.projects = [];
        init();
    };

    var init = function() {
        projects = projectService.getProjects();
    };

    init();

}]);