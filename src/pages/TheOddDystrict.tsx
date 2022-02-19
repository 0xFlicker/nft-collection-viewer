import rarityData from "../fixtures/0X71EAA691B6E5D5E75A3EBB36D4F87CBFB23C87B0.json";
import Token from "../layouts/Token";

export default () => {
  return (
    <Token
      contractAddress={"0x71EAA691B6E5D5E75A3EBB36D4F87CBFB23C87B0"}
      rarityData={rarityData.map((n) => Number(n))}
    />
  );
};
