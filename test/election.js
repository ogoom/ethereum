var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts){
    var electionInstance;

    it("initializes with three candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 3);
        });
    });

    it("initializes the candidates with correct values", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0], 1, "contains the correct Id");
            assert.equal(candidate[1], "Candidate 1", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct voteCount");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0], 2, "contains the correct Id");
            assert.equal(candidate[1], "Candidate 2", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct voteCount");
            return electionInstance.candidates(3);
        }).then(function(candidate){
            assert.equal(candidate[0], 3, "contains the correct Id");
            assert.equal(candidate[1], "Candidate 3", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct voteCount");
        });
    });

    it("Allows a voter to cast a vote", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, {from: accounts[0]});
        }).then(function(receipt){
            return electionInstance.voted(accounts[0]);
        }).then(function(voted){
            assert(voted, "The voter was marked voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "Increments the candidate's vote count");
        })
        
    });

    it("Throws exception for invalid candidates", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.vote(99, {from: accounts[1]});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, "error must contain revert")
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "Candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount, 1, "Candidate 2 did not receive any votes");
            return electionInstance.candidates(3);
        }).then(function(candidate3){
            var voteCount = candidate3[2];
            assert.equal(voteCount, 1, "Candidate 3 did not receive any votes");
        });
        
    });

    it("Throws exception for double voting", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId, {from: accounts[1]});
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "accepts first vote");
            return electionInstance.vote(candidateId, {from: accounts[1]});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, "error must contain revert")
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "Candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount, 1, "Candidate 2 did not receive any votes");
            return electionInstance.candidates(3);
        }).then(function(candidate3){
            var voteCount = candidate3[2];
            assert.equal(voteCount, 1, "Candidate 3 did not receive any votes");
        });
        
    });

});