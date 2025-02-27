export type Color = Hex | RGB;

export type Hex = `#${string}`;

export class RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a?: number = 1;

  constructor(r: number, g: number, b: number, a?: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}
