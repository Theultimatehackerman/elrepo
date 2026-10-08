import { describe, expect, it } from "vitest";
import { isEditableTarget, isThemeShortcut, nextTheme, type ShortcutKeyEvent } from "./shortcut";

const base: ShortcutKeyEvent = { code: "KeyT", altKey: true, shiftKey: true, ctrlKey: false, metaKey: false, repeat: false };

describe("isThemeShortcut (L16)", () => {
  it("aceita Alt+Shift+T", () => expect(isThemeShortcut(base)).toBe(true));
  it.each([
    ["sem Alt", { altKey: false }],
    ["sem Shift", { shiftKey: false }],
    ["com Ctrl", { ctrlKey: true }],
    ["com Meta", { metaKey: true }],
    ["outra tecla", { code: "KeyY" }],
    ["tecla repetida", { repeat: true }],
  ])("rejeita %s", (_label, patch) => expect(isThemeShortcut({ ...base, ...patch })).toBe(false));
});

describe("isEditableTarget", () => {
  it.each(["input", "TEXTAREA", "select"])("campo %s é editável", (tagName) => expect(isEditableTarget({ tagName })).toBe(true));
  it("contenteditable é editável", () => expect(isEditableTarget({ tagName: "DIV", isContentEditable: true })).toBe(true));
  it("botão e null não são", () => {
    expect(isEditableTarget({ tagName: "BUTTON" })).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });
});

describe("nextTheme", () => {
  it("alterna o tema efetivo", () => {
    expect(nextTheme("dark")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
  });
});
