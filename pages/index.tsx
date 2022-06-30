import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Image from 'next/image'

import Layout from "../components/Layout";

import MintingForm from "../components/MintingForm";

const Home: NextPage = () => {
  // console.log(typeof window === undefined)

  return (
    <Layout>
      <div className="border-solid border-black border-[0.0625rem] rounded overflow-hidden">
        <div className="w-full h-96 overflow-hidden">
          <div className="bg-black h-full relative border-solid border-black border-b-[0.0625rem]">
            <Image src="/word_gif.gif" alt="word in beads that says cloud" layout="fill" />
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-4xl">SomeWords NFT Club</h1>
        </div>
        <div className="border-solid border-black border-t-[0.0625rem] flex">
          <div className="p-6 flex items-center">
            <strong>
              <p className="inline">
                🚀&nbsp;
              </p>
              <p className="inline underline text-lg italic">
                Claim your words and join the club!
              </p>
            </strong>
          </div>
          <div className="border-solid border-black border-l-[0.0625rem] p-6 flex w-1/3 justify-between">
            <h2>0.0025 ETH</h2>
            <Image src="/eth-glyph-colored.png" width={26} height={40} alt="ethereum icon" />
          </div>
        </div>
        <div className="border-solid border-black border-t-[0.0625rem] flex justify-center p-6">
          <ConnectButton chainStatus="icon" />
        </div>
        <MintingForm />
      </div>
    </Layout>
  );
};

export default Home;
