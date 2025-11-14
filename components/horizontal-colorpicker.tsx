import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { HexColorPicker } from 'react-colorful'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

interface horizontalColorPickerProps {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
}

const HorizontalColorPicker = ({ color, setColor }: horizontalColorPickerProps) => {
    return (
        <div className='flex flex-row w-full gap-2 items-stretch py-2'>
            <HoverCard>
                <HoverCardTrigger>
                    <Button style={{ backgroundColor: color }}></Button>
                </HoverCardTrigger>
                <HoverCardContent className='flex items-center justify-center'>
                    <HexColorPicker color={color} onChange={setColor} className='' />
                </HoverCardContent>
            </HoverCard>
            <div className='relative flex-1'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>#</span>
                <Input
                    className='pl-7 w-full'
                    value={color.replace('#', '')}
                    onChange={(e) => setColor(`#${e.target.value.replace('#', '')}`)}
                    placeholder={color}
                />
            </div>
        </div>
    )
}

export default HorizontalColorPicker