import React, { useMemo, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { Card } from './ui/card';
import { PlayerRef, CallbackListener } from '@remotion/player';

interface TranscriptViewerProps {
    transcript: string;
    type: 'SRT' | 'VTT';
    onSeek?: (time: number) => void;
    playerRef: React.RefObject<PlayerRef | null>;
}

interface TranscriptSegment {
    index: number;
    startTime: number;
    endTime: number;
    text: string;
}

const parseTimestamp = (timestamp: string): number => {
    const cleanTimestamp = timestamp.replace(',', '.');
    const parts = cleanTimestamp.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const secondsParts = parts[2].split('.');
    const seconds = parseInt(secondsParts[0]);
    const milliseconds = parseInt(secondsParts[1] || '0');

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
};

const parseSRT = (srt: string): TranscriptSegment[] => {
    const segments: TranscriptSegment[] = [];
    const blocks = srt.trim().split('\n\n');

    blocks.forEach(block => {
        const lines = block.split('\n');
        if (lines.length >= 3) {
            const index = parseInt(lines[0]);
            const [startTimeStr, endTimeStr] = lines[1].split(' --> ');
            const text = lines.slice(2).join('\n');

            segments.push({
                index,
                startTime: parseTimestamp(startTimeStr),
                endTime: parseTimestamp(endTimeStr),
                text
            });
        }
    });

    return segments;
};

const parseVTT = (vtt: string): TranscriptSegment[] => {
    const segments: TranscriptSegment[] = [];
    const lines = vtt.split('\n');
    let currentSegment: Partial<TranscriptSegment> | null = null;
    let index = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.includes('-->')) {
            const [startTimeStr, endTimeStr] = line.split(' --> ');
            currentSegment = {
                index: ++index,
                startTime: parseTimestamp(startTimeStr),
                endTime: parseTimestamp(endTimeStr),
                text: ''
            };
        } else if (currentSegment && line && line !== 'WEBVTT') {
            if (currentSegment.text) {
                currentSegment.text += '\n' + line;
            } else {
                currentSegment.text = line;
            }
        } else if (currentSegment && !line) {
            segments.push(currentSegment as TranscriptSegment);
            currentSegment = null;
        }
    }

    if (currentSegment && currentSegment.text) {
        segments.push(currentSegment as TranscriptSegment);
    }

    return segments;
};

// Custom hook using useSyncExternalStore for optimal performance
const useCurrentPlayerFrame = (ref: React.RefObject<PlayerRef | null>) => {
    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            const { current } = ref;
            if (!current) {
                return () => undefined;
            }

            const updater: CallbackListener<'frameupdate'> = ({ detail }) => {
                onStoreChange();
            };

            current.addEventListener('frameupdate', updater);

            return () => {
                current.removeEventListener('frameupdate', updater);
            };
        },
        [ref]
    );

    const data = useSyncExternalStore<number>(
        subscribe,
        () => ref.current?.getCurrentFrame() ?? 0,
        () => 0
    );

    return data;
};

const TranscriptViewer = ({ transcript, type, onSeek, playerRef }: TranscriptViewerProps) => {
    const segments = useMemo(() => {
        return type === 'SRT' ? parseSRT(transcript) : parseVTT(transcript);
    }, [transcript, type]);

    const activeSegmentRef = useRef<HTMLDivElement>(null);

    // Use the custom hook to get current frame
    const currentFrame = useCurrentPlayerFrame(playerRef);
    const currentTime = currentFrame / 30; // Convert frames to seconds (30 fps)

    // Find the currently active segment
    const activeSegmentIndex = useMemo(() => {
        return segments.findIndex(
            segment => currentTime >= segment.startTime && currentTime <= segment.endTime
        );
    }, [segments, currentTime]);

    // Auto-scroll to active segment
    useEffect(() => {
        if (activeSegmentRef.current) {
            activeSegmentRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [activeSegmentIndex]);

    const handleSegmentClick = (segment: TranscriptSegment) => {
        if (onSeek) {
            onSeek(segment.startTime);
        }
    };

    return (
        <div className="space-y-2 p-2">
            {segments.map((segment, index) => {
                const isActive = index === activeSegmentIndex;

                return (
                    <Card
                        key={segment.index}
                        ref={isActive ? activeSegmentRef : null}
                        onClick={() => handleSegmentClick(segment)}
                        className={`p-4 transition-all duration-200 cursor-pointer hover:bg-accent ${isActive
                                ? 'bg-primary/20 border-primary shadow-md'
                                : 'bg-card hover:shadow-sm'
                            }`}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-mono ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                                    }`}>
                                    {new Date(segment.startTime * 1000).toISOString().substr(11, 8)}
                                    {' → '}
                                    {new Date(segment.endTime * 1000).toISOString().substr(11, 8)}
                                </span>
                                <span className={`text-xs ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                                    }`}>
                                    #{segment.index}
                                </span>
                            </div>
                            <p className={`text-sm ${isActive ? 'font-medium' : ''}`}>
                                {segment.text}
                            </p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default TranscriptViewer;
