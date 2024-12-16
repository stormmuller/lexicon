import { ecs, rendering } from "@gameup/engine";
import { LeaderboardEntryComponent } from "../components";

export class LeaderboardSystem extends ecs.System {
  constructor() {
    super("leaderboard", [
      LeaderboardEntryComponent.symbol,
      rendering.LayoutBoxComponent.symbol,
    ]);
  }

  async run(entity: ecs.Entity): Promise<void> {
    const leaderboardEntryComponent =
      entity.getComponentRequired<LeaderboardEntryComponent>(
        LeaderboardEntryComponent.symbol
      );

    const layoutBoxComponentComponent =
      entity.getComponentRequired<rendering.LayoutBoxComponent>(
        rendering.LayoutBoxComponent.symbol
      );

    if (!leaderboardEntryComponent.leaderboardEntry) {
      return;
    }

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

    const nameTextRenderSource = nameAndRankCompositeRenderSource
      .renderSources[0] as rendering.TextRenderSource;
    const rankTextRenderSource = nameAndRankCompositeRenderSource
      .renderSources[1] as rendering.TextRenderSource;

    scoreTextRenderSource.text =
      leaderboardEntryComponent.leaderboardEntry.score.toString();
    nameTextRenderSource.text =
      leaderboardEntryComponent.leaderboardEntry.username;
    rankTextRenderSource.text =
      leaderboardEntryComponent.leaderboardEntry.rank.toString();
  }
}
