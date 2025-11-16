import { Player, PlayerRef } from '@remotion/player';
import React, { useEffect, useMemo, useState } from 'react';
import { Html5Video } from 'remotion';
import { Card } from './ui/card';
import CaptionOverlay from './caption-overlay';
import { CaptionStyles } from '@/app/page';

interface VideoPreviewProps {
    file: File;
    playerRef: React.RefObject<PlayerRef | null>;
    videoControlRef?: React.RefObject<{ seekTo: (time: number) => void } | null>;
    srtContent?: string | null;
    captionStyle: CaptionStyles | null;
}

const MyVideoComposition = ({ src, srtContent, captionStyle }: { src: string; srtContent?: string, captionStyle: CaptionStyles | undefined }) => {
    console.log('SRT Content in Composition:', srtContent);
    return (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
            <Html5Video
                src={src}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                playsInline
            />
            {srtContent && <CaptionOverlay srtContent={srtContent} captionStyle={captionStyle!} />}
        </div>
    );
}

const VideoPreview = ({ file, playerRef, videoControlRef, srtContent, captionStyle }: VideoPreviewProps) => {
    console.log('SRT Content in VideoPreview:', srtContent);
    const videoUrl = useMemo(() => {
        return URL.createObjectURL(file);
    }, [file]);

    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });
    const [isLoaded, setIsLoaded] = useState(false);

    // Setup video control ref for seeking
    useEffect(() => {
        if (videoControlRef) {
            videoControlRef.current = {
                seekTo: (time: number) => {
                    if (playerRef.current && videoDuration) {
                        const frame = Math.floor(time * 30);
                        playerRef.current.seekTo(frame);
                    }
                }
            };
        }
    }, [videoControlRef, videoDuration, playerRef]);

    // Load video metadata
    useEffect(() => {
        const video = document.createElement('video');

        const handleLoadedMetadata = () => {
            const duration = video.duration;
            const fps = 30;

            setVideoDuration(Math.ceil(duration * fps));
            setVideoDimensions({
                width: video.videoWidth || 1280,
                height: video.videoHeight || 720
            });
            setIsLoaded(true);
        };

        const handleError = (e: ErrorEvent) => {
            console.error('Video error:', e);
            console.error('Video error details:', video.error);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);

        video.src = videoUrl;
        video.load();

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
            video.remove();
            if (isLoaded) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl, isLoaded]);

    if (!videoDuration) {
        return (
            <Card className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400">Loading video...</div>
            </Card>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Player
                ref={playerRef}
                component={MyVideoComposition}
                inputProps={{
                    src: videoUrl,
                    srtContent: srtContent || undefined,
                    captionStyle: captionStyle || undefined
                }}
                durationInFrames={videoDuration}
                compositionWidth={videoDimensions.width}
                compositionHeight={videoDimensions.height}
                fps={30}
                controls
                style={{ width: '100%', height: '100%', maxHeight: '100%', borderRadius: 8 }}
            />
        </div>
    );
};

export default VideoPreview;
