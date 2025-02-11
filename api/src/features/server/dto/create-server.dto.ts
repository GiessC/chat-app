export class CreateServerDto {
  readonly name: string;
  readonly ownerId: string; // ! Temporarily until auth
}
