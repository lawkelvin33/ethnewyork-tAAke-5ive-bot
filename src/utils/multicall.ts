import { Interface, JsonRpcProvider } from "ethers";
import { Multicall2__factory, type Multicall2 } from "../typechain";

interface MulticallCallData<I extends Interface = any> {
  itf: I;
  address: string;
  method: string;
  args?: Array<any>;
}
async function multicall<ReturnType, I extends Interface = Interface>(
  chain: { rpcUrls: string[]; multicallAddress: string },
  calls: MulticallCallData<I>[]
): Promise<ReturnType[]> {
  const provider = new JsonRpcProvider(chain.rpcUrls[0]);

  // Set Multicall
  const multicallContract = Multicall2__factory.connect(
    chain.multicallAddress,
    provider
  );

  // encode
  const callStructs: Multicall2.CallStruct[] = calls.map(
    ({ itf, address, method, args }) => ({
      target: address,
      callData: itf.encodeFunctionData(method, args),
    })
  );

  // call
  const { returnData } = await multicallContract.aggregate.staticCall(
    callStructs
  );

  // decode
  return calls.map(({ itf, method }, i) => {
    return itf.decodeFunctionResult(method, returnData[i]) as ReturnType;
  });
}

export default multicall;
