import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Layout from "./components/Layout";
import SomeWordsClubJSON from "../blockchain/out/SomeWordsClub.sol/SomeWordsClub.json";

console.log(SomeWordsClubJSON.abi);

const Home: NextPage = () => {
  return (
    <Layout>
      <ConnectButton />
    </Layout>
  );
};

export default Home;
