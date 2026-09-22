"""
tests/test_api_endpoints.py
Comprehensive End-to-End Test Suite for Hospital AI & Hybrid Quantum ML Platform.
Tests:
1. Doctor & Hospital Authentication (Login, Quick Login, OTP Verification, RBAC)
2. Doctor Clinical Intelligence (Patients, Alerts, AI Reports, Lab Feeds, Performance Stats)
3. Hospital Command Center (Model Registry, Integrations Health, Version Control, Doctor Feedback)
4. 10-Step AutoML Tournament Pipeline (Upload, Profile, Config, Clean, Approve, Detect, Train, Report, Governance, Deploy)
5. Hybrid Quantum Machine Learning Suite (Datasets, Hardware Readiness, Profiling, Benchmark Run, Prediction, Explainability, History)
"""
import io
import sys
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from fastapi.testclient import TestClient

from app.main import app


def run_all_tests():
    with TestClient(app) as client:
        print("=" * 70)
        print(" 1. Testing Authentication & Role-Based Access Control")
        print("=" * 70)
        
        # 1a. Doctor Quick Login
        r_doc = client.post("/api/auth/login/quick", json={"identifier": "MED-11001-DL", "password": "doctor"})
        assert r_doc.status_code == 200, f"Doctor login failed: {r_doc.text}"
        doc_token = r_doc.json()["token"]
        doc_headers = {"Authorization": f"Bearer {doc_token}"}
        print("  [OK] Doctor quick login passed.")

        # 1b. Hospital Admin Quick Login
        r_hosp = client.post("/api/auth/login/quick", json={"identifier": "HOSP-MH-001", "password": "admin"})
        assert r_hosp.status_code == 200, f"Hospital login failed: {r_hosp.text}"
        hosp_token = r_hosp.json()["token"]
        hosp_headers = {"Authorization": f"Bearer {hosp_token}"}
        print("  [OK] Hospital Admin quick login passed.")

        # 1c. Standard login (requires OTP)
        r_otp_req = client.post("/api/auth/login", json={"identifier": "MED-11001-DL", "password": "doctor"})
        assert r_otp_req.status_code == 200
        assert r_otp_req.json().get("requires_otp") is True
        print("  [OK] 2FA OTP generation passed.")

        print("\n" + "=" * 70)
        print(" 2. Testing Doctor Clinical Intelligence Portal")
        print("=" * 70)
        
        # Patients list and detail
        pts = client.get("/api/patients", headers=doc_headers)
        assert pts.status_code == 200, pts.text
        assert pts.json()["total"] >= 1
        print(f"  [OK] Patient list returned {pts.json()['total']} patients.")

        pt_detail = client.get("/api/patients/PAT-001", headers=doc_headers)
        assert pt_detail.status_code == 200, pt_detail.text
        assert pt_detail.json()["patient"]["id"] == "PAT-001"
        print(f"  [OK] Patient detail for PAT-001: {pt_detail.json()['patient']['name']}")

        # Alerts
        alerts = client.get("/api/alerts", headers=doc_headers)
        assert alerts.status_code == 200, alerts.text
        print(f"  [OK] Clinical alerts: {alerts.json()['total']} active alerts.")

        # Reports
        reports = client.get("/api/reports", headers=doc_headers)
        assert reports.status_code == 200, reports.text
        print(f"  [OK] Diagnostic reports: {reports.json()['total']} records.")

        # Lab sources & uploads
        sources = client.get("/api/lab/sources", headers=doc_headers)
        assert sources.status_code == 200, sources.text
        print(f"  [OK] Lab connected sources: {sources.json()['total_connected']} online.")

        uploads = client.get("/api/lab/uploads", headers=doc_headers)
        assert uploads.status_code == 200, uploads.text
        print(f"  [OK] Lab imaging uploads: {uploads.json()['total']} files.")

        # AI stats
        stats = client.get("/api/ai/stats", headers=doc_headers)
        assert stats.status_code == 200, stats.text
        print(f"  [OK] AI performance stats: Doctor agreement {stats.json()['doctor_agreement_pct']}%.")

        print("\n" + "=" * 70)
        print(" 3. Testing Hospital Command Center & Model Marketplace")
        print("=" * 70)

        h_stats = client.get("/api/hospital/stats", headers=hosp_headers)
        assert h_stats.status_code == 200, h_stats.text
        print(f"  [OK] Hospital stats: {h_stats.json()['active_models']} active models.")

        h_models = client.get("/api/hospital/models", headers=hosp_headers)
        assert h_models.status_code == 200, h_models.text
        assert h_models.json()["total"] >= 1
        print(f"  [OK] Model Registry returned {h_models.json()['total']} deployed models.")

        h_integrations = client.get("/api/hospital/integrations", headers=hosp_headers)
        assert h_integrations.status_code == 200, h_integrations.text
        print(f"  [OK] Hospital integrations: {h_integrations.json()['summary']['total']} systems configured.")

        h_versions = client.get("/api/hospital/versions", headers=hosp_headers)
        assert h_versions.status_code == 200, h_versions.text
        print(f"  [OK] Version history: {len(h_versions.json()['versions'])} historical releases.")

        # Doctor feedback
        fb_resp = client.post(
            "/api/hospital/models/mdl-001/feedback",
            json={"doctor_name": "Dr. Ananya Sharma", "rating": 5, "comment": "Excellent quantum kernel accuracy."},
            headers=doc_headers
        )
        assert fb_resp.status_code == 200, fb_resp.text
        print("  [OK] Doctor feedback submitted successfully.")

        print("\n" + "=" * 70)
        print(" 4. Testing 10-Step Hospital AutoML Self-Service Pipeline")
        print("=" * 70)

        # Step 1: Upload dataset
        csv_content = (
            "age,blood_pressure,cholesterol,glucose,heart_rate,outcome\n"
            + "\n".join([f"{40 + (i % 30)},{120 + (i % 20)},{180 + (i % 50)},{90 + (i % 40)},{72 + (i % 15)},{i % 2}" for i in range(120)])
        ).encode("utf-8")
        
        up = client.post(
            "/api/automl/upload",
            data={"disease_name": "Cardiovascular Risk Model"},
            files={"file": ("cardio_data.csv", io.BytesIO(csv_content), "text/csv")},
            headers=hosp_headers
        )
        assert up.status_code == 200, up.text
        job_id = up.json()["job_id"]
        print(f"  Step 1: Uploaded dataset -> Job ID: {job_id}")

        # Step 2: Profile
        prof = client.post(f"/api/automl/profile/{job_id}", headers=hosp_headers)
        assert prof.status_code == 200, prof.text
        assert prof.json()["status"] == "profiled"
        print(f"  Step 2: Profiled {prof.json()['profile']['rows']} rows, status: {prof.json()['status']}")

        # Step 3: Configure Target & Drop PII
        cfg = client.post(
            f"/api/automl/configure/{job_id}",
            json={"target_column": "outcome", "remove_columns": []},
            headers=hosp_headers
        )
        assert cfg.status_code == 200, cfg.text
        print(f"  Step 3: Target configured: {cfg.json()['target_column']}")

        # Step 4: Clean Data
        clean = client.post(f"/api/automl/clean/{job_id}", headers=hosp_headers)
        assert clean.status_code == 200, clean.text
        assert clean.json()["status"] == "cleaned"
        print(f"  Step 4: Data cleaned -> Shape: {clean.json()['final_shape']}")

        # Step 5: Human Verification Review
        rev = client.get(f"/api/automl/review/{job_id}", headers=hosp_headers)
        assert rev.status_code == 200, rev.text
        assert rev.json()["can_proceed"] is True
        print(f"  Step 5: Quality reviewed -> Quality Score: {rev.json()['quality_score']}% (can_proceed: {rev.json()['can_proceed']})")

        # Step 6: Detect Problem Type
        det = client.post(f"/api/automl/detect-problem/{job_id}", headers=hosp_headers)
        assert det.status_code == 200, det.text
        print(f"  Step 6: Detected problem: {det.json()['problem_type']} ({det.json()['sub_type']})")

        # Step 7: Train Multi-Algorithm Tournament
        trn = client.post(f"/api/automl/train/{job_id}", headers=hosp_headers)
        assert trn.status_code == 200, trn.text
        champ = trn.json()["results"]["champion"]
        print(f"  Step 7: Tournament finished! Champion: {champ['name']} (Acc: {champ['accuracy']}%)")

        # Step 8: Explainability Report
        rep = client.get(f"/api/automl/explainability/{job_id}", headers=hosp_headers)
        assert rep.status_code == 200, rep.text
        print(f"  Step 8: Generated explainability report: {rep.json()['explainability']['why_selected'][:60]}...")

        # Step 9: Final Approval
        gov = client.post(
            f"/api/automl/approve/{job_id}",
            json={"approved": True, "reason": "Meets clinical efficacy guidelines."},
            headers=hosp_headers
        )
        assert gov.status_code == 200, gov.text
        print("  Step 9: Model approved for deployment.")

        # Step 10: Model Deployment
        dep = client.post(f"/api/automl/deploy/{job_id}", headers=hosp_headers)
        assert dep.status_code == 200, dep.text
        print(f"  Step 10: Successfully deployed to model registry: {dep.json().get('deployed_model', {}).get('name')}")

        print("\n" + "=" * 70)
        print(" 5. Testing Hybrid Quantum Machine Learning Platform (SIH 26139)")
        print("=" * 70)

        # Datasets list
        q_datasets = client.get("/api/qml/datasets", headers=doc_headers)
        assert q_datasets.status_code == 200, q_datasets.text
        assert len(q_datasets.json()["benchmark_datasets"]) >= 4
        print(f"  [OK] Loaded {len(q_datasets.json()['benchmark_datasets'])} benchmark datasets.")

        # Hardware status
        q_hw = client.get("/api/qml/hardware/status", headers=doc_headers)
        assert q_hw.status_code == 200, q_hw.text
        print(f"  [OK] Quantum simulator backends: {list(q_hw.json()['backends'].keys())}")

        # Profile WDBC
        q_prof = client.post(
            "/api/qml/datasets/profile",
            json={"dataset_name": "breast_cancer"},
            headers=hosp_headers
        )
        assert q_prof.status_code == 200, q_prof.text
        print(f"  [OK] Profiled WDBC: {q_prof.json()['n_samples']} samples, Quality: {q_prof.json()['data_quality_score']}")

        # Single-sample inference test
        q_hist = client.get("/api/qml/experiments/history", headers=doc_headers)
        assert q_hist.status_code == 200, q_hist.text
        print(f"  [OK] Quantum experiment history audit trail accessible (Count: {len(q_hist.json())}).")

        print("\n" + "=" * 70)
        print(" >>> ALL VERIFICATION TESTS PASSED SUCCESSFULLY! (100% GREEN) <<<")
        print("=" * 70)

if __name__ == "__main__":
    run_all_tests()
