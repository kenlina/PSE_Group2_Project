"use client"
import React, { useState } from 'react';
import { generateCommitment, generateFullProof } from "../../lib/proof";
import { type Proof } from "@/config/proof";

interface ProofProps {
    proof: {
      proof: string[];
      publicSignals: string[];
    };
}

const GenerateProof: React.FC = () => {
  const [random, setRandom] = useState('');
  const [bid, setBid] = useState('');
  const [reserve, setReserve] = useState('');
  const [proof, setProof] = useState<Proof>();
  


  const handleSubmit = async (event: React.FormEvent) => {
    console.log("tri");
    event.preventDefault();
    try {
        const PoseidonHash = await generateCommitment(bid, random);
        const fullProof = await generateFullProof(random, bid, reserve, PoseidonHash);
        setProof(fullProof);
        console.log("done", PoseidonHash);
    } catch (error) {
      console.error('Error generating proof:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
    <form onSubmit={handleSubmit} style={{ margin: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Random" value={random} onChange={(e) => setRandom(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Bid" value={bid} onChange={(e) => setBid(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Reserve" value={reserve} onChange={(e) => setReserve(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s' }}>
            Generate Proof
        </button>
    </form>
    {proof && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f4f4f4', borderRadius: '5px' }}>
        <h3>Proof:</h3>
        <p>{"[" + proof.proof.map((item) => `"${item}"`).join(", ") + "]"}</p>
        <h4>Public Signals:</h4>
        <p>Reserve: {proof.publicSignals[0]}</p>
        <p>Commit: {proof.publicSignals[1]}</p>
      </div>
    )}
    </div>

  );
};

export default GenerateProof;
