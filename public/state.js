export class State {
  constructor(state) {
    this.state = state;
    this.callbacks = [];
  }

  setState(newValue) {
    if (newValue === this.state) {
      return;
    }

    const oldValue = this.state;
    this.state = newValue;

    this.callbacks.forEach((fun) => {
      fun(this.state, oldValue);
    });
  }

  sub(callback) {
    this.callbacks.push(callback);
  }

  get value() {
    return this.state;
  }
}
