angular.module('etherCrowdServices', []).service('accountsService', ['$window', function($window){

    var accounts = [];
    var account = "";

    this.getBalance = function(callback) {

        web3.eth.getBalance(accounts[0], function(error, result) {
            callback(error, result);
        });
    };

    this.getMainAccount = function() {
        return accounts[0];
    };

    this.init = function(onInitialised) {
        var seed = prompt('Enter your private key seed', 'edge add ketchup champion panda pink basket develop trash capable arena fault');
        // the seed is stored in memory and encrypted by this user-defined password
        var password = prompt('Enter password to encrypt the seed', 'dev_password');

        lightwallet.keystore.deriveKeyFromPassword(password, function(err, _pwDerivedKey) {
            pwDerivedKey = _pwDerivedKey;
            ks = new lightwallet.keystore(seed, pwDerivedKey);

            // Create a custom passwordProvider to prompt the user to enter their
            // password whenever the hooked web3 provider issues a sendTransaction
            // call.
            ks.passwordProvider = function (callback) {
                var pw = prompt("Please enter password to sign your transaction", "dev_password");
                callback(null, pw);
            };

            var provider = new HookedWeb3Provider({
                // Let's pick the one that came with Truffle
                host: web3.currentProvider.host,
                transaction_signer: ks
            });
            web3.setProvider(provider);
            // And since Truffle v2 uses EtherPudding v3, we also need the line:
            FundingHub.setProvider(provider);

            // Generate the first address out of the seed
            ks.generateNewAddress(pwDerivedKey);

            accounts = ks.getAddresses();
            account = "0x" + accounts[0];
            console.log("Your account is " + accounts[0]);
            onInitialised();
        });
    };

}]);