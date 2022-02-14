import { FC, useEffect, useState } from "react";
import useContract from "../../hooks/useContract";

import styles from "./index.module.css";

const Content: FC = () => {
  const { contract } = useContract();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  useEffect(() => {
    if (contract) {
      contract.name().then((name) => {
        setName(name);
      });
      contract.symbol().then((symbol) => {
        setSymbol(symbol);
      });
    }
  }, [contract]);
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.header}>Name:</span>
        <span className={styles.name}>{name}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.header}>Symbol:</span>
        <span className={styles.symbol}>{symbol}</span>
      </div>
    </div>
  );
};

export default Content;
