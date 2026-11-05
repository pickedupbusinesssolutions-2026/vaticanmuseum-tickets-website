import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_files = [f for f in glob.glob('**/*.html', recursive=True) if not f.startswith('content_sources')]

found = []
for hf in html_files:
    with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    if 'cl-homelink-campare' in content or 'btn-compare-all' in content or 'Ready to Experience' in content:
        found.append(hf)

print(f"Files found with this CTA banner / link: {len(found)}")
for f in found:
    print(" -", f)

