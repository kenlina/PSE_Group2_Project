"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getContract, provider } from '../lib/ethereum';


export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(0);
    const [accountIndex, setAccountIndex] = useState(0); 
    
    let contract: any;
    async function loadSigner() {
        const index = accountIndex === null ? 0 : accountIndex;
        contract = await getContract(index); 
        const signer = provider.getSigner(index);
        const address = await signer.getAddress();
        console.log("Login signer address:", address);
        
    }

    const handleLogin = async () => {
        // You might want to perform additional operations on login
        loadSigner();
        console.log(`Logged in with account ${accountIndex}`);
        const next_page = "/proof?accountIndex="+accountIndex;
        router.push(next_page); // Assuming you have a dashboard route
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            {!loading ? (
                <div>
                    <h1>選擇你的帳號並登錄</h1>
                    <select 
                        value={accountIndex}
                        onChange={(e) => setAccountIndex(Number(e.target.value))}
                        className="mb-4 p-2 border rounded"
                    >
                        {Array.from({ length: 20 }, (_, i) => (
                            <option key={i} value={i}>Account {i}</option>
                        ))}
                    </select>
                    <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">
                        登錄
                    </button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
