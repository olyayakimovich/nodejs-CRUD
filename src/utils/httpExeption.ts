class HttpException extends Error {
  status: number;

  message: string;

  methodName?: string;

  body?: any;

  constructor(status: number, message: string, methodName?: string, body?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.methodName = methodName;
    this.body = body;
  }
}

export default HttpException;
