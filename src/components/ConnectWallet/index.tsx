import { Button } from "@mui/material";
import Image from "next/image";
import { useCallback } from "react";

import metamaskIcon from "../../../public/metamask-fox.svg";
import useContract from "../../hooks/useContract";

export default function () {
  const { connect } = useContract();

  const onClick = useCallback(() => {
    connect();
  }, [connect]);
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      startIcon={<Image src={metamaskIcon} width={25} height={25} />}
    >
      Connect Wallet
    </Button>
  );
}
