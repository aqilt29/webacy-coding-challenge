import { FC, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useContractRead, useAccount, useContractWrite } from "wagmi";
import SomeWordsClubJSON from "../../blockchain/out/SomeWordsClub.sol/SomeWordsClub.json";
import IndividualNFTDisplays from "./IndividualNFTDisplays";
import { ethers } from "ethers";
import { useRouter } from 'next/router'

const someWordsClubContractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

const allTokenIds = [0, 1, 2, 3, 4];

const defaultNfts = {
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
  const router = useRouter();
  const methods = useForm();

  const [myBalance, setMyBalance] = useState(defaultNfts);

  // @ts-ignore
  const { data, isError, isLoading } = useAccount();

  const contractRead = useContractRead(
    {
      addressOrName: someWordsClubContractAddress,
      contractInterface: SomeWordsClubJSON.abi,
    },
    "balanceOfBatch",
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
        allTokenIds,
      ],
    }
  );

  const contractWriteBatchTransfer = useContractWrite(
    {
      addressOrName: someWordsClubContractAddress,
      contractInterface: SomeWordsClubJSON.abi,
    },
    "safeBatchTransferFrom"
  );

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
            allTokenIds,
          ],
        });

        if (!refetchData.data) return;

        Object.keys(defaultNfts).forEach((tokenName, index) => {
          // @ts-ignore
          newBalances[tokenName] = refetchData.data[index].toString();
        });

        console.log({ newBalances });
        // @ts-ignore
        setMyBalance(newBalances);
      }
    };

    fn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);


  // @ts-ignore
  const constructArgsForBatchTransfer = ({ destination, ...cartData }) => {
    const tokenIds: number[] = [];
    const numEachTokens: number[] = [];

    console.log({ destination });

    Object.keys(cartData).forEach(
      (tokenName) => {
        // @ts-ignore
        tokenIds.push(nftIdToNameMapping[tokenName])
        numEachTokens.push(cartData[tokenName])

      }
    )

    return { tokenIds, numEachTokens, destination };

  };

  const onSubmit = methods.handleSubmit((formData) => {
    console.log({ formData });

    // @ts-ignore
    const { tokenIds, numEachTokens, destination } = constructArgsForBatchTransfer(formData);

    if (!data) return;

    console.log(data.address,
      destination,
      tokenIds,
      numEachTokens)

    contractWriteBatchTransfer.writeAsync({
      args: [
        data.address,
        destination,
        tokenIds,
        numEachTokens,
        ethers.utils.formatBytes32String("")
      ]
    })
    .then((data) => {
      console.log({ data });
      window.alert("success transfer");
      router.reload();
    })
    .catch((err) => {
      window.alert(err.reason);
    })


  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6 space-y-5">
          <h2>My Balance</h2>
          <pre>{JSON.stringify(myBalance, null, 2)}</pre>
        </div>
        <div className="border-solid border-black border-t-[0.0625rem] flex flex-col justify-center p-6">
          {listOfNFTInputs.map((listItem, index) => {
            return (
              <IndividualNFTDisplays
                //@ts-ignore
                max={parseInt(myBalance[listItem.name])}
                index={index}
                {...listItem}
                key={listItem.imageURI}
              />
            );
          })}
        </div>
        <div className="flex flex-col justify-center w-full items-center space-y-4 mb-5">
          <label>
            <h2>destination wallet</h2>
          </label>
          <input {...methods.register("destination")} type="text" />
          <button type="submit" className="bg-black text-white px-5 py-2 rounded">Transfer Batch</button>
        </div>
      </form>
    </FormProvider>
  );
};

export default NFTDisplayModule;
