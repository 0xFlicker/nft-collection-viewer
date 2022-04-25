import { Command } from 'commander';

const program = new Command();

program
  .command('pull')
  .option('-c, --contract <contract>', 'contract address')
  .option('-i, --ipfs-gateway <ipfs-gateway>', 'ipfs gateway')
  .option('-n, --node-url <node-url>', 'node url')
  .action(async (options) => {
    const { contract, ipfsGateway, nodeUrl } = options;
    const { default: pull } = await import('./pull.mjs');
    await pull({ contract, ipfsGateway, nodeUrl });
  })

program
  .command('rarity <token-name>')
  .action(async (tokenName, options) => {
    // const { tokenName } = options;
    const { default: rarity } = await import('./rarity.mjs');
    await rarity({ tokenName });
  })

program.parse(process.argv);
