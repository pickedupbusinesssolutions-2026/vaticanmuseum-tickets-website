import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_files = [f for f in glob.glob('**/*.html', recursive=True) if not f.startswith('content_sources')]

found = []
for hf in html_files:
    with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    if 'Compare All Tickets & Tours' in content or 'Ready to Experience the Vatican Museums' in content or 'Compare All Tickets' in content:
        # find matching links
        links = re.findall(r'<a\s+[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', content, re.DOTALL)
        for h, t in links:
            clean = re.sub(r'<[^>]+>', '', t).strip()
            if 'compare' in clean.lower():
                found.append((hf, clean, h))

print(f"Total matching compare button occurrences: {len(found)}")
# Group by file
from collections import defaultdict
grouped = defaultdict(list)
for hf, txt, hr in found:
    grouped[hf].append((txt, hr))

for hf, items in list(grouped.items())[:15]:
    print(f"\n{hf}:")
    for txt, hr in items:
        print(f"  [{txt}] -> {hr}")

