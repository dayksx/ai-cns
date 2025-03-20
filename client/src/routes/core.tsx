import { PageHeader } from "../components/page-header";
import { CnsCoreInfrastructure } from "../components/cns/cns-core-infrastructure";

export default function Core() {
    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Core Infrastructure" />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <CnsCoreInfrastructure />
                    </div>
                </div>
            </div>
        </div>
    );
}
