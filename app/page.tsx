"use client"

import CaptionControls from "@/components/caption-controls";
import DragDropCard from "@/components/drag-drop-card";
import TranscriptCard from "@/components/transcript-card";

export default function Home() {
  return (
    <div className="w-full h-full p-2 flex flex-col gap-4">
      {/* Left Col */}
      <div className="flex flex-row w-full h-[50%] gap-4">
        <div className="h-full w-[50%]">
          <DragDropCard />
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
