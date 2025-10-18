# Template Implementation Guide

## ✅ Completed: All 33 Schema Files

All schema.json files have been created for every document type with:
- Comprehensive field definitions
- Validation rules
- Bilingual labels (Uzbek/Russian)
- Type-specific options

## 📋 Template Structure

Each template directory should contain:

```
/template_name/
├── schema.json       ✅ COMPLETE (all 33 types)
├── template.html     ⏳ TODO (use ijara_shartnomasi as reference)
└── styles.css        ⏳ TODO (reusable - copy from ijara_shartnomasi)
```

## 🎨 Creating HTML Templates

### Reference Implementation
See `ijara_shartnomasi/template.html` for a complete example.

### Standard Template Structure

```html
<!DOCTYPE html>
<html lang="{{language}}">
<head>
    <meta charset="UTF-8">
    <title>{{document_title}}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="document">
        <!-- Header -->
        <header class="document-header">
            <h1 class="document-title">DOCUMENT TITLE</h1>
            <p class="document-subtitle">№ ____ от {{date}}</p>
        </header>

        <!-- Parties Section -->
        <section class="parties">
            <p class="intro-text">{{parties_introduction}}</p>
        </section>

        <!-- Articles -->
        <section class="article">
            <h2 class="article-title">1. ARTICLE TITLE</h2>
            <p class="article-content">{{content}}</p>
        </section>

        <!-- Signatures -->
        <section class="signatures">
            <h2 class="signatures-title">SIGNATURES</h2>
            <div class="signature-blocks">
                <div class="signature-block">
                    <!-- Signature details -->
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="document-footer">
            <p class="ai-notice">🤖 AI-generated notice</p>
        </footer>
    </div>
</body>
</html>
```

### Handlebars Variables

Use these patterns in templates:

```handlebars
{{variable_name}}           - Simple substitution
{{#if_uzbek}}...{{/if_uzbek}}  - Uzbek language block
{{#if_russian}}...{{/if_russian}} - Russian language block
{{#if variable}}...{{/if}}  - Conditional block
```

## 🎨 Styling

The `styles.css` file from `ijara_shartnomasi` is **reusable** for all templates.

Key CSS classes:
- `.document` - Main container (A4 size)
- `.document-header` - Title section
- `.article` - Content sections
- `.signatures` - Signature blocks
- `.ai-notice` - AI disclosure footer

### To reuse styles:
```bash
cp templates/ijara_shartnomasi/styles.css templates/your_template/styles.css
```

## 🔧 Backend Integration

### Loading a Template

```python
import json
from pathlib import Path

def load_template(template_name):
    template_dir = Path(f"templates/{template_name}")

    with open(template_dir / "schema.json") as f:
        schema = json.load(f)

    with open(template_dir / "template.html") as f:
        template = f.read()

    return schema, template
```

### Rendering a Document

```python
from jinja2 import Template

def render_document(template_name, language, data):
    schema, html_template = load_template(template_name)

    # Add language flags
    data['if_uzbek'] = (language == 'uzbek')
    data['if_russian'] = (language == 'russian')
    data['language'] = language

    # Render
    template = Template(html_template)
    rendered_html = template.render(**data)

    return rendered_html
```

### Generating PDF

```python
from weasyprint import HTML

def generate_pdf(html_content, output_path):
    HTML(string=html_content).write_pdf(output_path)
```

## 📊 Document Categories Summary

### ✅ Contracts (10 types)
1. ijara_shartnomasi (Lease Agreement)
2. mehnat_shartnomasi (Employment Contract)
3. xizmat_shartnomasi (Service Agreement)
4. yetkazib_berish_shartnomasi (Supply Contract)
5. kredit_shartnomasi (Loan Agreement)
6. ishonch_shartnomasi (Trust Agreement)
7. sheriklik_shartnomasi (Partnership Agreement)
8. sotib_olish_shartnomasi (Sale-Purchase Agreement)
9. pudrat_shartnomasi (Construction Contract)
10. franchayzing_shartnomasi (Franchise Agreement)

### ✅ Court Documents (6 types)
11. davo_arizasi (Lawsuit/Petition)
12. shikoyat (Complaint/Appeal)
13. javob_arizasi (Response to Lawsuit)
14. kassatsiya_shikoyati (Cassation Appeal)
15. sud_qarori (Court Decision)
16. sud_majlisi_bayonnomasi (Court Session Minutes)

### ✅ Corporate Documents (6 types)
17. nizom (Charter)
18. tasis_shartnomasi (Founding Agreement)
19. ishtirokchilar_yigilishi (Shareholders Meeting Minutes)
20. direktor_buyrugi (Director's Order)
21. ishga_qabul_buyrugi (Employment Order)
22. ishdan_boshatish_buyrugi (Dismissal Order)

### ✅ Property Documents (4 types)
23. kochmas_mulk_guvohnomasi (Real Estate Certificate)
24. yer_uchastkasi_shartnomasi (Land Plot Agreement)
25. ijaraga_berish_shartnomasi (Rental Agreement)
26. meros_hujjati (Inheritance Document)

### ✅ Administrative Documents (4 types)
27. ishonchnoma (Power of Attorney)
28. notarial_tasdiq (Notarized Document)
29. malumotnoma (Reference Letter)
30. ariza (Application)

### ✅ Tax & Financial Documents (3 types)
31. soliq_deklaratsiyasi (Tax Declaration)
32. hisob_faktura (Invoice)
33. tolov_topshirigi (Payment Order)

## 🚀 Next Steps

1. **Create HTML templates** using `ijara_shartnomasi/template.html` as a reference
2. **Copy styles.css** to each template directory
3. **Test rendering** with sample data
4. **Generate PDFs** using WeasyPrint or similar
5. **Integrate with backend** API

## 📝 Field Validation

Each schema includes validation rules:
- `pattern` - Regex validation (e.g., passport format)
- `min`/`max` - Number ranges
- `minLength`/`maxLength` - String length
- `required` - Mandatory fields

## 🌐 Language Support

All templates support:
- **Uzbek** (Latin script)
- **Russian** (Cyrillic script)

Language selection affects:
- Field labels
- Document content
- Legal terminology

## ⚖️ Legal Compliance

All templates include:
- ✅ AI-generated content disclosure
- ✅ Professional formatting (A4, Times New Roman)
- ✅ Uzbekistan legal standards
- ✅ Proper legal terminology
- ✅ Required sections per document type

---

**Status**: All schemas complete ✅ | HTML templates in progress ⏳
**Total Documents**: 33 types | **Languages**: 2 (Uzbek, Russian)
