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

  return axios
    .post(subgraph, query)
    .then((res) => {
      return {
        id: res.data.position.id,
        owner: res.data.position.owner,
        tickLower: res.data.position.tickLower,
        tickUpper: res.data.position.tickUpper,
        liquidity: res.data.position.liquidity,
        depositedToken0: res.data.position.depositedToken0,
        depositedToken1: res.data.position.depositedToken1,
        collectedFeesToken0: res.data.position.collectedFeesToken0,
        collectedFeesToken1: res.data.position.collectedFeesToken1,
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
) => {
  const query = `{
        pool(id: ${address}, block: {number:${blockNumber}}){
            liquidity
            token0Price
        }
    }`;

  return axios.post(subgraph, query).then((res) => {
    return {
      liquidity: res.data.pool.liquidity,
      token0Price: res.data.pool.token0Price,
    };
  });
};
