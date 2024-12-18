import { common, ecs, rendering } from "@gameup/engine";

export const createRenderLayers = (
  layerService: rendering.LayerService,
  cameraEntity: ecs.Entity,
  worldSpace: common.Space,
  world: ecs.World
) => {
  const artRenderLayer = layerService.createLayer("art");
  const backgroundRenderLayer = layerService.createLayer("background");
  const foregroundRenderLayer = layerService.createLayer("foreground");
  const focusedRenderLayer = layerService.createLayer("focused");
  const uiRenderLayer = layerService.createLayer("ui");
  const debugRenderLayer = layerService.createLayer("debug");

  const layoutSystem = new rendering.LayoutSystem();

  const artRenderSystem = new rendering.RenderSystem(
    artRenderLayer,
    cameraEntity,
    worldSpace
  );

  const backgroundRenderSystem = new rendering.RenderSystem(
    backgroundRenderLayer,
    cameraEntity,
    worldSpace
  );

  const foregroundRenderSystem = new rendering.RenderSystem(
    foregroundRenderLayer,
    cameraEntity,
    worldSpace
  );

  const focusedRenderSystem = new rendering.RenderSystem(
    focusedRenderLayer,
    cameraEntity,
    worldSpace
  );

  const debugRenderSystem = new rendering.DebugRenderSystem(
    debugRenderLayer,
    cameraEntity,
    worldSpace
  );

  world.addSystems([
    layoutSystem,
    artRenderSystem,
    backgroundRenderSystem,
    foregroundRenderSystem,
    focusedRenderSystem,
    debugRenderSystem
  ]);

  return {
    artRenderLayer,
    backgroundRenderLayer,
    foregroundRenderLayer,
    focusedRenderLayer,
    uiRenderLayer,
    debugRenderLayer,
  };
};
