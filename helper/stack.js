class ObjectStack {
    constructor() {
      this.items = []; // initially, the stack is empty.
    }

    push(item) {
        this.items.push(item);
        return item;
    }

    pop() {
        return this.items.pop();
    }

    size() {
        return this.items.length;
    }

    peek() {
        return this.items[this.size() - 1];
    }

    isExist(item){
        return (this.items.indexOf(item) !== -1) ? true : false;
    }
  }

module.exports = {ObjectStack};