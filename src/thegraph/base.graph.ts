import axios from "axios";

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
