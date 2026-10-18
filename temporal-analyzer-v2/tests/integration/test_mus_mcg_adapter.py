import unittest
from temporal_analyzer.mus_mcg_adapter import MUSMCGAdapter
from temporal_analyzer.core.validator import Validator

class TestMUSMCGIntegration(unittest.TestCase):
    def test_adapter_and_validator(self):
        profile = {"id": "comp_001", "name": "Bach", "era": "Baroque"}
        adapter = MUSMCGAdapter(profile)
        observations = [
            {"timestamp": 100, "value": 0.5},
            {"timestamp": 101, "value": 0.6}
        ]
        Validator.validate_observations(observations)
        prepared = [adapter.prepare_observation(obs) for obs in observations]
        self.assertEqual(prepared[0]["profile_id"], "comp_001")
        self.assertEqual(len(prepared), 2)

if __name__ == "__main__":
    unittest.main()
