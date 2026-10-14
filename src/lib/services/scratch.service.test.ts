import { describe, expect, it } from "vitest";
import { chooseWeightedPrize } from "@/lib/services/scratch-policy";

describe("chooseWeightedPrize", () => {
  const prizes = [{ label: "Coffee", weight: 2 }, { label: "Cookie", weight: 1 }];
  it("selects from the first weight range", () => expect(chooseWeightedPrize(prizes, 1.5)).toBe("Coffee"));
  it("selects from the second weight range", () => expect(chooseWeightedPrize(prizes, 2.5)).toBe("Cookie"));
  it("returns null without prizes", () => expect(chooseWeightedPrize([], 0)).toBeNull());
});
