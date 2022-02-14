import { useRouter } from "next/router";
import { useMemo } from "react";
import Token from "../../layouts/Token";

export default () => {
  const router = useRouter();
  const contract = useMemo(() => {
    if (router.query.contract) {
      if (Array.isArray(router.query.contract)) {
        return router.query.contract[0];
      }
      return router.query.contract;
    }
  }, [router.query]);
  return (
    (contract && <Token contractAddress={contract} rarityData={[]} />) || null
  );
};
