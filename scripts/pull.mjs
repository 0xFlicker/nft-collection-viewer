import { providers, Contract } from 'ethers';
import fetch from 'node-fetch';
import { from, range, of, mergeMap, catchError, retryWhen, pipe, timer, zip, map } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import cliProgress from "cli-progress";
import fs from 'fs';

/**
 * 
 * @param {string} filePath 
 */
async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

function backOff(maxTries, ms) {
  return pipe(
    retryWhen(attempts => range(1, maxTries)
      .pipe(
        zip(attempts, (i) => i),
        map(i => i * i),
        mergeMap(i => timer(i * ms))
      )
    )
  );
}

export default async function ({ contract: contractAddress, ipfsGateway, nodeUrl }) {
  const provider = new providers.JsonRpcProvider(nodeUrl);
  const abi = JSON.parse(fs.readFileSync('./ERC721Metadata.json', 'utf8')).abi;
  const contract = new Contract(contractAddress, abi, provider);
  const contractName = await contract.name();
  const tokenCount = await contract.totalSupply();

  // const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  // bar.start(tokenCount, 0);
  await fs.promises.mkdir(`metadata/${contractName}`, { recursive: true });

  range(1, tokenCount.toNumber()).pipe(
    mergeMap(async (tokenId) => {
      if (await fileExists(`metadata/${contractName}/${tokenId}.json`)) {
        return of({ tokenId, content: JSON.parse(await fs.promises.readFile(`metadata/${contractName}/${tokenId}.json`, 'utf8')) });
      }
      const tokenURI = await contract.tokenURI(tokenId);
      const tokenURL = new URL(tokenURI);
      let fetchURL = tokenURI;
      if (tokenURL.protocol === 'ipfs') {
        const ipfsHash = tokenURL.pathname.slice(1);
        fetchURL = `${ipfsGateway}/ipfs/${ipfsHash}`;
      }
      return ajax(fetchURL).pipe(
        backOff(10, 250)
      ).pipe(
        map(content => ({ tokenId, content }))
      );
    }, 6),
    mergeMap(async ({ content, tokenId }) => {
      await fs.promises.writeFile(`metadata/${contractName}/${tokenId}.json`, content, 'utf8');
      return of({ tokenId, content: JSON.parse(content) });
    }, 2),
    catchError(error => {
      console.error(error);
      return of({ error });
    })
  ).subscribe({ next: () => { /* bar.increment() */ }, complete: () => { /*bar.stop();*/ } });
}
