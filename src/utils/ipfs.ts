export function stripIpfsProtocol(maybeIpfsProtocol: string) {
  const imgComponents = maybeIpfsProtocol.split("ipfs://");
  if (imgComponents.length > 0) {
    return imgComponents[1];
  }
  return maybeIpfsProtocol;
}

export function ipfsGatewayUrl(ipfsUrl: string) {
  const ipfsPath = stripIpfsProtocol(ipfsUrl);
  return `${process.env.NEXT_IPFS_GATEWAY}${ipfsPath}`;
}
