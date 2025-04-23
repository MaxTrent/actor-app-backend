import { Request, Response } from "express";

export default class ResponseNamespace {
  static sendSuccessMessage(res: Response, data: any, code: number, message: String) {
    let body = {
      error: false,
      success: true,
      data,
      code: res.status(code).statusCode,
      message: message
    };
    res.status(code).send(body);
  }

  static sendErrorMessage(req: Request, res: Response, err: Error, code: number, message: String) {
    let body = {
      error: true,
      success: false,
      message: err?.message || message,
      code: res.status(code).statusCode
    };
    res.status(code).send(body);
  }

  static BadUserRequestError(res: Response, message: string) {
    const status = 400;
    let body = {
      error: true,
      success: false,
      message: message,
      status: status,
      errorType: "BadUserRequestError"
    };
    res.status(status).send(body);
  }

  static NotFoundError(res: Response, message: string) {
    const status = 404;
    let body = {
      error: true,
      success: false,
      message: message,
      status: status,
      errorType: "NotFoundError"
    };
    res.status(status).send(body);
  }

  static UnauthorizedError(res: Response, message: string) {
    const status = 401;
    let body = {
      error: true,
      success: false,
      message: message,
      status: status,
      errorType: "UnAuthorizedError"
    };
    res.status(status).send(body);
  }

  static InternalServerError(res: Response, message: string) {
    const status = 500;
    let body = {
      error: true,
      success: false,
      message: message,
      status: status,
      errorType: "InternalServerError"
    };
    res.status(status).send(body);
  }

  static sendRequiredParameterMissingError(req: Request, res: Response, comment: string) {
    console.log("parameters are missing", comment);
    this.sendErrorMessage(
      req,
      res,
      {
        name: "",
        message: ""
      },
      res.status(400).statusCode,
      "one or more parameters missing from body"
    );
  }
}
