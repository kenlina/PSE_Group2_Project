"use client"
// pages/choose-role.tsx
import { useRouter } from 'next/router';

const ChooseRole: React.FC = () => {
//   const router = useRouter();

  const handleSelectRole = (role: 'seller' | 'bidder') => {
    // 這裡可以導航到不同的路由，或者處理角色選擇後的邏輯
    console.log(`Selected role: ${role}`);
    // 例如： router.push(`/${role}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button  onClick={() => handleSelectRole('seller')}>
        Seller
      </button>
      <button  onClick={() => handleSelectRole('bidder')}>
        Bidder
      </button>
    </div>
  );
};

export default ChooseRole;
