function myAwait(g: Iterator<any>) {
  let result = g.next();
  while (!result.done) {
    result = g.next();
  }
  return result.value;
}

function get() {
  return {
    done: false,
    count: 0,
    next() {
      if (this.done) return { value: this.count, done: this.done };

      this.count++;
      if (this.count === 3) this.done = true;
      return { value: this.count, done: this.done };
    },
  };
}

function myAsync(fn: Generator) {
  const res = myAwait(fn);
  return Promise.resolve(res)
}
