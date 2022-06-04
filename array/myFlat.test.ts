import {  expect, test } from "vitest";
import { MyFlat } from "./myFlat";


const arr = [1, 2, 3, [1], [2], [3, [1, 2, 3]]];

test("test myFlat with empty arguments", () => {
  const result = JSON.stringify([1, 2, 3, 1, 2, 3, [1, 2, 3]]);
  expect(JSON.stringify(MyFlat(arr))).toBe(result);
});

test("test myFlat with one depth", () => {
  const result = JSON.stringify([1, 2, 3, 1, 2, 3, [1, 2, 3]]);

  expect(JSON.stringify(MyFlat(arr, 1))).toBe(result);
});

test("test myFlat with zero depth", () => {
  const result = JSON.stringify(arr);
  expect(JSON.stringify(MyFlat(arr, 0))).toBe(result);
});

test("test myFlat with two depth", () => {
  const result = JSON.stringify([1, 2, 3, 1, 2, 3, 1, 2, 3]);
  expect(JSON.stringify(MyFlat(arr, 2))).toBe(result);
});
test("test myFlat with infinity", () => {
  const result = JSON.stringify([1, 2, 3, 1, 2, 3, 1, 2, 3]);
  expect(JSON.stringify(MyFlat(arr, Infinity))).toBe(result);
});
