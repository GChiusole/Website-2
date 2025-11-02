"""
Convert GIF to MP4 video using imageio library.
This will create smooth, web-optimized MP4 videos.
"""

try:
    import imageio
    print("✓ imageio is installed")
except ImportError:
    print("Installing imageio and imageio-ffmpeg...")
    import subprocess
    subprocess.check_call(['pip3', 'install', 'imageio', 'imageio-ffmpeg'])
    import imageio

import os

def gif_to_mp4(input_gif, output_mp4, fps=30, scale=0.6, quality=8):
    """
    Convert GIF to MP4 with web optimization.
    
    Args:
        input_gif: Input GIF file path
        output_mp4: Output MP4 file path
        fps: Frames per second (default: 30 for smooth playback)
        scale: Scale factor (default: 0.6 for 60% size)
        quality: Video quality 0-10, where 10 is best (default: 8)
    """
    print(f"Converting {input_gif} to MP4...")
    print(f"Settings: fps={fps}, scale={scale}, quality={quality}")
    
    # Read the GIF
    reader = imageio.get_reader(input_gif)
    
    # Get metadata
    meta = reader.get_meta_data()
    original_fps = 1000 / meta.get('duration', 33)  # GIF duration is in ms
    print(f"Original FPS: {original_fps:.1f}")
    
    # Read all frames
    frames = []
    for i, frame in enumerate(reader):
        if i % 20 == 0:
            print(f"  Reading frame {i}...")
        frames.append(frame)
    
    total_frames = len(frames)
    print(f"Total frames: {total_frames}")
    
    # Get original size
    height, width = frames[0].shape[:2]
    new_width = int(width * scale)
    new_height = int(height * scale)
    
    # Make dimensions even (required for yuv420p)
    new_width = new_width - (new_width % 2)
    new_height = new_height - (new_height % 2)
    
    print(f"Original size: {width}x{height}")
    print(f"New size: {new_width}x{new_height}")
    
    # Resize frames if needed
    if scale != 1.0:
        from PIL import Image
        import numpy as np
        
        print("Resizing frames...")
        resized_frames = []
        for i, frame in enumerate(frames):
            if i % 20 == 0:
                print(f"  Resizing frame {i}/{total_frames}...")
            img = Image.fromarray(frame)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            resized_frames.append(np.array(img))
        frames = resized_frames
    
    print(f"Writing MP4 at {fps} fps...")
    
    # Write MP4 with web optimization
    writer = imageio.get_writer(
        output_mp4,
        fps=fps,
        codec='libx264',
        quality=quality,
        pixelformat='yuv420p',
        macro_block_size=1,
        ffmpeg_params=['-movflags', '+faststart']  # Enable fast start for web
    )
    
    for i, frame in enumerate(frames):
        if i % 20 == 0:
            print(f"  Writing frame {i}/{total_frames}...")
        writer.append_data(frame)
    
    writer.close()
    reader.close()
    
    # Get file sizes
    input_size = os.path.getsize(input_gif) / (1024 * 1024)
    output_size = os.path.getsize(output_mp4) / (1024 * 1024)
    reduction = ((input_size - output_size) / input_size) * 100
    
    print(f"\n✓ Conversion complete!")
    print(f"  Original GIF: {input_size:.2f} MB")
    print(f"  MP4 Video: {output_size:.2f} MB")
    print(f"  Reduction: {reduction:.1f}%")

if __name__ == "__main__":
    print("="*70)
    print("CONVERTING FKPP ANIMATION TO MP4")
    print("="*70 + "\n")
    
    gif_to_mp4(
        "FKPP_animation_599frames_fps30.gif",
        "FKPP_animation.mp4",
        fps=30,  # Keep full 30fps for smooth animation
        scale=0.6,  # 60% size
        quality=8  # High quality
    )
    
    print("\n" + "="*70)
    print("CONVERTING METASTABLE SDE TO MP4")
    print("="*70 + "\n")
    
    gif_to_mp4(
        "metastable_sde_sigma0.50_seed31.gif",
        "metastable_sde.mp4",
        fps=30,
        scale=0.7,
        quality=8
    )
