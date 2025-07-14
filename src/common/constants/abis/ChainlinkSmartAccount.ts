export const ChainlinkSmartAccounts = [
	{ "type": "fallback", "stateMutability": "payable" },
	{ "type": "receive", "stateMutability": "payable" },
	{
		"type": "function",
		"name": "UPKEEPS_ID_SLOT",
		"inputs": [],
		"outputs": [
			{ "name": "", "type": "bytes32", "internalType": "bytes32" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "ccipReceive",
		"inputs": [
			{
				"name": "",
				"type": "tuple",
				"internalType": "struct Client.Any2EVMMessage",
				"components": [
					{ "name": "messageId", "type": "bytes32", "internalType": "bytes32" },
					{ "name": "sourceChainSelector", "type": "uint64", "internalType": "uint64" },
					{ "name": "sender", "type": "bytes", "internalType": "bytes" },
					{ "name": "data", "type": "bytes", "internalType": "bytes" },
					{
						"name": "destTokenAmounts",
						"type": "tuple[]",
						"internalType": "struct Client.EVMTokenAmount[]",
						"components": [
							{ "name": "token", "type": "address", "internalType": "address" },
							{ "name": "amount", "type": "uint256", "internalType": "uint256" }
						]
					}
				]
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "checkUpkeep",
		"inputs": [
			{ "name": "checkData", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [
			{ "name": "", "type": "bool", "internalType": "bool" },
			{ "name": "", "type": "bytes", "internalType": "bytes" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "createCronJobFromSpec",
		"inputs": [
			{
				"name": "calls",
				"type": "tuple[]",
				"internalType": "struct Call[]",
				"components": [
					{ "name": "target", "type": "address", "internalType": "address" },
					{ "name": "value", "type": "uint256", "internalType": "uint256" },
					{ "name": "data", "type": "bytes", "internalType": "bytes" }
				]
			},
			{
				"name": "spec",
				"type": "tuple",
				"internalType": "struct Spec",
				"components": [
					{
						"name": "minute",
						"type": "tuple",
						"internalType": "struct Field",
						"components": [
							{ "name": "fieldType", "type": "uint8", "internalType": "enum FieldType" },
							{ "name": "singleValue", "type": "uint8", "internalType": "uint8" },
							{ "name": "interval", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeStart", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeEnd", "type": "uint8", "internalType": "uint8" },
							{ "name": "listLength", "type": "uint8", "internalType": "uint8" },
							{ "name": "list", "type": "uint8[26]", "internalType": "uint8[26]" }
						]
					},
					{
						"name": "hour",
						"type": "tuple",
						"internalType": "struct Field",
						"components": [
							{ "name": "fieldType", "type": "uint8", "internalType": "enum FieldType" },
							{ "name": "singleValue", "type": "uint8", "internalType": "uint8" },
							{ "name": "interval", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeStart", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeEnd", "type": "uint8", "internalType": "uint8" },
							{ "name": "listLength", "type": "uint8", "internalType": "uint8" },
							{ "name": "list", "type": "uint8[26]", "internalType": "uint8[26]" }
						]
					},
					{
						"name": "day",
						"type": "tuple",
						"internalType": "struct Field",
						"components": [
							{ "name": "fieldType", "type": "uint8", "internalType": "enum FieldType" },
							{ "name": "singleValue", "type": "uint8", "internalType": "uint8" },
							{ "name": "interval", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeStart", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeEnd", "type": "uint8", "internalType": "uint8" },
							{ "name": "listLength", "type": "uint8", "internalType": "uint8" },
							{ "name": "list", "type": "uint8[26]", "internalType": "uint8[26]" }
						]
					},
					{
						"name": "month",
						"type": "tuple",
						"internalType": "struct Field",
						"components": [
							{ "name": "fieldType", "type": "uint8", "internalType": "enum FieldType" },
							{ "name": "singleValue", "type": "uint8", "internalType": "uint8" },
							{ "name": "interval", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeStart", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeEnd", "type": "uint8", "internalType": "uint8" },
							{ "name": "listLength", "type": "uint8", "internalType": "uint8" },
							{ "name": "list", "type": "uint8[26]", "internalType": "uint8[26]" }
						]
					},
					{
						"name": "dayOfWeek",
						"type": "tuple",
						"internalType": "struct Field",
						"components": [
							{ "name": "fieldType", "type": "uint8", "internalType": "enum FieldType" },
							{ "name": "singleValue", "type": "uint8", "internalType": "uint8" },
							{ "name": "interval", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeStart", "type": "uint8", "internalType": "uint8" },
							{ "name": "rangeEnd", "type": "uint8", "internalType": "uint8" },
							{ "name": "listLength", "type": "uint8", "internalType": "uint8" },
							{ "name": "list", "type": "uint8[26]", "internalType": "uint8[26]" }
						]
					}
				]
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "deleteCronJob",
		"inputs": [
			{ "name": "id", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "entryPoint",
		"inputs": [],
		"outputs": [
			{ "name": "", "type": "address", "internalType": "contract IEntryPoint" }
		],
		"stateMutability": "pure"
	},
	{
		"type": "function",
		"name": "execute",
		"inputs": [
			{ "name": "target", "type": "address", "internalType": "address" },
			{ "name": "value", "type": "uint256", "internalType": "uint256" },
			{ "name": "data", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "executeBatch",
		"inputs": [
			{
				"name": "calls",
				"type": "tuple[]",
				"internalType": "struct BaseAccount.Call[]",
				"components": [
					{ "name": "target", "type": "address", "internalType": "address" },
					{ "name": "value", "type": "uint256", "internalType": "uint256" },
					{ "name": "data", "type": "bytes", "internalType": "bytes" }
				]
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "executeCCIP",
		"inputs": [
			{
				"name": "",
				"type": "tuple[]",
				"internalType": "struct BaseAccount.Call[]",
				"components": [
					{ "name": "target", "type": "address", "internalType": "address" },
					{ "name": "value", "type": "uint256", "internalType": "uint256" },
					{ "name": "data", "type": "bytes", "internalType": "bytes" }
				]
			},
			{
				"name": "",
				"type": "tuple",
				"internalType": "struct Config",
				"components": [
					{ "name": "chain", "type": "uint64", "internalType": "uint64" },
					{ "name": "feeToken", "type": "address", "internalType": "address" },
					{
						"name": "transferTokens",
						"type": "tuple[]",
						"internalType": "struct Client.EVMTokenAmount[]",
						"components": [
							{ "name": "token", "type": "address", "internalType": "address" },
							{ "name": "amount", "type": "uint256", "internalType": "uint256" }
						]
					},
					{
						"name": "extraArgs",
						"type": "tuple",
						"internalType": "struct Client.GenericExtraArgsV2",
						"components": [
							{ "name": "gasLimit", "type": "uint256", "internalType": "uint256" },
							{ "name": "allowOutOfOrderExecution", "type": "bool", "internalType": "bool" }
						]
					}
				]
			}
		],
		"outputs": [
			{ "name": "messageId", "type": "bytes32", "internalType": "bytes32" }
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "feeTokenInfo",
		"inputs": [],
		"outputs": [
			{ "name": "maxFee", "type": "uint96", "internalType": "uint96" },
			{ "name": "token", "type": "address", "internalType": "address" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getActiveCronJobIDs",
		"inputs": [],
		"outputs": [
			{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getCronJob",
		"inputs": [
			{ "name": "id", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{
				"name": "calls",
				"type": "tuple[]",
				"internalType": "struct Call[]",
				"components": [
					{ "name": "target", "type": "address", "internalType": "address" },
					{ "name": "value", "type": "uint256", "internalType": "uint256" },
					{ "name": "data", "type": "bytes", "internalType": "bytes" }
				]
			},
			{ "name": "cronString", "type": "string", "internalType": "string" },
			{ "name": "nextTick", "type": "uint256", "internalType": "uint256" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getNonce",
		"inputs": [],
		"outputs": [
			{ "name": "", "type": "uint256", "internalType": "uint256" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "isValidSignature",
		"inputs": [
			{ "name": "hash", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "signature", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [
			{ "name": "magicValue", "type": "bytes4", "internalType": "bytes4" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "keeperRegister",
		"inputs": [],
		"outputs": [
			{ "name": "", "type": "address", "internalType": "contract IKeeperRegistryUI" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "onERC1155BatchReceived",
		"inputs": [
			{ "name": "", "type": "address", "internalType": "address" },
			{ "name": "", "type": "address", "internalType": "address" },
			{ "name": "", "type": "uint256[]", "internalType": "uint256[]" },
			{ "name": "", "type": "uint256[]", "internalType": "uint256[]" },
			{ "name": "", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [
			{ "name": "", "type": "bytes4", "internalType": "bytes4" }
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "onERC1155Received",
		"inputs": [
			{ "name": "", "type": "address", "internalType": "address" },
			{ "name": "", "type": "address", "internalType": "address" },
			{ "name": "", "type": "uint256", "internalType": "uint256" },
			{ "name": "", "type": "uint256", "internalType": "uint256" },
			{ "name": "", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [
			{ "name": "", "type": "bytes4", "internalType": "bytes4" }
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "onERC721Received",
		"inputs": [
			{ "name": "", "type": "address", "internalType": "address" },
			{ "name": "", "type": "address", "internalType": "address" },
			{ "name": "", "type": "uint256", "internalType": "uint256" },
			{ "name": "", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [
			{ "name": "", "type": "bytes4", "internalType": "bytes4" }
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "performUpkeep",
		"inputs": [
			{ "name": "performData", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "registerUpkeep",
		"inputs": [
			{ "name": "name", "type": "string", "internalType": "string" },
			{ "name": "gasLimit", "type": "uint32", "internalType": "uint32" },
			{ "name": "offchainConfig", "type": "bytes", "internalType": "bytes" },
			{ "name": "checkData", "type": "bytes", "internalType": "bytes" },
			{ "name": "amount", "type": "uint96", "internalType": "uint96" }
		],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "setConditionDelegatee",
		"inputs": [
			{ "name": "delegatee", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setFeeTokenInfo",
		"inputs": [
			{ "name": "maxFee", "type": "uint96", "internalType": "uint96" },
			{ "name": "token", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setForwarder",
		"inputs": [
			{ "name": "newForwarder", "type": "address", "internalType": "address" },
			{ "name": "allowed", "type": "bool", "internalType": "bool" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "supportsInterface",
		"inputs": [
			{ "name": "id", "type": "bytes4", "internalType": "bytes4" }
		],
		"outputs": [
			{ "name": "", "type": "bool", "internalType": "bool" }
		],
		"stateMutability": "pure"
	},
	{
		"type": "function",
		"name": "unlockCallback",
		"inputs": [
			{ "name": "", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [
			{ "name": "", "type": "bytes", "internalType": "bytes" }
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "updateCronJob",
		"inputs": [
			{ "name": "id", "type": "uint256", "internalType": "uint256" },
			{
				"name": "newCall",
				"type": "tuple[]",
				"internalType": "struct Call[]",
				"components": [
					{ "name": "target", "type": "address", "internalType": "address" },
					{ "name": "value", "type": "uint256", "internalType": "uint256" },
					{ "name": "data", "type": "bytes", "internalType": "bytes" }
				]
			},
			{ "name": "newEncodedCronSpec", "type": "bytes", "internalType": "bytes" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "upkeeps",
		"inputs": [
			{ "name": "", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{ "name": "", "type": "uint256", "internalType": "uint256" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "validateUserOp",
		"inputs": [
			{
				"name": "userOp",
				"type": "tuple",
				"internalType": "struct PackedUserOperation",
				"components": [
					{ "name": "sender", "type": "address", "internalType": "address" },
					{ "name": "nonce", "type": "uint256", "internalType": "uint256" },
					{ "name": "initCode", "type": "bytes", "internalType": "bytes" },
					{ "name": "callData", "type": "bytes", "internalType": "bytes" },
					{ "name": "accountGasLimits", "type": "bytes32", "internalType": "bytes32" },
					{ "name": "preVerificationGas", "type": "uint256", "internalType": "uint256" },
					{ "name": "gasFees", "type": "bytes32", "internalType": "bytes32" },
					{ "name": "paymasterAndData", "type": "bytes", "internalType": "bytes" },
					{ "name": "signature", "type": "bytes", "internalType": "bytes" }
				]
			},
			{ "name": "userOpHash", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "missingAccountFunds", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{ "name": "validationData", "type": "uint256", "internalType": "uint256" }
		],
		"stateMutability": "nonpayable"
	},
	{ "type": "error", "name": "CheckUpkeepError", "inputs": [] },
	{
		"type": "error",
		"name": "CronJobIDNotFound",
		"inputs": [
			{ "name": "id", "type": "uint256", "internalType": "uint256" }
		]
	},
	{ "type": "error", "name": "ECDSAInvalidSignature", "inputs": [] },
	{
		"type": "error",
		"name": "ECDSAInvalidSignatureLength",
		"inputs": [
			{ "name": "length", "type": "uint256", "internalType": "uint256" }
		]
	},
	{
		"type": "error",
		"name": "ECDSAInvalidSignatureS",
		"inputs": [
			{ "name": "s", "type": "bytes32", "internalType": "bytes32" }
		]
	},
	{ "type": "error", "name": "ExecuteCCIPError", "inputs": [] },
	{
		"type": "error",
		"name": "ExecuteError",
		"inputs": [
			{ "name": "index", "type": "uint256", "internalType": "uint256" },
			{ "name": "error", "type": "bytes", "internalType": "bytes" }
		]
	},
	{ "type": "error", "name": "FeeTokenError", "inputs": [] },
	{ "type": "error", "name": "InvalidHandler", "inputs": [] },
	{ "type": "error", "name": "NotPoolManager", "inputs": [] },
	{ "type": "error", "name": "PerformError", "inputs": [] },
	{ "type": "error", "name": "PerformUpkeepError", "inputs": [] },
	{ "type": "error", "name": "ReceiveCCIPError", "inputs": [] },
	{ "type": "error", "name": "TickDoesntMatchSpec", "inputs": [] },
	{ "type": "error", "name": "TickInFuture", "inputs": [] },
	{ "type": "error", "name": "TickTooOld", "inputs": [] },
	{
		"type": "error",
		"name": "Unknown",
		"inputs": [
			{ "name": "", "type": "bytes", "internalType": "bytes" }
		]
	},
	{ "type": "error", "name": "UnknownFieldType", "inputs": [] }
]
