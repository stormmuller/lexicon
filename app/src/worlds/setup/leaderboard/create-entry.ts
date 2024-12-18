import { common, ecs, math, rendering } from "@gameup/engine";
import { styles } from "../../../styles";

export function createEntries(
  foregroundRenderLayer: rendering.RenderLayer,
  backgroundRenderLayer: rendering.RenderLayer,
  world: ecs.World,
  amount: number = 5
) {
  if (amount % 2 === 0) {
    throw new Error(
      "Need an odd amount of leader board enties so that the player can be in the middle"
    );
  }

  const entries = Array<ecs.Entity>();

  for (let index = 0; index < amount; index++) {
    entries.push(
      createEntry(
        index,
        amount,
        foregroundRenderLayer,
        backgroundRenderLayer,
        world
      )
    );
  }

  return entries;
}

export function createEntry(
  index: number,
  total: number,
  foregroundRenderLayer: rendering.RenderLayer,
  backgroundRenderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  const rankTextRenderSource = new rendering.TextRenderSource(
    "",
    styles.sidePanel.width - styles.sidePanel.padding.x * 2,
    styles.sidePanel.width - styles.sidePanel.padding.x,
    "Share Tech Mono",
    14,
    styles.colors.grey,
    "start"
  );

  const usernameTextRenderSource = new rendering.TextRenderSource(
    "",
    styles.sidePanel.width - styles.sidePanel.padding.x * 2,
    styles.sidePanel.width - styles.sidePanel.padding.x * 2 - 20,
    "Share Tech Mono",
    12,
    styles.colors.primary,
    "end"
  );

  const leaderboardEntryRenderSource = new rendering.CompositeRenderSource({
    rank: rankTextRenderSource,
    text: usernameTextRenderSource,
  });

  const nameAndRankEntity = new ecs.Entity(`name and rank ${index}`, [
    new rendering.SpriteComponent(
      leaderboardEntryRenderSource,
      foregroundRenderLayer.name,
      { anchor: math.Vector2.zero() }
    ),
    new common.PositionComponent(),
  ]);

  const scoreTextRenderSource = new rendering.TextRenderSource(
    "",
    styles.sidePanel.width - styles.sidePanel.padding.x * 2,
    styles.sidePanel.width - styles.sidePanel.padding.x,
    "Share Tech Mono",
    20,
    styles.colors.primary,
    "end"
  );

  const scoreEntity = new ecs.Entity(`score ${index}`, [
    new rendering.SpriteComponent(
      scoreTextRenderSource,
      foregroundRenderLayer.name,
      { anchor: math.Vector2.zero() }
    ),
    new common.PositionComponent(),
  ]);

  const containerRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.sidePanel.width,
    Math.floor(
      (styles.sidePanel.height - styles.sidePanel.padding.y * 2) / total
    ),
    0,
    "transparent"
  );

  const leaderboardEntryContainerEntity = new ecs.Entity(
    `leaderboard entry ${index}`,
    [
      new common.PositionComponent(),
      new common.RotationComponent(0),
      new rendering.SpriteComponent(
        containerRenderSource,
        backgroundRenderLayer.name,
        { anchor: math.Vector2.zero() }
      ),
      new rendering.LayoutBoxComponent(
        [nameAndRankEntity, scoreEntity],
        containerRenderSource.boundingBox,
        15,
        new math.Vector2(styles.sidePanel.padding.x, 10),
        "center",
        "bottom"
      ),
    ]
  );

  world.addEntity(nameAndRankEntity);
  world.addEntity(leaderboardEntryContainerEntity);
  world.addEntity(scoreEntity);

  return leaderboardEntryContainerEntity;
}
