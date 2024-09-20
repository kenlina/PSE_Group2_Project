"use client"
import React, { useState } from 'react';
import { generateCommitment, generateFullProof } from "../../lib/proof";
import { type Proof } from "@/config/proof";
import { useRouter, useSearchParams } from 'next/navigation';


const Seller: React.FC = () => {
  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <h1>這裡是賣家的頁面，應該讓賣家可以新增商品填入價格時間等等的因素</h1>
    </div>

  );
};

export default Seller;
