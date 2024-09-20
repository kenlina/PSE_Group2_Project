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
    
    const accountIndex = param.get('accountIndex');
    const index = Number(accountIndex);

    

    useEffect(() => {
        const loadContract = async () => {
            const loadedContract = await getContract(index);
            setContract(loadedContract);
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
        <div style={containerStyle}>
        {loading ? <p style={loadingTextStyle}>Loading products...</p> : (
            <ul style={listStyle}>
                {products.map((product, index) => (
                    <li key={index} style={listItemStyle} onClick={() => handleProductClick(index + 1)}>
                        {product.name} - {product.startingPrice}
                    </li>
                ))}
            </ul>
        )}
    </div>
    );
}

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
