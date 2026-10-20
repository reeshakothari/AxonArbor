"use client";

import { createContext, useContext } from "react";

/**
 * True inside the admin's inline editor. Sections with scroll-driven
 * storytelling use it to lay everything out at once, so every piece of
 * content is visible and clickable while editing.
 */
export const EditingContext = createContext(false);

export function useIsEditing() {
  return useContext(EditingContext);
}
