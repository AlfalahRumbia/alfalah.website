import os
import re

workspace = r"C:\Users\user\Documents\ALFALAH WEBSITE"
pages_dir = os.path.join(workspace, "pages")

# List all HTML files
html_files = [os.path.join(workspace, "index.html")]
if os.path.exists(pages_dir):
    for f in os.listdir(pages_dir):
        if f.endswith(".html"):
            html_files.append(os.path.join(pages_dir, f))

# 1. Create Directories if they don't exist
for d in ["css", "css/components", "css/pages", "js", "js/components", "js/pages", "assets/images", "assets/icons", "assets/fonts", "assets/videos"]:
    os.makedirs(os.path.join(workspace, d), exist_ok=True)

# 2. Write Shared CSS Files
global_css_path = os.path.join(workspace, "css/global.css")
with open(global_css_path, "w", encoding="utf-8") as f:
    f.write("""*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --primary:      #1A4D2E; /* Rich Forest Green */
  --primary-dark: #0F301F; /* Deeper Forest */
  --primary-mid:  #4F6F52; /* Sage Green */
  --secondary:    #FEFBF3; /* Cleaner, brighter cream */
  --secondary-dark:#F5EFE6; /* Warm grey-cream */
  --accent:       #D4AF37; /* Brighter Gold */
  --accent-soft:  rgba(212, 175, 55, 0.12);
  --accent-border:rgba(212, 175, 55, 0.3);
  --text-dark:    #0D1B1E;
  --text-mid:     #4A5D59;
  --text-light:   #fff;
  --radius:       20px;
  --radius-sm:    10px;
  --shadow-card:  0 4px 32px rgba(15,48,31,0.1);
  --shadow-hover: 0 12px 60px rgba(15,48,31,0.18);
  --transition:   0.32s ease;
}

html { scroll-behavior:smooth; overflow-x:hidden; }
body { font-family:'Nunito Sans',sans-serif; color:var(--text-dark); background:var(--secondary); overflow-x:hidden; }
img  { max-width:100%; height:auto; display:block; }

.fade-up {
  opacity:0; transform:translateY(24px);
  transition:opacity .6s ease, transform .6s ease;
}
.fade-up.show { opacity:1; transform:translateY(0); }
.fade-up:nth-child(2) { transition-delay:.10s; }
.fade-up:nth-child(3) { transition-delay:.20s; }
.fade-up:nth-child(4) { transition-delay:.30s; }
""")

