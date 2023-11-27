export class HelloResponseDto {
  constructor(name: string, amount: number) {
    this.name = name;
    this.amount = amount;
  }

  name: string;
  amount: number;
}
