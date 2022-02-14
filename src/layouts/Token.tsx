import { FC } from "react";
import Head from "next/head";
import { Provider } from "../hooks/useContract";
import Description from "../components/Description";
import Tokens from "../components/Tokens";

interface IProps {
  contractAddress: string;
  rarityData: number[];
}

const Root: FC<IProps> = ({ contractAddress, rarityData }) => {
  return (
    <Provider contractAddress={contractAddress}>
      <Head>
        <title>Root</title>
        <meta name="description" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Description />
      <Tokens rarityData={rarityData} />
    </Provider>
  );
};

export default Root;
