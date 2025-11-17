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

const backendURL = process.env.LOCAL_BACKEND_SERVER_URL;

/**
 * Fetches transcript from the Whisper.cpp FastAPI backend
 * @param file - Audio or video file to transcribe
 * @param language - Language code (default: "en")
 * @returns Promise with SRT and VTT transcripts
 */
export async function fetchTranscript(
  file: File,
  language: string
): Promise<TranscriptionResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    // Determine if we need Perplexity translation based on language
    if (language === "hinglish") {
      // For Hinglish: use current Perplexity prompt
      formData.append("translate_to_hinglish", "true");
    } else if (language === "hi") {
      // For Hindi: translate to Devanagari script
      formData.append("translate_to_hindi_script", "true");
    }
    // For English (en): don't add any translation flags

    const response = await fetch(`${backendURL}/transcribe`, {
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
    const response = await fetch(`${backendURL}/health`);
    const data = await response.json();
    return data.status === "healthy" && data.executable_exists && data.model_exists;
  } catch {
    return false;
  }
}
