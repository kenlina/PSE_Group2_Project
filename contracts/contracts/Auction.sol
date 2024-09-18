// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PlonkVerifier.sol";
import "./Poseidon.sol";

contract Auction{

    enum AuctionStatus { OPEN, END}

    Poseidon public poseidon;
    PlonkVerifier public verifier;

    constructor(address _poseidonAddress, address _verifierAddress) {
        poseidon = Poseidon(_poseidonAddress);
        verifier = PlonkVerifier(_verifierAddress);
    }

    struct Product{
        uint256 auctionID; 
        address seller;
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        AuctionStatus status;
    }

    struct Bid{
        address bidder;
        uint256 commitment;
    }

    uint256 public AuctionCounter;

    mapping(uint256 => Product) public products;
    mapping(uint256 => Bid[]) public bids;
    mapping(uint256 => address) public highestBidder;

    event AuctionCreated(uint256 auctionId, address seller);
    event BidSubmitted(uint256 auctionId, address bider);
    event AuctionEnded(uint256 auctionId, address winner);

    function createAuction(string memory _name, string memory _description, uint256 _startTime, uint256 _endTime) public returns (uint256){

        AuctionCounter++;

        products[AuctionCounter] = Product({
            auctionID : AuctionCounter,
            seller : msg.sender,
            name : _name,
            description : _description,
            startTime : _startTime,
            endTime : _endTime,
            status : AuctionStatus.OPEN
        });

        emit AuctionCreated(AuctionCounter, msg.sender);
        return AuctionCounter;
    }

    function summitBid(uint256 _auctionID, bytes memory proof, uint[] memory pubSignals, uint256 _commitment) public{

        require(verifier.verifyProof(proof, pubSignals),"Invaild");

        bids[_auctionID].push(
            Bid({
                bidder : msg.sender,
                commitment : _commitment
            })
        );

        emit BidSubmitted(_auctionID, msg.sender);
    }

    function revealBids(uint256 _auctionID, uint256 _revealedBid, uint256 _randomNum) public{

        uint256 highestBidValue;
        address winner;

        for(uint256 i = 0; i < bids[_auctionID].length; i++){
            Bid storage bid = bids[_auctionID][i];

            uint256 bidValue = recoverBidValue(bid.commitment, _revealedBid, _randomNum);

            if(bidValue > highestBidValue){
                highestBidValue = bidValue;
                winner = bid.bidder;
            }
        }

        highestBidder[_auctionID] = winner;
        products[_auctionID].status = AuctionStatus.END;

        emit AuctionEnded(_auctionID, winner);
    }

    function recoverBidValue(uint256 _commitment, uint256 _revealedBid, uint256 randomNum) internal view returns(uint256){
        
        
        uint256 Commitment = poseidon.hash([_revealedBid, randomNum]);
        
        require(Commitment == _commitment, "Invaild");

        return _revealedBid;
   
    }
}
