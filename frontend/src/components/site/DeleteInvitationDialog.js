"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";

// Asks once before deleting an invitation. `onConfirm()` does the delete and throws on failure;
// the error is shown inside the dialog and it stays open.
export default function DeleteInvitationDialog({ open, title, onClose, onConfirm }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function close() {
    if (busy) return;
    setError("");
    onClose();
  }

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={close} title="Delete invitation?">
      <p className="text-sm text-ink-500">
        {title ? <>&ldquo;{title}&rdquo; and all</> : "All"} its RSVPs and wishes will be permanently deleted, and the link will stop working. This can&apos;t be undone.
      </p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={close} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn-danger" onClick={confirm} disabled={busy}>
          {busy && <Spinner className="h-4 w-4" />} {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
