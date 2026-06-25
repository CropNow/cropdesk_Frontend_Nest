// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLockBodyScroll } from "../useLockBodyScroll";

describe("useLockBodyScroll", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  });

  test("should lock scroll when isLocked is true", () => {
    renderHook(() => useLockBodyScroll(true));
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.touchAction).toBe("none");
  });

  test("should not lock scroll when isLocked is false", () => {
    renderHook(() => useLockBodyScroll(false));
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.touchAction).toBe("");
  });
});
