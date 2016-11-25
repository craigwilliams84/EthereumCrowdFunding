angular.module('etherCrowdServices').service('projectService', ['accountsService', function(accountsService){
    this.createProject = function(projectName, fundingTargetInWei, deadlineTimeInSecs, callback) {
        var fundingHub = FundingHub.deployed();

        fundingHub.createProject(web3.fromAscii(projectName), fundingTargetInWei, deadlineTimeInSecs, {from: accountsService.getMainAccount(),
            gas: 300000, gasPrice: web3.eth.gasPrice.toString(10)}).then(function() {
            callback();
        }).catch(function(e) {
            callback(e);
        });
    };

    this.contribute = function(projectAddress, amountToContribute, callback) {
        var fundingHub = FundingHub.deployed();

        fundingHub.contribute("0x" + projectAddress, {value: amountToContribute, from: accountsService.getMainAccount(),
            gas: 300000, gasPrice: web3.eth.gasPrice.toString(10)}).then(function() {
            callback();
        }).catch(function(e) {
            callback(e);
        });
    };

    this.getProjects = function(callback) {
        var fundingHub = FundingHub.deployed();

        var projectCreatedEvent = fundingHub.ProjectCreated({},{fromBlock: 0, toBlock: web3.eth.getBlockNumber()});

        projectCreatedEvent.get(function(err, logs) {
            if (err) {
                callback(err);
            } else {
                var projects = new Set();

                logs.forEach(function(log) {
                    projects.add(createProject(
                        log.args.projectAddress,
                        log.args.projectName,
                        log.args.ownerAddress,
                        log.args.amountToBeRaised,
                        log.args.deadlineTime));
                });

                callback(null, [...projects.values()]);
            }
        });
    };

    this.getProjectDetails = function(projectAddress, callback) {
        var project = Project.at(projectAddress);

        project.getProjectDetails.call().then(function(projectDetails) {
            console.log(projectDetails[0]);
            callback(null, {
                'address': projectAddress,
                name: web3.toAscii(projectDetails[0]),
                ownerAddress: projectDetails[1],
                amountToBeRaised: projectDetails[2],
                deadlineTime: projectDetails[3],
                currentFundingTotal: projectDetails[4],
                statusCode: projectDetails[5],
                numberOfContributions: projectDetails[6]});
        }).catch(function(err) {
            callback(err);
        });
    };

    var createProject = function(projectAddress, projectName, ownerAddress, amountToBeRaised, deadlineTime) {
        return {'address' : projectAddress,
            'name' : web3.toAscii(projectName),
            'ownerAddress' : ownerAddress,
            'amountToBeRaised' : amountToBeRaised,
            'deadlineTime' : deadlineTime};
    };
}]);