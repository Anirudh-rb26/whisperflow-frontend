"use client"

import { Input } from './ui/input'
import { Button } from './ui/button'
import React, { useState } from 'react'
import { Copy, Download, Video } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { toast } from 'sonner'


interface DownloadHoverCardProps {
    isRendering: boolean;
    downloadUrl: string | null;
    onRender: () => void;
}


const DownloadHoverCard: React.FC<DownloadHoverCardProps> = ({
    isRendering,
    downloadUrl,
    onRender,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCopyCommand = () => {
        if (!downloadUrl) return;

        const command = `curl -o output.mp4 "${downloadUrl}"`;
        navigator.clipboard.writeText(command);

        toast("Copied!", {
            description: "Download command copied to clipboard",
            duration: 2000,
        });
    };

    const handleDirectDownload = () => {
        if (!downloadUrl) return;

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'output.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast("Downloading", {
            description: "Your video is being downloaded",
            duration: 2000,
        });
    };

    return (
        <HoverCard open={isOpen} onOpenChange={setIsOpen}>
            <HoverCardTrigger asChild>
                <Button
                    className="gap-2"
                    variant="default"
                    onClick={onRender}
                    disabled={isRendering}
                >
                    <Video className="h-4 w-4" />
                    <span>{isRendering ? "Rendering..." : "Export Video"}</span>
                </Button>
            </HoverCardTrigger>

            <HoverCardContent className="w-80" align="end">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Download Video</h4>
                        <p className="text-xs text-muted-foreground">
                            {downloadUrl
                                ? "Choose how to download your rendered video"
                                : "Render video to see download options"}
                        </p>
                    </div>

                    {downloadUrl && (
                        <div className="space-y-3">
                            {/* Command Input Field */}
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={`curl -o output.mp4 "${downloadUrl}"`}
                                    disabled
                                    className="text-xs"
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCopyCommand}
                                    className="gap-1"
                                >
                                    <Copy className="h-3 w-3" />
                                    Copy
                                </Button>
                            </div>

                            {/* Direct Download Button */}
                            <Button
                                size="sm"
                                className="w-full gap-2"
                                onClick={handleDirectDownload}
                            >
                                <Download className="h-4 w-4" />
                                Direct Download
                            </Button>
                        </div>
                    )}

                    {!downloadUrl && isRendering && (
                        <div className="flex items-center justify-center py-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-xs ml-2">Rendering video...</span>
                        </div>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default DownloadHoverCard
