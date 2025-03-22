export const NetworkAgreementAbi = [
    {
        inputs: [
            {
                internalType: "string",
                name: "_constitutionURL",
                type: "string",
            },
            {
                internalType: "address",
                name: "_initiativesAddress",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "userProfileType",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "userNatureAgent",
                type: "string",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "constitutionHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "etherAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "AgreementSigned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "newURL",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "ConstitutionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "newAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "InitiativesContractAdressUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "newReceiver",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "NetworkStateTreasuryUpdated",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_CREDITS_PER_USER",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "constitutionURL",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initiativesContract",
        outputs: [
            {
                internalType: "contract NetworkStateInitiatives",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "networkdStateTreasury",
        outputs: [
            { internalType: "address payable", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_userProfileType",
                type: "string",
            },
            {
                internalType: "string",
                name: "_userNatureAgent",
                type: "string",
            },
            {
                internalType: "bytes32",
                name: "_constitutionHash",
                type: "bytes32",
            },
            { internalType: "bytes", name: "_signature", type: "bytes" },
        ],
        name: "signAgreement",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_constitutionURL",
                type: "string",
            },
        ],
        name: "updateConstitutionURL",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_initiativesContract",
                type: "address",
            },
        ],
        name: "updateInitiativesContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_newReceiver",
                type: "address",
            },
        ],
        name: "updateNetworkStateTreasury",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "userInformation",
        outputs: [
            { internalType: "string", name: "userProfileType", type: "string" },
            { internalType: "string", name: "userNatureAgent", type: "string" },
            {
                internalType: "bytes32",
                name: "constitutionHash",
                type: "bytes32",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
            { internalType: "bool", name: "hasAgreed", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "userNatureAgentAllowedList",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "userProfileTypeAllowedList",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
];
