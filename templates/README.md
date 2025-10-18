# Legal Document Templates - Uzbekistan

This directory contains comprehensive templates for Uzbek legal documents in both Uzbek and Russian languages.

## Structure

Each template directory contains:
- `schema.json` - Field definitions, validation rules, and metadata
- `template.html` - HTML template with Handlebars-style variables
- `styles.css` - Document styling (A4 format, print-ready)

## Categories

### 1. Contracts (Shartnomalar) - 10 types
1. `ijara_shartnomasi` - Lease/Rent Agreement (✅ Complete)
2. `mehnat_shartnomasi` - Employment Contract (⏳ In Progress)
3. `xizmat_shartnomasi` - Service Agreement
4. `yetkazib_berish_shartnomasi` - Supply Contract
5. `kredit_shartnomasi` - Loan Agreement
6. `ishonch_shartnomasi` - Trust Agreement/Power of Attorney
7. `sheriklik_shartnomasi` - Partnership Agreement
8. `sotib_olish_shartnomasi` - Sale-Purchase Agreement
9. `pudrat_shartnomasi` - Construction Contract
10. `franchayzing_shartnomasi` - Franchise Agreement

### 2. Court Documents (Sud hujjatlari) - 6 types
1. `davo_arizasi` - Lawsuit/Petition
2. `shikoyat` - Complaint/Appeal
3. `javob_arizasi` - Response to Lawsuit
4. `kassatsiya_shikoyati` - Cassation Appeal
5. `sud_qarori` - Court Decision/Judgment
6. `sud_majlisi_bayonnomasi` - Court Session Minutes

### 3. Corporate Documents (Korporativ hujjatlar) - 6 types
1. `nizom` - Charter/Articles of Association
2. `tasis_shartnomasi` - Founding Agreement
3. `ishtirokchilar_yigilishi` - Shareholders Meeting Minutes
4. `direktor_buyrugi` - Director's Order
5. `ishga_qabul_buyrugi` - Employment Order
6. `ishdan_boshatish_buyrugi` - Dismissal Order

### 4. Property Documents (Mulk hujjatlari) - 4 types
1. `kochmas_mulk_guvohnomasi` - Real Estate Certificate
2. `yer_uchastkasi_shartnomasi` - Land Plot Agreement
3. `ijaraga_berish_shartnomasi` - Rental Agreement
4. `meros_hujjati` - Inheritance Document

### 5. Administrative Documents (Ma'muriy hujjatlar) - 4 types
1. `ishonchnoma` - Power of Attorney
2. `notarial_tasdiq` - Notarized Document
3. `malumotnoma` - Reference Letter/Certificate
4. `ariza` - Application/Request

### 6. Tax & Financial Documents - 3 types
1. `soliq_deklaratsiyasi` - Tax Declaration
2. `hisob_faktura` - Invoice
3. `tolov_topshirigi` - Payment Order

## Total: 33 Document Types

## Usage

### Backend Integration
```python
from templates import TemplateManager

manager = TemplateManager()
document = manager.generate(
    template_name="ijara_shartnomasi",
    language="uzbek",
    data={
        "landlord_name": "Aliyev Ali Alievich",
        # ... other fields
    }
)
```

### Field Types
- `text` - Single-line text input
- `textarea` - Multi-line text input
- `number` - Numeric input with min/max validation
- `date` - Date picker
- `select` - Dropdown selection
- `boolean` - Yes/No checkbox

## Legal Compliance
- ✅ Uzbekistan legal format standards
- ✅ Bilingual support (Uzbek & Russian)
- ✅ AI-generated content disclosure
- ✅ Professional legal layout (A4, Times New Roman)
- ✅ Print-ready PDF generation

## License
Proprietary - For hackathon use only
