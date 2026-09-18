"use client";

import { useState } from "react";

export default function CopyInventory({ promptText }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Clipboard API can fail on non-HTTPS/non-localhost contexts —
      // the text is still selectable manually below.
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        readOnly
        value={promptText}
        rows={12}
        className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-mono bg-white"
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="font-body bg-navy text-cream rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90"
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>

        <a
          href="https://claude.ai/new"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body rounded-md border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-white"
        >
          Open Claude.ai
        </a>
      </div>

      <p className="font-body text-xs text-stone-400">
        Paste the copied text into the new chat to get recipe ideas based on
        what's in your fridge right now.
      </p>
    </div>
  );
}
