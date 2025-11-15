import { toast } from 'sonner';
import { Card } from './ui/card';
import { Upload } from 'lucide-react';
import React, { SetStateAction, useRef, useState } from 'react'

interface dragDropCardProps {
    file: File | null;
    setFile: React.Dispatch<SetStateAction<File | null>>;
}

const DragDropCard = ({ file, setFile }: dragDropCardProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const droppedFiles = event.dataTransfer?.files;
        if (!droppedFiles || droppedFiles.length === 0) return;

        const file = droppedFiles[0];

        if (file.type !== "video/mp4") {
            toast("Wrong file type!", { description: "Uploaded file was not .mp4" });
            return;
        }

        setFile(file);
    }

    function handleDragEnter(event: React.DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    }

    function handleDragLeave(event: React.DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.currentTarget === event.target) {
            setIsDragging(false);
        }
    }

    function handleDragOver(event: React.DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    function handleUploadClick() {
        inputRef.current?.click();
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== "video/mp4") {
            toast("Wrong file type!", { description: "Uploaded file was not a .mp4" });
            return;
        }

        setFile(selectedFile);
    }

    return (
        <Card
            className={`w-full h-full border-dashed border-primary p-2 ${isDragging ? "border border-green-400" : "none"} ${file ? "border border-solid border-simora-blue" : "none"}`}
            onClick={handleUploadClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >

            <div className='w-full h-full flex flex-col items-center justify-center p-4 gap-4'>
                {
                    file ? (
                        <div className='p-2 relative flex items-center justify-center'>
                            <video src={URL.createObjectURL(file)} className='rounded-md max-w-full max-h-full' />
                            <div className="absolute inset-0 rounded-md pointer-events-none flex items-center justify-center">
                                <p className='text-white text-sm font-medium px-4 py-2 bg-black/90 rounded text-center'>
                                    {file.name}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full h-full items-center justify-center flex flex-col gap-4'>
                            <div className='flex flex-row gap-2'>
                                <Upload />
                                <p>Upload a file</p>
                            </div>
                            <p className='text-[10px] text-muted-foreground'>*only .mp4 File</p>
                        </div>
                    )
                }
                <input type='file' accept='video/mp4' ref={inputRef} className='hidden' onChange={handleInputChange} />
            </div >
        </Card >
    )
}

export default DragDropCard