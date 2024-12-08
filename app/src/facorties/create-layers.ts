import type { rendering } from "@gameup/engine";

export const createLayers = (
  layerService: rendering.LayerService
) => {
  const backgroundRenderLayer = layerService.createLayer("background");
  const foregroundRenderLayer = layerService.createLayer("foreground");
  const focusedRenderLayer = layerService.createLayer("focused");
  const uiRenderLayer = layerService.createLayer("ui");
  const debugRenderLayer = layerService.createLayer("debug");

  return {
    backgroundRenderLayer,
    foregroundRenderLayer,
    focusedRenderLayer,
    uiRenderLayer,
    debugRenderLayer,
  };
};
