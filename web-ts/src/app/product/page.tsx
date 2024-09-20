"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getContract, provider } from '../../lib/ethereum';
import {type Contract } from "ethers"
import { generateCommitment, generateFullProof , getRandomNullifier} from "../../lib/proof";
import { type Proof } from "@/config/proof";

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
    const [proof, setProof] = useState<Proof>();
    const [showProof, setShowProof] = useState(false);  // 新增狀態管理顯示 proof
    const [product, setProduct] = useState<Product | null>(null);
    const [bid, setBid] = useState<string>('');
    const [PoseidonHash, setPoseidonHash] = useState<string>();
    
    const accountIndex = param.get('accountIndex');
    const productID = param.get('productID');
    const index = Number(accountIndex);

    const toggleProofDisplay = () => {
        setShowProof(!showProof);  // 切換顯示或隱藏 proof
    };

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

    const submit = async () => {
        if (contract && product && bid) {
            setLoading(true);
            try {
                const random = getRandomNullifier();
                
                const Hash = await generateCommitment(bid, random);
                const fullProof = await generateFullProof(random, bid, product.startingPrice, Hash);
                setPoseidonHash(Hash);
                setProof(fullProof);
            } catch (error) {
                console.error("Failed to place bid:", error);
                alert('Failed to place bid.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const submitBid = async () => {
            if (contract && product && bid && proof) {
                setLoading(true);
                try {
                    console.log("type:", typeof(productID), productID);
                    const transaction = await contract.summitBid(productID, proof.proof, proof.publicSignals, PoseidonHash);
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
    
        if (proof && PoseidonHash) {
            submitBid();
        }
    }, [proof, PoseidonHash]);
    

    return (
        <div style={containerStyle}>
            {loading ? (
                <p style={loadingTextStyle}>Bidding for product...</p>
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
                        <button onClick={submit} style={buttonStyle}>Submit Bid</button>
                    </div>
                    {proof && (
                        <button onClick={toggleProofDisplay} className="p-2 bg-blue-500 text-white rounded" style={{ padding: '10px 20px' }}>
                            {showProof ? 'Hide Proof' : 'Show Proof'}
                        </button>
                    )}
                    {showProof && proof && (
                    <div style={proofDetailStyle}>
                        <h2 style={headingStyle}>Proof Details</h2>
                        <p style={textStyle}>Bid Commitment: {proof.publicSignals}</p>
                        <br></br>
                        <div style={proofListStyle}>
                            <h3 style={subHeadingStyle}>Proof:</h3>
                            <ul>
                                {proof.proof.map((element, index) => (
                                    <li key={index} style={listItemStyle}>{`Proof[${index + 1}]: ${element}`}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                </>
            ) : (
                <p>Product not found</p>
            )}
        </div>
    );
    
    
}

const proofDetailStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f0f0f0', // 淺灰色背景
    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
    marginBottom: '20px',
};

const headingStyle: React.CSSProperties = {
    fontSize: '20px',
    color: '#333',
    marginBottom: '10px',
};

const subHeadingStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#444',
    marginTop: '10px',
    marginBottom: '5px',
};

const proofListStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
};

const textStyle: React.CSSProperties = {
    fontSize: '17px',
    color: '#375',
    lineHeight: '1.5',
};

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
    maxWidth: '1000px', // 根據實際需要調整寬度
    margin: '20px auto',
    backgroundColor: '#f8f9fa', // 淺灰色背景
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: '16px',
    margin: '4px',
    cursor: 'pointer',
    borderRadius: '12px',
    boxShadow: '2px 5px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s',
    width: '20%', // 控制按鈕的寬度
    marginTop: '20px' // 增加與上面元素的距離
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
