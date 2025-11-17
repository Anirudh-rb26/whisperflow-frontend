/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RenderVideoResponse {
  success: boolean;
  renderId: string;
  downloadPath: string;
  downloadUrl: string;
  expiresAt: string;
  fileSize: number;
  cliCommand: string;
}

export async function triggerVideoRender(params: {
  compositionId: string;
  inputProps: any;
  renderConfig: any;
}): Promise<RenderVideoResponse> {
  const response = await fetch("http://localhost:8000/api/render/video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Render request failed: ${response.statusText}`);
  }

  return response.json();
}
