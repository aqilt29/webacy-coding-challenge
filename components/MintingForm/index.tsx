import { FC } from "react";
import Image from "next/image";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useAccount } from 'wagmi'

import NumberIncrementor from "./NumberIncrementer";
import classNames from "classnames";

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
  "cloud": 0,
  "friend": 0,
  "work": 0,
  "pleasure": 0,
  "success": 0,
}

const InputNFTListItem: FC<{
  imageURI: string;
  name: string;
  title: string;
  tokenId: number;
  index: number;
}> = ({ imageURI, name, title, tokenId, index }) => {
  return (
    <div className={classNames("p-4 flex justify-between", index !== 0 ? "border-solid border-black border-t-[0.0625rem]": "")}>
      <div className="flex flex-col space-y-10">
        <h1>{title}</h1>
        <NumberIncrementor name={name} />
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

const MintingForm: FC = () => {
  const methods = useForm();
  const { data, isError, isLoading } = useAccount()

  const onSubmit = methods.handleSubmit((data) => console.log(data));
  const { control } = methods;
  const shoppingCart = useWatch({ control, defaultValue: defaultCart });

  const totalNFTs = Object.keys(shoppingCart).reduce((p, key) => p + shoppingCart[key], 0);

  const isWalletUnavailable = (!data || isError || isLoading);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="contents">
        <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6">
          {
            listOfNFTInputs.map((listItem, index) => {
              return <InputNFTListItem index={index} {...listItem} key={listItem.imageURI} />;
            })
          }
        </div>
        <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6 space-y-5">
          <h2>Tokens to Mint</h2>
          <pre>{JSON.stringify(shoppingCart, null, 2)}</pre>
          <div className="flex">
            <h2 className="mr-5">{(0.0025 * totalNFTs).toFixed(4)}&nbsp;ETH</h2>
            <Image src="/eth-glyph-colored.png" width={26} height={40} layout="fixed" alt="ethereum icon" />
          </div>
        </div>
        <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6 space-y-5">
          <button
            className={classNames(
              "bg-black rounded transition ease-in-out hover:bg-white",
              "border-solid border-white border-[0.0625rem]",
              "hover:border-black disabled:bg-gray-400 disabled:border-transparent disabled:text-white"
            )}
            disabled={!data || isError || isLoading} type="submit"
          >
            <h2
            className={classNames(
              "text-white transition ease-in-out",
              isWalletUnavailable ? "hover:text-white" : "hover:text-black"
              )}
            >
              {isWalletUnavailable ? "Connect Wallet" :  "MINT"}
            </h2>
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MintingForm;
