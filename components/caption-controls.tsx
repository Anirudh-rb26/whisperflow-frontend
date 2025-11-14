"use client"

import { Card } from './ui/card'
import Dropdown from './dropdown'
import React, { useState } from 'react'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import HorizontalColorPicker from './horizontal-colorpicker'

const captionStyles = [
    "Karaoke Style",
    "News Style (Top Bar)",
    "Standard (Bottom Centered)",
]

const fontOptions = [
    // Normal/Clean Fonts
    "Poppins",           // Modern, clean sans-serif [web:17]
    "Lato",              // Versatile, highly readable [web:17]

    // Fancy/Decorative Fonts
    "Cinzel Decorative", // Elegant, classical Roman-inspired [web:20]
    "Tangerine",         // Stylish script, sophisticated [web:17]
    "Sacramento",        // Flowing script, whimsical [web:17]
    "Great Vibes",       // Elegant cursive, luxury feel [web:17]

    // Coding/Typewriter Fonts
    "Source Code Pro",   // Monospaced, coder-friendly [web:16]
    "IBM Plex Mono",     // Professional monospace [web:16]

    // Devanagari (Hindi) Support
    "Noto Sans Devanagari", // Modern sans-serif for Hindi [web:12]
    "Hind",                  // UI-optimized, supports Devanagari + Latin [web:14]
];

const fontSizeOptions = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
]


const CaptionControls = () => {
    const [textColor, setTextColor] = useState("#ffffff");
    const [backgroundColor, setbackgroundColor] = useState("#000000");

    const [font, setFont] = useState("Poppins");
    const [fontsize, setFontSize] = useState("md");

    const [captionStyle, setCaptionStyle] = useState("Standard (Bottom Centered)");
    return (
        <Card className='w-full h-full p-4'>
            <ScrollArea className='p-4 overflow-auto space-y-6'>
                <h1 className='mb-6 font-medium'>Customize Caption Styles</h1>
                <Separator className='w-full text-muted-foreground my-4' />
                {/* Caption Style */}
                <Dropdown title='Caption Style' initialValue={captionStyle} values={captionStyles} setValue={setCaptionStyle} />

                <Separator className='w-full text-muted-foreground my-4' />

                {/* Text Colors */}
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <h2 className='text-sm font-medium'>Caption Text Color</h2>
                        <HorizontalColorPicker color={textColor} setColor={setTextColor} />
                    </div>
                    <div className='space-y-2'>
                        <h2 className='text-sm font-medium'>Caption Background Color</h2>
                        <HorizontalColorPicker color={backgroundColor} setColor={setbackgroundColor} />
                    </div>
                </div>

                <Separator className='w-full text-muted-foreground my-4' />

                {/* Font Styling */}
                <div className='flex flex-row w-full gap-2'>
                    <div className='w-[50%]'>
                        <Dropdown
                            title='Font Family'
                            initialValue={font}
                            values={fontOptions}
                            setValue={setFont}
                            showValuesInOwnStyle={true}
                            previewType='font'
                        />
                    </div>
                    <div className='w-[50%]'>
                        <Dropdown
                            title='Font Size'
                            initialValue={fontsize}
                            values={fontSizeOptions}
                            setValue={setFontSize}
                            showValuesInOwnStyle={true}
                            previewType='size'
                        />
                    </div>
                </div>
            </ScrollArea>
        </Card>
    )
}

export default CaptionControls
