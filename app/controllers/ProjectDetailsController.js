angular.module('etherCrowdApp').controller('projectDetailsCtrl', ['$scope', '$routeParams', '$timeout', 'projectService', function($scope, $routeParams, $timeout, projectService){
    $scope.project = {};
    $scope.contributeInProgress = false;
    $scope.statusHeader = {};

    $scope.refreshProject = function() {
        $scope.project = {};
        init();
    };

    $scope.contribute = function(contributionAmount) {
        setContributeInProgress(true);
        $scope.$parent.showInfoMessage("Contribution has been broadcast.  Waiting for it to be processed...");

        projectService.contribute($scope.project.address, contributionAmount, function(err) {
            setContributeInProgress(false);

            if (err) {
                console.error(err);
                $scope.$parent.showErrorMessage("There was an error when processing your contribution.");
            } else {
                $scope.refreshProject();
                $scope.$parent.showSuccessMessage("Contribution was successful!");
            }
        });
    };

    $scope.isFundable = function() {
        return $scope.project.statusCode == 0;
    };

    $scope.getDeadlineDate = function() {
        var deadlineDate = new Date($scope.project.deadlineTime * 1000);

        return deadlineDate.toString();
    }

    var init = function() {
        projectService.getProjectDetails($routeParams.projectAddress, function(err, project) {
            if (err) {
                console.error(err);
            } else {
                $timeout(function() {
                    $scope.project = project;
                    setStatusHeader();
                });
            }
        });
    };

    var setContributeInProgress = function(value) {
        $timeout(function() {
            $scope.contributeInProgress = value;
        });
    }

    var statusMappings = {0: "Open", 1 : "Completed", 2: "Expired"}

    var setStatusHeader = function() {
        $scope.statusHeader = statusMappings[$scope.project.statusCode];
    }



    init();

}]);