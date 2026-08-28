import { describe, expect, it } from 'vitest';
import { decodePairing, encodePairing } from '../src/pairing';

describe('manual pairing code', () => {
  it('round trips a session description', () => {
    const source: RTCSessionDescriptionInit = { type: 'offer', sdp: 'v=0\r\na=ice-ufrag:local\r\n' };
    expect(decodePairing(encodePairing(source))).toEqual(source);
  });

  it('rejects incomplete codes', () => {
    expect(() => decodePairing('invalid')).toThrow('That sender code is invalid or incomplete. Copy the full code and try again.');
  });

  it('does not expose parser details for malformed encoded JSON', () => {
    const malformedJson = btoa('{').replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
    expect(() => decodePairing(malformedJson)).toThrow('That sender code is invalid or incomplete. Copy the full code and try again.');
  });
});
