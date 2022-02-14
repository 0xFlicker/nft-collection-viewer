import { ethers } from "ethers";
import EventEmitter from "events";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider & EventEmitter;
  }
}
