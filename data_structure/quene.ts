class Quene<T> {
  items: T[] = [];

  eqeue(elem: T) {
    this.items.push(elem);
  }
  deqeue(): T | undefined {
    return this.items.shift();
  }
  front(): T | undefined {
    return this.items[0];
  }
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  size(): number {
    return this.items.length;
  }
}
