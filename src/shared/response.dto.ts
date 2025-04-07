// export interface IResponse<T = any> {
//   statusCode: number;
//   message: string;
//   data: T | T[];
// }

// export class SuccessResponse<T = any> implements IResponse<T> {
//   /** @example "Success" */
//   message: string;
//   /** @example ["data1", "data2"] or { user: {...} } */
//   data: T | T[];
//   /** @example 200 */
//   statusCode: number;

//   constructor(message: string, data?: T | T[], statusCode: number = 200) {
//     this.statusCode = statusCode;
//     this.message = message;
//     this.data = data || [];
//   }
// }

// export class SuccessResponse<T = any> {
//   /** @example 200 */
//   statusCode: number;

//   /** @example "Operation successful" */
//   message: string;

//   /** @example { id: 1 } or [{ id: 1 }, { id: 2 }] */
//   data?: T | T[]; // Make data optional

//   constructor(message: string, data?: T | T[], statusCode: number = 200) {
//     this.statusCode = statusCode;
//     this.message = message;

//     // Only assign if provided (keeps it undefined otherwise)
//     if (data !== undefined) {
//       this.data = Array.isArray(data) ? data : data;
//     }
//   }
// }

export class SuccessResponse<T = any> {
  /**
   * @example 200
   */
  statusCode: number;

  /**
   * @example "Operation successful"
   */
  message: string;

  /**
   * @example { id: 1 } or [{ id: 1 }, { id: 2 }]
   */
  data?: T;

  constructor(message: string, data?: T, statusCode: number = 200) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * Static constructor for array responses
   */
  static array<T>(
    message: string,
    data: T[],
    statusCode: number = 200,
  ): SuccessResponse<T[]> {
    return new SuccessResponse(message, data, statusCode);
  }

  /**
   * Static constructor for empty responses
   */
  static empty(
    message: string,
    statusCode: number = 200,
  ): SuccessResponse<void> {
    return new SuccessResponse(message, undefined, statusCode);
  }
}
