// The new-invitation wizard keeps a draft in this tab (sessionStorage), so a reload returns to the same
// step with everything filled in. It's cleared once the invitation is created, and by startFresh.
export const DRAFT_KEY = "new-invitation-draft";

export function readDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

// onClick for the "new invitation" links: the wizard starts again from step 1, not where an earlier one stopped
export function startFresh() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {}
}
