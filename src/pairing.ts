export function encodePairing(description: RTCSessionDescriptionInit): string {
  const bytes = new TextEncoder().encode(JSON.stringify(description));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function decodePairing(value: string): RTCSessionDescriptionInit {
  const invalid = () => new Error('That sender code is invalid or incomplete. Copy the full code and try again.');
  try {
    const normalized = value.trim().replaceAll('-', '+').replaceAll('_', '/');
    if (!normalized) throw invalid();
    const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== 'object' || !('type' in parsed) || !('sdp' in parsed)) throw invalid();
    const description = parsed as RTCSessionDescriptionInit;
    if (!['offer', 'answer'].includes(description.type ?? '')) throw invalid();
    return description;
  } catch {
    // Pairing text is user-provided. Do not expose base64/JSON parser details in the UI.
    throw invalid();
  }
}

export function waitForIce(peer: RTCPeerConnection): Promise<void> {
  if (peer.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    const listener = () => {
      if (peer.iceGatheringState === 'complete') {
        peer.removeEventListener('icegatheringstatechange', listener);
        resolve();
      }
    };
    peer.addEventListener('icegatheringstatechange', listener);
  });
}
