import BN from 'bn.js';
import { POIsPerList, TXIDVersion } from './poi-types';

export type BytesData = ArrayLike<number> | string | BN;

export type AdaptID = {
  contract: string;
  parameters: string;
};

export type Ciphertext = {
  iv: string;
  tag: string;
  data: string[];
};

export type CTRCiphertext = {
  iv: string;
  data: string[];
};

export enum TokenType {
  ERC20 = 0,
  ERC721 = 1,
  ERC1155 = 2,
}

export type TransactionReceiptLog = {
  topics: string[];
  data: string;
};

export type TokenData = {
  tokenType: TokenType;
  tokenAddress: string;
  tokenSubID: string;
};

export type NFTTokenData = TokenData & {
  tokenType: TokenType.ERC721 | TokenType.ERC1155;
};

export type EncryptedData = [string, string];

export enum CommitmentType {
  ShieldCommitment = 'ShieldCommitment',
  TransactCommitment = 'TransactCommitment',
  LegacyEncryptedCommitment = 'LegacyEncryptedCommitment',
  LegacyGeneratedCommitment = 'LegacyGeneratedCommitment',
}

export enum OutputType {
  Transfer = 0,
  RelayerFee = 1,
  Change = 2,
}

export type NoteAnnotationData = {
  outputType: OutputType; // Chunk 0: Byte 1 (1)
  senderRandom: string; // Chunk 0: Bytes 2-16 (15)
  walletSource: Optional<string>; // Chunk 1: Bytes 22-32 (11) - can be extended left if needed
};

export type EncryptedNoteAnnotationData = string;

// !! DO NOT MODIFY THIS TYPE - IT IS STORED IN DB WITH THESE EXACT KEYS !!
export type NoteSerialized = {
  npk: string;
  value: string;
  token: string;
  random: string;
  annotationData: string;
  recipientAddress: string;
  outputType: Optional<OutputType>;
  senderAddress: Optional<string>;
  memoText: Optional<string>;
  shieldFee: Optional<string>;
  blockNumber: Optional<number>;
};

// !! DO NOT MODIFY THIS TYPE - IT IS STORED IN DB WITH THESE EXACT KEYS !!
export type LegacyNoteSerialized = {
  npk: string;
  value: string;
  token: string;
  encryptedRandom: [string, string];
  memoField: string[];
  recipientAddress: string;
  memoText: Optional<string>;
  blockNumber: Optional<number>;
};

export type MerkleProof = {
  leaf: string; // hash of commitment
  elements: string[];
  indices: string;
  root: string;
};

export type PreImage = {
  npk: string;
  token: TokenData;
  value: string;
};

export type ShieldCiphertext = {
  encryptedBundle: [string, string, string];
  shieldKey: string;
};

export type CommitmentCiphertext = {
  ciphertext: Ciphertext;
  blindedSenderViewingKey: string;
  blindedReceiverViewingKey: string;
  annotationData: string;
  memo: string;
};

type CommitmentShared = {
  commitmentType: CommitmentType;
  hash: string;
  txid: string;
  blockNumber: number;
  timestamp: Optional<number>;
  utxoTree: number;
  utxoIndex: number;
};

export type ShieldCommitment = CommitmentShared & {
  commitmentType: CommitmentType.ShieldCommitment;
  preImage: PreImage;
  encryptedBundle: [string, string, string];
  shieldKey: string;
  fee: Optional<string>;
};

export type TransactCommitment = CommitmentShared & {
  commitmentType: CommitmentType.TransactCommitment;
  ciphertext: CommitmentCiphertext;
  railgunTxid: Optional<string>;
};

export type RailgunTransaction = {
  graphID: string;
  commitments: string[];
  nullifiers: string[];
  boundParamsHash: string;
  blockNumber: number;
  txid: string;
  unshield: Optional<{
    tokenData: TokenData;
    toAddress: string;
    value: string;
  }>;
  utxoTreeIn: number;
  utxoTreeOut: number;
  utxoBatchStartPositionOut: number;
  timestamp: number;
  verificationHash: string;
};

export type RailgunTransactionWithHash = RailgunTransaction & {
  railgunTxid: string;
  hash: string;
};

export type TXIDMerkletreeData = {
  railgunTransaction: RailgunTransactionWithHash;
  currentMerkleProofForTree: MerkleProof;
  currentTxidIndexForTree: number;
};

export type Commitment =
  | ShieldCommitment
  | TransactCommitment
  | LegacyGeneratedCommitment
  | LegacyEncryptedCommitment;

export type Nullifier = {
  nullifier: string;
  treeNumber: number;
  txid: string;
  blockNumber: number;
};

// !! DO NOT MODIFY THIS TYPE - IT IS STORED IN DB WITH THESE EXACT KEYS !!
export type StoredReceiveCommitment = {
  txidVersion: TXIDVersion;
  spendtxid: string | false;
  txid: string;
  timestamp: Optional<number>;
  nullifier: string;
  blockNumber: number;
  decrypted: NoteSerialized | LegacyNoteSerialized;
  senderAddress: Optional<string>;
  commitmentType: CommitmentType;
  poisPerList: Optional<POIsPerList>;
  blindedCommitment: Optional<string>;
  transactCreationRailgunTxid: Optional<string>;
};

// !! DO NOT MODIFY THIS TYPE - IT IS STORED IN DB WITH THESE EXACT KEYS !!
export type StoredSendCommitment = {
  txidVersion: TXIDVersion;
  txid: string;
  timestamp: Optional<number>;
  decrypted: NoteSerialized | LegacyNoteSerialized;
  commitmentType: CommitmentType;
  noteExtraData?: NoteAnnotationData;
  recipientAddress: string;
  railgunTxid: Optional<string>;
  poisPerList: Optional<POIsPerList>;
  blindedCommitment: Optional<string>;
};

/**
 * Legacy event types: Pre version 3.
 * Need to support these for legacy notes.
 */

export type LegacyGeneratedCommitment = CommitmentShared & {
  commitmentType: CommitmentType.LegacyGeneratedCommitment;
  preImage: PreImage;
  encryptedRandom: [string, string];
};

export type LegacyCommitmentCiphertext = {
  ciphertext: Ciphertext; // iv & tag (16 bytes each), recipient master public key (packedPoint) (uint256), packedField (uint256) {sign, random, amount}, token (uint256)
  ephemeralKeys: string[]; // receiver first, sender second (packed points 32 bytes each)
  memo: string[]; // bytes32[]
};

export type LegacyEncryptedCommitment = CommitmentShared & {
  commitmentType: CommitmentType.LegacyEncryptedCommitment;
  ciphertext: LegacyCommitmentCiphertext;
  railgunTxid: Optional<string>;
};

export type CommitmentSummary = {
  commitmentCiphertext: CommitmentCiphertext;
  commitmentHash: string;
};

export type RelayAdaptShieldERC20Recipient = { tokenAddress: string; recipientAddress: string };

export type RelayAdaptShieldNFTRecipient = {
  nftTokenData: NFTTokenData;
  recipientAddress: string;
};

export type POICommitmentOutData = {
  blindedCommitmentsOut: string[];
  npksOut: bigint[];
  valuesOut: bigint[];
  poisPerList: Optional<POIsPerList>;
};
