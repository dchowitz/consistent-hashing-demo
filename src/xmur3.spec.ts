import hash from "./xmur3";

test("different hash for similar values (no real test)", () => {
  const hash1 = hash("foo");
  const hash2 = hash("boo");
  expect(hash1).not.toBe(hash2);
});

test("same hash for same values", () => {
  const hash1 = hash("foo");
  const hash2 = hash("foo");
  expect(hash1).toBe(hash2);
});

test("hash is non-negative (no real test)", () => {
  for (let i = 0; i < 10000; i++) {
    expect(hash(i.toString())).toBeGreaterThanOrEqual(0);
  }
});
