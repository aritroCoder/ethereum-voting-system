//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Voting{
    mapping(address=>uint) public voters;
    mapping(address=>uint) private candidates;
    address[] public candidateAddr;
    address[] public voterAddr;
    address private topCandidate;
    address public owner;
    uint256 public min_wei_for_candidate = 1e15;
    uint256 public min_wei_for_vote = 1e14;
    bool public isVoteOn = false;

    constructor(){
        owner = msg.sender;
    }

    // map initializations are done by 1 as solidity by default initializes to zero
    // user interaction functions
    function addVoter() external{
        require(voters[msg.sender]==0, "You are already a voter");
        voters[msg.sender] = 1;
        voterAddr.push(msg.sender);
    }

    function addCandidate() external payable{
        require(msg.value >= min_wei_for_candidate, "Send atleast 0.001 eth to become a candidate!");
        candidates[msg.sender] = 1;
        voters[msg.sender] = 1;
        candidateAddr.push(msg.sender);
        voterAddr.push(msg.sender);
    }

    function vote(address addr) external payable{
        require(isVoteOn==true, "Vote is not going on now");
        require(msg.value >= min_wei_for_vote, "Send 0.0001 eth to vote!");
        require(candidates[addr]>0, "This candidate is not registered");
        if(voters[msg.sender]==0){
            revert("You have not registered!");
        }
        require(voters[msg.sender]==1, "You have already voted!");
        candidates[addr] += 1;
        voters[msg.sender] = 2;
        calculateTopCandidate(addr);
    }

    // internal functions
    function calculateTopCandidate(address addr) internal{
        if(candidates[addr]>candidates[topCandidate]){
            topCandidate = addr;
        }
    }

    // restricted functions
    function startVote() external{
        require(msg.sender==owner, "Must be called by an owner!");
        isVoteOn = true;
    }

    function publishResults() external payable{
        require(isVoteOn==true, "Vote is not going on now");
        require(msg.sender==owner, "Only owner can call this function");
        isVoteOn = false;
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    //getters
    function getCandidateEntranceFee() view external returns (uint256){
        return min_wei_for_candidate;
    }

    function getVoteFee() view external returns (uint256){
        return min_wei_for_vote;
    }

    function getVotes(address addr) view external returns (uint256){
        require(isVoteOn==false, "Vote is going on now");
        return candidates[addr];
    }

    function getVoters() view external returns (address[] memory){
        return voterAddr;
    }

    function getCandidates() view external returns(address[] memory){
        return candidateAddr;
    }

    function getCandidateAtIndex(uint256 i) view external returns(address){
        return candidateAddr[i];
    }

    function getWinner() view external returns(address){
        require(isVoteOn==false, "Vote is going on now");
        return topCandidate;
    }

}
