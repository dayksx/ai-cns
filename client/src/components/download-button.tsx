import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const DownloadButton = ({
    url,
    fileName,
}: {
    url: string;
    fileName: string;
}) => {
    const handleDownload = () => {
        console.log("downloading", url, fileName);
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName || "downloaded-file";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error fetching the file:", error);
            });
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={handleDownload}
                    variant="ghost"
                    size="icon"
                    className="flex items-center space-x-2 text-muted-foreground"
                >
                    <Download className="size-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>Download</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default DownloadButton;
