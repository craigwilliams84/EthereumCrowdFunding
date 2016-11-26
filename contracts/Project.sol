pragma solidity ^0.4.2;

contract Project {

    struct ProjectDetails {
        bytes32 name;
        address ownerAddress;
        uint amountToBeRaised;
        uint deadlineTime;
        uint currentFundingTotal;
        ProjectStatus status;
    }

    struct Contribution {
        address contributorAddress;
        uint amountContributed;
    }

enum ProjectStatus { FUNDING, PAIDOUT, REFUNDED }

    ProjectDetails projectDetails;
    Contribution[] contributions;
    address hubAddress;

    //Note, could use tx.origin rather than passing owner address
    //but vitalik recommends not relying on tx.origin in order to be serenity-proof
    //http://ethereum.stackexchange.com/questions/196/how-do-i-make-my-dapp-serenity-proof
    function Project(bytes32 name, address ownerAddress, uint amountToBeRaised, uint deadlineTime) {
        hubAddress = msg.sender;

        projectDetails.name = name;
        projectDetails.ownerAddress = ownerAddress;
        projectDetails.amountToBeRaised = amountToBeRaised;
        projectDetails.deadlineTime = deadlineTime;
        projectDetails.currentFundingTotal = 0;
        projectDetails.status = ProjectStatus.FUNDING;
    }

    //Same as above regarding tx.origin
    function fund(address contributerAddress) onlyHub payable {
        if (projectDetails.status == ProjectStatus.PAIDOUT || projectDetails.status == ProjectStatus.REFUNDED) throw;

        uint amountToFund = msg.value;

        if(isPassedDeadline()) {
            projectDetails.status = ProjectStatus.REFUNDED;

            //Send funds back to this contributer
            sendFunds(contributerAddress, amountToFund);

            //Refund all other contributers
            refund();
        } else {
            uint overContributedAmount = 0;
            if (projectDetails.currentFundingTotal + amountToFund > projectDetails.amountToBeRaised) {
                //Funded too much
                //Refund excess
                overContributedAmount = (projectDetails.currentFundingTotal + amountToFund) - projectDetails.amountToBeRaised;

                //Recalculate amount to fund
                amountToFund = projectDetails.amountToBeRaised - projectDetails.currentFundingTotal;
            }

            addContribution(contributerAddress, amountToFund);

            if (projectDetails.amountToBeRaised == projectDetails.currentFundingTotal) {
                projectDetails.status = ProjectStatus.PAIDOUT;

                //Project has been fully funded, payout!
                payout();

                //Refund if over contributed
                if (overContributedAmount != 0) {
                    sendFunds(contributerAddress, overContributedAmount);
                }
            }
        }
    }

    function payout() private {
        sendFunds(projectDetails.ownerAddress, projectDetails.currentFundingTotal);

        ProjectFullyFunded(this);
    }

    function refund() private {
        ProjectNotFundedBeforeDeadline(this);

        for (uint i = 0; i < contributions.length; i++) {
            sendFunds(contributions[i].contributorAddress, contributions[i].amountContributed);
        }
    }

    function getProjectDetails() public returns(
        bytes32 name, address ownerAddress, uint amountToBeRaised, uint deadlineTime,
        uint currentFundingTotal, ProjectStatus status, uint numberOfContributions) {

        return (projectDetails.name,
            projectDetails.ownerAddress,
            projectDetails.amountToBeRaised,
            projectDetails.deadlineTime,
            projectDetails.currentFundingTotal,
            projectDetails.status,
            contributions.length);
    }

    function sendFunds(address recipient, uint amount) private {
        Paid(recipient, amount);

        if(!recipient.send(amount)) {
            throw;
        }
    }

    function addContribution(address contributorAddress, uint amountToFund) private {
        uint index = contributions.length;
        contributions.length++;

        contributions[index].contributorAddress = contributorAddress;
        contributions[index].amountContributed = amountToFund;

        projectDetails.currentFundingTotal += amountToFund;

        ContributionMade(this, contributorAddress, amountToFund);
    }

    function isPassedDeadline() private returns(bool) {
        return now > projectDetails.deadlineTime;
    }

    modifier onlyHub () {
        if (hubAddress != msg.sender) {
            throw;
        }
        _;
    }

    event ContributionMade(address indexed projectAddress, address indexed contributorAddress, uint amountContributed);

    event ProjectFullyFunded(address indexed projectAddress);

    event ProjectNotFundedBeforeDeadline(address indexed projectAddres);

    event Paid(address paidAddress, uint value);
}