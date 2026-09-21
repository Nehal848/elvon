"""
app/auth_router.py — Authentication Router
Doctor & Hospital Registration, Login, OTP Verification, JWT
"""
import logging
import random
import time
import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

import config

logger = logging.getLogger("auth")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# ─── In-memory stores (demo mode) ────────────────────────────────────────────
_PENDING_OTP: dict = {}        # {email: {otp, expires, user_data, attempts, action}}
from sqlalchemy.orm import Session
from core.database import SessionLocal, User

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# ─── Pydantic Schemas ────────────────────────────────────────────────────────
class DoctorRegisterRequest(BaseModel):
    full_name: str
    license_number: str
    state: str
    email: str
    hospital_name: str
    password: str
    phone: str

class HospitalRegisterRequest(BaseModel):
    hospital_name: str
    hospital_address: str
    registration_number: str
    admin_name: str
    email: str
    phone: str
    password: str

class LoginRequest(BaseModel):
    identifier: str       # license number or registration number
    password: str

class OTPVerifyRequest(BaseModel):
    email: str
    otp: str

class TokenResponse(BaseModel):
    token: str
    role: str
    full_name: str
    email: str
    institution: str
    designation: str
    identifier: str
    requires_otp: bool = False


# ─── Helper: JWT ──────────────────────────────────────────────────────────────
def create_jwt(user_data: dict, expires_hours: int = 24) -> str:
    payload = {
        "sub": user_data["id"],
        "role": user_data["role"],
        "identifier": user_data["identifier"],
        "email": user_data["email"],
        "full_name": user_data["full_name"],
        "institution": user_data.get("institution", ""),
        "exp": datetime.now(timezone.utc) + timedelta(hours=expires_hours),
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm="HS256")


def decode_jwt(token: str) -> dict:
    if config.DEMO_MODE and token == "demo_token":
        return {
            "sub": "usr_demo_doctor",
            "role": "doctor",
            "identifier": "MED-11001-DL",
            "email": "doctor@elvon.ai",
            "full_name": "Dr. Ananya Sharma",
            "institution": "AIIMS Delhi",
        }
    try:
        return jwt.decode(token, config.JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(authorization: str | None = Header(None)) -> dict:
    if not authorization:
        if config.DEMO_MODE:
            return {
                "sub": "usr_demo_admin",
                "role": "institution",
                "identifier": "HOSP-MH-001",
                "email": "admin@citycare.in",
                "full_name": "CityCare Hospital Admin",
                "institution": "CityCare Multi-Speciality Hospital",
            }
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing",
        )
    token = authorization.replace("Bearer ", "")
    return decode_jwt(token)


# ─── RBAC Role Guards ────────────────────────────────────────────────────────
def require_role(*allowed_roles: str):
    """
    Returns a FastAPI dependency that enforces role-based access.
    Usage: Depends(require_role("doctor", "institution"))
    """
    def _guard(
        user: dict = Depends(get_current_user),  # noqa: B008
    ) -> dict:
        if config.DEMO_MODE:
            return user
        if user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=(
                    f"Access denied. Required role: "
                    f"{', '.join(allowed_roles)}"
                ),
            )
        return user
    return _guard


require_doctor = require_role("doctor")
require_hospital = require_role("institution")
require_any_auth = require_role("doctor", "institution")


def generate_otp() -> str:
    import secrets
    return f"{secrets.randbelow(900000) + 100000}"


# ─── 1. Doctor Registration ──────────────────────────────────────────────────
@router.post("/register/doctor")
async def register_doctor(req: DoctorRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new doctor. Generates OTP sent to console (demo mode).
    README Section 3.1.
    """
    existing_user = db.query(User).filter(User.identifier == req.license_number).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="License number already registered")

    # Create user record (pending OTP verification)
    user_data = {
        "id": f"usr_{uuid.uuid4().hex[:8]}",
        "full_name": req.full_name,
        "identifier": req.license_number,
        "email": req.email,
        "role": "doctor",
        "password_hash": bcrypt.hashpw(
            req.password.encode(), bcrypt.gensalt()
        ).decode(),
        "institution": req.hospital_name,
        "designation": "Doctor",
        "state": req.state,
        "phone": req.phone,
        "verified": False,
    }

    otp = generate_otp()
    _PENDING_OTP[req.email] = {
        "otp": otp,
        "expires": time.time() + 600,  # 10 min
        "user_data": user_data,
        "action": "register",
        "attempts": 0,
    }

    # In demo mode, print OTP to console
    logger.info(f"[OTP] Doctor registration OTP for {req.email}: {otp}")
    print(f"\n{'='*50}")
    print(f"[OTP] Registration OTP for {req.email}: {otp}")
    print(f"{'='*50}\n")

    return {
        "message": "OTP sent to your email (check console in demo mode)",
        "email": req.email,
        "requires_otp": True,
    }


# ─── 2. Hospital Registration ────────────────────────────────────────────────
@router.post("/register/hospital")
async def register_hospital(req: HospitalRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new hospital. Generates OTP sent to console (demo mode).
    README Section 3.2.
    """
    existing_user = db.query(User).filter(User.identifier == req.registration_number).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Registration number already registered",
        )

    user_data = {
        "id": f"usr_{uuid.uuid4().hex[:8]}",
        "full_name": req.admin_name,
        "identifier": req.registration_number,
        "email": req.email,
        "role": "institution",
        "password_hash": bcrypt.hashpw(
            req.password.encode(), bcrypt.gensalt()
        ).decode(),
        "institution": req.hospital_name,
        "designation": "Hospital Admin",
        "address": req.hospital_address,
        "phone": req.phone,
        "verified": False,
    }

    otp = generate_otp()
    _PENDING_OTP[req.email] = {
        "otp": otp,
        "expires": time.time() + 600,
        "user_data": user_data,
        "action": "register",
        "attempts": 0,
    }

    logger.info(f"[OTP] Hospital registration OTP for {req.email}: {otp}")
    print(f"\n{'='*50}")
    print(f"[OTP] Registration OTP for {req.email}: {otp}")
    print(f"{'='*50}\n")

    return {
        "message": "OTP sent to your email (check console in demo mode)",
        "email": req.email,
        "requires_otp": True,
    }


