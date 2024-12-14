// import { ecs, rendering } from "@gameup/engine";
// import { WordComponent, WordHistoryComponent } from "../components";

// export class WordHistoryDisplaySystem extends ecs.System {
//   private _entities: Array<ecs.Entity>;

//   constructor() {
//     super("word history display", [
//       rendering.SpriteComponent.symbol,
//       WordHistoryComponent.symbol,
//     ]);
//   }

//   async run(entity: ecs.Entity): Promise<void> {
//     const spriteComponent =
//       entity.getComponentRequired<rendering.SpriteComponent>(
//         rendering.SpriteComponent.symbol
//       );

//     const wordComponent = entity.getComponentRequired<WordComponent>(
//       WordComponent.symbol
//     );

//     if (!(spriteComponent.renderSource instanceof rendering.TextRenderSource)) {
//       // This enetity does not have a text render source (it might be some other render source e.g. Image)
//       return;
//     }

//     const textRenderSource =
//       spriteComponent.renderSource as rendering.TextRenderSource;
//     textRenderSource.text = wordComponent.word;
//   }
// }
