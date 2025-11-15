import { Player } from '@remotion/player';
import React, { useEffect, useMemo, useState } from 'react';
import { Html5Video } from 'remotion';
import { Card } from './ui/card';

interface VideoPreviewProps {
    file: File;
}

const MyVideoComposition = ({ src }: { src: string }) => (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
        <Html5Video
            src={src}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            playsInline
        />
    </div>
);

const VideoPreview = ({ file }: VideoPreviewProps) => {
    const videoUrl = useMemo(() => {
        const url = URL.createObjectURL(file);

        return url;
    }, [file]);

    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });
    const [isLoaded, setIsLoaded] = useState(false);

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
        <div className="w-full h-full items-center justify-center flex p-3">
            <Player
                component={MyVideoComposition}
                inputProps={{ src: videoUrl }}
                durationInFrames={videoDuration}
                compositionWidth={videoDimensions.width}
                compositionHeight={videoDimensions.height}
                fps={30}
                controls
                style={{ width: '100%', maxWidth: 800, aspectRatio: '16/9', borderRadius: 8 }}
            />
        </div>
    );
};

export default VideoPreview;