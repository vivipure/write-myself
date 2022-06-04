type ArrayIterationCallbackFunction = (item: any, i: number, arr: any[]) => any;
type ArrayReduceCallbackFunction = (
  previousValue: any,
  currentValue: any,
  currentIndex: number,
  array: any[]
) => any;

export function myForeach(
  arr: any[],
  callback: ArrayIterationCallbackFunction
) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i, arr);
  }
}
export function myMap(arr: any[], callback: ArrayIterationCallbackFunction) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = callback(arr[i], i, arr);
  }
  return newArr;
}

export function myReduce(
  arr: any[],
  callback: ArrayReduceCallbackFunction,
  initValue?: any
) {
  let initIndex = initValue ? 0 : 1;
  let accValue = initValue !== undefined ? initValue : arr[0];

  for (let i = initIndex; i < arr.length; i++) {
    accValue = callback(accValue, arr[i], i, arr);
  }
  return accValue;
}

type ArrayFilterCallbackFunction = Parameters<typeof Array.prototype.filter>[0]


export function myFilter(arr: any[], callback: ArrayFilterCallbackFunction) {
  let filterArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr)) {
      filterArr.push(arr[i]);
    }
  }
  return filterArr;
}

