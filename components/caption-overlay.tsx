"use client"

import { useCurrentFrame, useVideoConfig } from 'remotion';
import { parseSrt } from '@remotion/captions';

interface CaptionOverlayProps {
    srtContent: string;
}

const CaptionOverlay = ({ srtContent }: CaptionOverlayProps) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Convert frame to milliseconds
    const currentTimeMs = (frame / fps) * 1000;
    console.log('Current frame:', frame, 'Time (ms):', currentTimeMs);

    // Parse SRT - note the object destructuring and input format
    const { captions } = parseSrt({ input: srtContent });
    console.log('Total captions parsed:', captions.length);
    console.log('First caption:', captions[0]);

    // Find active caption for current time
    const activeCaption = captions.find(
        (caption) =>
            currentTimeMs >= caption.startMs &&
            currentTimeMs <= caption.endMs
    );

    console.log('Active caption:', activeCaption);

    if (!activeCaption) {
        console.log('No active caption for current time');
        return null;
    }


    return (
        <div
            style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
                maxWidth: '80%',
                zIndex: 10,
            }}
        >
            {activeCaption.text}
        </div>
    );
};

export default CaptionOverlay;
