import os
import re

workspace = r"C:\Users\user\Documents\ALFALAH WEBSITE"
pages_dir = os.path.join(workspace, "pages")

html_files = [os.path.join(workspace, "index.html")]
if os.path.exists(pages_dir):
    for f in os.listdir(pages_dir):
        if f.endswith(".html"):
            html_files.append(os.path.join(pages_dir, f))

print(f"Found {len(html_files)} HTML files:")
for f in html_files:
    print(" -", os.path.basename(f))

def analyze_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Find style blocks
    style_blocks = re.findall(r"<style[^>]*>(.*?)</style>", content, re.DOTALL)
    
    # Find script blocks
    script_blocks_all = re.findall(r"<script[^>]*>(.*?)</script>", content, re.DOTALL)
    # Filter out JSON-LD schema scripts
    script_blocks = []
    schema_count = 0
    for block in re.finditer(r"<script([^>]*)>(.*?)</script>", content, re.DOTALL):
        attrs = block.group(1)
        code = block.group(2)
        if "application/ld+json" in attrs:
            schema_count += 1
        elif "src=" not in attrs:
            script_blocks.append(code)
            
    return style_blocks, script_blocks, schema_count

for f in html_files:
    styles, scripts, schema = analyze_file(f)
    print(f"\nFile: {os.path.basename(f)}")
    print(f"  Style blocks: {len(styles)} (Total chars: {sum(len(s) for s in styles)})")
    print(f"  Script blocks (excluding JSON-LD): {len(scripts)} (Total chars: {sum(len(s) for s in scripts)})")
    print(f"  JSON-LD schema blocks: {schema}")
