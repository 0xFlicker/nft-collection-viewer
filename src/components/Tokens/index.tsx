import { FC, useEffect, useState } from "react";
import useContract from "../../hooks/useContract";
import ConnectWallet from "../ConnectWallet";

import styles from "./index.module.css";
import CardGrid from "./CardGrid";

interface IProps {
  rarityData: number[];
}
const Root: FC<IProps> = ({ rarityData }) => {
  const { contract, selectedAccount } = useContract();
  const [tokens, setTokens] = useState<number[]>([]);

  useEffect(() => {
    async function getTokens() {
      if (contract && selectedAccount) {
        const address = await selectedAccount.getAddress();
        const balance = (await contract.balanceOf(address)).toNumber();
        const promiseTokens: Promise<number>[] = [];
        for (let i = 0; i < balance; i++) {
          promiseTokens.push(
            contract.tokenOfOwnerByIndex(address, i).then((n) => n.toNumber())
          );
        }
        const ownedTokens = await Promise.all(promiseTokens);
        setTokens(ownedTokens);
      }
    }
    getTokens().catch((e) => console.error(e));
  }, [contract, selectedAccount]);

  return (
    <div className={styles.root}>
      <ConnectWallet />
      <CardGrid tokens={tokens} rarityData={rarityData} />
    </div>
  );
};

export default Root;
