// constants
// erc20 token
export const erc20TokenCurationEventSignature =
  "event Curation(address indexed curator, address indexed creator, address indexed token, string uri, uint256 amount)" as const;
export const erc20TokenCurationEventABI = [
  {
    name: "Curation",
    type: "event",
    inputs: [
      { type: "address", indexed: true, name: "curator" },
      { type: "address", indexed: true, name: "creator" },
      { type: "address", indexed: true, name: "token" },
      { type: "string", name: "uri" },
      { type: "uint256", name: "amount" },
    ],
  },
] as const;

// native token
export const nativeTokenCurationEventSignature =
  "event Curation(address indexed from, address indexed to, string uri, uint256 amount)" as const;
export const nativeTokenCurationEventABI = [
  {
    name: "Curation",
    type: "event",
    inputs: [
      { type: "address", indexed: true, name: "from" },
      { type: "address", indexed: true, name: "to" },
      { type: "string", name: "uri" },
      { type: "uint256", name: "amount" },
    ],
  },
] as const;

// additional constants
export const CURATION_ABI = [
  ...erc20TokenCurationEventABI,
  ...nativeTokenCurationEventABI,
] as const;

// ref from etherscan
// export const curationAbi = [
//   { inputs: [], name: "InvalidURI", type: "error" },
//   { inputs: [], name: "SelfCuration", type: "error" },
//   { inputs: [], name: "TransferFailed", type: "error" },
//   { inputs: [], name: "ZeroAddress", type: "error" },
//   { inputs: [], name: "ZeroAmount", type: "error" },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: "address", name: "from", type: "address" },
//       { indexed: true, internalType: "address", name: "to", type: "address" },
//       {
//         indexed: true,
//         internalType: "contract IERC20",
//         name: "token",
//         type: "address",
//       },
//       { indexed: false, internalType: "string", name: "uri", type: "string" },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256",
//       },
//     ],
//     name: "Curation",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: "address", name: "from", type: "address" },
//       { indexed: true, internalType: "address", name: "to", type: "address" },
//       { indexed: false, internalType: "string", name: "uri", type: "string" },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256",
//       },
//     ],
//     name: "Curation",
//     type: "event",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "to_", type: "address" },
//       { internalType: "contract IERC20", name: "token_", type: "address" },
//       { internalType: "uint256", name: "amount_", type: "uint256" },
//       { internalType: "string", name: "uri_", type: "string" },
//     ],
//     name: "curate",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "to_", type: "address" },
//       { internalType: "string", name: "uri_", type: "string" },
//     ],
//     name: "curate",
//     outputs: [],
//     stateMutability: "payable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bytes4", name: "interfaceId_", type: "bytes4" }],
//     name: "supportsInterface",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
// ] as const;
