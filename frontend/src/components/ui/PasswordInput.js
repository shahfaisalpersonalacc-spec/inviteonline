"use client";

import { useState } from "react";

export default function PasswordInput({ id, value, onChange, placeholder = "••••••••", autoComplete = "current-password", minLength }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input pr-16"
      />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-500 hover:text-brand-600">
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
