import axios from "axios";
import {
  poolInterface,
  positionInterface,
} from "../interface/interfaces.interface";

export const investQuery = async (
  subgraph: string,
  blockNumber: number,
  positionId: number
): Promise<void | positionInterface> => {
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

  return axios
    .post(subgraph, query)
    .then((res) => {
      return {
        id: res.data.position.id,
        owner: res.data.position.owner,
        tickLower: Number(res.data.position.tickLower),
        tickUpper: Number(res.data.position.tickUpper),
        liquidity: Number(res.data.position.liquidity),
        depositedToken0: Number(res.data.position.depositedToken0),
        depositedToken1: Number(res.data.position.depositedToken1),
        collectedFeesToken0: Number(res.data.position.collectedFeesToken0),
        collectedFeesToken1: Number(res.data.position.collectedFeesToken1),
      };
    })
    .catch((error) => {
      console.error(error);
    });
};

export const poolQuery = async (
  subgraph: string,
  blockNumber: number,
  address: string
): Promise<void | poolInterface> => {
  const query = `{
        pool(id: ${address}, block: {number:${blockNumber}}){
            liquidity
            token0Price
        }
    }`;

  return axios.post(subgraph, query).then((res) => {
    return {
      liquidity: Number(res.data.pool.liquidity),
      token0Price: Number(res.data.pool.token0Price),
    };
  });
};
