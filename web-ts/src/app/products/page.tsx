"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getContract, provider } from '../../lib/ethereum';
import {type Contract } from "ethers"


interface Product {
    name: string;
    description: string;
    startTime: number;
    endTime: number;
    startingPrice: string;
    // 添加更多根據智慧合約中的定義所需的屬性
}


export default function Home() {
    const router = useRouter();
    const param = useSearchParams();

    const [loading, setLoading] = useState(false); 
    const [contract, setContract] = useState<Contract | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [address, setAddress] = useState('');

    const accountIndex = param.get('accountIndex');
    const index = Number(accountIndex);

    

    useEffect(() => {
        const loadContract = async () => {
            const loadedContract = await getContract(index);
            setContract(loadedContract);
            const add =  (await provider.getSigner(index).getAddress()).toString();
            setAddress(add);
        };

        loadContract();
    }, []);

    const loadProducts = async (currentContract: Contract) => {
        if (currentContract) {
            setLoading(true);
            try {
                const auctionCount = await currentContract.AuctionCounter();
                const productsList: Product[] = [];
                for (let i = 1; i <= auctionCount.toNumber(); i++) {
                    const product = await currentContract.products(i);
                    productsList.push({
                        name: product.name,
                        description: product.description,
                        startTime: product.startTime.toNumber(),
                        endTime: product.endTime.toNumber(),
                        startingPrice: product.startingPrice.toString()
                    });
                }
                setProducts(productsList);
            } catch (error) {
                console.error("Failed to load products:", error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    

    useEffect(() => {
        if (contract) {
            const onAuctionCreated = (auctionId, seller) => {
                console.log(`Auction Created: ${auctionId} by ${seller}`);
                loadProducts(contract);  // 更新這裡，直接使用當前的 contract 對象
            };
    
            // 監聽事件
            contract.on('AuctionCreated', onAuctionCreated);
    
            // 清理函數
            return () => {
                if (contract) {
                    contract.off('AuctionCreated', onAuctionCreated);
                }
            };
        }
    }, [contract]);  // 這裡保留 contract 作為依賴
    

    const handleProductClick = (productID: number) => {
        // 實現導航到商品詳情頁面，假設商品詳情頁面路由是 '/product/[id]'
        router.push(`/product/?accountIndex=${accountIndex}&productID=${productID}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 bg-stripes flex flex-col p-4">
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
            <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Auction Products</h2>


                {loading ? (
                    <p className="text-center text-lg text-gray-700">Loading products...</p>
                ) : (
                    <>
                        {products.length === 0 ? (
                            <p className="text-center text-gray-500">No products available.</p>
                        ) : (
                            <ul className="space-y-4">
                                {products.map((product, index) => (
                                    <li
                                        key={index} onClick={() => handleProductClick(index + 1)}
                                        className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-4"
                                    >
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                            <p className="text-gray-600">{product.description}</p>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-green-600 font-bold">${product.startingPrice}</span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(product.startTime * 1000).toLocaleString()} - {new Date(product.endTime * 1000).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
    );
}

/*<div style={containerStyle}>
            <div style={accountStyle}>
                {address ? `Current Account: ${address}` : 'Loading account...'}
            </div>
        {loading ? <p style={loadingTextStyle}>Loading products...</p> : (
            <ul style={listStyle}>
                {products.map((product, index) => (
                    <li key={index} style={listItemStyle} onClick={() => handleProductClick(index + 1)}>
                        {product.name} - {product.startingPrice}
                    </li>
                ))}
            </ul>
        )}
    </div>*/