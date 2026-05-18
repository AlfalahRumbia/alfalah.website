import os
import re

workspace = r"C:\Users\user\Documents\ALFALAH WEBSITE"
pages_dir = os.path.join(workspace, "pages")

html_files = [os.path.join(workspace, "index.html")]
if os.path.exists(pages_dir):
    for f in os.listdir(pages_dir):
        if f.endswith(".html"):
            html_files.append(os.path.join(pages_dir, f))

for filepath in html_files:
    filename = os.path.basename(filepath)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    style_blocks = re.findall(r"<style[^>]*>(.*?)</style>", content, re.DOTALL)
    if not style_blocks:
        continue
    
    style_text = style_blocks[0]
    
    # Try to find navbar section
    navbar_match = re.search(r"(/\* ── NAVBAR ── \*/.*?)(/\* ── |/\* ──|$)", style_text, re.DOTALL)
    navbar_len = len(navbar_match.group(1)) if navbar_match else 0
    
    # Try to find footer section
    footer_match = re.search(r"(\.footer\s*\{.*?)(/\* ── |/\* ──|$)", style_text, re.DOTALL)
    # Or match based on .footer
    footer_match_alt = re.search(r"(/\* ── FOOTER ── \*/.*?)(/\* ── |/\* ──|$)", style_text, re.DOTALL)
    
    footer_len = 0
    if footer_match:
        footer_len = len(footer_match.group(1))
    elif footer_match_alt:
        footer_len = len(footer_match_alt.group(1))
        
    print(f"File: {filename}")
    print(f"  Navbar section matched: {navbar_match is not None} (Length: {navbar_len})")
    print(f"  Footer section matched: {footer_match is not None or footer_match_alt is not None} (Length: {footer_len})")
