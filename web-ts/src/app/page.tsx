"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContract } from '../lib/useContract';
import {} from "../lib/proof"

export default function Home() {
    const router = useRouter();
    const { contract, loading, auctionCounter } = useContract();
    const [creating, setCreating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [revealing, setRevealing] = useState(false);

    const create = async (name, description, startTime, endTime, startPrice) => {
        if (!contract) {
            console.error("Contract is not initialized.");
            return;
        }
        try {
            setCreating(true);
            const tx = await contract.createAuction(name, description, startTime, endTime, startPrice);
            await tx.wait();
            console.log('Auction Created: ', tx);
            setCreating(false);
        } catch (error) {
            console.error("Failed to create auction:", error);
            setCreating(false);
        }
    };

    const submitBid = async (auctionID, proof, pubSignals, commitment) => {
        if (!contract) {
            console.error("Contract is not initialized.");
            return;
        }
        try {
            setSubmitting(true);
            const tx = await contract.submitBid(auctionID, proof, pubSignals, commitment);
            await tx.wait();
            console.log('Bid Submitted');
            setSubmitting(false);
        } catch (error) {
            console.error("Failed to submit bid:", error);
            setSubmitting(false);
        }
    };

    const revealBids = async (auctionID, revealedBid, randomNum) => {
        if (!contract) {
            console.error("Contract is not initialized.");
            return;
        }
        try {
            setRevealing(true);
            const tx = await contract.revealBids(auctionID, revealedBid, randomNum);
            await tx.wait();
            console.log('Bids Revealed');
            setRevealing(false);
        } catch (error) {
            console.error("Failed to reveal bids:", error);
            setRevealing(false);
        }
    };
    

    return (
        <div className="p-4 max-w-lg mx-auto">
            {!loading ? (
                <div className="space-y-2">
                    <h1>Auction Num: {auctionCounter}</h1>
                    <button disabled={creating} onClick={() => create("Product Name", "Description here", Date.now(), Date.now() + 10000, 10)}>
                        {creating ? "Creating..." : "Create Auction"}
                    </button> <br></br>
                    <button disabled={submitting} onClick={() => submitBid(1, "proofHere", ["pubSignal1"], 12345)}>
                        {submitting ? "Submitting..." : "Submit Bid"}
                    </button><br></br>
                    <button disabled={revealing} onClick={() => revealBids(1, 123, 456)}>
                        {revealing ? "Revealing..." : "Reveal Bids"}
                    </button>
                </div>
                
            ) : (
                <p>Loading...</p>
            )}
            <br></br><br></br>
            <div>
            <h1>歡迎來到首頁！</h1>
            <button onClick={() => router.push('/proof')}>產生proof</button>
            </div>
        </div>
    );
}
