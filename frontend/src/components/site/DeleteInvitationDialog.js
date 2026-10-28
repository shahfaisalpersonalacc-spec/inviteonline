"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import PasswordInput from "@/components/ui/PasswordInput";
import Spinner from "@/components/ui/Spinner";

// Confirms deleting an invitation with the account password. `onConfirm(password)` does the delete
// and throws on failure; a wrong password keeps the dialog open with the message shown inside it.
export default function DeleteInvitationDialog({ open, title, onClose, onConfirm }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function close() {
    if (busy) return;
    setPassword("");
    setError("");
    onClose();
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onConfirm(password);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={close} title="Delete invitation?">
      <form onSubmit={submit}>
        <p className="text-sm text-ink-500">
          {title ? <>&ldquo;{title}&rdquo; and all</> : "All"} its RSVPs and wishes will be permanently deleted, and the link will stop working. This can&apos;t be undone.
        </p>
        <label className="label mt-5" htmlFor="delete-password">
          Enter your password to confirm
        </label>
        <PasswordInput id="delete-password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={close} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn-danger" disabled={busy || !password}>
            {busy && <Spinner className="h-4 w-4" />} {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
