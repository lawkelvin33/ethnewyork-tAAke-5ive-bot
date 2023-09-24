import axios from "axios";

export const investQuery = async (
  subgraph: string,
  blockNumber: number,
  positionId: number
) => {
  const query = `{
        position(id: ${positionId}, block:{number:${blockNumber}}){
            id
            owner
            tickLower
            tickUpper
            liquidity
            depositedToken0
            depositedToken1
            collectedFeesToken0
            collectedFeesToken1
        }
    }`;
};

export const poolQuery = async (
  subgraph: string,
  blockNumber: number,
  address: string
) => {
  const query = `{
        
    }`;
};
