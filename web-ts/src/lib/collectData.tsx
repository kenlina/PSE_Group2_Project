"use server"

interface UserBid {
    index: number;
    bid: string;
    random: string;
}

interface RevealBid {
    revealedBid: string;  // Solidity 的 uint256 對應 TypeScript 的 string
    randomNum: string;  // Solidity 的 uint256 對應 TypeScript 的 string
}

let bids: UserBid[] = [];


export async function open(userbid: UserBid, BidsNum: number): Promise<RevealBid[] | null> {
    bids.push(userbid);
    console.log("Current bids:", bids);
    console.log("Expected number of bids:", BidsNum);
    console.log("Current number of bids:", bids.length);

    if (bids.length == BidsNum) {
        console.log("All bids received, assembling...");

        const sortedBids = bids.sort((a, b) => a.index - b.index);
        const revealBids: RevealBid[] = sortedBids.map(bid => ({
            revealedBid: bid.bid,
            randomNum: bid.random
        }));
        bids = [];
        console.log("Assembled reveal bids array:", revealBids);
        return revealBids;
    } else {
        console.log("Error: Number of bids does not match the expected number.");
        return null;
    }
}