import { ecs } from "@gameup/engine";

type Word = {
  text: string,
  score: number
};

export class WordHistoryComponent implements ecs.Component {
  name: symbol;
  private _words: Array<Word>;

  static symbol = Symbol("WordHistory");

  constructor(words: Array<Word> = []) {
    this.name = WordHistoryComponent.symbol;
    this._words = words;
  }

  public isEmpty(): boolean {
    return this._words.length === 0;
  }

  public add(word: Word) {
    this._words.push(word);
  }

  public conatins(word: Word) {
    for (const existingWord of this._words) {
      if (word === existingWord) {
        return true;
      }
    }

    return false;
  } 

  public clear() {
    this._words.length = 0;
  }
}
