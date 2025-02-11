export default class ApiResponse<TBody = never> {
  message: string;
  error: boolean = false;
  item?: TBody;
  items?: TBody[];
  requestErrors: Record<string, string[]>;

  constructor(
    message: string,
    item?: TBody,
    items?: TBody[],
    error: boolean = false,
    requestErrors?: Record<string, string[]>,
  ) {
    this.message = message;
    this.item = item;
    this.items = items;
    this.error = error;
    this.requestErrors = requestErrors ?? {};
  }
}

export class ApiResponseWithError<TBody = never> extends ApiResponse<TBody> {
  constructor(
    message: string,
    item?: TBody,
    items?: TBody[],
    requestErrors?: Record<string, string[]>,
  ) {
    super(message, item, items, true, requestErrors);
  }
}
