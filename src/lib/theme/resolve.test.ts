import { describe, expect, it } from "vitest";
import { isThemePreference, resolveTheme } from "./resolve";

describe("resolveTheme", () => {
  it.each([
    ["light", true, "light"],
    ["light", false, "light"],
    ["dark", true, "dark"],
    ["dark", false, "dark"],
    ["system", true, "dark"],
    ["system", false, "light"],
  ] as const)("%s (SO escuro=%s) -> %s", (pref, systemDark, expected) => {
    expect(resolveTheme(pref, systemDark)).toBe(expected);
  });
});

describe("isThemePreference", () => {
  it("aceita apenas os 3 valores válidos", () => {
    expect(["light", "dark", "system"].every(isThemePreference)).toBe(true);
    for (const bad of ["", "auto", "Dark", null, undefined, 1, {}]) expect(isThemePreference(bad)).toBe(false);
  });
});
