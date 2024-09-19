// src/hooks/useContract.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract , listAllAccounts } from './ethereum';

export const useContract = () => {
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [loading, setLoading] = useState(true);
    const [auctionCounter, setAuctionCounter] = useState<number>(0);

    useEffect(() => {
        async function loadContract() {
            const loadedContract = await getContract();
            if (loadedContract) {
                setContract(loadedContract);
                setLoading(false);

                const counter = await loadedContract.AuctionCounter();
                setAuctionCounter(counter.toNumber());

                listAllAccounts();

                loadedContract.on('AuctionCreated', (result) => {
                    console.log('Event triggered:', result);
                    loadedContract.AuctionCounter().then(counter => {
                        setAuctionCounter(counter.toNumber());
                    });
                });
            } else {
                console.error("Failed to load contract.");
                setLoading(false);
            }
        }

        loadContract();
        return () => contract?.removeAllListeners();
    }, []);

    return { contract, loading, auctionCounter };
};