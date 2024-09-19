"use client"
import React, { useState } from 'react';
import { getRandomNullifier, generateFullProof } from "../../lib/proof";
import { type Proof } from "@/config/proof";
import { buildPoseidon } from "circomlibjs";

const GenerateProof: React.FC = () => {
    function uint8ArrayToBigInt(array: Uint8Array): BigInt {
        const hex = Array.from(array)
                         .map(b => b.toString(16).padStart(2, '0'))
                         .join('');
        return BigInt('0x' + hex);
    }
    async function usePoseidon() {
        let poseidon = await buildPoseidon();
        let F = poseidon.F;
        const hash = poseidon([BigInt(5), BigInt(77)]);
        F.e(hash);
        const big = uint8ArrayToBigInt(hash);
        console.log(F.e(hash));
    }
    usePoseidon();

  const [random, setRandom] = useState('');
  const [bid, setBid] = useState('');
  const [reserve, setReserve] = useState('');
  const [commit, setCommit] = useState('');
  const [proof, setProof] = useState<Proof>();
  


  const handleSubmit = async (event: React.FormEvent) => {
    console.log("tri");
    event.preventDefault();
    try {
        const fullProof = await generateFullProof(random, bid, reserve, commit);
        setProof(fullProof);
        console.log("done");
    } catch (error) {
      console.error('Error generating proof:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
    <form onSubmit={handleSubmit} style={{ margin: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Random" value={random} onChange={(e) => setRandom(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="number" placeholder="Bid" value={bid} onChange={(e) => setBid(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="number" placeholder="Reserve" value={reserve} onChange={(e) => setReserve(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Commit" value={commit} onChange={(e) => setCommit(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s' }}>
            Generate Proof
        </button>
    </form>
    {proof && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f4f4f4', borderRadius: '5px' }}>
            <h3>Proof:</h3>
            {proof.proof.map((item, index) => (
                <p key={index} style={{ margin: '5px 0' }}>{item}</p>
            ))}
            <h4>Public Signals:</h4>
            <p>Reserve: {proof.publicSignals[0]}</p>
            <p>Commit: {proof.publicSignals[1]}</p>
        </div>
    )}
    </div>

  );
};

export default GenerateProof;
