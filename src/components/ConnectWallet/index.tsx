import { Button } from "@mui/material";
import { useCallback } from "react";
import useContract from "../../hooks/useContract";
import metamaskSrc from "../../../public/metamask-fox.svg";

export default function () {
  const { connect } = useContract();

  const onClick = useCallback(() => {
    connect();
  }, [connect]);
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      startIcon={<img src={metamaskSrc} width={25} height={25} />}
    >
      Connect Wallet
    </Button>
  );
}
