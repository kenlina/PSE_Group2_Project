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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => handleSelectRole('seller')} style={buttonStyle}>
                Seller
            </button>
            <button onClick={() => handleSelectRole('bidder')} style={buttonStyle}>
                Bidder
            </button>
        </div>
    );
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
    transition: 'all 0.3s'
};

export default ChooseRole;
