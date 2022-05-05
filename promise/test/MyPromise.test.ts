import { assert, expect, it, test } from "vitest";
import MyPromise from "../MyPromise";
// Edit an assertion and save to see HMR in action

test("then", () => {
  const myPromise = new MyPromise((res) => {
    res("default");
  });
  const res = "1";
  expect(myPromise).resolves.toBe('aaaa');
});
