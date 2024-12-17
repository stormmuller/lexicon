import {
  animations,
  common,
  ecs,
  game,
  rendering,
  timer,
} from "@gameup/engine";
import { styles } from "../styles";
import {
  createArt,
  createBoard,
  createCameras,
  createChain,
  createInputs,
  createRenderLayers,
} from "./setup";
import { createWordDisplay as createWordDisplay } from "./setup/word-display";
import { createWordHistory } from "./setup/word-history";
import { createLeaderboard } from "./setup/leaderboard";
import {
  onAddedToChain,
  onChainComplete,
  onRemovedFromChain,
} from "./setup/chain/events";

export async function createMainWorld(
  worldSpace: common.Space,
  layerService: rendering.LayerService,
  gameContainer: HTMLElement,
  game: game.Game
) {
  const world = new ecs.World(game);
  const inputsEntity = createInputs(world, gameContainer);
  const imageCache = new rendering.ImageCache();

  const animationSystem = new animations.AnimationSystem(game.time);
  world.addSystem(animationSystem);

  const timerSystem = new timer.TimerSystem(game.time);
  world.addSystem(timerSystem);

  const { worldCamera } = createCameras(world, worldSpace, inputsEntity, game);
  const {
    foregroundRenderLayer,
    backgroundRenderLayer,
    focusedRenderLayer,
    artRenderLayer,
  } = createRenderLayers(layerService, worldCamera, worldSpace, world);

  void createArt(imageCache, artRenderLayer, world);

  const tileImageRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.tile.size,
    styles.tile.size,
    styles.tile.borderRaduis,
    styles.tile.backgroundColor
  );

  const tileChainImageRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.tile.size,
    styles.tile.size,
    styles.tile.borderRaduis,
    styles.tile.backgroundColor,
    { width: 2, color: styles.line.color }
  );

  const { wordTextEntity } = createWordDisplay(
    world,
    foregroundRenderLayer,
    backgroundRenderLayer
  );

  const { bookEntity, wordHistoryUpdater } = await createWordHistory(
    world,
    backgroundRenderLayer,
    foregroundRenderLayer,
    imageCache
  );

  const { leaderboardUpdater } = createLeaderboard(
    world,
    backgroundRenderLayer,
    foregroundRenderLayer
  );

  const onChainCompleteCallback = onChainComplete({
    renderSource: tileImageRenderSource,
    renderLayer: foregroundRenderLayer,
    wordTextEntity,
    bookEntity,
    leaderboardUpdater,
    wordHistoryUpdater
  });

  const onRemovedFromChainCallback = onRemovedFromChain({
    renderSource: tileImageRenderSource,
    renderLayer: foregroundRenderLayer,
    wordTextEntity,
  });

  const onAddedToChainCallback = onAddedToChain({
    renderSource: tileChainImageRenderSource,
    renderLayer: foregroundRenderLayer,
    wordTextEntity,
  });

  createChain(
    world,
    inputsEntity,
    worldCamera,
    worldSpace,
    foregroundRenderLayer,
    onChainCompleteCallback,
    onRemovedFromChainCallback,
    onAddedToChainCallback
  );

  void createBoard(
    foregroundRenderLayer,
    focusedRenderLayer,
    world,
    inputsEntity,
    worldCamera,
    worldSpace
  );

  return world;
}
