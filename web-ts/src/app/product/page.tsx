"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getContract, provider } from '../../lib/ethereum';
import {type Contract } from "ethers"
import { generateCommitment, generateFullProof , getRandomNullifier} from "../../lib/proof";
import { type Proof } from "@/config/proof";
import { open } from "@/lib/collectData"

interface Product {
    auctionID: number;
    seller: string;
    name: string;
    description: string;
    startTime: number;
    endTime: number;
    startingPrice: string;
    status: string;
}

enum AuctionStatus {
    OPEN,
    END
}

interface UserBid {
    index: number;
    bid: string;
    random: string;
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
    const [address, setAddress] = useState('');
    const [winner, setWinner] = useState<string | null>(null);
    
    const accountIndex = param.get('accountIndex');
    const productID = param.get('productID');
    const index = Number(accountIndex);
    const [bnum, setBnum] = useState<number>(0);

    const toggleProofDisplay = () => {
        setShowProof(!showProof);  // 切換顯示或隱藏 proof
    };

    useEffect(() => {
        const loadContract = async () => {
            const loadedContract = await getContract(index);
            setContract(loadedContract);
            const add =  (await provider.getSigner(index).getAddress()).toString();
            setAddress(add);
            console.log("address: ", address);
        };

        loadContract();
    }, [address]);

    const loadProduct = async () => {
        if (contract && productID) {
            setLoading(true);
            try {
                const productDetails = await contract.products(productID);
                console.log("productDetails.status: ", productDetails.status);
                setProduct({
                    auctionID: productDetails.auctionID.toNumber(),
                    seller: productDetails.seller,
                    name: productDetails.name,
                    description: productDetails.description,
                    startTime: productDetails.startTime.toNumber(),
                    endTime: productDetails.endTime.toNumber(),
                    startingPrice: productDetails.startingPrice.toString(),
                    status: AuctionStatus[productDetails.status]  // Assuming status is an enum index
                });
                if (AuctionStatus[productDetails.status] === 'END') {
                    const winnerAddress = await contract.highestBidder(productID);
                    setWinner(winnerAddress);
                } else {
                    setWinner(null); 
                }
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
                const BIGnum = await contract.getBidsCount(productID);
                setBnum(BIGnum.toNumber() + 1);
                const formData: UserBid= {
                    index: BIGnum.toNumber(),
                    bid: bid,
                    random: random
                };
                localStorage.setItem(address, JSON.stringify(formData));
                console.log("userBid has stored in local storage in :", address);
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
                    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
                    const secondsDiff = product.endTime - currentUnixTimestamp;
                    setTimeout(async () => {  
                        const BIGnum = await contract.getBidsCount(productID);
                        const data = localStorage.getItem(address);
                        if (data) {
                            console.log("bnum before open:", BIGnum.toNumber());
                            const result = await open(JSON.parse(data), BIGnum.toNumber());
                            if (result) {
                                const tx = await contract.revealBids(productID, result);
                                await tx.wait();
                                console.log("Open function successful:", result);
                            } else {
                                console.log("Open function failed or no bids matched.");
                            }
                        }
                    }, secondsDiff * 1000);
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
            <div style={accountStyle}>
                {address ? `Current Account: ${address}` : 'Loading account...'}
            </div>
            {loading ? (
                <p style={loadingTextStyle}>Bidding for product...</p>
            ) : product ? (
                <>
                    <h1 style={highlightStyle}>Product Name: {product.name}</h1>
                    <p style={normalDetailStyle}>Seller: {product.seller}</p>
                    <p style={normalDetailStyle}>Description: {product.description}</p>
                    <div style={timeContainerStyle}>
                        <p style={{...normalDetailStyle}}>Start Time: {formatDate(product.startTime)}</p>
                        <p style={{...normalDetailStyle, ...timeHighlightStyle}}>End Time: {formatDate(product.endTime)}</p>
                    </div>
                    <p style={highlightStyle}>Starting Bid: {product.startingPrice}</p>
                    <p style={normalDetailStyle}>Status: {product.status}</p>
                    {product && product.status === 'END' && winner && (
                        <p style={winnerStyle}>Winner: {winner}</p>
                    )}
                    { product.status == "OPEN" && (
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
                        )
                    }
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

const winnerStyle: React.CSSProperties = {
    ...detailStyle,  // 继承已有的 detailStyle 样式
    backgroundColor: '#7E3D76',  // 设置为绿色背景，或者您选择的任何颜色
    color: 'white',  // 设置文本颜色为白色以增加对比
    padding: '10px',  // 增加一些内边距
    borderRadius: '8px',  // 圆角
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'  // 添加阴影以增强视觉效果
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

const accountStyle: React.CSSProperties = {
    position: 'fixed',  // 使地址固定在页面的特定位置
    top: '10px',  // 距离顶部10px
    right: '10px',  // 距离右侧10px
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    fontSize: '14px',
    color: '#333',
    zIndex: 1000  // 确保它在页面的最上层
};

const highlightStyle: React.CSSProperties = {
    fontSize: '20px',  // 放大字体大小
    color: '#000000',  // 使用更显眼的颜色
    fontWeight: 'bold',  // 加粗字体
    marginBottom: '15px',  // 增加底部边距
    padding: '15px',  // 增加内边距
    backgroundColor: '#f7f7f7',  // 轻微的背景色
    borderRadius: '8px',  // 圆角
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 轻微的阴影
};

const normalDetailStyle: React.CSSProperties = {
    ...detailStyle,  // 继承已有的 detailStyle 样式
    fontSize: '16px',  // 缩小字体大小
    color: '#666',  // 使用更淡的颜色
};

const timeContainerStyle: React.CSSProperties = {
    display: 'flex',  // 使用 flexbox 布局
    justifyContent: 'space-between',  // 在两端对齐内容
    alignItems: 'center',  // 垂直居中对齐
    marginBottom: '10px',  // 底部留白
    padding: '10px',  // 增加内边距
    backgroundColor: '#B3D9D9',  // 背景色
    borderRadius: '8px',  // 圆角
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 轻微的阴影
};

const timeHighlightStyle: React.CSSProperties = {
    fontSize: '18px',  // 增大字體大小
    fontWeight: 'bold',  // 加粗
    color: '#000',  // 使用深色以增強視覺對比
    padding: '5px 10px',  // 增加內邊距，讓字體更容易閱讀
    backgroundColor: '#F0E68C',  // 添加明亮的背景色來突出顯示
    borderRadius: '5px',  // 添加輕微的圓角
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)'  // 添加内阴影以增强深度感
};