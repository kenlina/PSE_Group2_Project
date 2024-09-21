# Specification of project

## Introduction

Construct a zero-knowledge auction system where the bid amounts from buyers are not disclosed before the deadline (submitted to the smart contract via a commitment scheme). Before submitting their commitments, buyers must prove that their bid is above the reserve price. The smart contract will verify the validity of these proofs. After the deadline, the commitments must be opened to allow the smart contract to determine the winner (the highest bidder). The smart contract will then handle the subsequent transaction process.

![image](./flow.png)

## User

#### Seller

-   only one person
-   set reserve price
-   set deadline
-   set product name

#### Bidder

-   could be many people
-   need to bid a valid amount
-   generate commitment for bid amount
-   generate proof for valid bid (greater than reserve price)
-   open the commitment after deadline

## Frontend

### Main page

Provide an interface that allows users to connect to their Ethereum address.

### After connecting

#### Provide a page for users to choose their role ( seller or bidder )

- Page after selecting a Seller
    -Allows the Seller to auction items, requiring entry of the product name, reserve price, and deadline.
- Page after selecting a Bidder
    -Displays all currently ongoing auctions; selecting any item allows entry to the bidding page for that item.
    -Upon entering the specific item's bidding page, the bidder must enter a bid amount, generate a commitment for that amount, then produce a zk proof, and submit the commitment & proof to the backend.   

### Bid Commitment computation

On the client side, first generate a random number, then calculate the hash using the bid amount and the random number r.

```c=
commiment = poseidon("Bid amount", r)
```

> The random number r must be stored on the client side in some form that remains undisclosed to others, as it conceals the bid amount, but it is currently unclear how to store it.

## Backend

- After the main page sends a request to connect to Ethereum, this client should be connected to their Ethereum account.
- If a Seller adds a new product, all the auction item's information should be recorded on the contract so all buyers can see it.
- After a User selects Bidder, the page lists all the bid-eligible items currently on the contract (that have not yet reached their Deadline).
- After a Bidder places a bid on a specific item, the commitment & proof should be submitted to the contract.
- When the Deadline is reached, all bidders should be notified to open their bids, and trigger the contract’s closing function to generate the winner.

## Smart Contract

- The above needs to record all items in auction as well as all the commitments and proofs submitted for bids.
- There should be a function to receive new auction items from Sellers.
- There should be a function to process bids for specific items.
- There should be a function that can be called after the Deadline to handle the closing of bids, deciding the highest bid based on all the bid amounts received (from the amounts revealed after opening all initial commitments) and proceeding with the transaction with the winner.

## ZK Circuit

### Private Input

-   User's random number r
-   User's bid amount

### Public Input

-   Reserve bid
-   commitment
    > The hash function used to generate the commitment is by default Poseidon.

### Proving Content

- The hash generated from the bid amount and random number r indeed equals the commitment.
- The bid amount is greater than the reserve price.