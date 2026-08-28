export function encodePairing(description: RTCSessionDescriptionInit): string {
  const bytes = new TextEncoder().encode(JSON.stringify(description));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function decodePairing(value: string): RTCSessionDescriptionInit {
  const normalized = value.trim().replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
  if (!parsed || typeof parsed !== 'object' || !('type' in parsed) || !('sdp' in parsed)) throw new Error('That pairing code is not valid. Copy the complete code and try again.');
  const description = parsed as RTCSessionDescriptionInit;
  if (!['offer', 'answer'].includes(description.type ?? '')) throw new Error('That pairing code has an unknown type.');
  return description;
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
