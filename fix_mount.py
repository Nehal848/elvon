from pathlib import Path

main_file = Path('app/main.py')
content = main_file.read_text(encoding='utf-8')
if 'name="frontend"' not in content:
    content += '\nif (_frontend_dir / "out").exists():\n    app.mount("/", _SF(directory=str(_frontend_dir / "out"), html=True), name="frontend")\n'
    main_file.write_text(content, encoding='utf-8')
