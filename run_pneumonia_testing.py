"""
Automation runner for Pneumonia dataset download and AutoML training
"""
import subprocess
import sys

import kagglehub


def main():
    print("============================================================")
    print("  AutoML Pneumonia X-Ray Dataset Training Script")
    print("============================================================")
    
    # 1. Download/locate dataset
    print("  [Step 1] Locating pcbreviglieri/pneumonia-xray-images via kagglehub...")
    try:
        path = kagglehub.dataset_download("pcbreviglieri/pneumonia-xray-images")
        print(f"  [OK] Path to dataset files: {path}")
    except Exception as e:  # noqa: BLE001
        print(f"  [Error] Failed to download/locate dataset: {e}")
        sys.exit(1)
        
    # 2. Run AutoML tournament
    print("  [Step 2] Launching AutoML tournament training...")
    cmd = [
        "python", "train_automl.py",
        "--dataset_path", path,
        "--disease", "Pneumonia",
        "--output_path", "app/automl_results.json"
    ]
    print(f"  Executing command: {' '.join(cmd)}")
    
    res = subprocess.run(cmd)  # noqa: PLW1510
    if res.returncode == 0:
        print("  [OK] AutoML tournament finished successfully!")
    else:
        print("  [Error] AutoML tournament training failed.")
        sys.exit(1)

if __name__ == '__main__':
    main()
