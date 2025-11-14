import React from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Sparkles } from 'lucide-react'

const TranscriptCard = () => {
    return (
        <Card className='h-full w-full p-2 flex justify-center items-center'>
            <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
                <h3>Generate Captions to view transcript.</h3>
                <Button className='flex flex-row bg-linear-to-r from-simora-blue to-simora-purple text-white hover:bg-linear-to-l'>
                    <p> Auto-Generate Captions </p>
                    <Sparkles />
                </Button>
            </div>
        </Card>
    )
}

export default TranscriptCard