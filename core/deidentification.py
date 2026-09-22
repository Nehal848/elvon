import re
import uuid

# Common regex patterns for PHI (Protected Health Information)
EMAIL_REGEX = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")
PHONE_REGEX = re.compile(r"(\+\d{1,3}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}")
# Simple MRN/ID regex (e.g., PAT-001, MED-1234, etc.)
ID_REGEX = re.compile(r"(PAT|MED|ID|MRN)-?\d{3,}")

def deidentify_text(text: str, patient_name: str | None = None) -> tuple[str, dict]:
    """
    Strips PHI from a string and replaces it with tokens.
    Returns the de-identified text and a dictionary of applied tokens.
    """
    if not isinstance(text, str):
        return text, {}

    tokens = {}
    deidentified = text
    
    # 1. Replace Patient Name if known
    if patient_name and patient_name in deidentified:
        token = "[REDACTED_PATIENT_NAME]"
        deidentified = deidentified.replace(patient_name, token)
        tokens[token] = patient_name
        
        # Also try first name / last name separately if they are space separated
        parts = patient_name.split()
        if len(parts) > 1:
            for part in parts:
                if len(part) > 2 and part in deidentified:
                    deidentified = deidentified.replace(part, "[REDACTED_NAME_PART]")
                    tokens["[REDACTED_NAME_PART]"] = "part of name"

    # 2. Replace Emails
    for match in EMAIL_REGEX.finditer(deidentified):
        email = match.group()
        token = "[REDACTED_EMAIL]"
        deidentified = deidentified.replace(email, token)
        tokens[token] = email

    # 3. Replace Phones
    for match in PHONE_REGEX.finditer(deidentified):
        phone = match.group()
        token = "[REDACTED_PHONE]"
        deidentified = deidentified.replace(phone, token)
        tokens[token] = phone
        
    # 4. Replace IDs
    for match in ID_REGEX.finditer(deidentified):
        id_val = match.group()
        token = "[REDACTED_ID]"
        deidentified = deidentified.replace(id_val, token)
        tokens[token] = id_val

    return deidentified, tokens


def deidentify_payload(payload: dict, patient_name: str | None = None) -> tuple[dict, dict]:
    """
    Deeply traverses a dictionary/list payload and de-identifies strings.
    Returns the de-identified payload and a mapping of applied tokens.
    """
    tokens_applied = {}

    def _traverse(obj):
        if isinstance(obj, dict):
            new_dict = {}
            for k, v in obj.items():
                # We also de-identify keys if necessary, but usually it's the values
                de_k, t_k = deidentify_text(str(k), patient_name)
                tokens_applied.update(t_k)
                
                # Special hardcoded keys to scrub completely
                if k.lower() in ["name", "patient_name", "full_name"]:
                    new_dict[de_k] = "[REDACTED_NAME]"
                elif k.lower() in ["dob", "date_of_birth"]:
                    new_dict[de_k] = "[REDACTED_DOB]"
                elif k.lower() in ["address", "location"]:
                    new_dict[de_k] = "[REDACTED_ADDRESS]"
                else:
                    new_dict[de_k] = _traverse(v)
            return new_dict
        elif isinstance(obj, list):
            return [_traverse(item) for item in obj]
        elif isinstance(obj, str):
            de_v, t_v = deidentify_text(obj, patient_name)
            tokens_applied.update(t_v)
            return de_v
        else:
            return obj

    safe_payload = _traverse(payload)
    
    # Generate a secure case token
    case_token = f"CASE-{uuid.uuid4().hex[:8].upper()}"
    safe_payload["_case_token"] = case_token
    
    return safe_payload, tokens_applied
