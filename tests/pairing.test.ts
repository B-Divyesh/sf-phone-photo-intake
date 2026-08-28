import { describe, expect, it } from 'vitest';
import { decodePairing, encodePairing } from '../src/pairing';

describe('manual pairing code', () => {
  it('round trips a session description', () => {
    const source: RTCSessionDescriptionInit = { type: 'offer', sdp: 'v=0\r\na=ice-ufrag:local\r\n' };
    expect(decodePairing(encodePairing(source))).toEqual(source);
  });

  it('rejects incomplete codes', () => {
    expect(() => decodePairing('not-a-code')).toThrow();
  });
});
