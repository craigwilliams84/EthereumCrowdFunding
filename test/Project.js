//'Hub' address: accounts[0]
//Project owner address: accounts[1]
//Deadline is 5 seconds in future
contract('Project in isolation', function(accounts) {

    it("should be able to fund a project", redeploy(accounts, function(done, project){
        return project.fund(accounts[2], {from: accounts[0], value: 5000, gas: 300000}).then(function() {
            done();
        })
    }));

    it("should not be able to fund a from non-hub address", redeploy(accounts, function(done, project){
        return project.fund(accounts[2], {from: accounts[5], value: 5000, gas: 300000}).then(function() {
            done("Funding from non hub account did not throw!");
        }).catch(function(err) {
            //Error is expected
            done();
        });
    }));

    it("should pay funds to project owner on funding completion", redeploy(accounts, function(done, project){
        var originalOwnerBalance = web3.eth.getBalance(accounts[1]);
        return project.fund(accounts[2], {from: accounts[0], gas: 300000, value: 5000}).then(function() {
            return project.fund(accounts[3], {from: accounts[0], gas: 300000, value: 3000});
        }).then(function() {
            return project.fund(accounts[4], {from: accounts[0], gas: 300000, value: 2000});
        }).then(function() {
            var newOwnerBalance = web3.eth.getBalance(accounts[1]);
            assert.equal(newOwnerBalance.toString(), originalOwnerBalance.plus(10000).toString(), "Project balance not paid to owner on funding completion");
            done();
        }).catch(function(err) {
            done(err);
        });
    }));

    it("should refund contributions when deadline has passed", redeploy(accounts, function(done, project){
        var originalOwnerBalance = web3.eth.getBalance(accounts[1]);
        var originalAccount2Balance = web3.eth.getBalance(accounts[2]);
        var originalAccount3Balance = web3.eth.getBalance(accounts[3]);
        var originalAccount4Balance = web3.eth.getBalance(accounts[4]);
        var originalAccount5Balance = web3.eth.getBalance(accounts[5]);
        return project.fund(accounts[2], {from: accounts[0], gas: 300000, value: 5000}).then(function() {
            return project.fund(accounts[3], {from: accounts[0], gas: 300000, value: 3000});
        }).then(function() {
            return project.fund(accounts[4], {from: accounts[0], gas: 300000, value: 1000});
        }).then(function() {
            return sleep(5000);
        }).then(function() {
            return project.fund(accounts[5], {from: accounts[0], gas: 300000, value: 1000});
        }).then(function() {
            var newAccount2Balance = web3.eth.getBalance(accounts[2]);
            var newAccount3Balance = web3.eth.getBalance(accounts[3]);
            var newAccount4Balance = web3.eth.getBalance(accounts[4]);
            var newAccount5Balance = web3.eth.getBalance(accounts[5]);

            assert.equal(getBalance(2).toString(), originalAccount2Balance.plus(5000).toString(), "Account 2 balance not refunded");
            assert.equal(newAccount3Balance.toString(), originalAccount3Balance.plus(3000).toString(), "Account 3 balance not refunded");
            assert.equal(newAccount4Balance.toString(), originalAccount4Balance.plus(1000).toString(), "Account 4 balance not refunded");
            assert.equal(newAccount5Balance.toString(), originalAccount5Balance.plus(1000).toString(), "Account 5 balance not refunded");
            done();
        }).catch(function(err) {
            done(err);
        });
    }));

    it("should refund excess on overfunding", redeploy(accounts, function(done, project){
        var originalOwnerBalance = web3.eth.getBalance(accounts[1]);
        var originalOverFunderBalance = web3.eth.getBalance(accounts[4]);
        return project.fund(accounts[2], {from: accounts[0], gas: 300000, value: 5000}).then(function() {
            return project.fund(accounts[3], {from: accounts[0], gas: 300000, value: 3000});
        }).then(function() {
            return project.fund(accounts[4], {from: accounts[0], gas: 300000, value: 6000});
        }).then(function() {
            var newOwnerBalance = web3.eth.getBalance(accounts[1]);
            var newOverFunderBalance = web3.eth.getBalance(accounts[4]);
            assert.equal(newOwnerBalance.toString(), originalOwnerBalance.plus(10000).toString(), "Incorrect value paid to owner on funding completion");
            assert.equal(newOverFunderBalance.toString(), originalOverFunderBalance.plus(4000).toString(), "Over funder not refunded correctly");
            done();
        }).catch(function(err) {
            done(err);
        });
    }));

    it("should report correct project details", redeploy(accounts, function(done, project){
        return project.fund(accounts[2], {from: accounts[0], value: 4000, gas: 300000}).then(function() {
            return project.getProjectDetails.call();
        }).then(function(details) {
            assert.equal("Test Project", toAscii(details[0]));
            assert.equal(accounts[1], details[1]);
            assert.equal(10000, details[2]);
            assert.equal(2479903709, details[3]);
            assert.equal(4000, details[4]);
            assert.equal(0, details[5]);
            assert.equal(1, details[6]);
            done();
        }).catch(function(err) {
            done(err);
        });
    }, 2479903709));

    function getBalance(accountId) {
        return web3.eth.getBalance(accounts[accountId]);
    }
});

function redeploy(accounts, testFunction, deadlineTime) {
    var wrappedFunction = function(done) {
        if (!deadlineTime) {
            //5 seconds in the future
            deadlineTime = (new Date().getTime() / 1000) + 5;
        }
        return Project.new(fromAscii("Test Project"), accounts[1], 10000, deadlineTime, { from: accounts[0] }).then(function (newProject) {
            console.log("Deployed with deadline: " + deadlineTime);
            return testFunction(done, newProject);
        });
    }

    return wrappedFunction;
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function fromAscii(str, padding) {
    var hex = '0x';
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }
    return hex + '0'.repeat(padding*2 - hex.length + 2);
}

function toAscii(hex) {
    var str = '',
        i = 0,
        l = hex.length;
    if (hex.substr(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i+=2) {
        var code = parseInt(hex.substr(i, 2), 16);
        if (code === 0) continue; // this is added
        str += String.fromCharCode(code);
    }
    return str;
}