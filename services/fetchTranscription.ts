// api/fetchTranscription.ts

export interface TranscriptionResponse {
  success: boolean;
  filename: string;
  language: string;
  srt: string;
  vtt: string;
}

export interface TranscriptionError {
  detail: string;
}

/**
 * Fetches transcript from the Whisper.cpp FastAPI backend
 * @param file - Audio or video file to transcribe
 * @param language - Language code (default: "en")
 * @returns Promise with SRT and VTT transcripts
 */
export async function fetchTranscript(
  file: File,
  language: string = "auto"
): Promise<TranscriptionResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    const response = await fetch("http://localhost:8000/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error: TranscriptionError = await response.json();
      throw new Error(error.detail || "Transcription failed");
    }

    const data: TranscriptionResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch transcript: ${error.message}`);
    }
    throw new Error("An unknown error occurred during transcription");
  }
}

/**
 * Checks if the backend is healthy and ready
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8000/health");
    const data = await response.json();
    return data.status === "healthy" && data.executable_exists && data.model_exists;
  } catch {
    return false;
  }
}
