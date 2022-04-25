import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Container,
  Button,
  CardHeader,
  Box,
} from "@mui/material";
import cn from "classnames";
import { FC, useState, useEffect, useMemo } from "react";
import useContract from "../../hooks/useContract";
import { IMetadataAttribute } from "../../types/metadata";
import { ipfsGatewayUrl } from "../../utils/ipfs";
import styles from "./ActionableCard.module.css";
import Attributes from "./Attributes";

interface IRarityProps {
  rankPercent: number;
}

const RARITY_BREAKPOINTS = {
  RARE: 0.2,
  EPIC: 0.1,
  LEGENDARY: 0.03,
};

const Rarity: FC<IRarityProps> = ({ rankPercent, children }) => {
  const className = useMemo(
    () =>
      cn({
        [styles.epic]: rankPercent >= 0.05 && rankPercent < 0.2,
      }),
    [rankPercent]
  );
  return <div className={className}>{children}</div>;
};

interface IActionableCardProps {
  tokenId: number;
  rarityData: number[];
}

const ActionableCard: FC<IActionableCardProps> = ({ tokenId, rarityData }) => {
  const { contract } = useContract();
  const [url, setUrl] = useState("");
  const [attributes, setAttributes] = useState<IMetadataAttribute[]>([]);

  useEffect(() => {
    if (contract) {
      contract.tokenURI(tokenId).then((uri) => {
        // Fetch metadata
        fetch(ipfsGatewayUrl(uri)).then((res) => {
          res.json().then((json) => {
            setAttributes(json.attributes);
            setUrl(ipfsGatewayUrl(json.image));
          });
        });
      });
    }
  }, [contract, tokenId]);
  const rankPercent = useMemo(
    () => rarityData[tokenId] / rarityData.length,
    [tokenId, rarityData]
  );
  const className = useMemo(
    () =>
      cn({
        [styles.rare]:
          rankPercent >= RARITY_BREAKPOINTS.EPIC &&
          rankPercent < RARITY_BREAKPOINTS.RARE,
        [styles.epic]:
          rankPercent >= RARITY_BREAKPOINTS.LEGENDARY &&
          rankPercent < RARITY_BREAKPOINTS.EPIC,
        [styles.legendary]: rankPercent < RARITY_BREAKPOINTS.LEGENDARY,
      }),
    [rankPercent]
  );
  return (
    <Grid item xs={12} sm={6} md={3} xl={2} key={tokenId}>
      <Card variant="elevation">
        <Box sx={{ position: "relative" }}>
          <CardHeader
            title={`#${tokenId}`}
            titleTypographyProps={{ align: "right" }}
          />
          {url ? (
            <Container
              sx={{
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <CardMedia component="img" width="480" image={url} />
            </Container>
          ) : (
            <Container>
              <div className={styles.loading}>
                <CircularProgress />
              </div>
            </Container>
          )}

          {/* <CardContent>
          <Attributes attributes={attributes} />
        </CardContent> */}
          {/* <CardActions>
          <Button>Attributes</Button>
        </CardActions> */}
          <div className={className} />
        </Box>
      </Card>
    </Grid>
  );
};

export default ActionableCard;
