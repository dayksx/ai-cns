import { useEffect, useState } from "react";
import { PageHeader } from "../components/page-header";
import { CnsActivities } from "../components/cns/cns-activities";
import { CnsCoreGoods } from "../components/cns/cns-core-goods";
import { CnsDemography } from "../components/cns/cns-demography";
import { CnsTreasury } from "../components/cns/cns-treasury";
import { CnsSoftwareAssets } from "../components/cns/cns-software-assets";
import { getCnsNetizens, Netizen } from "../lib/cns/get-cns-netizens";

export default function Census() {
    const [netizens, setNetizens] = useState<Netizen[]>([]);

    useEffect(() => {
        getCnsNetizens().then((netizens) => {
            setNetizens(netizens);
        });
    }, []);

    return (
        <div className="flex flex-col w-full h-[100dvh] p-8 text-white">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Census" />
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                            <CnsDemography netizens={netizens} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-3xl font-bold text-blue-400 uppercase">
                                Assets
                            </span>
                            <CnsTreasury />
                            <CnsCoreGoods />
                            <CnsSoftwareAssets />
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-4">
                            <CnsActivities />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
