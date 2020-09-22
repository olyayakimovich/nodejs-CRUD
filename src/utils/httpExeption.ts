class HttpException extends Error {
  status: number;

  message: string;

  methodName?: string;

  args?: string[];

  constructor(status: number, message: string, methodName?: string, args?: string[]) {
    super(message);
    this.status = status;
    this.message = message;
    this.methodName = methodName;
    this.args = args;
  }
}

export default HttpException;
