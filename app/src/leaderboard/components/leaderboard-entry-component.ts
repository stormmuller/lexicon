import { ecs } from "@gameup/engine";
import { LeaderboardEntry } from "@lexicon/common";

export type LeaderboardEntryOrder = 0 | 1 | 2 | 3 | 4;

export class LeaderboardEntryComponent implements ecs.Component {
  name: symbol;
  leaderboardEntry?: LeaderboardEntry;
  order: LeaderboardEntryOrder;

  static symbol = Symbol("Leaderboard");

  constructor(
    order: number,
    leaderboardEntry?: LeaderboardEntry
  ) {
    this.name = LeaderboardEntryComponent.symbol;
    this.leaderboardEntry = leaderboardEntry;
    this.order = order as LeaderboardEntryOrder;
  }
}
