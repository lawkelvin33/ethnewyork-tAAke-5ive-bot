export interface GetUniswapV3PositionsParams {
  chain: chainInterface;
  project: string;
  owner: string;
  positionManager: string;
  farmedPositionIds: string[];
  positionIds: string[];
  toaster: string;
  ignoreUnknownToken: boolean;
  masterChef?: string;
  rewardToken?: string;
  tokens: { priceUSD: number; address: string; decimals: number }[];
}

export interface chainInterface {
  chainId: number;
  logoURI: string;
  name: string;
  symbol: string;
  explorer: string;
  multicallAddress: string;
  rpcUrls: string[];
}
export interface V3PositionCall {
  nonce: bigint;
  operator: string;
  token0: string;
  token1: string;
  fee: bigint;
  tickLower: bigint;
  tickUpper: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
}

export interface V3PositionTotalValue {
  amount0: bigint;
  amount1: bigint;
  sqrtRatioX96: bigint;
}

export interface V3Position {
  positionId: number;
  name: string;
  value: number;
  tokenAmount: number[];
  ratio: number[];
  timeElapsed: number;
  valueChange: number;
  chatId: number;
}
