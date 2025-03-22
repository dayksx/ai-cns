// @ts-ignore
import Jazzicon from "@metamask/jazzicon";
import { FunctionComponent, useRef, useEffect } from "react";

export type JazzIconProps = {
    address: string;
    size: number;
};

export const JazzIcon: FunctionComponent<JazzIconProps> = ({
    address,
    size,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const addr = address.trim().slice(2, 10);
    const seed = parseInt(addr, 16);

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = "";
            ref.current.appendChild(Jazzicon(size, seed));
        }
    }, [seed, size]);

    return <div ref={ref} className="rounded-full overflow-hidden" />;
};
