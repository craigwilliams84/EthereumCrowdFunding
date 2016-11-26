angular.module('etherCrowdApp').controller('createProjectCtrl', ['$scope', '$routeParams', '$timeout', 'projectService', function($scope, $routeParams, $timeout, projectService){

    $scope.creationInProgress = false;

    $scope.createProject = function(name, fundingTarget, durationInDays) {
        setCreationInProgress(true);
        $scope.$parent.showInfoMessage("Your project creation request has been broadcast.  Waiting for it to be processed...");

        projectService.createProject(name, fundingTarget, secondsAtDaysInFuture(durationInDays), function(err) {
            setCreationInProgress(false);

            if(err) {
                console.log(err);
                $scope.$parent.showErrorMessage("There was an error when processing your project creation request.");
            } else {
                console.log("Project created!");
                $scope.$parent.showSuccessMessage("Your project was created successfully!");
            }
        });
    };

    var setCreationInProgress = function(value) {
        $timeout(function() {
            $scope.creationInProgress = value;
        });
    };

    var secondsAtDaysInFuture = function(days) {
        var seconds = days * 24 * 60 * 60

        return new Date().getTime() / 1000 + seconds;
    }

}]);