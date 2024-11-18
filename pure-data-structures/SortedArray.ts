const defaultComparator = <K>(a: K, b: K): number => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export class SortedArray<K, V> {
  private array: { key: K; value: V }[];
  private comparator: (a: K, b: K) => number;

  constructor(comparator: (a: K, b: K) => number = defaultComparator) {
    this.array = [];
    this.comparator = comparator;
  }

  add(key: K, value: V): void {
    let left = 0;
    let right = this.array.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.comparator(this.array[mid].key, key) < 0) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    this.array.splice(left, 0, { key, value });
  }

  delete(key: K): boolean {
    let left = 0;
    let right = this.array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const compare = this.comparator(this.array[mid].key, key);
      if (compare === 0) {
        this.array.splice(mid, 1);
        return true;
      } else if (compare < 0) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return false;
  }

  get(key: K): { key: K; value: V } | undefined {
    let left = 0;
    let right = this.array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const compare = this.comparator(this.array[mid].key, key);
      if (compare === 0) {
        return this.array[mid];
      } else if (compare < 0) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return undefined;
  }

  forEach = (callback: (key: K, value: V) => void): void => {
    this.array.forEach(({ key, value }) => callback(key, value));
  };

  public head(): { key: K; value: V } | undefined {
    return this.array[0];
  }

  public tail(): { key: K; value: V } | undefined {
    return this.array[this.array.length - 1];
  }

  public at = (index: number): { key: K; value: V } => {
    return this.array[index];
  };

  public print = () => {
    console.log(this.array);
  };
}
