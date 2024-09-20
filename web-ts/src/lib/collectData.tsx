"use server"
import { provider, contractABI, contractAddress } from "./ethereum";
import { ethers } from "ethers";
interface UserBid {
    user: string;
    bid: string;
    random: string;
}


let bids: UserBid[] = [];


export async function open(userbid: UserBid, BidsNum: number) {
    
    bids.push(userbid);
    console.log(bids);
    console.log("bids num: ", BidsNum);
    console.log(bids.length);
    if(bids.length == BidsNum){
        console.log("assemble!");
    }
}