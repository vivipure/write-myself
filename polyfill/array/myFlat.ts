export function MyFlat(arr: any[], depth: number = 1) {
  if (depth === 0) {
    return arr;
  }
  const newArr: any[] = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      newArr.push(...MyFlat(item, depth - 1));
    } else {
      newArr.push(item);
    }
  });
  return newArr;
}
