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

interface IContext {
  contractAddress?: string;
  provider?: providers.Web3Provider;
  accounts?: string[];
  selectedAccount?: Signer;
}

const slice = createSlice({
  name: "erc721",
  initialState: {} as IContext,
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

const ContractContext = createContext<IContext>({});

function useERC721(context: IContext = {}) {
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
  }, [window && window.ethereum]);
  const connect = useCallback(async () => {
    if (state.provider) {
      const accounts = await state.provider.listAccounts();
      dispatch(slice.actions.setAccounts(accounts));
    }
  }, [state.provider]);

  return {
    ...state,
    contract,
    connect,
  };
}

const Provider: FC = ({ children }) => {
  const context = useERC721();

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
