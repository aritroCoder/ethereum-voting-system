const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Voting Contract", function () {
    let contract
    let owner
    let addr1
    let addr2
    let candidateEntranceFee
    let voteFee

    beforeEach(async function () {
        let contract_factory = await ethers.getContractFactory("Voting")
        arr = await ethers.getSigners()
        owner = arr[0]
        addr1 = arr[1]
        addr2 = arr[2]
        contract = await contract_factory.deploy()
        candidateEntranceFee = await contract.getCandidateEntranceFee()
        voteFee = await contract.getVoteFee()
    })

    describe("Deployment", function () {
        it("Sets the right owner", async function () {
            expect(await contract.owner()).to.equal(owner.address)
        })
    })

    describe("Public Interactions", function () {
        it("Adds a new voter", async function () {
            await contract.addVoter()
            expect(await contract.voters(owner.address)).to.equal(1)
        })

        it("Adds a new candidate", async function () {
            await contract.addCandidate({ value: candidateEntranceFee })
            expect(await contract.getCandidateAtIndex(0)).to.equal(owner.address)
        })

        it("Does not add candidate if not sent enough wei", async function () {
            await expect(contract.addCandidate()).to.be.revertedWith(
                "Send atleast 0.001 eth to become a candidate!"
            )
        })

        it("Allows voters to vote when open", async function () {
            await contract.startVote()
            await contract.addVoter()
            await contract.addCandidate({ value: candidateEntranceFee })
            await contract.vote(owner.address, { value: voteFee })
            expect(await contract.voters(owner.address)).to.equal(2)
        })

        it("Does not allow multiple votes", async function () {
            await contract.startVote()
            await contract.addCandidate({ value: candidateEntranceFee })
            await contract.vote(owner.address, { value: voteFee })
            await expect(contract.vote(owner.address, { value: voteFee })).to.be.revertedWith(
                "You have already voted!"
            )
        })

        it("Does not allow to vote if voter not registered", async function () {
            await contract.startVote()
            await contract.addCandidate({ value: candidateEntranceFee })
            await expect(
                contract.connect(addr1).vote(owner.address, { value: voteFee })
            ).to.be.revertedWith("You have not registered!")
        })

        it("Does not allow to vote if candidate not registered", async function () {
            await contract.startVote()
            await expect(
                contract.connect(addr1).vote(owner.address, { value: voteFee })
            ).to.be.revertedWith("This candidate is not registered")
        })

        it("Does not allow to vote if not enough tokens sent", async function () {
            await contract.startVote()
            await contract.addCandidate({ value: candidateEntranceFee })
            await expect(contract.vote(owner.address)).to.be.revertedWith(
                "Send 0.0001 eth to vote!"
            )
        })

        it("Does not allow to vote if not open", async function () {
            await contract.addCandidate({ value: candidateEntranceFee })
            await expect(contract.vote(owner.address, { value: voteFee })).to.be.revertedWith(
                "Vote is not going on now"
            )
        })

        it("Does not allow to see votes if voting is going on", async function(){
            await contract.startVote()
            await contract.addCandidate({ value: candidateEntranceFee })
            await expect(contract.getVotes(owner.address)).to.be.revertedWith(
                "Vote is going on now"
            )
        })

        it("Allows to see votes if voting is not going on", async function () {
            await contract.startVote()
            await contract.addCandidate({ value: candidateEntranceFee })
            await contract.vote(owner.address, {value: candidateEntranceFee})
            await contract.publishResults()
            expect(await contract.getVotes(owner.address)).to.equal(2)
        })
    })

    describe("Internal logic", function () {
        it("Adds voted candidate to topCandidate on first vote", async function () {
            await contract.startVote()
            await contract.addCandidate({ value: candidateEntranceFee })
            await contract.vote(owner.address, { value: voteFee })
            await contract.publishResults()
            expect(await contract.getWinner()).to.equal(owner.address)
        })

        it("Updates top candidate with highest voted candidate", async function () {
            await contract.startVote()
            await contract.addCandidate({ value: candidateEntranceFee })
            await contract.connect(addr1).addCandidate({ value: candidateEntranceFee })
            await contract.connect(addr2).addVoter()
            await contract.vote(owner.address, { value: voteFee })
            await contract.connect(addr1).vote(addr1.address, { value: voteFee })
            await contract.connect(addr2).vote(addr1.address, { value: voteFee })
            await contract.publishResults()
            expect(await contract.getWinner()).to.equal(addr1.address)
        })
    })

    describe("Owner only interactions", function () {
        it("Allows owner to start vote", async function () {
            await contract.startVote()
            expect(await contract.isVoteOn()).to.equal(true)
        })

        it("Does not allow others to start vote", async function () {
            await expect(contract.connect(addr1).startVote()).to.be.revertedWith(
                "Must be called by an owner!"
            )
        })

        it("Allows owner to end vote", async function () {
            await contract.startVote()
            await contract.publishResults()
            expect(await contract.isVoteOn()).to.equal(false)
        })

        it("Does not allow others to end vote", async function () {
            await contract.startVote()
            await expect(contract.connect(addr1).publishResults()).to.be.revertedWith(
                "Only owner can call this function"
            )
        })

        it("Does not allow anyone to end vote if not started", async function () {
            await expect(contract.publishResults()).to.be.revertedWith("Vote is not going on now")
        })

        it("Sends contract balance to owner after vote is over", async function(){
            await contract.startVote()
            await contract.addCandidate({value: candidateEntranceFee})
            await contract.connect(addr1).addVoter()
            await contract.connect(addr1).vote(owner.address, {value: voteFee})
            await contract.publishResults()
            expect(await ethers.provider.getBalance(contract.address)).to.equal(0)
        })
    })
})
