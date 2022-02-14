export interface IAttributeString {
  value: string;
  trait_type: string;
}

export interface IAttributeNumeric {
  value: number;
  trait_type: string;
  display_type?: "number" | "boost_number" | "boost_percentage";
}

export type IMetadataAttribute = IAttributeString | IAttributeNumeric;

export interface IMetadata {
  image: string;
  tokenId?: string;
  external_url?: string;
  name: string;
  attributes?: IMetadataAttribute[];
}
