import { registerRoot } from 'remotion';
import React, { ComponentType } from 'react';
import { Composition } from 'remotion';
import { MyRemotionComposition } from './components/MyRemotionComposition';

export const RemotionRoot: React.FC = () => (
    <Composition
        id="MyRemotionComposition"
        component={MyRemotionComposition as ComponentType}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
            src: '', // Will be provided at render time
            srtContent: undefined,
            captionStyle: undefined,
        }}
    />
);

registerRoot(RemotionRoot);

export default RemotionRoot;
