import { ConnectWalletButton } from "./connect-wallet-button";

export function PageHeader({ title }: { title: string }) {
    return (
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
                <h1 className="text-[39px] font-bold text-gray-700 uppercase">{title}</h1>
            </div>
            <div className="grid justify-items-end">
                <ConnectWalletButton />
            </div>
        </div>
    );
}
