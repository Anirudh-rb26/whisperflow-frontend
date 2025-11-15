"use client"

import { useState } from "react";
import DragDropCard from "@/components/drag-drop-card";
import TranscriptCard from "@/components/transcript-card";
import CaptionControls from "@/components/caption-controls";
import VideoPreview from "@/components/video-preview";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="w-full h-full p-2 flex flex-col gap-4">
      {/* Left Col */}
      <div className="flex flex-row w-full h-[50%] gap-4">
        <div className="h-full w-[50%]">
          {file ? (
            <div className="relative w-full h-full">
              <VideoPreview file={file!} />
              <Button
                variant={"destructive"}
                onClick={() => { setFile(null) }}
                className="absolute top-1 right-4"
              >
                <Trash2Icon />
              </Button>
            </div>
          ) : (
            <DragDropCard file={file} setFile={setFile} />
          )}
        </div>
        <div className="h-full w-[50%]">
          <CaptionControls />
        </div>
      </div>

      {/* Right Col */}
      <div className="h-[50%]">
        <TranscriptCard />
      </div>
    </div>
  );
}
