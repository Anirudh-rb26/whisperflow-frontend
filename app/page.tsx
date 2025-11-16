"use client"

import { useState, useRef, useEffect } from "react";
import DragDropCard from "@/components/drag-drop-card";
import TranscriptCard from "@/components/transcript-card";
import CaptionControls from "@/components/caption-controls";
import VideoPreview from "@/components/video-preview";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { PlayerRef } from "@remotion/player";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const playerRef = useRef<PlayerRef | null>(null);

  const [srt, setSrt] = useState<string | null>(null);
  const [vtt, setVtt] = useState<string | null>(null);

  // Video control ref - allows transcript to control video playback
  const videoControlRef = useRef<{ seekTo: (time: number) => void } | null>(null);

  useEffect(() => {
    console.log("Page.tsx: ", srt);
    console.log("Page.tsx: ", vtt);
  }, [srt, vtt])

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
                playerRef={playerRef}
                videoControlRef={videoControlRef}
                srtContent={srt}
              />
              <Button
                variant={"destructive"}
                onClick={() => {
                  setFile(null);
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
          playerRef={playerRef}
          onSeek={(time) => videoControlRef.current?.seekTo(time)}
          srt={srt!}
          vtt={vtt!}
          setSrt={setSrt}
          setVtt={setVtt}
        />
      </div>
    </div>
  );
}