"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AIPaymentModal } from "./AIPaymentModal";
import { AIWritingModal } from "./AIWritingModal";
import { QuoteGeneratorModal } from "./QuoteGeneratorModal";
import { AIWritingButton } from "./AIWritingButton";

interface AIWritingAssistantProps {
  fieldName: string;
  fieldLabel: string;
  currentText: string;
  userName: string;
  profileId?: Id<"profiles">;
  onTextUpdate: (text: string) => void;
  isQuoteField?: boolean;
}

const AI_PAYMENT_SESSION_KEY = "ai-payment-confirmed";

interface PaymentSession {
  confirmed: boolean;
  amount: number;
  timestamp: number;
}

export function AIWritingAssistant({
  fieldName,
  fieldLabel,
  currentText,
  userName,
  profileId,
  onTextUpdate,
  isQuoteField = false,
}: AIWritingAssistantProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWritingModal, setShowWritingModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [hasSessionPayment, setHasSessionPayment] = useState(false);

  const recordPayment = useMutation(api.ai.recordPayment);

  // Check for existing session payment on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(AI_PAYMENT_SESSION_KEY);
    if (stored) {
      try {
        const session: PaymentSession = JSON.parse(stored);
        // Session is valid for 24 hours
        if (session.confirmed && Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
          setHasSessionPayment(true);
        }
      } catch {
        // Invalid session data
      }
    }
  }, []);

  const handleButtonClick = () => {
    if (hasSessionPayment) {
      // Already paid in this session, go directly to AI modal
      if (isQuoteField) {
        setShowQuoteModal(true);
      } else {
        setShowWritingModal(true);
      }
    } else {
      // Show payment modal first
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = async (amount: number) => {
    try {
      // Record the payment in the database
      await recordPayment({
        profileId,
        userName: userName || "Anonymous",
        amount,
        fieldUsed: fieldName,
      });

      // Store in session
      const session: PaymentSession = {
        confirmed: true,
        amount,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(AI_PAYMENT_SESSION_KEY, JSON.stringify(session));
      setHasSessionPayment(true);

      // Close payment modal and open the appropriate AI modal
      setShowPaymentModal(false);
      if (isQuoteField) {
        setShowQuoteModal(true);
      } else {
        setShowWritingModal(true);
      }
    } catch (error) {
      console.error("Failed to record payment:", error);
      // Still allow them to proceed even if recording fails
      setShowPaymentModal(false);
      if (isQuoteField) {
        setShowQuoteModal(true);
      } else {
        setShowWritingModal(true);
      }
    }
  };

  const handleTextAccept = (text: string) => {
    onTextUpdate(text);
  };

  return (
    <>
      <AIWritingButton
        onClick={handleButtonClick}
        isQuoteField={isQuoteField}
      />

      <AIPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        userName={userName}
      />

      <AIWritingModal
        isOpen={showWritingModal}
        onClose={() => setShowWritingModal(false)}
        currentText={currentText}
        fieldName={fieldName}
        fieldLabel={fieldLabel}
        onAccept={handleTextAccept}
      />

      <QuoteGeneratorModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        onAccept={handleTextAccept}
      />
    </>
  );
}
