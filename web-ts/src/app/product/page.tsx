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

const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); 
    return date.toLocaleString(); 
};


export default function Home() {
    const router = useRouter();
    const param = useSearchParams();

    const [loading, setLoading] = useState(false); 
    const [contract, setContract] = useState<Contract | null>(null);
    
    const accountIndex = param.get('accountIndex');
    const productID = param.get('productID');
    const index = Number(accountIndex);
    const [product, setProduct] = useState<Product | null>(null);
    const [bid, setBid] = useState<string>('');


    useEffect(() => {
        const loadContract = async () => {
            const loadedContract = await getContract(index);
            setContract(loadedContract);
        };

        loadContract();
    }, []);

    const loadProduct = async () => {
        if (contract && productID) {
            setLoading(true);
            try {
                const productDetails = await contract.products(productID);
                setProduct({
                    name: productDetails.name,
                    description: productDetails.description,
                    startTime: productDetails.startTime.toNumber(),
                    endTime: productDetails.endTime.toNumber(),
                    startingPrice: productDetails.startingPrice.toString()
                });
            } catch (error) {
                console.error("Failed to load product:", error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    

    useEffect(() => {
        if (contract) {
            console.log("productID:",productID);
            loadProduct(); // 每次事件觸發時重新加載商品
        }
    }, [contract]); // 確保依賴於contract的更新

    const submitBid = async () => {
        if (contract && product && bid) {
            setLoading(true);
            try {
                const transaction = await contract.placeBid(productID, { value: 100 });
                await transaction.wait();
                alert('Bid placed successfully!');
            } catch (error) {
                console.error("Failed to place bid:", error);
                alert('Failed to place bid.');
            } finally {
                setLoading(false);
            }
        }
    };
    

    return (
        <div style={containerStyle}>
            {loading ? (
                <p style={loadingTextStyle}>Loading product...</p>
            ) : product ? (
                <>
                    <h1 style={detailStyle}>Product Name: {product.name}</h1>
                    <p style={detailStyle}>Product Description: {product.description}</p>
                    <p style={detailStyle}>Start Time: {formatDate(product.startTime)}</p>
                    <p style={detailStyle}>End Time: {formatDate(product.endTime)}</p>
                    <p style={detailStyle}>Starting Bid: {product.startingPrice}</p>
                    <div style={{ margin: '20px 0' }}>
                        <input
                            type="text"
                            value={bid}
                            onChange={(e) => setBid(e.target.value)}
                            placeholder="Your bid"
                            style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
                        />
                        <button onClick={submitBid} style={{ padding: '10px 20px' }}>Submit Bid</button>
                    </div>
                </>
            ) : (
                <p>Product not found</p>
            )}
        </div>
    );
    
    
}

const detailStyle: React.CSSProperties = {
    marginBottom: '15px', 
    padding: '10px', 
    backgroundColor: '#ffffff', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lineHeight: '1.6',
    fontSize: '16px', 
};


const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '800px', // 根據實際需要調整寬度
    margin: '20px auto',
    backgroundColor: '#f8f9fa', // 淺灰色背景
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const listStyle: React.CSSProperties = {
    listStyleType: 'none', // 移除列表點
    padding: '0',
    margin: '10px 0' // 給列表增加垂直邊距
};

const listItemStyle: React.CSSProperties = {
    padding: '15px 10px', // 增加內邊距
    borderBottom: '1px solid #ddd', // 底部邊框線條
    fontSize: '16px', // 字體大小
    color: '#333', // 字體顏色
    transition: 'background-color 0.3s', // 背景色變化動畫
    cursor: 'pointer', // 鼠標樣式
    marginBottom: '8px', // 每個項目之間的間隔
    backgroundColor: '#ffffff', // 設定背景色為白色
    borderRadius: '5px', // 圓角
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)' // 添加溫暖色調的陰影
};

const loadingTextStyle: React.CSSProperties = {
    textAlign: 'center', // 文本居中
    fontSize: '18px', // 較大字體大小
    color: '#555', // 文本顏色
    fontStyle: 'italic', // 斜體字
    marginTop: '50px' // 當正在加載時讓文字稍微向下一些
};
