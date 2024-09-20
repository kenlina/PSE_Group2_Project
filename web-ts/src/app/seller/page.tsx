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


    let contract: any;
    
    async function sellProducts(event) {
        event.preventDefault(); // 阻止表單的默認提交行為
        try {
            const index = accountIndex === "" ? 0 : Number(accountIndex);
            contract = await getContract(index);
            const signer = await provider.getSigner(index);
            const address = await signer.getAddress();
            console.log("Login signer address:", address);
    
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
        <div className="p-4 max-w-lg mx-auto">
            {successMessage && <div style={successMessageStyle}>{successMessage}</div>}
            <form onSubmit={sellProducts} style={formStyle}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                style={inputStyle}
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                style={inputStyle}
            />
            <input
                type="text"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="Starting Price"
                style={inputStyle}
            />
            <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Start Time"
                style={inputStyle}
            />
            <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="End Time"
                style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Create Auction</button>
        </form>
        </div>
    );
}


const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // 間距
    alignItems: 'center', // 居中對齊
    justifyContent: 'center'
};

const inputStyle: React.CSSProperties = {
    padding: '10px',
    margin: '5px 0',
    width: '80%', // 控制寬度
    border: '2px solid #ccc', // 邊框樣式
    borderRadius: '8px' // 圓角
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
    width: '85%', // 控制按鈕的寬度
    marginTop: '20px' // 增加與上面元素的距離
};

const successMessageStyle: React.CSSProperties = {
    color: 'green',
    backgroundColor: '#ccffcc',
    padding: '10px',
    borderRadius: '5px',
    margin: '10px 0',
    textAlign: 'center',
    fontWeight: 'bold'
};
