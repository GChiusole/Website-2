from PIL import Image, ImageSequence
import os

def optimize_gif_high_quality(input_gif, output_webp, quality=85, resize_factor=0.65, frame_skip=2):
    """
    Convert GIF to WebP with high quality and good frame retention.
    frame_skip=2 means keep every other frame (30fps -> 15fps)
    """
    print(f"Converting {input_gif} to high-quality WebP...")
    
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
                    # Resize with high quality
                    resized = img.copy().resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Convert to RGB if needed (WebP sometimes has issues with palette mode)
                    if resized.mode == 'P':
                        resized = resized.convert('RGB')
                    
                    frames.append(resized)
                    
                    # Get frame duration and adjust
                    duration = img.info.get('duration', 33)  # Default ~30fps
                    adjusted_duration = duration * frame_skip
                    durations.append(adjusted_duration)
                    
                    frame_count += 1
                    
                    if frame_count % 50 == 0:
                        print(f"  Processed {frame_count} frames...")
                
                total_frames += 1
                img.seek(img.tell() + 1)
        except EOFError:
            pass
        
        print(f"Total frames processed: {frame_count} from {total_frames}")
        print(f"Saving WebP...")
        
        # Save as WebP with high quality settings
        frames[0].save(
            output_webp,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            quality=quality,
            method=6,  # Best compression method
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
    print(f"  Effective frame rate: ~{30 / frame_skip:.1f} fps")

if __name__ == "__main__":
    print("="*70)
    print("OPTIMIZING FKPP ANIMATION")
    print("="*70)
    
    # FKPP: Keep every 2nd frame (15fps) with higher quality
    optimize_gif_high_quality(
        "FKPP_animation_599frames_fps30.gif",
        "FKPP_animation.webp",
        quality=85,
        resize_factor=0.65,
        frame_skip=2  # 30fps → 15fps (much smoother!)
    )
    
    print("\n" + "="*70)
    print("OPTIMIZING METASTABLE SDE ANIMATION")
    print("="*70)
    
    # Metastable: Also keep every 2nd frame
    optimize_gif_high_quality(
        "metastable_sde_sigma0.50_seed31.gif",
        "metastable_sde.webp",
        quality=85,
        resize_factor=0.7,
        frame_skip=2  # 15fps
    )
