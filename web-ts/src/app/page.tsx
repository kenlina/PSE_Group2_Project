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
        const next_page = "/select?accountIndex="+accountIndex;
        router.push(next_page); // Assuming you have a dashboard route
    };

    return (
        <div className="min-h-screen bg-gray-100 bg-stripes flex flex-col">
            <style jsx global>{`
                .bg-stripes {
                    background-image: linear-gradient(
                        45deg,
                        #f0f0f0 25%,
                        transparent 25%,
                        transparent 50%,
                        #f0f0f0 50%,
                        #f0f0f0 75%,
                        transparent 75%,
                        transparent
                    );
                    background-size: 20px 20px;
                }
            `}</style>

            {/* Top Right: Account Selector and Login Button */}
            <div className="flex justify-end items-center p-4">
                <label htmlFor="account-select" className="mr-2">Select Account:</label>
                <select 
                    id="account-select"
                    value={accountIndex}
                    onChange={(e) => setAccountIndex(Number(e.target.value))}
                    className="p-2 border rounded"
                >
                    {Array.from({ length: 20 }, (_, i) => (
                        <option key={i} value={i}>Account {i}</option>
                    ))}
                </select>
                <button 
                    onClick={handleLogin} 
                    className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                    Login
                </button>
            </div>

            {/* Main Content Area: Welcome and Technical Introduction */}
            <div className="flex flex-1 p-4 max-w-7xl mx-auto">
                {/* Welcome and Description Section */}
                <div className="w-1/2 flex justify-center">
                    {!loading ? (
                        <div className="bg-purple-100 px-[15px] py-8 rounded-3xl shadow-lg text-left">
                            <h1 className="text-3xl font-bold mb-4">Welcome to our Auction Platform</h1>
                            <p className="mb-8">
                                Here you can participate in auctions and bid on your favorite items. We use blockchain technology to ensure secure and transparent transactions.
                            </p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                {/* Technical Introduction Section */}
                <div className="w-1/2 flex justify-center ml-4">
                    <div className="bg-blue-100 px-[15px] py-8 rounded-3xl shadow-lg text-left">
                        <h2 className="text-3xl font-semibold mb-4">Technical Introduction: Zero-Knowledge Proofs</h2>
                        <p className="mb-4">
                            Our platform leverages Zero-Knowledge Proofs (ZKPs) to enhance privacy and security. ZKPs allow one party to prove to another that a statement is true without revealing any additional information.
                        </p>
                        <p className="mb-4">
                            Specifically, we utilize the PLONK protocol, a cutting-edge Zero-Knowledge Proof system. PLONK offers universal and updatable trusted setups, enabling efficient and scalable proof generation for various applications within our auction platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
