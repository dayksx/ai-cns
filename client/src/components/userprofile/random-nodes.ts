const SAMPLE_ETHEREUM_ADDRESSES = [
    "0xD7B8A2E5C1F4A6D7B9C3D5A9B6F7C8D1E2A4C6B",
    "0x8A2E5C1F4A6D7B9C3D5A9B6F7C8D1E2A4C6B9D7",
    "0x5C1F4A6D7B9C3D5A9B6F7C8D1E2A4C6B9D7B8A2",
    "0x1F4A6D7B9C3D5A9B6F7C8D1E2A4C6B9D7B8A2E5",
    "0xD7B9C3D5A9B6F7C8D1E2A4C6B9D7B8A2E5C1F4A",
    "0x3D5A9B6F7C8D1E2A4C6B9D7B8A2E5C1F4A6D7B9",
    "0x9B6F7C8D1E2A4C6B9D7B8A2E5C1F4A6D7B9C3D5",
    "0xF7C8D1E2A4C6B9D7B8A2E5C1F4A6D7B9C3D5A9B",
];

// const possibleAddresses = [
//     "0x44dc4e3309b80ef7abf41c7d0a68f0337a88f044",
//     "0x2754265A82705CEe4Fca6343a5cdD36850348780",
//     "0x65a4CeC9f1c6060f3b987d9332Bedf26e8E86D17",
//     "0x17757544f255c78D3492bc2534DBfaDD7C1bD007",
// ];

const getConnectedNodes = (mainAddress: string): any => {
    //const normalizedMainAddress = mainAddress.toLowerCase();

    // const scenario =
    //     possibleAddresses.findIndex(
    //         (addr) => addr.toLowerCase() === normalizedMainAddress
    //     ) + 1; // `+1` ensures scenario starts from 1 instead of -1

    const scenario = 1;

    switch (scenario) {
        case 1:
            return {
                nodes: [
                    { id: mainAddress, group: 1, isMain: true },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[0],
                        group: 2,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[1],
                        group: 2,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[2],
                        group: 3,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[3],
                        group: 3,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[4],
                        group: 3,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[5],
                        group: 3,
                        isMain: false,
                    },
                ],
                links: [
                    {
                        source: mainAddress,
                        target: SAMPLE_ETHEREUM_ADDRESSES[0],
                    },
                    {
                        source: mainAddress,
                        target: SAMPLE_ETHEREUM_ADDRESSES[1],
                    },
                    {
                        source: SAMPLE_ETHEREUM_ADDRESSES[0],
                        target: SAMPLE_ETHEREUM_ADDRESSES[2],
                    },
                    {
                        source: SAMPLE_ETHEREUM_ADDRESSES[0],
                        target: SAMPLE_ETHEREUM_ADDRESSES[3],
                    },
                    {
                        source: SAMPLE_ETHEREUM_ADDRESSES[1],
                        target: SAMPLE_ETHEREUM_ADDRESSES[4],
                    },
                    {
                        source: SAMPLE_ETHEREUM_ADDRESSES[1],
                        target: SAMPLE_ETHEREUM_ADDRESSES[5],
                    },
                ],
            };
        case 2:
            return {
                nodes: [
                    { id: mainAddress, group: 1, isMain: true },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[0],
                        group: 2,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[1],
                        group: 2,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[2],
                        group: 3,
                        isMain: false,
                    },
                ],
                links: [
                    {
                        source: mainAddress,
                        target: SAMPLE_ETHEREUM_ADDRESSES[0],
                    },
                    {
                        source: mainAddress,
                        target: SAMPLE_ETHEREUM_ADDRESSES[1],
                    },
                    {
                        source: SAMPLE_ETHEREUM_ADDRESSES[0],
                        target: SAMPLE_ETHEREUM_ADDRESSES[2],
                    },
                ],
            };
        case 3:
            return {
                nodes: [
                    { id: mainAddress, group: 1, isMain: true },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[0],
                        group: 2,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[1],
                        group: 2,
                        isMain: false,
                    },
                ],
                links: [
                    {
                        source: mainAddress,
                        target: SAMPLE_ETHEREUM_ADDRESSES[0],
                    },
                    {
                        source: mainAddress,
                        target: SAMPLE_ETHEREUM_ADDRESSES[1],
                    },
                ],
            };
        default:
            return {
                nodes: [
                    { id: mainAddress, group: 1, isMain: true },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[0],
                        group: 2,
                        isMain: false,
                    },
                    {
                        id: SAMPLE_ETHEREUM_ADDRESSES[1],
                        group: 3,
                        isMain: false,
                    },
                ],
                links: [
                    {
                        source: mainAddress,
                        target: SAMPLE_ETHEREUM_ADDRESSES[0],
                    },
                    {
                        source: SAMPLE_ETHEREUM_ADDRESSES[0],
                        target: SAMPLE_ETHEREUM_ADDRESSES[1],
                    },
                ],
            };
    }
};

export default getConnectedNodes;
