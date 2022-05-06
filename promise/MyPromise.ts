enum PromiseState {
  PENDDING = "pendding",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

type PerfectFnType = (...args: any[]) => any;
type noob = undefined | null;

type PromiseCB = (resolve: PerfectFnType, reject: PerfectFnType) => any;

class UncaughtPromiseError extends Error {
  constructor(msg: string) {
    super(msg);
    this.stack = `(in promise) ${this.stack}`;
  }
}

export default class MyPromise<T extends any = any> {
  private thenCbs: PerfectFnType[] = [];
  private catchCbs: PerfectFnType[] = [];
  state = PromiseState.PENDDING;
  value: any;

  constructor(cb: PromiseCB) {
    try {
      cb(this._onSuccess.bind(this), this._onFail.bind(this));
    } catch (error: any) {
      this._onFail(error);
    }
  }

  then(
    thenCb: PerfectFnType | noob,
    catchCb?: PerfectFnType | noob
  ): MyPromise {
    return new MyPromise((resolve, reject) => {
      this.thenCbs.push((result) => {
        if (thenCb == null) {
          resolve(result);
          return;
        }

        try {
          resolve(thenCb(result));
        } catch (error) {
          reject(error);
        }
      });

      this.catchCbs.push((result) => {
        if (catchCb == null) {
          reject(result);
          return;
        }

        try {
          resolve(catchCb(result));
        } catch (error) {
          reject(error);
        }
      });

      this.runCallbacks();
    });
  }
  catch(callback: PerfectFnType): MyPromise {
    return this.then(null, callback);
  }

  finally(cb: PerfectFnType): MyPromise {
    return this.then(
      (result) => {
        cb();
        return result;
      },
      (result) => {
        cb();
        return result;
      }
    );
  }

  private _onSuccess(value: any) {
    if (this.state !== PromiseState.PENDDING) return;

    // 支持promise值
    if (value instanceof MyPromise) {
      value.then(this._onSuccess.bind(this), this._onFail.bind(this));
      return;
    }

    this.value = value;
    this.state = PromiseState.FULFILLED;

    this.runCallbacks();
  }
  private _onFail(error: any) {
    if (this.state !== PromiseState.PENDDING) return;

    if (error instanceof MyPromise) {
      error.then(this._onSuccess.bind(this), this._onFail.bind(this));
      return;
    }

    // 错误未捕获时进行抛出
    if (this.catchCbs.length === 0) {
      throw new UncaughtPromiseError(String(error));
    }

    this.value = error;
    this.runCallbacks();
  }

  private runCallbacks() {
    if (this.state === PromiseState.FULFILLED) {
      this.thenCbs.forEach((callback) => {
        callback(this.value);
      });

      this.thenCbs = [];
      return;
    }

    if (this.state === PromiseState.REJECTED) {
      this.catchCbs.forEach((callback) => {
        callback(this.value);
      });

      this.catchCbs = [];
    }
  }

  static resolve(value: any) {
    return new this((res) => {
      res(value);
    });
  }
  static reject(reason: any) {
    return new this((_, reject) => {
      reject(reason);
    });
  }
  static all(promiseArr: Iterable<any>) {
    const arr = Array.from(promiseArr);
    let resolveCount = 0;
    let resolveArr = [];
    return new this((resolve, reject) => {
      for (let i = 0; i < arr.length; i++) {
        this.resolve(arr[i]).then((res) => {
          resolveCount++;
          resolveArr[i] = res;
          if (resolveCount === arr.length) {
            resolve(arr);
          }
        }, reject);
      }
    });
  }
  static race(promises: MyPromise[]) {
    return new this((resovle, reject) => {
      promises.forEach((p) => {
        p.then(resovle).catch(reject);
      });
    });
  }
  static any(promises: MyPromise[]) {
    const errors = [];
    let rejectedPromises = 0;
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then(resolve).catch((value) => {
          rejectedPromises++;
          errors[i] = value;
          if (rejectedPromises === promises.length) {
            reject(new Error("All promises were rejected"));
          }
        });
      }
    });
  }

  static allSettled(promises: MyPromise[]): MyPromise<Settled[]> {
    const result = [];
    let completCount = 0;
    return new this((resolve) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i]
          .then((value) => {
            resolve({
              status: PromiseState.FULFILLED,
              value,
            });
          })
          .catch((reason) => {
            resolve({
              reason,
              status: PromiseState.REJECTED,
            });
          });
      }
    });
  }
}

interface Settled {
  status: PromiseState.FULFILLED | PromiseState.REJECTED;
  reason?: any;
  value?: any;
}
