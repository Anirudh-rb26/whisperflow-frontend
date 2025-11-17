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

const backendURL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

export async function triggerVideoRender(params: {
  compositionId: string;
  inputProps: any;
  renderConfig: any;
}): Promise<RenderVideoResponse> {
  const response = await fetch(`${backendURL}/api/render/video`, {
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
