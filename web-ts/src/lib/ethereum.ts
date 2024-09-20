import data from '../../../contracts/artifacts/contracts/Auction.sol/Auction.json';
import { ethers } from "ethers";

const HARDHAT_NETWORK_URL = 'http://127.0.0.1:8545/';
export const provider = new ethers.providers.JsonRpcProvider(HARDHAT_NETWORK_URL);
export const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const contractABI = data.abi;



async function getContract(index: number) {
    try {
        const signer = await provider.getSigner(index);
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        return contract;
    } catch (error) {
        console.error('Failed to initialize the contract:', error);
    }
    return null; 
}

// 用於顯示所有帳號
async function listAllAccounts() {
    try {
        const accounts = await provider.listAccounts();
        console.log('Available accounts:', accounts);
    } catch (error) {
        console.error('Failed to list accounts:', error);
    }
}

export { getContract, listAllAccounts};
