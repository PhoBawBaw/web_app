#!/bin/bash
rm /app/stream/*.ts
rm /app/stream/*.m3u8
ffmpeg -i rtsp://<ip address>:18554/test \
-c:v copy -c:a copy \
-hls_time 4 -hls_list_size 5 \
-hls_flags delete_segments+split_by_time \
-hls_playlist_type event \
-fflags +genpts \
-muxdelay 0 \
-f hls /app/stream/stream.m3u8
