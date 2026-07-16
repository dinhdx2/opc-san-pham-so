import subprocess, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
frames = ['1-hook.png','2-before.png','3-fill.png','4-after.png','5-files.png','6-end.png']
dur    = [4.0, 7.0, 5.0, 4.0, 4.0, 4.0]
xd     = 0.5
fps    = 30
trans  = ['fade','wipeleft','fade','slideup','fade']

cmd = [FF, '-y']
for f in frames:
    cmd += ['-i', f]              # SINGLE frame input (no -loop): zoompan controls duration

fc = []
for i,d in enumerate(dur):
    n = int(round(d*fps))
    if i % 2 == 0:
        x = "iw/2-(iw/zoom/2)"
    else:
        x = "iw/2-(iw/zoom/2)+(on/%d)*30" % n
    y = "ih/2-(ih/zoom/2)"
    fc.append(
        f"[{i}:v]scale=1620:2880,zoompan=z='min(zoom+0.0007,1.10)':x='{x}':y='{y}':"
        f"d={n}:s=1080x1920:fps={fps},setsar=1,format=yuv420p[v{i}]"
    )

cum = dur[0]; prev = "v0"
for k in range(1,6):
    off = cum - xd
    out = f"x{k}"
    fc.append(f"[{prev}][v{k}]xfade=transition={trans[k-1]}:duration={xd}:offset={off:.3f}[{out}]")
    cum = cum + dur[k] - xd
    prev = out

cmd += ['-filter_complex', ";".join(fc), '-map', f'[{prev}]',
        '-r', str(fps), '-c:v','libx264','-pix_fmt','yuv420p','-preset','veryfast','-crf','21',
        '-movflags','+faststart','donthat-video-c1.mp4']
print("expected len ~", round(cum,2), "s")
r = subprocess.run(cmd, capture_output=True, text=True)
print("returncode", r.returncode)
print(r.stderr[-1200:] if r.returncode else "OK built")
