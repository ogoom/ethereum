pragma solidity ^0.4.23;

contract Election{
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    event votedEvent(
        uint indexed _candidateId
    );

    uint public abc;
    mapping (uint=>Candidate) public candidates;
    mapping (address=>bool) public voted;

    uint public candidatesCount;
    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
        addCandidate("Candidate 3");

    }

    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId)  public {
        require(voted[msg.sender] == false);
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        voted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }

    function pcp(uint a) public {
        abc = a*5;
    }
}