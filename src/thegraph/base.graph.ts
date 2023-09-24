import axios from "axios";

// 가장 최근에 Sync된 blocknumber 구하기
export const syncBlockQuery = async (subgraph: string) => {
  const query = `{ 
      _meta{
        block {
          number
          timestamp
        }
      }
    }`;

  return await axios
    .post(subgraph, query)
    .then((res) => {
      return {
        blockNumber: res.data._meta.block.number,
        timestamp: res.data._meta.block.timestamp,
      };
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error);
    });
};
