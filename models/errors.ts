export class UserAlreadyCommentedError extends Error {
   constructor(message: string) {
      super(message);
      this.name = 'UserAlreadyCommentedError';

      // Restore the prototype chain
      Object.setPrototypeOf(this, UserAlreadyCommentedError.prototype);
   }
}
