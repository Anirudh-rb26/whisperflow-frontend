import React, { useState } from 'react';
import { Html5Video } from 'remotion';
import CaptionOverlay from './caption-overlay';
import { CaptionStyles } from '@/app/page';

export interface RemotionCompositionProps {
    src: string;
    srtContent?: string;
    captionStyle?: CaptionStyles;
}

export const MyRemotionComposition: React.FC<RemotionCompositionProps> = ({
    src,
    srtContent,
    captionStyle,
}) => {
    const [videoError, setVideoError] = useState<string | null>(null);

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }}>
            {/* Video with error handling */}
            <Html5Video
                src={src}
                style={{ width: '100%', height: '100%' }}
                onError={(e) => {
                    const errorMsg = `Video error: ${e.message}`;
                    console.error(errorMsg);
                    setVideoError(errorMsg);
                }}
            />

            {/* Error overlay */}
            {videoError && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '20px',
                    }}
                >
                    <div>
                        <h3>Video Load Error</h3>
                        <p>{videoError}</p>
                    </div>
                </div>
            )}

            {/* Captions */}
            {srtContent && captionStyle && (
                <CaptionOverlay
                    srtContent={srtContent}
                    captionStyle={captionStyle}
                />
            )}
        </div>
    );
};

export default MyRemotionComposition;
