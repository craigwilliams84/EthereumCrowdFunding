module.exports = function(deployer) {
    deployer.deploy(FundingHub).then(function() {
        FundingHub.deployed().createProject(0x546573742050726f6a656374, 10000, new Date().getTime() + 604800000);
    });

};