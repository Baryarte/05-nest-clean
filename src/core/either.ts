// This file defines two classes, Left and Right, which represent the two possible outcomes of an Either type.
// The Either type is commonly used in functional programming to represent a value that can be either a success or a failure.

// The Left class represents the failure outcome of an Either type.
/**
 * Represents the Left side of an Either type.
 * @template L - The type of the Left value.
 * @template R - The type of the Right value.
 */
export class Left<L, R> {
  readonly value: L

  /**
   * Creates a new instance of Left.
   * @param value - The value of the Left side.
   */
  constructor(value: L) {
    this.value = value
  }

  /**
   * Checks if the instance is of type Left.
   * @returns true if the instance is of type Left, false otherwise.
   */
  isLeft(): this is Left<L, R> {
    return true
  }

  /**
   * Checks if the instance is of type Right.
   * @returns true if the instance is of type Right, false otherwise.
   */
  isRight(): this is Right<L, R> {
    return false
  }
}

// The Right class represents the success outcome of an Either type.
/**
 * Represents a Right value in the Either monad.
 * @template L - The type of the Left value.
 * @template R - The type of the Right value.
 */
export class Right<L, R> {
  readonly value: R

  /**
   * Creates a new instance of Right.
   * @param value - The value of the Right instance.
   */
  constructor(value: R) {
    this.value = value
  }

  /**
   * Checks if the instance is of type Left.
   * @returns False if the instance is of type Left.
   */
  isLeft(): this is Left<L, R> {
    return false
  }

  /**
   * Checks if the instance is of type Right.
   * @returns True if the instance is of type Right.
   */
  isRight(): this is Right<L, R> {
    return true
  }
}

// The Either type is a union type that can be either a Left or a Right.
export type Either<L, R> = Left<L, R> | Right<L, R>

// Factory function to create a Left instance.
export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

// Factory function to create a Right instance.
export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}
