from pathlib import Path

main_file = Path('app/main.py')
content = main_file.read_text(encoding='utf-8')
content = content.replace('class OTPSendPayload(BaseModel):', 'from pydantic import BaseModel\nclass OTPSendPayload(BaseModel):')
main_file.write_text(content, encoding='utf-8')
