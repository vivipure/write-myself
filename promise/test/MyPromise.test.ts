import { assert, expect, it, test } from "vitest";
import MyPromise from "../MyPromise";
// Edit an assertion and save to see HMR in action

test("then", async () => {
  const myPromise = new MyPromise((res, rej) => {
    res("1");
  },);

  const res = await new Promise((resolve) => {
    myPromise.catch(err => {
      resolve(err)
    });
  });
  expect(res).toBe("1");
}, 5000);
