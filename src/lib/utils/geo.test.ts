import { describe, expect, it } from "vitest";
import { distanceMeters, nearest } from "@/lib/utils/geo";

describe("branch distance helpers", () => {
  it("returns zero for the same location", () => expect(distanceMeters({ lat: 28.6139, lng: 77.209 }, { lat: 28.6139, lng: 77.209 })).toBe(0));
  it("selects the nearest branch", () => {
    const result = nearest({ lat: 28.6139, lng: 77.209 }, [{ id: "near", lat: 28.614, lng: 77.209 }, { id: "far", lat: 19.076, lng: 72.8777 }]);
    expect(result?.item.id).toBe("near");
    expect(result?.distance).toBeLessThan(100);
  });
});
