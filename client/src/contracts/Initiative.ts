export const contractAddress = import.meta.env
    .VITE_CNS_INITIATIVE_CONTRACT_ADDRESS;

export const contractAbi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newCreditBalance",
                type: "uint256",
            },
        ],
        name: "CreditsUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "initiativeId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "voter",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "votesNumber",
                type: "uint256",
            },
        ],
        name: "Downvoted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "initiativeId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "ideator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "title",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "description",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "category",
                type: "string",
            },
        ],
        name: "InitiativeCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "initiativeId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "string",
                name: "newStatus",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "StatusUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "initiativeId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "member",
                type: "address",
            },
        ],
        name: "TeamMemberAdded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "initiativeId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "member",
                type: "address",
            },
        ],
        name: "TeamMemberRemoved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "initiativeId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "voter",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "votesNumber",
                type: "uint256",
            },
        ],
        name: "Upvoted",
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
        inputs: [
            { internalType: "bytes32", name: "_initiativeId", type: "bytes32" },
            { internalType: "address", name: "_member", type: "address" },
        ],
        name: "addTeamMember",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_ideator", type: "address" },
            { internalType: "string", name: "_title", type: "string" },
            { internalType: "string", name: "_description", type: "string" },
            { internalType: "string", name: "_category", type: "string" },
            { internalType: "string[]", name: "_tags", type: "string[]" },
        ],
        name: "createInitiatives",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "_initiativeId", type: "bytes32" },
            { internalType: "uint256", name: "_votesNumber", type: "uint256" },
        ],
        name: "downvote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "generatePseudoUUID",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "bytes32", name: "", type: "bytes32" },
        ],
        name: "hasVoted",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "initiatives",
        outputs: [
            { internalType: "bytes32", name: "id", type: "bytes32" },
            { internalType: "address", name: "ideator", type: "address" },
            { internalType: "address", name: "instigator", type: "address" },
            { internalType: "string", name: "title", type: "string" },
            { internalType: "string", name: "description", type: "string" },
            { internalType: "string", name: "category", type: "string" },
            { internalType: "uint256", name: "timestamp", type: "uint256" },
            { internalType: "string", name: "status", type: "string" },
            { internalType: "uint256", name: "upvotes", type: "uint256" },
            { internalType: "uint256", name: "downvotes", type: "uint256" },
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
            { internalType: "bytes32", name: "_initiativeId", type: "bytes32" },
            { internalType: "address", name: "_member", type: "address" },
        ],
        name: "removeTeamMember",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "statusList",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "_initiativeId", type: "bytes32" },
            { internalType: "string", name: "_newStatus", type: "string" },
        ],
        name: "updateStatus",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_user", type: "address" },
            {
                internalType: "uint256",
                name: "_newCreditBalance",
                type: "uint256",
            },
        ],
        name: "updateUserCredits",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "_initiativeId", type: "bytes32" },
            { internalType: "uint256", name: "_votesNumber", type: "uint256" },
        ],
        name: "upvote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "userCredits",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];
