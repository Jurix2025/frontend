'use client';

import { TemplateField } from '@/lib/templateLoader';

interface DynamicFormProps {
  fields: TemplateField[];
  language: 'uzbek' | 'russian';
  formData: Record<string, string | boolean>;
  onFieldChange: (fieldId: string, value: string | boolean) => void;
}

export function DynamicForm({ fields, language, formData, onFieldChange }: DynamicFormProps) {
  const renderField = (field: TemplateField) => {
    const label = field.label[language];
    const value = formData[field.id] || '';

    const baseInputClass = "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500";

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id}>
            <label className="block text-white font-semibold mb-2">
              {label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
              type="text"
              className={baseInputClass}
              placeholder={label}
              value={value as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              required={field.required}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
              pattern={field.validation?.pattern}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.id}>
            <label className="block text-white font-semibold mb-2">
              {label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
              type="number"
              className={baseInputClass}
              placeholder={label}
              value={value as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              required={field.required}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.id}>
            <label className="block text-white font-semibold mb-2">
              {label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
              type="date"
              className={baseInputClass}
              value={value as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id}>
            <label className="block text-white font-semibold mb-2">
              {label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <select
              className={baseInputClass}
              value={value as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              required={field.required}
            >
              <option value="">{language === 'uzbek' ? 'Tanlang...' : 'Выберите...'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[language]}
                </option>
              ))}
            </select>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id}>
            <label className="block text-white font-semibold mb-2">
              {label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <textarea
              className={baseInputClass}
              placeholder={label}
              value={value as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              required={field.required}
              rows={4}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={field.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              id={field.id}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-2 focus:ring-purple-500"
              checked={!!value}
              onChange={(e) => onFieldChange(field.id, e.target.checked)}
            />
            <label htmlFor={field.id} className="text-white font-semibold">
              {label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  // Group fields into grid layouts where appropriate
  const renderFields = () => {
    const elements: JSX.Element[] = [];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const nextField = fields[i + 1];

      // Check if we can group the current field with the next one in a grid
      if (
        nextField &&
        (field.type === 'text' || field.type === 'number' || field.type === 'date') &&
        (nextField.type === 'text' || nextField.type === 'number' || nextField.type === 'date')
      ) {
        elements.push(
          <div key={`grid-${i}`} className="grid md:grid-cols-2 gap-6">
            {renderField(field)}
            {renderField(nextField)}
          </div>
        );
        i++; // Skip next field as we already rendered it
      } else {
        elements.push(renderField(field));
      }
    }

    return elements;
  };

  return (
    <div className="space-y-6">
      {renderFields()}
    </div>
  );
}
