class Counter {
  constructor() {
    this.commentCounter = 0;
  }

  countComment() {
    this.commentCounter += 1;
  }

  getCommentCount() {
    return this.commentCounter;
  }

  clearCommentCounter() {
    this.commentCounter = 0;
  }
}

export default Counter;