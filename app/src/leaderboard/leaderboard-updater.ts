import { ecs, rendering } from "@gameup/engine";
import { LeaderboardEntry } from "@lexicon/common";

export class LeaderboardUpdater {
  private _leaderboardEntryEntities: Array<ecs.Entity>;

  constructor(leaderboardEntryEntities: Array<ecs.Entity>) {
    this._leaderboardEntryEntities = leaderboardEntryEntities;
  }

  update(entries: LeaderboardEntry[]) {
    for (let index = 0; index < 5; index++) {
      const entry = entries[index] ?? null;

      this.updateEntry(index, entry);
    }
  }

  updateEntry(index: number, entry?: LeaderboardEntry) {
    const entity = this._leaderboardEntryEntities[index];

    const layoutBoxComponentComponent =
      entity.getComponentRequired<rendering.LayoutBoxComponent>(
        rendering.LayoutBoxComponent.symbol
      );

    const nameAndRankEntity = layoutBoxComponentComponent.sortedEntities[0];
    const scoreEntity = layoutBoxComponentComponent.sortedEntities[1];

    entity.enabled = true;
    nameAndRankEntity.enabled = true;
    scoreEntity.enabled = true;

    const nameAndRankCompositeRenderSource =
      nameAndRankEntity.getComponentRequired<rendering.SpriteComponent>(
        rendering.SpriteComponent.symbol
      ).renderSource as rendering.CompositeRenderSource;

    const scoreTextRenderSource =
      scoreEntity.getComponentRequired<rendering.SpriteComponent>(
        rendering.SpriteComponent.symbol
      ).renderSource as rendering.TextRenderSource;

    const rankTextRenderSource = nameAndRankCompositeRenderSource
      .renderSources[0] as rendering.TextRenderSource;
    const nameTextRenderSource = nameAndRankCompositeRenderSource
      .renderSources[1] as rendering.TextRenderSource;

    if (entry) {
      scoreTextRenderSource.text = entry.score.toString();
      nameTextRenderSource.text = entry.username;
      rankTextRenderSource.text = (entry.rank + 1).toString();
    } else {
      scoreTextRenderSource.text = "-";
      nameTextRenderSource.text = "";
      rankTextRenderSource.text = "";
    }
  }
}