navbar_css_path = os.path.join(workspace, "css/components/navbar.css")
with open(navbar_css_path, "w", encoding="utf-8") as f:
    f.write("""/* ── NAVBAR ── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(135deg, var(--primary) 0%, #1e3330 100%);
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  z-index: 9999;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.25);
  border-bottom: 2px solid rgba(212, 175, 55, 0.35);
  transition: all 0.4s ease;
}

.navbar.scrolled {
  padding: 0 40px;
  background: rgba(22, 38, 35, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.35);
  border-bottom-color: rgba(212, 175, 55, 0.5);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 20px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex-shrink: 0;
}

.nav-logo {
  height: 46px;
  width: auto;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.nav-brand-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  line-height: 1.15;
}

.nav-brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.nav-brand-sub {
  font-size: 10px;
  font-weight: 400;
  color: var(--accent);
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.nav-menu {
  display: flex;
  gap: 6px;
  list-style: none;
  align-items: center;
}

.nav-menu a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  padding: 7px 13px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 13px;
  right: 13px;
  width: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-menu a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-menu a:hover::after,
.nav-menu a.active::after {
  width: calc(100% - 26px);
}

.nav-menu a.active {
  color: var(--accent);
  background: rgba(212, 175, 55, 0.1);
}

.nav-cta {
  display: inline-block;
  padding: 9px 20px;
  background: var(--accent);
  color: #1a1a1a !important;
  font-weight: 700 !important;
  font-size: 13.5px !important;
  border-radius: 50px !important;
  text-decoration: none;
  transition: all 0.3s ease !important;
  white-space: nowrap;
  box-shadow: 0 3px 12px rgba(212, 175, 55, 0.35);
}

.nav-cta::after {
  display: none !important;
}

.nav-cta:hover {
  background: #e8c33a !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5) !important;
  color: #1a1a1a !important;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.hamburger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2.5px;
  background: var(--text-light);
  border-radius: 3px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

.nav-menu-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 9997;
  backdrop-filter: blur(4px);
}

.nav-menu-overlay.open {
  display: block;
}

/* Mobile responsive menu */
@media (max-width: 900px) {
  .hamburger {
    display: flex;
  }

  .nav-brand-name {
    font-size: 12px;
  }

  .nav-brand-sub {
    font-size: 10px;
  }

  .nav-logo {
    height: 36px;
  }

  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: min(280px, 78vw);
    height: 100dvh;
    background: linear-gradient(160deg, #1a2e2b 0%, #0d1a18 100%);
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0;
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -6px 0 40px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    z-index: 9998;
  }

  .nav-menu::before {
    content: 'Menu Navigasi';
    display: block;
    padding: 24px 20px 18px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(212, 175, 55, 0.7);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 10px;
    margin-top: 60px;
  }

  .nav-menu.open {
    right: 0;
  }

  .nav-menu li {
    padding: 0 12px;
  }

  .nav-menu a {
    font-size: 15px;
    width: 100%;
    display: block;
    padding: 13px 14px;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.88);
    border-bottom: none;
  }

  .nav-menu a:hover,
  .nav-menu a.active {
    background: rgba(212, 175, 55, 0.12);
    color: var(--accent);
  }

  .nav-menu li:last-child {
    padding: 16px 12px 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin-top: 8px;
  }

  .nav-cta {
    width: 100%;
    text-align: center;
    border-radius: 12px !important;
    padding: 13px 20px;
    justify-content: center;
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .nav-cta span {
    display: none;
  }

  .nav-container {
    gap: 10px;
  }

  .navbar {
    padding: 8px 3% !important;
  }
}
""")

footer_css_path = os.path.join(workspace, "css/components/footer.css")
with open(footer_css_path, "w", encoding="utf-8") as f:
    f.write("""/* ── FOOTER ── */
.footer {
  background:#000; color:#fff;
  padding:80px 0 40px;
  border-top:1px solid rgba(255,255,255,0.1);
  font-family: Arial, sans-serif;
}

.footer-content {
  display:grid; grid-template-columns:2fr 1fr 1fr;
  gap:40px; margin-bottom:60px;
}

.footer-identity h2 { font-family:'Arial Black', 'Arial', sans-serif; font-size:24px; font-weight:900; margin-bottom:15px; letter-spacing:0.5px; }
.footer-identity p  { font-size:16px; line-height:1.8; color:rgba(255,255,255,0.8); max-width:500px; font-weight:400; }
.footer-social-section h4, .footer-utility-section h4 { font-family: 'Arial Black', Arial, sans-serif; font-weight: 900; }
.social-list-extended, .utility-list-extended { list-style:none; padding:0; }
.social-list-extended li, .utility-list-extended li { margin-bottom:12px; }
.social-list-extended a, .utility-list-extended a {
  color:rgba(255,255,255,0.8); text-decoration:none; font-size:14px; font-weight:400;
  transition: all 0.3s ease; display:flex; align-items:center; gap:10px;
}

.social-list-extended a:hover, .utility-list-extended a:hover { color:var(--accent); opacity:1; }

.footer-bottom {
  text-align:center; font-size:14px; color:rgba(255,255,255,0.6); font-weight:400;
  padding-top:40px; border-top:1px solid rgba(255,255,255,0.1);
}

@media (max-width: 992px) {
  .footer-content { grid-template-columns:1.4fr 0.6fr; gap:35px 20px; padding:0 5%; }
  .footer-identity { grid-column:1 / -1; }
  .footer-identity img.footer-logo { width:48px !important; margin-bottom:15px !important; }
  .footer-identity h2 { font-size:18px !important; margin-bottom:10px; }
  .footer-identity p  { font-size:12px; color:rgba(255,255,255,0.7); }
  .footer-social-section h4, .footer-utility-section h4 {
    font-size:11px !important; letter-spacing:1px; margin-bottom:15px;
    font-weight:600; color:#fff !important;
  }
  .social-list-extended a, .utility-list-extended a {
    font-size:12px !important; color:#fff !important; white-space:nowrap;
  }
  .footer { padding:40px 0 30px !important; }
  .footer-bottom { font-size:10px !important; padding-top:20px !important; }
}
""")

