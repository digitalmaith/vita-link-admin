import { useEffect, useCallback } from "react";

interface KeyboardShortcutOptions {
  onSearchOpen?: () => void;
  onSearchClose?: () => void;
  onEscape?: () => void;
  onArrowDown?: () => void;
  onArrowUp?: () => void;
  onEnter?: () => void;
  isSearchOpen?: boolean;
}

export function useKeyboardShortcuts({
  onSearchOpen,
  onSearchClose,
  onEscape,
  onArrowDown,
  onArrowUp,
  onEnter,
  isSearchOpen = false,
}: KeyboardShortcutOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl+K ou Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen?.();
        return;
      }

      // Échap
      if (e.key === "Escape") {
        if (isSearchOpen) {
          onSearchClose?.();
          onEscape?.();
        }
        return;
      }

      // Navigation dans les résultats
      if (isSearchOpen) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            onArrowDown?.();
            break;
          case "ArrowUp":
            e.preventDefault();
            onArrowUp?.();
            break;
          case "Enter":
            e.preventDefault();
            onEnter?.();
            break;
        }
      }
    },
    [isSearchOpen, onSearchOpen, onSearchClose, onEscape, onArrowDown, onArrowUp, onEnter]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}