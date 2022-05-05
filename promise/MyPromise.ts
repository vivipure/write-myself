enum PromiseState {
  PENDDING = "PENDDING",
  FULFILLED = "FULFILLED",
  REJECTED = "REJECTED",
}

type PerfectFnType = (...args: any[]) => any;
type noob = undefined | null;

type PromiseCB = (resolve: PerfectFnType, reject: PerfectFnType) => any;

export default class MyPromise {
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

  then(thenCb: PerfectFnType | noob, catchCb?: PerfectFnType | noob) {
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
  catch(callback: PerfectFnType) {
    return this.then(null, callback);
  }

  finally() {}

  private _onSuccess(value: any) {
    if (this.state !== PromiseState.PENDDING) return;

    this.value = value;
    this.state = PromiseState.FULFILLED;

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

  private _onFail(error: any) {}
  static resolve() {}
  static reject() {}
  static all() {}
  static race() {}
  static any() {}
}
