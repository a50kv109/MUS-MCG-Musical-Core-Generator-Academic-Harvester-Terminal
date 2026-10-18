import sys
import os

# Ensure src is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from temporal_analyzer.mus_mcg_adapter import MUSMCGAdapter
from temporal_analyzer.core.validator import Validator

def main():
    print("=== Temporal Analyzer v2: MUS-MCG Basic Analysis Example ===")
    
    # 1. Define static composer profile (mock core)
    composer_profile = {
        "id": "composer-bach-001",
        "name": "Johann Sebastian Bach",
        "style": "Baroque",
        "base_parameters": {
            "tempo": 120,
            "complexity": 0.85
        }
    }
    
    # 2. Initialize adapter
    adapter = MUSMCGAdapter(composer_profile)
    print(f"Initialized MUSMCGAdapter for profile: {adapter.profile_id}")
    print(f"Profile SHA-256 Hash: {adapter.profile_hash}")
    
    # 3. Prepare temporal observations
    raw_observations = [
        {"timestamp": 100.0, "harmonic_density": 0.78},
        {"timestamp": 105.5, "harmonic_density": 0.82},
        {"timestamp": 110.2, "harmonic_density": 0.80}
    ]
    
    prepared_observations = [adapter.prepare_observation(obs) for obs in raw_observations]
    print(f"Prepared {len(prepared_observations)} observations with provenance link.")
    
    # 4. Validate temporal sequence and finiteness
    data_to_validate = [obs["data"] for obs in prepared_observations]
    Validator.validate_observations(data_to_validate)
    print("Validation passed successfully: chronological order and finite numeric values verified.")
    
    print("Basic analysis example completed successfully.")

if __name__ == "__main__":
    main()
