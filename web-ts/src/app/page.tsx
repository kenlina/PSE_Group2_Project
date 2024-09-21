"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getContract, provider } from '../lib/ethereum';
import Image from 'next/image';


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
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>

            {/* Main Content Area: Welcome and Technical Introduction */}
            <div className="flex flex-1 p-4 max-w-7xl mx-auto">
                {/* Welcome and Description Section */}
                <div className="w-1/2 flex justify-center">
                    {!loading ? (
                        <div className="bg-purple-100 px-6 py-8 rounded-3xl shadow-lg text-left fixed-vertical-height">
                            <h1 className="text-3xl font-bold mb-4">Welcome to our Auction Platform</h1>
                            <div className="center-paragraph">
                                <p>
                                    Here you can participate in auctions and bid on your favorite items. We use blockchain technology to ensure secure and transparent transactions.
                                </p>
                                    <Image 
                                        src="/zkp.webp" 
                                        alt="Seller Icon"
                                        width = {250}
                                        height= {250} 
                                        style={{ marginLeft: '130px' }}
                                    />
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                {/* Technical Introduction Section */}
                <div className="w-1/2 flex justify-center ml-4">
                    <div className="bg-blue-100 px-6 py-8 rounded-3xl shadow-lg text-left fixed-vertical-height overflow-auto">
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

            {/* Footer Section */}
            <footer className="bg-gray-900 text-white py-4">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <a href="https://github.com/kenlina/PSE_Group2_Project" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        {/* GitHub SVG 圖標 */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="hover:text-gray-400 transition-colors duration-300"
                        >
                            <path d="M12 0.296c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.01-1.04-0.016-2.04-3.338 0.724-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.744 0.084-0.729 0.084-0.729 1.205 0.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.304 3.495 0.997 0.108-0.775 0.418-1.305 0.76-1.604-2.665-0.305-5.466-1.332-5.466-5.931 0-1.31 0.47-2.381 1.235-3.221-0.124-0.303-0.535-1.524 0.117-3.176 0 0 1.008-0.322 3.3 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.29-1.552 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.874 0.118 3.176 0.77 0.84 1.234 1.911 1.234 3.221 0 4.61-2.805 5.624-5.475 5.921 0.43 0.372 0.823 1.102 0.823 2.222 0 1.606-0.014 2.896-0.014 3.286 0 0.319 0.216 0.694 0.825 0.576 4.765-1.589 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span className="ml-2 text-lg">GitHub</span>
                    </a>
                </div>
            </footer>
        </div>
    );
}
