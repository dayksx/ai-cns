import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { Hex } from "viem";

export const getNetizenBadgeAttestations = async (netizenAddress: Hex) => {
    try {
        const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND);
        const attestationDataMapper = veraxSdk.attestation; // RW Attestations
        const portalAddress = "0x4787Fd2DfE83C0e5d07d2BA1aEF12Afc5c4fe306";
        const schemaId =
            "0x8660da4093987072670aba14868d8dc4112ea88a777f7434a54ea8e7925a1a73";

        const netizenBadgeAttestations = await attestationDataMapper.findBy(
            10, // first - can be set to limit the number of results, null means no limit
            undefined, // skip - can be set to paginate results, null means start from the beginning
            {
                portal: portalAddress.toLowerCase(),
                schema: schemaId, // Add this if you want to filter by schema
                subject: netizenAddress,
            },
            "id", // orderBy - using "id" which is likely to be valid
            "desc" // orderDirection - most recent first
        );

        const formattedAttestations = netizenBadgeAttestations.map(
            (attestation) => {
                const [scope, isTrustworthy] = attestation.decodedData;
                return { scope, isTrustworthy };
            }
        );
        return formattedAttestations;
    } catch (error) {}
};
