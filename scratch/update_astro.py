import re

with open('src/pages/literatura/[slug].astro', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove ExamFocus type
content = re.sub(r'type ExamFocus = \{[\s\S]*?\};\n+', '', content)

# 2. Remove const examFocus
content = re.sub(r'const examFocus = entry\.data\.examFocus as ExamFocus;\n', '', content)

# 3. Remove lit-focus section
content = re.sub(r'\s*<section class="lit-section lit-focus lit-reveal".*?</section>', '', content, flags=re.DOTALL)

# 4. Remove essayAngles section
content = re.sub(r'\s*\{/\*\s*Essay angles\s*\*/\}[\s\S]*?</section>\n\s*\)\}', '', content)

# 5. Refactor lit-message
old_msg = '''<div class="lit-message lit-reveal">
        <h3 class="lit-message-label">Послание</h3>
        <p class="lit-message-text">{entry.data.message}</p>
      </div>'''
new_msg = '''<section class="lit-section lit-reveal">
        <h2 class="lit-section-title">Послание</h2>
        <p class="lit-section-text">{entry.data.message}</p>
      </section>'''
content = content.replace(old_msg, new_msg)

# 6. Swap main and aside
main_match = re.search(r'(<!-- MAIN CONTENT \(left\) -->[\s\S]*?</main>)', content)
aside_match = re.search(r'(<!-- SIDEBAR \(right, inline on mobile\) -->[\s\S]*?</aside>)', content)

if main_match and aside_match:
    main_str = main_match.group(1).replace('MAIN CONTENT (left)', 'MAIN CONTENT (right)')
    aside_str = aside_match.group(1).replace('SIDEBAR (right, inline on mobile)', 'SIDEBAR (left, inline on mobile)')
    
    # We remove them from their original spots
    content = content.replace(main_match.group(1), '')
    content = content.replace(aside_match.group(1), '')
    
    # Insert them back in reversed order inside <div class="lit-page">
    # We find the start of lit-page
    lit_page_start = content.find('<div class="lit-page">') + len('<div class="lit-page">')
    
    # Insert aside then main
    insert_str = '\n    ' + aside_str + '\n\n    ' + main_str + '\n'
    content = content[:lit_page_start] + insert_str + content[lit_page_start:]

with open('src/pages/literatura/[slug].astro', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated [slug].astro successfully.')
