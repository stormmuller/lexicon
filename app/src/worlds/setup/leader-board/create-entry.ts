import { common, ecs, rendering } from "@gameup/engine";
import { styles } from "../../../styles";

export function createEntries(
  renderLayer: rendering.RenderLayer,
  world: ecs.World,
  amount: number = 5
) {
  if (amount % 2 === 0) {
    throw new Error(
      "Need an odd amount of leader board enties so that the player can be in the middle"
    );
  }

  const entries = Array<ecs.Entity>();

  for (let i = 0; i < amount; i++) {
    entries.push(createEntry(i, renderLayer));
  }

  world.addEntities(entries);

  return entries;
}

export function createEntry(index: number, renderLayer: rendering.RenderLayer) {
  const rankTextRenderSource = new rendering.TextRenderSource(
    "20",
    styles.sidePanel.width - styles.sidePanel.padding.x * 2,
    styles.sidePanel.width - styles.sidePanel.padding.x - 70,
    "Share Tech Mono",
    18,
    styles.colors.grey,
    "start"
  );

  const usernameTextRenderSource = new rendering.TextRenderSource(
    `username`,
    styles.sidePanel.width - styles.sidePanel.padding.x * 2,
    styles.sidePanel.width - styles.sidePanel.padding.x,
    "Share Tech Mono",
    16,
    styles.colors.primary,
    "end"
  );

  const leaderboardEntryRenderSource = new rendering.CompositeRenderSource({
    rank: rankTextRenderSource,
    text: usernameTextRenderSource,
  });

  const entryEntity = new ecs.Entity(`leaderboard ${index}`, [
    new rendering.SpriteComponent(
      leaderboardEntryRenderSource,
      renderLayer.name
    ),
    new common.PositionComponent(),
  ]);

  return entryEntity;
}
