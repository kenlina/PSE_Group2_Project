"use client"
// pages/choose-role.tsx
import { useRouter , useSearchParams } from 'next/navigation'; 
import React from 'react';

const ChooseRole = () => {
    const router = useRouter();  // 將 useRouter 放在組件函數內部使用
    const param = useSearchParams();

    const handleSelectRole = (role: 'seller' | 'bidder') => {
        console.log(`Selected role: ${role}`);
        let nextRoute = role === 'seller' ? "/seller" : "/products"; // 確保路徑正確
        const accountIndex = param.get("accountIndex");
        nextRoute += "?accountIndex=" + accountIndex;;
        router.push(nextRoute);  // 使用變量導航
    };

    return (
        <div style={containerStyle}>
            <button onClick={() => handleSelectRole('seller')} style={sellerButtonStyle}>
                Seller
            </button>
            <button onClick={() => handleSelectRole('bidder')} style={buttonStyle}>
                Bidder
            </button>
        </div>
    );
};

export default ChooseRole;

const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh', // 使容器佔滿整個視窗高度
    backgroundColor: '#fffff' // 輕微灰色背景
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#8F4586',
    border: 'none',
    color: 'white',
    padding: '80px 100px', // 增加padding使按鈕更大
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: '35px', // 增大字體大小
    margin: '40px',
    cursor: 'pointer',
    borderRadius: '50px',
    boxShadow: '3px 6px 12px rgba(0,0,0,0.3)',
    transition: 'transform 0.3s', // 新增transform過渡效果
};

const sellerButtonStyle: React.CSSProperties = {
    ...buttonStyle, // 繼承buttonStyle的所有樣式
    backgroundColor: '#007979', // 特定於Seller按鈕的背景顏色
};