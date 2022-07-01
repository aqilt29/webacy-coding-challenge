import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import Image from "next/image";
import SomeWordsClubJSON from "../../blockchain/out/SomeWordsClub.sol/SomeWordsClub.json";
import NumberIncrementor from "../MintingForm/NumberIncrementer";

const someWordsClubContractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

const NFTDisplaysItems: FC<{
  imageURI: string;
  name: string;
  title: string;
  tokenId: number;
  index: number;
  [key: string]: any;
}> = ({ imageURI, name, title, tokenId, index, ...props }) => {
  // react conditional rendering issues with ssr
  const [totalSupply, setTotalSupply] = useState("Loading...");

  const nftDataForToken = useContractRead(
    {
      addressOrName: someWordsClubContractAddress,
      contractInterface: SomeWordsClubJSON.abi,
    },
    "totalSupply",
    {
      args: [tokenId]
    }
  )
  
  useEffect(() => {
    //@ts-ignore
    setTotalSupply(nftDataForToken.data?.toString());
  }, [nftDataForToken])

  return (
    <div
      className={classNames(
        "p-4 flex justify-between",
        index !== 0 ? "border-solid border-black border-t-[0.0625rem]" : ""
      )}
    >
      <div className="flex flex-col space-y-10">
        <h1>{title}</h1>
        <NumberIncrementor name={name} max={props?.max} />
      </div>
      <div className="relative w-1/2 h-64">
        <Image
          src={imageURI}
          layout="fill"
          height={612}
          width={383}
          alt={`image of nft for tokenId ${tokenId}`}
        />
      </div>
    </div>
  );
};
export default NFTDisplaysItems;
