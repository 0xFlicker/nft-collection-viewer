import fs from "fs";
import { basename } from "path/posix";


/** @typedef {{ value: string, trait_type: string }} IAttributeString */
/** @typedef {{ value: number, trait_type: string, display_type?: "number"|"boost_number"|"boost_percentage" }} IAttributeNumeric */
/** @typedef {IAttributeNumeric | IAttributeString} IMetadataAttribute */
/** @typedef {{ image: string, token_id?: string, external_url?: string, name: string, attributes?: IMetadataAttribute[] }} IMetadata */

/**
 * Get the number of trait values in the largest trait class
 * 
 * @param {IMetadataAttribute[]} allTraits 
 * @param {string[]} traitTypes 
 * @returns number
 */
function maxVarietyCount(allTraits, traitTypes) {
  return traitTypes.reduce((max, traitType) => Math.max(max, allTraits.filter(t => t.trait_type === traitType).length), 0)
}

/**
 * Rarity.tools methodology. This computes rarity normalized by number of possible traits.
 * 
 * @param {IMetadata[]} tokens 
 * @param {string[]} traitTypes 
 * @param {boolean} traitCount 
 * @param {string[]} sumTraits
 * @param {number} sumTraitMultiplier 
 */
function generateRarityScore(tokens) {
  //, traitTypes, traitCount, sumTraits, sumTraitMultiplier
  // const nonSumTraits = traitTypes.filter(t => !sumTraits.includes(t))
  // const valueScoreMap = new Map();
  // const numTokens = tokens.length;
  // const maxVariety = maxVarietyCount(tokens.flatMap(t => t.attributes), nonSumTraits);
  // if (traitCount) {
  //   for (const attributes of tokens.map(t => t.attributes)) {
  //     if (attributes) {
  //       attributes.push({ value: attributes.length, trait_type: 'count' });
  //     }
  //   }
  //   traitTypes.push('count');
  //   nonSumTraits.push('count');
  // }
  // for (const traitType of nonSumTraits) {
  //   const valueCount = groupBy(t => t.value, tokens.flatMap(t => t.attributes.filter(a => a.trait_type === traitType))).length;
  //   const countPercent = (1 / (valueCount / numTokens)) / (valueCount / maxVariety);
  //   valueScoreMap.set(traitType, countPercent);
  // }

  const totalNum = tokens.length;
  let tally = { TraitCount: {} };
  const metadata = tokens.map(t => t.attributes).filter(a => a);
  for (let j = 0; j < metadata.length; j++) {
    let nftTraits = metadata[j].map((e) => e.trait_type);
    let nftValues = metadata[j].map((e) => e.value);
    let numOfTraits = nftTraits.length;

    if (tally.TraitCount[numOfTraits]) {
      tally.TraitCount[numOfTraits]++;
    } else {
      tally.TraitCount[numOfTraits] = 1;
    }

    for (let i = 0; i < nftTraits.length; i++) {
      let current = nftTraits[i];
      if (tally[current]) {
        tally[current].occurences++;
      } else {
        tally[current] = { occurences: 1 };
      }

      let currentValue = nftValues[i];
      if (tally[current][currentValue]) {
        tally[current][currentValue]++;
      } else {
        tally[current][currentValue] = 1;
      }
    }
  }

  const collectionAttributes = Object.keys(tally);
  let nftArr = [];
  for (let j = 0; j < metadata.length; j++) {
    let current = metadata[j];
    let totalRarity = 0;
    for (let i = 0; i < current.length; i++) {
      let rarityScore =
        1 / (tally[current[i].trait_type][current[i].value] / totalNum);
      current[i].rarityScore = rarityScore;
      totalRarity += rarityScore;
    }

    let rarityScoreNumTraits =
      8 * (1 / (tally.TraitCount[Object.keys(current).length] / totalNum));
    current.push({
      trait_type: "TraitCount",
      value: Object.keys(current).length,
      rarityScore: rarityScoreNumTraits,
    });
    totalRarity += rarityScoreNumTraits;

    if (current.length < collectionAttributes.length) {
      let nftAttributes = current.map((e) => e.trait_type);
      let absent = collectionAttributes.filter(
        (e) => !nftAttributes.includes(e)
      );

      absent.forEach((type) => {
        let rarityScoreNull =
          1 / ((totalNum - tally[type].occurences) / totalNum);
        current.push({
          trait_type: type,
          value: null,
          rarityScore: rarityScoreNull,
        });
        totalRarity += rarityScoreNull;
      });
    }

    nftArr.push({
      Attributes: current,
      Rarity: totalRarity,
      token_id: j + 1,
      image: tokens[j].image,
    });
  }
  nftArr.sort((a, b) => b.Rarity - a.Rarity);
  return nftArr;
}

