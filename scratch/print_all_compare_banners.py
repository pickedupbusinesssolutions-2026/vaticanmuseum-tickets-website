for p in ['index.html', 'plan-your-visit/index.html', 'plan-your-visit/vatican-museums-visitor-guide/index.html']:
    with open(p, 'r', encoding='utf-8') as f:
        html = f.read()
    import re
    m = re.search(r'<section class="cta-banner".*?</section>', html, re.DOTALL)
    if m:
        print(f"\n==================== {p} ====================")
        print(m.group(0))

