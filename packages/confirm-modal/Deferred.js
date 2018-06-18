export default class Deferred {
  constructor() {
    this.resolver = null;
    this.promise = new Promise(r => {
      this.resolver = r;
    });
  }

  resolve(v) {
    return this.resolver && this.resolver(v);
  }
}
