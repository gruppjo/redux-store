export class Store {
  private subscribers: Function[];
  private reducers: { [key: string]: Function };
  private state: { [key: string]: any };

  constructor(reducers = {}, initialState = {}) {
    this.subscribers = [];
    this.reducers = reducers;
    // empty action to initialize state
    this.state = this.reduce(initialState, {});
  }

  // store.value to access private member store.state
  get value() {
    return this.state;
  }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    this.notify(); // notify with current state

    return () => { // return unsubscribe function
      // remove this function from subscribers
      this.subscribers = this.subscribers.filter(sub => {
        return sub !== fn;
      })
    }
  }

  dispatch(action) {
    this.state = this.reduce(this.state, action);
    this.notify();
  }

  private notify() {
    this.subscribers.forEach(fn => fn(this.value));
  }

  private reduce(state, action) {
    const newState = {};

    for (const prop in this.reducers) {
      // newState.todos = this.reducers.todos(state.todos, action);
      newState[prop] = this.reducers[prop](state[prop], action);
    }

    console.log('STATE:::', state);
    return newState;
  }
}
