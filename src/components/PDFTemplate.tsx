import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginVertical: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
  },
});

interface PDFTemplateProps {
  documentType: string;
  language: string;
  formData: Record<string, string>;
}

export const PDFTemplate = ({ documentType, language, formData }: PDFTemplateProps) => {
  const getTitle = () => {
    const titles: Record<string, { uzbek: string; russian: string }> = {
      lease: { uzbek: 'Ijara Shartnomasi', russian: 'Договор аренды' },
      nda: { uzbek: 'Maxfiylik Shartnomasi', russian: 'Соглашение о конфиденциальности' },
      contract: { uzbek: 'Xizmat Ko\'rsatish Shartnomasi', russian: 'Договор об оказании услуг' },
      will: { uzbek: 'Vasiyatnoma', russian: 'Завещание' },
      petition: { uzbek: 'Sud Arizasi', russian: 'Судебное заявление' },
    };
    return titles[documentType]?.[language as 'uzbek' | 'russian'] || 'Document';
  };

  const getFieldLabel = (key: string) => {
    const labels: Record<string, { uzbek: string; russian: string }> = {
      landlord: { uzbek: 'Uy egasi', russian: 'Арендодатель' },
      tenant: { uzbek: 'Ijarachi', russian: 'Арендатор' },
      address: { uzbek: 'Manzil', russian: 'Адрес' },
      rent: { uzbek: 'Ijara to\'lovi', russian: 'Арендная плата' },
      duration: { uzbek: 'Muddat', russian: 'Срок' },
      partyOne: { uzbek: 'Birinchi tomon', russian: 'Первая сторона' },
      partyTwo: { uzbek: 'Ikkinchi tomon', russian: 'Вторая сторона' },
      purpose: { uzbek: 'Maqsad', russian: 'Цель' },
      scope: { uzbek: 'Hajm', russian: 'Объем работ' },
      payment: { uzbek: 'To\'lov', russian: 'Оплата' },
      testator: { uzbek: 'Vasiyat qiluvchi', russian: 'Завещатель' },
      executor: { uzbek: 'Ijrochi', russian: 'Исполнитель' },
      bequests: { uzbek: 'Meros', russian: 'Наследство' },
      court: { uzbek: 'Sud', russian: 'Суд' },
      petitionType: { uzbek: 'Ariza turi', russian: 'Тип заявления' },
      petitioner: { uzbek: 'Arizachi', russian: 'Заявитель' },
      respondent: { uzbek: 'Javobgar', russian: 'Ответчик' },
      grounds: { uzbek: 'Asos', russian: 'Основания' },
    };
    return labels[key]?.[language as 'uzbek' | 'russian'] || key;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>{getTitle()}</Text>
        </View>

        <View style={styles.divider} />

        {Object.entries(formData).map(([key, value]) => (
          value && (
            <View key={key} style={styles.section}>
              <Text style={styles.label}>{getFieldLabel(key)}:</Text>
              <Text style={styles.text}>{value}</Text>
            </View>
          )
        ))}

        <View style={styles.divider} />

        <View style={styles.footer}>
          <Text>
            {language === 'uzbek'
              ? 'Jurix tomonidan yaratilgan - AI Huquqiy Hujjat Generatori'
              : 'Создано Jurix - AI генератор юридических документов'}
          </Text>
          <Text>
            {language === 'uzbek'
              ? `Yaratilgan sana: ${new Date().toLocaleDateString('uz-UZ')}`
              : `Дата создания: ${new Date().toLocaleDateString('ru-RU')}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
