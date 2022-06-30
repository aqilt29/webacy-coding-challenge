import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useAccount, useContractWrite } from "wagmi";
import classNames from "classnames";
import { ethers } from "ethers";

import SomeWordsClubJSON from "../../blockchain/out/SomeWordsClub.sol/SomeWordsClub.json";
import LoadingSpinner from "../LoadingSpinner";
import InputNFTListItem from "./InputNFTListItem";

const someWordsClubContractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

const listOfNFTInputs = [
  { imageURI: "/cloud_0.jpeg", name: "cloud", title: "Cloud", tokenId: 0 },
  { imageURI: "/friend_1.jpeg", name: "friend", title: "Friend", tokenId: 1 },
  { imageURI: "/work_2.jpeg", name: "work", title: "Work", tokenId: 2 },
  {
    imageURI: "/pleasure_3.jpeg",
    name: "pleasure",
    title: "Pleasure",
    tokenId: 3,
  },
  {
    imageURI: "/success_4.jpeg",
    name: "success",
    title: "Success",
    tokenId: 4,
  },
];

const defaultCart = {
  cloud: 0,
  friend: 0,
  work: 0,
  pleasure: 0,
  success: 0,
};

const nftIdToNameMapping = {
  cloud: 0,
  friend: 1,
  work: 2,
  pleasure: 3,
  success: 4,
}

const MintingForm: FC = () => {
  const [isAwaitingContract, setIsAwaitingContract] = useState(false);

  const methods = useForm();

  const { data, isError, isLoading } = useAccount();

  const contractWriteMintBatchOfWords = useContractWrite(
    {
      addressOrName: someWordsClubContractAddress,
      contractInterface: SomeWordsClubJSON.abi,
    },
    "mintBatchOfWords"
  );

  const constructArgsForBatchMint = (cartData: any) => {
    const tokenIds: number[] = [];
    const numEachTokens: number[] = [];

    const totalTokensToMint = Object.keys(cartData).reduce(
      (acc, tokenName) => {
        // @ts-ignore
        tokenIds.push(nftIdToNameMapping[tokenName])
        numEachTokens.push(cartData[tokenName])

        return acc + cartData[tokenName];
      },
      0
    )

    const totalMintCost = (0.0025 * totalTokensToMint).toFixed(4)

    return { tokenIds, numEachTokens, totalMintCost };

  };

  const onSubmit = methods.handleSubmit(async (data) => {
    console.log("data submitted", data);
    setIsAwaitingContract(true);

    const { tokenIds, numEachTokens, totalMintCost } = constructArgsForBatchMint(data);

    await contractWriteMintBatchOfWords.writeAsync({
      args: [
        tokenIds,
        numEachTokens
      ],
      overrides: {
        value: ethers.utils.parseEther(totalMintCost)
      }
    })
    .then((data) => {
      console.log({ data });
      window.alert("success mint")
    })
    .catch((err) => {
      window.alert(err.reason)
    })

    setIsAwaitingContract(false);

  });

  const { control } = methods;
  const shoppingCart = useWatch({ control, defaultValue: defaultCart });

  const totalNFTs = Object.keys(shoppingCart).reduce(
    (p, key) => p + shoppingCart[key],
    0
  );

  // react conditional rendering issues with ssr
  const [isWalletUnavailable, setIsWalletUnavailable] = useState(true);
  const [buttonText, setButtonText] = useState("connect");

  useEffect(() => {
    if (!(!data || isError || isLoading)) {
      setIsWalletUnavailable(false);
      setButtonText("mint")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="contents">
        <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6">
          {listOfNFTInputs.map((listItem, index) => {
            return (
              <InputNFTListItem
                index={index}
                {...listItem}
                key={listItem.imageURI}
              />
            );
          })}
        </div>
        <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6 space-y-5">
          <h2>Tokens to Mint</h2>
          <pre>{JSON.stringify(shoppingCart, null, 2)}</pre>
          <div className="flex">
            <h2 className="mr-5">{(0.0025 * totalNFTs).toFixed(4)}&nbsp;ETH</h2>
            <Image
              src="/eth-glyph-colored.png"
              width={26}
              height={40}
              layout="fixed"
              alt="ethereum icon"
            />
          </div>
        </div>
        <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6 space-y-5">
          <button
            className={classNames(
              "bg-black rounded transition ease-in-out hover:bg-white",
              "border-solid border-white border-[0.0625rem]",
              "hover:border-black disabled:border-transparent disabled:text-white"
            )}
            disabled={isWalletUnavailable}
            type="submit"
          >
            {isAwaitingContract ? (
              <LoadingSpinner />
            ) : (
              <h2
                className={classNames(
                  "text-white transition ease-in-out hover:text-black",
                  isWalletUnavailable ? "bg-gray-400" : ""
                )}
              >
                {buttonText}
              </h2>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MintingForm;