# 3. Write Shared JS Files
global_js_path = os.path.join(workspace, "js/global.js")
with open(global_js_path, "w", encoding="utf-8") as f:
    f.write("""document.addEventListener("DOMContentLoaded", () => {
  // Global fade-up animation using IntersectionObserver
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
});
""")

navbar_js_path = os.path.join(workspace, "js/components/navbar.js")
with open(navbar_js_path, "w", encoding="utf-8") as f:
    f.write("""document.addEventListener("DOMContentLoaded", () => {
  // Hamburger and menu interaction
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (hamburger && navMenu && navOverlay) {
    function openMenu() {
      hamburger.classList.add('active');
      navMenu.classList.add('open');
      navOverlay.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      navOverlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Scrolling navbar state
  const navbar = document.getElementById('mainNav');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    });
  }
});
""")

# 4. Refactor manifest.json image paths
manifest_path = os.path.join(workspace, "manifest.json")
if os.path.exists(manifest_path):
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest_content = f.read()
    manifest_content = manifest_content.replace("img/Properti%20Utama/", "assets/images/Properti%20Utama/")
    manifest_content = manifest_content.replace("img/Properti Utama/", "assets/images/Properti Utama/")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(manifest_content)
    print("Updated manifest.json image paths")

# Helpers to strip duplicate logic
def clean_script_content(script_code):
    # Strip intersection observer block if it exists
    script_code = re.sub(r'const\s+(?:obs|observer)\s*=\s*new\s+IntersectionObserver.*?;?\s*document\.querySelectorAll\(\'\.fade-up\'\)\.forEach\(el\s*=>\s*(?:obs|observer)\.observe\(el\)\);?', '', script_code, flags=re.DOTALL)
    
    # Strip hamburger / scroll logic
    script_code = re.sub(r'const\s+hamburger\s*=\s*document\.getElementById\(\'hamburger\'\);.*navbar\.classList\.toggle\(\'scrolled\',\s*window\.scrollY\s*>\s*80\);\s*\}\);', '', script_code, flags=re.DOTALL)
    script_code = re.sub(r'const\s+hamburger\s*=\s*document\.getElementById\(\'hamburger\'\);.*hamburger\.setAttribute\(\'aria-expanded\',\s*\'false\'\);\s*document\.body\.style\.overflow\s*=\s*\'\';\s*\}\s*hamburger\.addEventListener\(\'click\',\s*\(\)\s*=>\s*\{.*?\}\);\s*navOverlay\.addEventListener\(\'click\',\s*closeMenu\);\s*navLinks\.forEach\(link\s*=>\s*\{.*?\}\);\s*const\s*navbar\s*=\s*document\.getElementById\(\'mainNav\'\);\s*window\.addEventListener\(\'scroll\',\s*\(\)\s*=>\s*\{.*?\}\);', '', script_code, flags=re.DOTALL)
    
    # Return cleaned script code
    return script_code.strip()