# ─── 3. OTP Verification ─────────────────────────────────────────────────────
@router.post("/verify-otp")
async def verify_otp(req: OTPVerifyRequest, db: Session = Depends(get_db)):
    """
    Verify OTP for registration or login.
    README Section 3.1, 3.2, 3.4, 3.5.
    """
    if req.email not in _PENDING_OTP:
        raise HTTPException(status_code=400, detail="No pending OTP for this email")

    pending = _PENDING_OTP[req.email]
    if time.time() > pending["expires"]:
        del _PENDING_OTP[req.email]
        raise HTTPException(status_code=400, detail="OTP expired")

    if req.otp != pending["otp"]:
        pending["attempts"] += 1
        if pending["attempts"] >= 5:
            del _PENDING_OTP[req.email]
            raise HTTPException(
                status_code=400,
                detail="Too many invalid attempts. OTP invalidated.",
            )
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user_data = pending["user_data"]

    if pending["action"] == "register":
        user_data["verified"] = True
        new_user = User(**user_data)
        db.add(new_user)
        db.commit()

    del _PENDING_OTP[req.email]

    token = create_jwt(user_data)
    return {
        "token": token,
        "role": user_data["role"],
        "full_name": user_data["full_name"],
        "email": user_data["email"],
        "institution": user_data.get("institution", ""),
        "designation": user_data.get("designation", ""),
        "identifier": user_data["identifier"],
    }


# ─── 4. Login ────────────────────────────────────────────────────────────────
@router.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with license/registration number + password.
    Generates OTP for 2FA. In demo mode, OTP is shown in response.
    README Section 3.4, 3.5.
    """
    user = db.query(User).filter(User.identifier == req.identifier).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials — identifier not found",
        )

    if not bcrypt.checkpw(req.password.encode(), user.password_hash.encode()):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials — wrong password",
        )

    user_dict = {
        "id": user.id,
        "full_name": user.full_name,
        "identifier": user.identifier,
        "email": user.email,
        "role": user.role,
        "institution": user.institution,
        "designation": user.designation,
    }

    # Generate OTP for 2FA
    otp = generate_otp()
    _PENDING_OTP[user.email] = {
        "otp": otp,
        "expires": time.time() + 600,
        "user_data": user_dict,
        "action": "login",
        "attempts": 0,
    }

    logger.info(f"[OTP] Login OTP for {user.email}: {otp}")
    print(f"\n{'='*50}")
    print(f"[OTP] Login OTP for {user.email}: {otp}")
    print(f"{'='*50}\n")

    return {
        "message": "OTP sent for verification",
        "email": user.email,
        "role": user.role,
        "full_name": user.full_name,
        "requires_otp": True,
    }


# ─── 5. Quick Login (Skip OTP for Demo) ──────────────────────────────────────
@router.post("/login/quick")
async def quick_login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Direct login without OTP — for demo/hackathon testing only.
    """
    if not config.DEMO_MODE:
        raise HTTPException(
            status_code=403,
            detail="Quick login is disabled outside of DEMO_MODE",
        )

    user = db.query(User).filter(User.identifier == req.identifier).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    valid = False
    try:
        valid = bcrypt.checkpw(req.password.encode(), user.password_hash.encode())
    except Exception:
        pass

    if not valid and config.DEMO_MODE:
        demo_aliases = {
            "RES-QML-007": ["researcher", "qml"],
            "DS-AI-404": ["datascience", "automl", "data_scientist"],
            "MED-11001-DL": ["doctor", "med123"],
            "HOSP-MH-001": ["admin", "hospital"],
        }
        if req.identifier in demo_aliases and req.password in demo_aliases[req.identifier]:
            valid = True

    if not valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_dict = {
        "id": user.id,
        "full_name": user.full_name,
        "identifier": user.identifier,
        "email": user.email,
        "role": user.role,
        "institution": user.institution,
        "designation": user.designation,
    }

    token = create_jwt(user_dict)
    return {
        "token": token,
        "role": user.role,
        "full_name": user.full_name,
        "email": user.email,
        "institution": user.institution,
        "designation": user.designation,
        "identifier": user.identifier,
    }


# ─── 6. Get Current User ─────────────────────────────────────────────────────
@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):  # noqa: B008
    """Returns the current authenticated user profile."""
    return {
        "id": user.get("sub"),
        "role": user.get("role"),
        "full_name": user.get("full_name"),
        "email": user.get("email"),
        "institution": user.get("institution", ""),
        "identifier": user.get("identifier", ""),
    }
