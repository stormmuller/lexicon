import { ecs } from "@gameup/engine";

export class WordComponent implements ecs.Component {
  name: symbol;
  word: string;

  static symbol = Symbol("Word");

  constructor(word: string = "") {
    this.name = WordComponent.symbol;
    this.word = word;
  }

  public isEmpty(): boolean {
    return this.word.length === 0;
  }

  public add(textToAdd: string) {
    this.word += textToAdd;
    return this.word;
  }

  public clear() {
    this.word = "";
  }
}
