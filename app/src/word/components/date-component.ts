import { ecs } from "@gameup/engine";

export class DateComponent implements ecs.Component {
  name: symbol;
  dateTime: Date;

  static symbol = Symbol("DateComponent");

  constructor(dateTime: Date = new Date()) {
    this.name = DateComponent.symbol;
    this.dateTime = dateTime;
  }
}
