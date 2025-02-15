import { ErrorCode } from './errors/error-code';

export default class ApiResponse<TBody = never> {
  message: string;
  errorCode?: ErrorCode;
  error: boolean = false;
  item?: TBody;
  items?: TBody[];
  requestErrors: Record<string, string[]>;

  constructor(
    message: string,
    item?: TBody,
    items?: TBody[],
    error: boolean = false,
    errorCode?: ErrorCode,
    requestErrors?: Record<string, string[]>,
  ) {
    this.message = message;
    this.item = item;
    this.items = items;
    this.error = error;
    this.errorCode = errorCode;
    this.requestErrors = requestErrors ?? {};
  }
}

export class ApiResponseWithError<TBody = never> extends ApiResponse<TBody> {
  constructor(
    message: string,
    errorCode?: ErrorCode,
    item?: TBody,
    items?: TBody[],
    requestErrors?: Record<string, string[]>,
  ) {
    super(message, item, items, true, errorCode, requestErrors);
  }
}
