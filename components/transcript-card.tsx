"use client"

import { Card } from './ui/card'
import Dropdown from './dropdown'
import ShinyText from './ShinyText'
import { Button } from './ui/button'
import { CaptionStyles } from '@/app/page'
import { PlayerRef } from '@remotion/player'
import { ScrollArea } from './ui/scroll-area'
import TranscriptViewer from './transcript-viewer'
import { Sparkles } from './animated-icons/sparkles'
import { Alert, AlertDescription } from './ui/alert'
import DownloadHoverCard from './download-hover-card'
import React, { SetStateAction, useState } from 'react'
import { Download, FileText, AlertCircle } from 'lucide-react'
import { fetchTranscript, TranscriptionResponse } from '@/services/fetchTranscription'
import { triggerVideoRender } from '@/services/renderVideo'

interface transcriptCardProps {
    file: File;
    srt: string;
    vtt: string;
    currentLanguage: string;
    currentTime?: number;
    isRenderingVideo: boolean;
    downloadUrl: string | null;
    onSeek?: (time: number) => void;
    captionStyle: CaptionStyles | null;
    playerRef: React.RefObject<PlayerRef | null>;
    setSrt: React.Dispatch<SetStateAction<string | null>>
    setVtt: React.Dispatch<SetStateAction<string | null>>
    setIsRenderingVideo: React.Dispatch<SetStateAction<boolean>>;
    setDownloadUrl: React.Dispatch<SetStateAction<string | null>>;
}

const TranscriptCard = ({
    srt,
    vtt,
    file,
    setSrt,
    onSeek,
    setVtt,
    currentLanguage,
    playerRef,
    downloadUrl,
    captionStyle,
    setDownloadUrl,
    isRenderingVideo,
    setIsRenderingVideo,
}: transcriptCardProps) => {
    const [loading, setLoading] = useState(false);
    const [caption, setCaption] = useState("SRT");
    const [error, setError] = useState<string | null>(null);
    const [cliCommand, setCliCommand] = useState<string | null>(null);

    const handleClick = async (file: File) => {
        if (!file) {
            console.log("No File Selected");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const transcript: TranscriptionResponse = await fetchTranscript(file, currentLanguage);

            setSrt(transcript.srt);
            setVtt(transcript.vtt);

            console.log("✅ Transcription successful!");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setError(errorMessage);
            console.error("❌ Transcription failed:", errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleExport = () => {
        const content = caption === 'SRT' ? srt : vtt;
        if (!content) return;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace(/\.[^/.]+$/, '')}.${caption.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const handleRenderVideo = async () => {
        if (!file) {
            setError("No file selected");
            return;
        }

        setIsRenderingVideo(true);
        setError(null);

        try {
            // Step 1: Upload video file
            console.log("📤 Uploading video file...");
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed with status ${uploadResponse.status}`);
            }

            const uploadData = await uploadResponse.json();

            // Extract and properly encode filename
            const fileName = uploadData.filename || file.name;

            // URL encode the filename to handle spaces and special characters
            const encodedFileName = encodeURIComponent(fileName);
            const videoUrl = `http://localhost:8000/uploads/${encodedFileName}`;

            console.log('📹 Video URL for rendering:', videoUrl);
            console.log('✓ File uploaded successfully');

            // Step 2: Verify the file is accessible before rendering
            console.log('🔍 Verifying file accessibility...');
            const headResponse = await fetch(videoUrl, { method: 'HEAD' });

            if (!headResponse.ok) {
                throw new Error(
                    `Video file not accessible at ${videoUrl} (Status: ${headResponse.status})`
                );
            }

            console.log('✓ File is accessible');

            // Step 3: Trigger video render with HTTP URL
            console.log('🎬 Starting render...');
            const renderResponse = await triggerVideoRender({
                compositionId: 'MyRemotionComposition',
                inputProps: {
                    src: videoUrl,
                    srtContent: srt || undefined,
                    captionStyle: captionStyle || undefined,
                },
                renderConfig: {
                    codec: 'h264',
                    expirationSeconds: 3600,
                    jpegQuality: 85,
                },
            });

            console.log('✅ Video render started:', renderResponse.renderId);

            // Set both download URL and CLI command
            setDownloadUrl(renderResponse.downloadUrl);
            setCliCommand(renderResponse.cliCommand);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setError(errorMessage);
            console.error('❌ Video render failed:', errorMessage);

        } finally {
            setIsRenderingVideo(false);
        }
    };

    const captionsGenerated = srt || vtt;

    return (
        <Card className='h-full w-full p-6 flex justify-center items-center overflow-hidden'>
            <div className='w-full h-full flex flex-col items-center justify-center gap-6 min-h-0'>
                {/* Error State */}
                {error && (
                    <Alert variant="destructive" className="w-full">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Default State - Empty */}
                {!loading && !captionsGenerated && !error && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="rounded-full bg-muted p-4">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">No Captions Yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Generate captions to view and edit your transcript
                            </p>
                        </div>
                    </div>
                )}

                {/* Video Uploaded but caption is not generated */}
                {!captionsGenerated && (
                    loading ? (
                        <Button
                            className='flex flex-row gap-2 min-w-60'
                            variant={'outline'}
                            disabled={true}
                            size="lg"
                        >
                            <ShinyText
                                text='Generating Captions...'
                                speed={2}
                                disabled={false}
                                className='shine-animation'
                            />
                            <Sparkles fromColor='#8e54e9' toColor='#4776e6' />
                        </Button>
                    ) : (
                        !error && (
                            <Button
                                className='flex flex-row gap-2 min-w-60'
                                variant={'default'}
                                onClick={() => { handleClick(file) }}
                                disabled={!file}
                                size="lg"
                            >
                                <Sparkles fromColor='#8e54e9' toColor='#4776e6' />
                                <span>Auto-Generate Captions</span>
                            </Button>
                        )
                    )
                )}

                {/* Video Uploaded and Caption generated */}
                {captionsGenerated && (
                    <div className='w-full h-full flex flex-col gap-2 min-h-0'>
                        {/* Header with controls */}
                        <div className='w-full flex flex-row items-center justify-between gap-3 shrink-0'>
                            <div className="flex items-center justify-center gap-2">
                                <h3 className="text-sm font-medium text-white">
                                    Format:
                                </h3>
                                <Dropdown
                                    initialValue={caption}
                                    values={['SRT', 'VTT']}
                                    setValue={setCaption}
                                />
                            </div>
                            <div className='flex flex-row gap-2'>
                                <Button
                                    onClick={handleExport}
                                    className="gap-2"
                                    variant="default"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Export {caption}</span>
                                </Button>
                                <DownloadHoverCard
                                    isRendering={isRenderingVideo}
                                    downloadUrl={downloadUrl}
                                    cliCommand={cliCommand}
                                    onRender={handleRenderVideo}
                                />
                            </div>
                        </div>

                        {/* Transcript viewer */}
                        <ScrollArea className='w-full flex-1 min-h-0'>
                            {caption === 'SRT' && srt && (
                                <TranscriptViewer transcript={srt} type={"SRT"} onSeek={onSeek} playerRef={playerRef} />
                            )}

                            {caption === 'VTT' && vtt && (
                                <TranscriptViewer transcript={vtt} type={"VTT"} onSeek={onSeek} playerRef={playerRef} />
                            )}
                        </ScrollArea>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default TranscriptCard
