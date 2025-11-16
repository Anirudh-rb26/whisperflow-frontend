"use client"

import { useCurrentFrame, useVideoConfig } from 'remotion';
import { parseSrt } from '@remotion/captions';
import { CaptionStyles } from '@/app/page';

interface CaptionOverlayProps {
    srtContent: string;
    captionStyle: CaptionStyles;
}

const fontSizeMap: Record<string, string> = {
    sm: '18px',
    md: '24px',
    lg: '32px',
    xl: '48px',
};


const CaptionOverlay = ({ srtContent, captionStyle }: CaptionOverlayProps) => {
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
                backgroundColor: captionStyle.captionBackgroundColor || 'rgba(0, 0, 0, 0.8)',
                color: captionStyle.captionTextColor || 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: fontSizeMap[captionStyle.fontSize] || '24px', // Dynamic size
                fontWeight: 'bold',
                fontFamily: captionStyle.fontFamily || 'sans-serif',
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
