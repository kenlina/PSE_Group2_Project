"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getContract, provider } from '../../lib/ethereum';


export default function Home() {
    const router = useRouter();
    const param = useSearchParams();
    const [loading, setLoading] = useState(0); 
    const accountIndex = param.get('accountIndex');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [address, setAddress] = useState('');

    let contract: any;
    
    useEffect(() => {
        const loadAccount = async () => {
            const add = await provider.getSigner(Number(accountIndex)).getAddress();
            setAddress(add);
        };

        loadAccount();
    }, []);

    async function sellProducts(event) {
        event.preventDefault(); // 阻止表單的默認提交行為
        try {
            const index = accountIndex === "" ? 0 : Number(accountIndex);
            contract = await getContract(index);
            const signer = await provider.getSigner(index);
            const add = await signer.getAddress();
            console.log("Login signer address:", add);
            setAddress(add);
            // 處理日期格式，轉換為 UNIX 時間戳
            const formattedStartTime = Math.floor(new Date(startTime).getTime() / 1000);
            const formattedEndTime = Math.floor(new Date(endTime).getTime() / 1000);
    
            let tx = await contract.createAuction(
                name,
                description,
                formattedStartTime,
                formattedEndTime,
                startingPrice
            );
            await tx.wait();
            console.log("create successful");
            setSuccessMessage('Auction created successfully!');
        } catch (error) {
            console.error("Error in selling products:", error);
            setSuccessMessage('Failed to create auction.');
        }
    }

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

        {/* 固定位置: Account Address */}
        <div className="fixed top-4 right-4 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg px-4 py-2 rounded shadow-md text-sm text-gray-800">
            {address ? `Current Account: ${address}` : 'Loading account...'}
        </div>

        {/* 主內容區域 */}
        <div className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create a New Auction</h2>
                
                {successMessage && (
                    <div className={`mb-4 text-center py-2 rounded ${successMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={sellProducts} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter product description"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700">Starting Price</label>
                        <input
                            type="number"
                            id="startingPrice"
                            value={startingPrice}
                            onChange={(e) => setStartingPrice(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter starting price"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            type="datetime-local"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Creating Auction..." : "Create Auction"}
                    </button>
                </form>

            </div>
        </div>
    </div>
    );
}