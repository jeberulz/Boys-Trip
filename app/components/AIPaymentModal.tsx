"use client";

import { useState } from "react";
import { Icon } from "./Icon";

interface AIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  userName: string;
}

export function AIPaymentModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: AIPaymentModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (!agreed) {
      setError("Please agree to the payment terms");
      return;
    }
    onConfirm(numAmount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError("");
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Icon name="lucide:sparkles" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  AI Writing Assistant
                </h3>
                <p className="text-xs text-slate-500">Powered by Claude AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Icon name="lucide:x" size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <div className="flex gap-3">
              <Icon
                name="lucide:info"
                size={20}
                className="text-orange-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm text-slate-700">
                  This is a <span className="font-medium">paid feature</span>.
                  Enter an amount you&apos;re willing to pay to use AI
                  assistance for improving your profile.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount (EUR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                &euro;
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Suggested: &euro;1-5 per use
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex gap-3">
              <Icon
                name="lucide:banknote"
                size={20}
                className="text-slate-500 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-slate-600">
                <span className="font-medium">John</span> will send you a Tikkie
                for the amount you enter. Please be ready to pay when you
                receive it.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setError("");
                }}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:border-orange-500 peer-checked:bg-orange-500 transition-colors">
                {agreed && (
                  <Icon name="lucide:check" size={16} className="text-white" />
                )}
              </div>
            </div>
            <span className="text-sm text-slate-600">
              I agree to pay the amount entered when I receive the Tikkie from
              John
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <Icon name="lucide:alert-circle" size={16} />
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Continue to AI
            <Icon name="lucide:arrow-right" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
