import { describe, it, expect } from "vitest";
import { REVEAL_DISTANCE_PX, revealOpacity } from "./revealOpacity";

describe("revealOpacity", () => {
  it("is 0 while the message is at or below the viewport edge", () => {
    expect(revealOpacity(800, 800)).toBe(0);
    expect(revealOpacity(900, 800)).toBe(0);
  });

  it("ramps from 0 to 1 as the message scrolls into view", () => {
    expect(revealOpacity(740, 800)).toBeCloseTo(0.5);
    expect(revealOpacity(700, 800)).toBeCloseTo(100 / 120);
  });

  it("stays fully visible once scrolled past the fade distance", () => {
    expect(revealOpacity(680, 800)).toBe(1);
    expect(revealOpacity(-100, 800)).toBe(1);
  });

  it("supports a custom fade distance", () => {
    expect(revealOpacity(740, 800, 240)).toBeCloseTo(0.25);
  });

  it("exposes the default fade distance", () => {
    expect(REVEAL_DISTANCE_PX).toBe(120);
  });
});
