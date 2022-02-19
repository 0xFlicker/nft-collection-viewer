export function stripIpfsProtocol(maybeIpfsProtocol: string) {
  const imgComponents = maybeIpfsProtocol.split("ipfs://");
  if (imgComponents.length > 0) {
    return imgComponents[1];
  }
  return maybeIpfsProtocol;
}

export function ipfsGatewayUrl(ipfsUrl: string) {
  if (new URL(ipfsUrl).protocol === "ipfs:") {
    const ipfsPath = stripIpfsProtocol(ipfsUrl);
    return `${process.env.NEXT_IPFS_GATEWAY}${ipfsPath}`;
  }
  return ipfsUrl;
}
