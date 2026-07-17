#!/usr/bin/env python3
"""
Optimize GIF files by reducing frames, resizing, and compressing
"""

from PIL import Image, ImageSequence
import os

def optimize_gif(input_path, output_path, resize_factor=0.75, frame_skip=2, quality=85):
    """
    Optimize a GIF by:
    - Resizing to a smaller dimension
    - Skipping frames to reduce frame count
    - Optimizing colors and compression
    
    Args:
        input_path: Path to input GIF
        output_path: Path to save optimized GIF
        resize_factor: Factor to resize (0.75 = 75% of original size)
        frame_skip: Keep every Nth frame (2 = keep every 2nd frame, halving frame count)
        quality: Quality setting (1-100, higher is better)
    """
    print(f"Optimizing {input_path}...")
    
    # Open the GIF
    img = Image.open(input_path)
    
    # Get original dimensions
    original_width, original_height = img.size
    new_width = int(original_width * resize_factor)
    new_height = int(original_height * resize_factor)
    
    print(f"  Original size: {original_width}x{original_height}")
    print(f"  New size: {new_width}x{new_height}")
    
    # Process frames
    frames = []
    durations = []
    frame_count = 0
    kept_frames = 0
    
    for frame in ImageSequence.Iterator(img):
        frame_count += 1
        
        # Skip frames
        if frame_count % frame_skip != 0:
            continue
        
        kept_frames += 1
        
        # Resize frame
        resized_frame = frame.copy()
        resized_frame = resized_frame.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Convert to RGB if necessary, then back to P mode with optimized palette
        if resized_frame.mode == 'P':
            frames.append(resized_frame)
        else:
            # Convert RGBA to RGB with white background
            if resized_frame.mode == 'RGBA':
                background = Image.new('RGB', resized_frame.size, (255, 255, 255))
                background.paste(resized_frame, mask=resized_frame.split()[3])
                resized_frame = background
            frames.append(resized_frame.convert('P', palette=Image.ADAPTIVE, colors=256))
        
        # Get duration
        try:
            duration = frame.info.get('duration', 100)
            # Adjust duration for skipped frames
            durations.append(duration * frame_skip)
        except:
            durations.append(100)
    
    print(f"  Frames: {frame_count} -> {kept_frames}")
    
    # Save optimized GIF
    if frames:
        frames[0].save(
            output_path,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            optimize=True,
            quality=quality
        )
        
        # Compare file sizes
        original_size = os.path.getsize(input_path) / (1024 * 1024)  # MB
        new_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
        reduction = (1 - new_size / original_size) * 100
        
        print(f"  Original: {original_size:.2f} MB")
        print(f"  Optimized: {new_size:.2f} MB")
        print(f"  Reduction: {reduction:.1f}%")
        print(f"  ✓ Saved to {output_path}\n")
    else:
        print("  ✗ No frames to save\n")

if __name__ == "__main__":
    # Optimize FKPP animation (37MB, 599 frames at 30fps)
    # Skip more frames and resize more aggressively
    optimize_gif(
        "FKPP_animation_599frames_fps30.gif",
        "FKPP_animation_optimized.gif",
        resize_factor=0.65,  # Reduce to 65% of original size
        frame_skip=3,  # Keep every 3rd frame (reduce from 30fps to ~10fps)
        quality=80
    )
    
    # Optimize metastable SDE (4.9MB)
    # Less aggressive optimization since it's already smaller
    optimize_gif(
        "metastable_sde_sigma0.50_seed31.gif",
        "metastable_sde_optimized.gif",
        resize_factor=0.8,  # Reduce to 80% of original size
        frame_skip=2,  # Keep every 2nd frame
        quality=85
    )
    
    print("Optimization complete!")
