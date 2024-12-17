import { common, ecs, math, rendering } from "@gameup/engine";
import { WordHistoryEntry } from "@lexicon/common";
import { styles } from "../styles";

export class WordHistoryUpdater {
  private _wordHistoryEntryEntities: Array<ecs.Entity>;
  private _renderLayer: rendering.RenderLayer;
  private _world: ecs.World;

  constructor(
    leaderboardEntryEntities: Array<ecs.Entity>,
    renderLayer: rendering.RenderLayer,
    world: ecs.World
  ) {
    this._wordHistoryEntryEntities = leaderboardEntryEntities;
    this._renderLayer = renderLayer;
    this._world = world;
  }

  add(entry: WordHistoryEntry) {
    const entity = this._createEntity(entry);

    this._wordHistoryEntryEntities.unshift(entity);
    this._world.addEntity(entity);
  }

  set(entries: WordHistoryEntry[]) {
    for (const entry of entries) {
      this.add(entry);
    }
  }

  private _createEntity(entry: WordHistoryEntry) {
    const date = new Date();

    const wordTextRenderSource = new rendering.TextRenderSource(
      entry.word,
      styles.sidePanel.width - styles.sidePanel.padding.x * 2,
      styles.sidePanel.width - styles.sidePanel.padding.x * 2 - 40,
      "Share Tech Mono",
      18,
      entry.reason === "new" ? styles.colors.primary : styles.colors.grey,
      "start"
    );

    const scoreTextRenderSource = new rendering.TextRenderSource(
      `+${entry.score.toString()}`,
      styles.sidePanel.width - styles.sidePanel.padding.x * 2,
      styles.sidePanel.width - styles.sidePanel.padding.x,
      "Share Tech Mono",
      18,
      entry.reason === "new" ? styles.colors.white : styles.colors.grey,
      "end"
    );

    const scoreHistoryRenderSource = new rendering.CompositeRenderSource({
      word: wordTextRenderSource,
      score: scoreTextRenderSource,
    });

    const wordEntity = new ecs.Entity(
      `word (${entry.word},${entry.score},${date})`,
      [
        new rendering.SpriteComponent(
          scoreHistoryRenderSource,
          this._renderLayer.name,
          { anchor: math.Vector2.zero() }
        ),
        new common.PositionComponent(),
      ]
    );

    return wordEntity;
  }
}
