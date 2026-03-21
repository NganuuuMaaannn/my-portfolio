"use client";

import { useEffect } from "react";

const isInspectionGuardDisabled =
  process.env.NEXT_PUBLIC_DISABLE_INSPECTION_GUARD?.trim().toLowerCase() ===
  "true";

export function InspectionGuard() {
  useEffect(() => {
    if (isInspectionGuardDisabled) {
      return;
    }

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isBlockedShortcut =
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && key === "u");

      if (!isBlockedShortcut) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return null;
}
