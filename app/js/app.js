var app = angular.module('etherCrowdApp', ['ngRoute', 'etherCrowdServices']);

app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/projects/', {
            templateUrl: 'projects.html',
            controller: 'projectListCtrl'
        }).when('/projectDetails/:projectAddress', {
        templateUrl: 'projectDetails.html',
        controller: 'projectDetailsCtrl'
    }).when('/createProject/', {
        templateUrl: 'createProject.html',
        controller: 'createProjectCtrl'
    }).when('/myProjects/', {
        templateUrl: 'myProjects.html',
        controller: 'myProjectsCtrl'
    }).otherwise({redirectTo : '/projects/'});
    $locationProvider.html5Mode(false);
}]);

app.controller("etherCrowdCtrl", [ '$scope', '$timeout', 'accountsService', function($scope, $timeout, accountsService) {
    $scope.balance = "";

    $scope.infoMessage = "";
    $scope.successMessage="";
    $scope.errorMessage="";

    $scope.refreshBalance = function() {
        accountsService.getBalance(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                $timeout(function() {
                    $scope.balance = result;
                });
            }
        });
    };

    $scope.showInfoMessage = function(message) {
        setMessages(message, "", "");
    };

    $scope.showSuccessMessage = function(message) {
        setMessages("", message, "");
    };

    $scope.showErrorMessage = function(message) {
        setMessages("", "", message);
    };

    var setMessages = function(info, success, error) {
        $timeout(function() {
            $scope.infoMessage = info;
            $scope.successMessage = success;
            $scope.errorMessage = error;
        });
    }

    accountsService.init(function() {
        $scope.refreshBalance();
    });

    $scope.$on('$locationChangeStart', function(event) {
        setMessages("", "", "");
    });
}]);
