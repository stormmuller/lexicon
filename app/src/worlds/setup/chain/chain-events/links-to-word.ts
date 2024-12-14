import { ecs } from "@gameup/engine";
import { TileComponent } from "../../../../tile";

export function linksToWord(links: Array<ecs.Entity>) {
  let word = "";

  for (const link of links) {
    const tileComponent = link.getComponentRequired<TileComponent>(
      TileComponent.symbol
    );

    word += tileComponent.letter;
  }

  return word;
}
