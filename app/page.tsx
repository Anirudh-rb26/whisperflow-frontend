"use client"

import { useState, useRef } from "react";
import DragDropCard from "@/components/drag-drop-card";
import TranscriptCard from "@/components/transcript-card";
import CaptionControls from "@/components/caption-controls";
import VideoPreview from "@/components/video-preview";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

export default function Home() {
  // File state
  const [file, setFile] = useState<File | null>(null);

  // Video playback state - tracks current time in seconds
  const [currentTime, setCurrentTime] = useState(0);

  // Video control ref - allows transcript to control video playback
  const videoControlRef = useRef<{ seekTo: (time: number) => void } | null>(null);

  return (
    <div className="w-full h-full p-2 flex flex-col gap-4">
      {/* Left Col */}
      <div className="flex flex-row w-full h-[50%] gap-4">
        {/* Video Preview Section */}
        <div className="h-full w-[50%]">
          {file ? (
            <div className="relative w-full h-full">
              <VideoPreview
                file={file}
                // VideoPreview calls this to update current time as video plays
                onTimeUpdate={setCurrentTime}
                // VideoPreview exposes its seekTo method through this ref
                videoControlRef={videoControlRef}
              />
              <Button
                variant={"destructive"}
                onClick={() => {
                  setFile(null);
                  setCurrentTime(0); // Reset time when file is removed
                }}
                className="absolute top-1 right-4"
              >
                <Trash2Icon />
              </Button>
            </div>
          ) : (
            <DragDropCard file={file} setFile={setFile} />
          )}
        </div>

        {/* Caption Controls Section */}
        <div className="h-full w-[50%]">
          <CaptionControls />
        </div>
      </div>

      {/* Right Col - Transcript Section */}
      <div className="h-[50%]">
        <TranscriptCard
          file={file!}
          // Pass current time so transcript can highlight active segment
          currentTime={currentTime}
          // Pass seek function so clicking transcript can control video
          onSeek={(time) => videoControlRef.current?.seekTo(time)}
        />
      </div>
    </div>
  );
}