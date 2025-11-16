"use client"

import React, { SetStateAction, useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { fetchTranscript, TranscriptionResponse } from '@/services/fetchTranscription'
import { Sparkles } from './animated-icons/sparkles'
import ShinyText from './ShinyText'
import { ScrollArea } from './ui/scroll-area'
import Dropdown from './dropdown'
import TranscriptViewer from './transcript-viewer'
import { Download, FileText, AlertCircle, Video } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { PlayerRef } from '@remotion/player'

interface transcriptCardProps {
    file: File;
    currentTime?: number;
    onSeek?: (time: number) => void;
    playerRef: React.RefObject<PlayerRef | null>;
    srt: string;
    setSrt: React.Dispatch<SetStateAction<string | null>>
    vtt: string;
    setVtt: React.Dispatch<SetStateAction<string | null>>
}

const TranscriptCard = ({ file, onSeek, playerRef, srt, setSrt, vtt, setVtt }: transcriptCardProps) => {
    const [loading, setLoading] = useState(false);
    const [caption, setCaption] = useState("SRT");
    const [error, setError] = useState<string | null>(null);

    const handleClick = async (file: File) => {
        if (!file) {
            console.log("No File Selected");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const transcript: TranscriptionResponse = await fetchTranscript(file);

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
                                <Button
                                    // onClick={ }
                                    className="gap-2"
                                    variant="default"
                                >
                                    <Video className="h-4 w-4" />
                                    <span>Export Video</span>
                                </Button>
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