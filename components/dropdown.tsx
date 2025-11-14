import React from 'react'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ScrollArea } from './ui/scroll-area';

interface dropdownProps {
    title: string;
    initialValue: string;
    values: string[];
    setValue: (value: string) => void;
    showValuesInOwnStyle?: boolean;
    previewType?: 'font' | 'size'; // New prop to specify what to preview
}

const Dropdown = ({ title, initialValue, values, setValue, showValuesInOwnStyle, previewType }: dropdownProps) => {
    const getItemStyle = (value: string) => {
        if (!showValuesInOwnStyle) return undefined;

        if (previewType === 'font') {
            return { fontFamily: value };
        } else if (previewType === 'size') {
            // Map size names to actual CSS values
            const sizeMap: Record<string, string> = {
                'xs': '0.75rem',
                'sm': '0.875rem',
                'md': '1rem',
                'lg': '1.125rem',
                'xl': '1.25rem',
            };
            return { fontSize: sizeMap[value] || '1rem' };
        }
        return undefined;
    };

    return (
        <div className='space-y-2'>
            <h2 className='text-sm font-medium'>{title}</h2>
            <DropdownMenu>
                <DropdownMenuTrigger className='w-full'>
                    <Button className='flex flex-row justify-between items-center w-full py-2 px-3' variant={'secondary'}>
                        {initialValue}
                        <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <ScrollArea className='overflow-auto'>
                        {values.map((value, index) => {
                            return (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={() => { setValue(value) }}
                                    style={getItemStyle(value)}
                                >
                                    {value}
                                </DropdownMenuItem>
                            )
                        })}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Dropdown;