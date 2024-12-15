interface Tile {
  x: number;
  y: number;
};

export type ChainCompleteRpcRequest = {
  tiles: Array<Tile>;
};

export type ChainCompleteRpcResponse = {
  word: string;
  score: number;
};
