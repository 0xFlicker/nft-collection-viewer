import rarityData from "../fixtures/rankings/Hunnys.json";
import Token from "../layouts/Token";

export default () => {
  return (
    <Token
      contractAddress={"0x5dfeb75abae11b138a16583e03a2be17740eaded"}
      rarityData={rarityData.map((n) => Number(n))}
    />
  );
};
