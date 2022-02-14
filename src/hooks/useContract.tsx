import { ethers, providers, Signer } from "ethers";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ERC721Metadata } from "../web3/ERC721Metadata";
import { ERC721Metadata__factory } from "../web3/factories/ERC721Metadata__factory";

interface IState {
  contractAddress?: string;
  provider?: providers.Web3Provider;
  accounts?: string[];
  selectedAccount?: Signer;
}

interface IContext extends IState {
  contract: ERC721Metadata | undefined;
  connect: () => Promise<void>;
}

const initialState: IState = {};

const slice = createSlice({
  name: "erc721",
  initialState,
  reducers: {
    connect(state, action: PayloadAction<providers.Web3Provider>) {
      state.provider = action.payload;
    },
    setAccounts(state, action: PayloadAction<string[]>) {
      state.accounts = action.payload;
    },
    selectAccount(state, action: PayloadAction<Signer>) {
      state.selectedAccount = action.payload;
    },
    setContractAddress(state, action: PayloadAction<string>) {
      state.contractAddress = action.payload;
    },
  },
});

const initialContext: IContext = {
  ...initialState,
  contract: undefined,
  connect: async () => {},
};

const ContractContext = createContext<IContext>(initialContext);

function useERC721(context: IContext) {
  const [state, dispatch] = useReducer(slice.reducer, context);
  const contract = useMemo(() => {
    if (state.provider && state.contractAddress) {
      return ERC721Metadata__factory.connect(
        state.contractAddress,
        state.provider
      );
    }
  }, [state.provider, state.contractAddress]);

  useEffect(() => {
    if (!window.ethereum?.request) {
      // TODO: Handle this error
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(slice.actions.connect(provider));
  }, []);

  useEffect(() => {
    if (!state.provider) {
      return;
    }
    const handleAccountsChanged = (accounts: string[]) => {
      dispatch(slice.actions.setAccounts(accounts));
    };
    state.provider?.addListener("accountsChanged", handleAccountsChanged);
    return () => {
      state.provider?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [state.provider]);

  useEffect(() => {
    if (state.accounts && state.provider) {
      const signer = state.provider.getSigner(state.accounts[0]);
      dispatch(slice.actions.selectAccount(signer));
    }
  }, [state.accounts, state.provider]);

  useEffect(() => {
    if (state.provider) {
      state.provider.listAccounts().then((accounts) => {
        dispatch(slice.actions.setAccounts(accounts));
      });
    }
  }, [state.provider]);

  const connect = useCallback(async () => {
    if (state.provider) {
      const accounts = await state.provider.send("eth_requestAccounts", []);
      dispatch(slice.actions.setAccounts(accounts));
    }
  }, [state.provider]);

  return {
    ...state,
    contract,
    connect,
  };
}

interface IProps {
  contractAddress: string;
}

const Provider: FC<IProps> = ({ contractAddress, children }) => {
  const context = useERC721({ ...initialContext, contractAddress });

  return (
    <ContractContext.Provider value={context}>
      {children}
    </ContractContext.Provider>
  );
};

export default function () {
  return useContext(ContractContext);
}
export { Provider };