# 5. Process HTML files
for filepath in html_files:
    filename = os.path.basename(filepath)
    is_root = (filename == "index.html")
    page_name = os.path.splitext(filename)[0].lower()
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract CSS
    style_blocks = re.findall(r"<style[^>]*>(.*?)</style>", content, re.DOTALL)
    style_content = style_blocks[0] if style_blocks else ""
    
    # Extract JS
    script_content = ""
    script_blocks_matches = list(re.finditer(r"<script([^>]*)>(.*?)</script>", content, re.DOTALL))
    custom_script_tag = None
    
    for match in script_blocks_matches:
        attrs = match.group(1)
        code = match.group(2)
        if "application/ld+json" not in attrs and "src=" not in attrs:
            script_content = code
            custom_script_tag = match.group(0)
            break
            
    # Process relative paths inside extracted CSS and JS
    if is_root:
        # Root paths
        style_content = style_content.replace("img/Properti%20Utama/", "assets/images/Properti%20Utama/")
        style_content = style_content.replace("img/Properti Utama/", "assets/images/Properti Utama/")
        style_content = style_content.replace("img/", "assets/images/")
        
        script_content = script_content.replace("img/Properti%20Utama/", "assets/images/Properti%20Utama/")
        script_content = script_content.replace("img/Properti Utama/", "assets/images/Properti Utama/")
        script_content = script_content.replace("img/", "assets/images/")
    else:
        # Subpage paths: extracted CSS files are in css/pages/, so from there the assets are at ../../assets/images/
        # Let's replace any relative references to img/ or ../img/ in CSS:
        style_content = style_content.replace("../img/Properti%20Utama/", "../../assets/images/Properti%20Utama/")
        style_content = style_content.replace("../img/Properti Utama/", "../../assets/images/Properti Utama/")
        style_content = style_content.replace("../img/", "../../assets/images/")
        style_content = style_content.replace("img/", "../../assets/images/")
        
        # Extracted JS files are in js/pages/, so assets are at ../../assets/images/ (or just relative if they run in page context, which is subpage level, so they should use ../assets/images/)
        # Wait, JS runs in the context of the HTML page!
        # So in the JS code, the relative path must match the HTML file context (which is pages/ or root), so it uses ../assets/images/ or assets/images/
        script_content = script_content.replace("../img/Properti%20Utama/", "../assets/images/Properti%20Utama/")
        script_content = script_content.replace("../img/Properti Utama/", "../assets/images/Properti Utama/")
        script_content = script_content.replace("../img/", "../assets/images/")
        script_content = script_content.replace("img/", "../assets/images/")
        
    # Clean JS content
    clean_js = clean_script_content(script_content)
    
    # Save files
    css_output_path = os.path.join(workspace, f"css/pages/{page_name}.css")
    with open(css_output_path, "w", encoding="utf-8") as f:
        f.write(style_content.strip())
        
    js_output_path = os.path.join(workspace, f"js/pages/{page_name}.js")
    with open(js_output_path, "w", encoding="utf-8") as f:
        f.write(clean_js)
        
    # Update HTML content
    # A. Update asset references inside HTML content
    if is_root:
        content = content.replace("img/Properti%20Utama/", "assets/images/Properti%20Utama/")
        content = content.replace("img/Properti Utama/", "assets/images/Properti Utama/")
        content = content.replace("img/", "assets/images/")
    else:
        content = content.replace("../img/Properti%20Utama/", "../assets/images/Properti%20Utama/")
        content = content.replace("../img/Properti Utama/", "../assets/images/Properti Utama/")
        content = content.replace("../img/", "../assets/images/")
        content = content.replace("img/", "../assets/images/")
        
    # B. Replace internal style tags with link elements
    if is_root:
        css_links = """  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/components/footer.css">
  <link rel="stylesheet" href="css/pages/index.css">"""
    else:
        if filename == "maintenance.html":
            css_links = """  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/pages/maintenance.css">"""
        else:
            css_links = f"""  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/components/navbar.css">
  <link rel="stylesheet" href="../css/components/footer.css">
  <link rel="stylesheet" href="../css/pages/{page_name}.css">"""
          
    # Replace the <style>...</style> block
    content = re.sub(r"<style[^>]*>.*?</style>", css_links, content, flags=re.DOTALL)
    
    # C. Replace internal script tags with script elements
    if is_root:
        js_scripts = """  <script src="js/global.js" defer></script>
  <script src="js/pages/index.js" defer></script>"""
    else:
        if filename == "maintenance.html":
            js_scripts = """  <script src="../js/global.js" defer></script>
  <script src="../js/pages/maintenance.js" defer></script>"""
        else:
            js_scripts = f"""  <script src="../js/global.js" defer></script>
  <script src="../js/components/navbar.js" defer></script>
  <script src="../js/pages/{page_name}.js" defer></script>"""
            
    if custom_script_tag:
        content = content.replace(custom_script_tag, js_scripts)
    else:
        # If no custom script tag found, append to body
        content = content.replace("</body>", f"{js_scripts}\n</body>")
        
    # Save the updated HTML
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Successfully processed {filename}:")
    print(f"  - Extracted CSS to: css/pages/{page_name}.css")
    print(f"  - Extracted JS to: js/pages/{page_name}.js")
    print(f"  - Updated HTML links and assets paths")

print("\nRefactoring process completed successfully!")
