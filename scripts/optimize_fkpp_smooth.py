from PIL import Image
import os

def convert_gif_to_webp_smooth(input_gif, output_webp, quality=78, resize_factor=0.6, frame_skip=3):
    """
    Convert GIF to WebP with better frame retention for smooth animation.
    """
    print(f"Converting {input_gif} to WebP format (smooth version)...")
    
    with Image.open(input_gif) as img:
        frames = []
        durations = []
        
        original_width, original_height = img.size
        new_width = int(original_width * resize_factor)
        new_height = int(original_height * resize_factor)
        
        print(f"Original size: {original_width}x{original_height}")
        print(f"New size: {new_width}x{new_height}")
        
        frame_count = 0
        total_frames = 0
        
        try:
            while True:
                if total_frames % frame_skip == 0:
                    # Resize and append frame
                    resized = img.copy().resize((new_width, new_height), Image.Resampling.LANCZOS)
                    frames.append(resized)
                    
                    # Get frame duration and adjust for skipped frames
                    duration = img.info.get('duration', 100)
                    adjusted_duration = duration * frame_skip
                    durations.append(adjusted_duration)
                    
                    frame_count += 1
                
                total_frames += 1
                img.seek(img.tell() + 1)
        except EOFError:
            pass
        
        print(f"Processing {frame_count} frames from {total_frames} total frames...")
        
        # Save as WebP with optimized settings
        frames[0].save(
            output_webp,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            quality=quality,
            method=6,  # Best compression
            lossless=False
        )
    
    # Get file sizes
    input_size = os.path.getsize(input_gif) / (1024 * 1024)
    output_size = os.path.getsize(output_webp) / (1024 * 1024)
    reduction = ((input_size - output_size) / input_size) * 100
    
    print(f"\n✓ Conversion complete!")
    print(f"  Original: {input_size:.2f} MB")
    print(f"  WebP: {output_size:.2f} MB")
    print(f"  Reduction: {reduction:.1f}%")
    print(f"  Frames: {total_frames} → {frame_count}")
    print(f"  Frame rate: ~{frame_count / (total_frames / 30):.1f} fps")

if __name__ == "__main__":
    # Convert FKPP animation with smoother settings
    convert_gif_to_webp_smooth(
        "FKPP_animation_599frames_fps30.gif",
        "FKPP_animation.webp",
        quality=78,
        resize_factor=0.6,  # 60% size
        frame_skip=3  # Keep every 3rd frame (30fps → 10fps, much smoother)
    )
