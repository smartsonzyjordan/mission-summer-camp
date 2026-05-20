"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/context/AppState";
import { createParentPin, verifyParentPin } from "@/services/parentAuth";
import type { ParentAction } from "@/types";

type ParentGateModalProps = {
  action: ParentAction;
  onApproved: () => void;
  onClose: () => void;
};

const actionText: Record<ParentAction, string> = {
  "approve-stars": "Approve mission stars",
  "unlock-reward": "Claim a reward",
  analytics: "Open parent analytics",
  "parent-settings": "Update parent PIN"
};

export function ParentGateModal({ action, onApproved, onClose }: ParentGateModalProps) {
  const { state, dispatch } = useAppState();
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [mode, setMode] = useState<"pin" | "otp" | "setup">(state.parentPin ? "pin" : "setup");
  const [error, setError] = useState("");

  const append = (value: string) => {
    setError("");
    setPin((current) => (current.length < 6 ? `${current}${value}` : current));
  };

  const submitPin = async () => {
    if (mode === "setup") {
      if (!newPin.match(/^\d{4,6}$/)) {
        setError("Choose a 4 to 6 digit parent PIN.");
        return;
      }
      dispatch({ type: "SET_PARENT_PIN", record: await createParentPin(newPin) });
      setPin("");
      setNewPin("");
      setMode("pin");
      setError("Parent PIN saved. Please enter it now to approve this action.");
      return;
    }

    const ok = await verifyParentPin(pin, state.parentPin);
    if (!ok) {
      setError("That PIN did not match.");
      setPin("");
      return;
    }

    if (action === "parent-settings" && newPin) {
      dispatch({ type: "SET_PARENT_PIN", record: await createParentPin(newPin) });
    }
    onApproved();
    onClose();
  };

  const sendOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setMode("otp");
    setError(`Parent OTP simulation: ${code}`);
  };

  const submitOtp = () => {
    if (otp === generatedOtp && generatedOtp) {
      setOtp("");
      setPin("");
      setNewPin("");
      setMode("setup");
      setError("OTP verified. Parent can set a new PIN, then must enter that PIN to approve.");
      return;
    }
    setError("OTP did not match.");
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        className="gold-panel w-full max-w-sm rounded-[2rem] p-5"
        initial={{ scale: 0.86, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-600 text-3xl shadow-glow">
            <i className="ti ti-lock-star" />
          </div>
          <div>
            <div className="text-lg font-black uppercase text-amber-300">Parent Validation</div>
            <div className="text-sm text-slate-300">{actionText[action]}</div>
          </div>
        </div>

        {mode === "setup" ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-200">Parent only: create a private PIN. Saving the PIN will not approve tasks until the PIN is entered.</p>
            <input
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-center text-2xl tracking-[0.3em] outline-none focus:border-cyan-300"
              value={newPin}
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setNewPin(event.target.value.replace(/\D/g, ""))}
              placeholder="PIN"
            />
            <button type="button" className="btn-primary w-full" onClick={submitPin}>
              Save PIN
            </button>
          </div>
        ) : mode === "otp" ? (
          <div className="space-y-3">
            <input
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-center text-2xl tracking-[0.3em] outline-none focus:border-cyan-300"
              value={otp}
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              placeholder="OTP"
            />
            <button type="button" className="btn-primary w-full" onClick={submitOtp}>
              Verify Parent OTP
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-center gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-full border border-violet-300 ${index < pin.length ? "bg-violet-400" : "bg-white/5"}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {"123456789".split("").map((number) => (
                <button key={number} type="button" className="h-14 rounded-2xl bg-white/10 text-xl font-black" onClick={() => append(number)}>
                  {number}
                </button>
              ))}
              <button type="button" className="h-14 rounded-2xl bg-white/10 text-sm font-black" onClick={() => setPin("")}>
                Clear
              </button>
              <button type="button" className="h-14 rounded-2xl bg-white/10 text-xl font-black" onClick={() => append("0")}>
                0
              </button>
              <button type="button" className="h-14 rounded-2xl bg-white/10 text-xl font-black" onClick={() => setPin((value) => value.slice(0, -1))}>
                <i className="ti ti-backspace" />
              </button>
            </div>
            {action === "parent-settings" ? (
              <input
                className="mt-3 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-center tracking-[0.2em] outline-none focus:border-cyan-300"
                value={newPin}
                inputMode="numeric"
                maxLength={6}
                onChange={(event) => setNewPin(event.target.value.replace(/\D/g, ""))}
                placeholder="New PIN optional"
              />
            ) : null}
            <button type="button" className="btn-primary mt-4 w-full" onClick={submitPin}>
              Validate
            </button>
          </div>
        )}

        {error ? <div className="mt-3 rounded-2xl bg-white/10 p-3 text-center text-sm text-amber-200">{error}</div> : null}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" className="h-11 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-slate-200" onClick={sendOtp}>
            Reset PIN
          </button>
          <button type="button" className="h-11 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-slate-200" onClick={onClose}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
