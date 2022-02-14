import { FC } from "react";
import { Grid } from "@mui/material";
import ActionableCard from "./ActionableCard";

interface ITokensProps {
  tokens: number[];
  rarityData: number[];
}

const CardGrid: FC<ITokensProps> = ({ tokens, rarityData }) => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={12}>
      {tokens.map((tokenId) => (
        <ActionableCard
          tokenId={tokenId}
          rarityData={rarityData}
          key={tokenId}
        />
      ))}
    </Grid>
  );
};

export default CardGrid;
