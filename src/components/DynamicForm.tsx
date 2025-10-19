'use client';

import { ReactElement } from 'react';
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

    const baseInputClass = "w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all hover:border-indigo-300";

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="group">
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">
              {label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
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
          <div key={field.id} className="group">
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">
              {label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
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
          <div key={field.id} className="group">
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">
              {label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
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
          <div key={field.id} className="group">
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">
              {label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <select
              className={baseInputClass + " cursor-pointer"}
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
          <div key={field.id} className="group">
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">
              {label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <textarea
              className={baseInputClass + " resize-none"}
              placeholder={label}
              value={value as string}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              required={field.required}
              rows={3}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={field.id} className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-md border border-gray-200 hover:border-indigo-300 transition-all group">
            <input
              type="checkbox"
              id={field.id}
              className="w-4 h-4 rounded border-gray-400 bg-white text-indigo-600 focus:ring-2 focus:ring-indigo-400 cursor-pointer transition-all"
              checked={!!value}
              onChange={(e) => onFieldChange(field.id, e.target.checked)}
            />
            <label htmlFor={field.id} className="text-gray-700 font-semibold text-sm cursor-pointer">
              {label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  // Group fields into grid layouts where appropriate
  const renderFields = () => {
    const elements: (ReactElement | null)[] = [];

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
          <div key={`grid-${i}`} className="grid md:grid-cols-2 gap-3">
            {renderField(field)}
            {renderField(nextField)}
          </div>
        );
        i++; // Skip next field as we already rendered it
      } else {
        elements.push(renderField(field));
      }
    }

    return elements.filter((el): el is ReactElement => el !== null);
  };

  return (
    <div className="space-y-3">
      {renderFields()}
    </div>
  );
}
