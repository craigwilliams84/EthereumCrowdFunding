pragma solidity ^0.4.2;
import "Project.sol";

contract FundingHub {
    uint currentProjectIndex = 0;

    mapping(address => Project) projects;

    function createProject(bytes32 name, uint amountToBeRaised, uint deadlineTime) external {
        Project newProject = new Project(name, msg.sender, amountToBeRaised, deadlineTime);
        projects[address(newProject)] = newProject;

        ProjectCreated(address(newProject), name, msg.sender, amountToBeRaised, deadlineTime);
    }

    function contribute(address projectAddress) external payable {
        projects[projectAddress].fund.value(msg.value)(msg.sender);
    }

    event ProjectCreated(address indexed projectAddress, bytes32 projectName, address indexed ownerAddress, uint amountToBeRaised, uint deadlineTime);
}