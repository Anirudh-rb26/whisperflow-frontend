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

    // Parse SRT
    const { captions } = parseSrt({ input: srtContent });

    // Find active caption for current time
    const activeCaption = captions.find(
        (caption) =>
            currentTimeMs >= caption.startMs &&
            currentTimeMs <= caption.endMs
    );

    if (!activeCaption) {
        return null;
    }

    // Helper function to lighten color for non-active words
    const getLightenedColor = (color: string, amount: number = 0.5): string => {
        // Simple implementation - blend with white
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const newR = Math.round(r + (255 - r) * amount);
        const newG = Math.round(g + (255 - g) * amount);
        const newB = Math.round(b + (255 - b) * amount);

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    };

    // Karaoke Style - smooth word by word highlighting with interpolation
    const renderKaraokeStyle = () => {
        const words = activeCaption.text.split(' ');
        const captionDuration = activeCaption.endMs - activeCaption.startMs;
        const timePerWord = captionDuration / words.length;
        const elapsedTime = currentTimeMs - activeCaption.startMs;
        const currentWordIndex = Math.floor(elapsedTime / timePerWord);

        // Calculate smooth transition progress for current word
        const wordProgress = (elapsedTime % timePerWord) / timePerWord;

        const inactiveColor = getLightenedColor(captionStyle.captionTextColor || '#ffffff', 0.65);
        const activeColor = captionStyle.captionTextColor || '#ffffff';

        // Interpolate between colors for ultra-smooth transition
        const interpolateColor = (progress: number): string => {
            if (progress < 0.2) {
                // Ease-in at the start
                const t = progress / 0.2;
                return activeColor;
            } else if (progress > 0.8) {
                // Ease-out at the end
                return activeColor;
            }
            return activeColor;
        };

        return (
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: captionStyle.captionBackgroundColor || 'rgba(0, 0, 0, 0.85)',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: fontSizeMap[captionStyle.fontSize] || '24px',
                    fontWeight: 'bold',
                    fontFamily: captionStyle.fontFamily || 'sans-serif',
                    textAlign: 'center',
                    maxWidth: '85%',
                    zIndex: 10,
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
            >
                {words.map((word, index) => {
                    let wordOpacity = 1;
                    let wordScale = 1;
                    let wordColor = inactiveColor;
                    let wordTranslateY = 0;

                    if (index < currentWordIndex) {
                        // Already spoken - full color
                        wordColor = activeColor;
                        wordOpacity = 0.9;
                    } else if (index === currentWordIndex) {
                        // Currently speaking - smooth interpolated animation
                        wordColor = interpolateColor(wordProgress);

                        // Smooth scale animation with easing
                        if (wordProgress < 0.3) {
                            // Pop in
                            wordScale = 1 + (wordProgress / 0.3) * 0.15;
                        } else if (wordProgress > 0.7) {
                            // Pop out
                            wordScale = 1.15 - ((wordProgress - 0.7) / 0.3) * 0.15;
                        } else {
                            // Hold
                            wordScale = 1.15;
                        }

                        // Subtle bounce
                        if (wordProgress < 0.2) {
                            wordTranslateY = -3 * Math.sin(wordProgress / 0.2 * Math.PI);
                        }

                        wordOpacity = 1;
                    } else {
                        // Not yet spoken - dimmed
                        wordOpacity = 0.5;
                    }

                    return (
                        <span
                            key={index}
                            style={{
                                color: wordColor,
                                opacity: wordOpacity,
                                transform: `scale(${wordScale}) translateY(${wordTranslateY}px)`,
                                display: 'inline-block',
                                textShadow: index === currentWordIndex
                                    ? `0 0 20px ${activeColor}40, 0 2px 4px rgba(0,0,0,0.8)`
                                    : '0 2px 4px rgba(0,0,0,0.6)',
                                filter: index === currentWordIndex ? 'brightness(1.2)' : 'none',
                                willChange: 'transform, opacity, color',
                            }}
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
        );
    };

    // News Style - top bar with slide-in animation
    const renderNewsStyle = () => {
        const progress = Math.min((currentTimeMs - activeCaption.startMs) / 300, 1); // 300ms slide-in
        const slideAmount = (1 - progress) * -100;

        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: captionStyle.captionBackgroundColor || 'rgba(200, 0, 0, 0.9)',
                    color: captionStyle.captionTextColor || 'white',
                    padding: '16px 24px',
                    fontSize: fontSizeMap[captionStyle.fontSize] || '24px',
                    fontWeight: 'bold',
                    fontFamily: captionStyle.fontFamily || 'sans-serif',
                    textAlign: 'center',
                    zIndex: 10,
                    transform: `translateY(${slideAmount}%)`,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                    borderBottom: `3px solid ${captionStyle.captionTextColor || 'white'}`,
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                }}>
                    <span style={{
                        paddingLeft: '12px',
                    }}>
                        {activeCaption.text}
                    </span>
                </div>
            </div>
        );
    };

    // Standard Style - bottom centered with fade-in
    const renderStandardStyle = () => {
        const progress = Math.min((currentTimeMs - activeCaption.startMs) / 200, 1); // 200ms fade-in
        const opacity = progress;
        const scale = 0.9 + (progress * 0.1);

        return (
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '50%',
                    transform: `translateX(-50%) scale(${scale})`,
                    backgroundColor: captionStyle.captionBackgroundColor || 'rgba(0, 0, 0, 0.8)',
                    color: captionStyle.captionTextColor || 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: fontSizeMap[captionStyle.fontSize] || '24px',
                    fontWeight: 'bold',
                    fontFamily: captionStyle.fontFamily || 'sans-serif',
                    textAlign: 'center',
                    maxWidth: '80%',
                    zIndex: 10,
                    opacity: opacity,
                }}
            >
                {activeCaption.text}
            </div>
        );
    };

    // Render based on selected caption style
    switch (captionStyle.captionStyle) {
        case 'Karaoke Style':
            return renderKaraokeStyle();
        case 'News Style (Top Bar)':
            return renderNewsStyle();
        case 'Standard (Bottom Centered)':
        default:
            return renderStandardStyle();
    }
};

export default CaptionOverlay;
