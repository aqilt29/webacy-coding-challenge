import { FC, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Image from "next/image";
import { useContractRead, useAccount } from "wagmi";
import SomeWordsClubJSON from "../../blockchain/out/SomeWordsClub.sol/SomeWordsClub.json";

const someWordsClubContractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

const allTokenIds = [0, 1, 2, 3, 4];

const nftIdToNameMapping = {
  cloud: 0,
  friend: 1,
  work: 2,
  pleasure: 3,
  success: 4,
};

const defaultNfts = {
  cloud: 0,
  friend: 0,
  work: 0,
  pleasure: 0,
  success: 0,
};


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

const NFTDisplayModule: FC = () => {
  const methods = useForm();

  const [myBalance, setMyBalance] = useState(defaultNfts);

  // @ts-ignore
  const { data, isError, isLoading } = useAccount();

  const contractRead = useContractRead(
    {
      addressOrName: someWordsClubContractAddress,
      contractInterface: SomeWordsClubJSON.abi,
    },
    'balanceOfBatch',
    {
      enabled: false,
      args: [
        [
          data?.address,
          data?.address,
          data?.address,
          data?.address,
          data?.address,
        ],
        allTokenIds
      ]
    },
  )

  useEffect(() => {
    const fn = async () => {
      const newBalances = {};

      if (data?.address) {
        const refetchData = await contractRead.refetch({
          // @ts-ignore
          args: [
            [
              data.address,
              data.address,
              data.address,
              data.address,
              data.address,
            ],
            allTokenIds
          ]
        });

        if (!refetchData.data) return;

        Object.keys(defaultNfts).forEach((tokenName, index) => {
          // @ts-ignore
          newBalances[tokenName] = refetchData.data[index].toString();
        });

        console.log({newBalances});
        // @ts-ignore
        setMyBalance(newBalances);

      }

    }

    fn();
  }, [data])


  return (
    <FormProvider {...methods}>
      <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6 space-y-5">
        <h2>My Balance</h2>
        <pre>{JSON.stringify(myBalance, null, 2)}</pre>
      </div>
    </FormProvider>
  );
};

export default NFTDisplayModule;