export default async function ({ tokenName }) {
  const metadataFiles = await fs.promises.readdir(`./metadata/${tokenName}`);
  const tokens = []
  for (const file of metadataFiles.sort((a, b) => Number(basename(a)) - Number(basename(b)))) {
    const metadata = JSON.parse(await fs.promises.readFile(`./metadata/${tokenName}/${file}`, 'utf8'));
    tokens.push(metadata);
  }
  const rarities = generateRarityScore(tokens)
  await fs.promises.mkdir('./rarity', { recursive: true });
  await fs.promises.mkdir('./src/fixtures/rankings', { recursive: true });
  await fs.promises.writeFile(`./rarity/${tokenName}_rarity.json`, JSON.stringify(rarities, null, 2), 'utf8');
  await fs.promises.writeFile(`./src/fixtures/rankings/${tokenName}.json`, JSON.stringify([
    null,
    ...rarities.map(r => r.token_id)
  ], null, 2), 'utf8');
}
//         # Compute the rarity score of each trait for each item in the collection
//         for trait in non_sum_traits:
//             # Compute the incidence of a trait value across the collection
//             value_count = trait_db.groupby([str(trait)]).size()

//             # Display incidence of each trait value across the collection
//             print(value_count)

//             # Compute the rarity of each trait value
//             count_pct = (1 / (value_count / num_tokens)) / (len(value_count) / max_size)

//             # Add the value to score map of the trait to the cache
//             value_score_map[str(trait)] = count_pct.to_dict()

//             # Set the rarity for the trait value of each item in the collection
//             rarity_db[trait] = trait_db[trait].map(value_score_map[trait])

//         # Compute rarity score of sum traits
//         if len(sum_traits) > 0:
//             # Rescale sum traits between 0 and 1
//             scaled_traits = list()
//             for trait in sum_traits:
//                 scaled_trait = f"SCALED_{trait}"
//                 trait_max = rarity_db[trait].max()
//                 trait_min = rarity_db[trait].min()
//                 rarity_db[scaled_trait] = (rarity_db[trait] - trait_min) / (
//                     trait_max - trait_min
//                 )
//                 scaled_traits.append(scaled_trait)

//             # Compute score multiplier, Assumes contribution is half of rarity score on average
//             mean_non_sum_score = rarity_db[non_sum_traits].sum(axis=1).mean()
//             mean_sum_score = rarity_db[scaled_traits].sum(axis=1).mean()
//             multiplier = mean_non_sum_score / mean_sum_score

//             # Add sum trait variable to rarity data frame
//             rarity_db["SUM_TRAIT"] = (
//                 rarity_db[scaled_traits].sum(axis=1) * multiplier * sum_trait_multiplier
//             )

//             # Add sum trait variable to the non sum trait list
//             non_sum_traits.append("SUM_TRAIT")

//     else:
//         raise ValueError(f"Method {method} is not supported. Try raritytools.")

//     # Compute aggregate rarity
//     rarity_db["RARITY_SCORE"] = rarity_db[non_sum_traits].sum(axis=1)

//     # Sort database and assign rank
//     rarity_db = rarity_db.sort_values(["RARITY_SCORE"], ascending=False)
//     rarity_db["Rank"] = np.arange(1, len(rarity_db) + 1)

//     # Set index as token name
//     rarity_db = rarity_db.set_index("TOKEN_ID")

//     return rarity_db
