'use client';

import React from 'react';
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

    const baseInputClass = "w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500";

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id}>
            <label className="block text-gray-900 font-bold mb-2 text-base">
              {label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
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
            <label className="block text-gray-900 font-bold mb-2 text-base">
              {label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
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
            <label className="block text-gray-900 font-bold mb-2 text-base">
              {label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
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
            <label className="block text-gray-900 font-bold mb-2 text-base">
              {label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
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
            <label className="block text-gray-900 font-bold mb-2 text-base">
              {label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
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
          <div key={field.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
            <input
              type="checkbox"
              id={field.id}
              className="w-6 h-6 rounded border-gray-400 bg-white text-purple-600 focus:ring-2 focus:ring-purple-500"
              checked={!!value}
              onChange={(e) => onFieldChange(field.id, e.target.checked)}
            />
            <label htmlFor={field.id} className="text-gray-900 font-bold text-base">
              {label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  // Group fields into grid layouts where appropriate
  const renderFields = () => {
    const elements: (React.JSX.Element | null)[] = [];

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
