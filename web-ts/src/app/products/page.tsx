"use client"
import React, { useState } from 'react';
import { generateCommitment, generateFullProof } from "../../lib/proof";
import { type Proof } from "@/config/proof";
import { useRouter, useSearchParams } from 'next/navigation';


const Seller: React.FC = () => {
  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <h1>這裡是買家 Bidder 的頁面，現在應該要顯示所有拍賣中的商品讓買家選擇， 選取特定生品後要跳轉到對該商品下標的頁面</h1>
    </div>

  );
};

export default Seller;
