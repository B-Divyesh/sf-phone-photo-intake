# Photo Intake Receipt demo

Open <https://phone-photo-intake.sociobot.in/demo> or use `/?demo=1`.

The first demo screen contains a completed three-file harbour-trip receipt and a four-part family-photo transfer paused after its first part. **Reset demo** restores both samples. **Start for real** deletes the demo database before returning home.

Demo records use the IndexedDB database `demo:photo-intake-receipt` and the local-storage prefix `demo:`. The normal database remains `photo-intake-receipt`. Demo code never reads the normal license keys.

Automated two-device claim tests use `/demo?transfer=1`. This route keeps the demo banner and the same isolated storage while exposing the real transfer controls.
