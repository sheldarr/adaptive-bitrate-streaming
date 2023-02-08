# adaptive-bitrate-streaming

## Processing video files to m3u8-processor

```sh
node m3u8-processor/index.mjs --inputFile m3u8-processor/assets/4k-example.mp4 --outputDirectory server/assets
```

## Serving m3u8 files

```sh
cd server && npx http-server
```
