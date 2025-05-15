
import React from "react";

interface BankInfoProps {
  bankAccount: string;
  ifscCode: string;
}

const BankInfo = ({ bankAccount, ifscCode }: BankInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[#1a1e29] rounded-xl p-3">
        <p className="text-blue-400 text-xs mb-1 text-left">Bank Account</p>
        <p className="text-white text-base font-medium text-left">{bankAccount}</p>
      </div>
      <div className="bg-[#1a1e29] rounded-xl p-3">
        <p className="text-blue-400 text-xs mb-1 text-left">IFSC code</p>
        <p className="text-white text-base font-medium text-left">{ifscCode}</p>
      </div>
    </div>
  );
};

export default BankInfo;
