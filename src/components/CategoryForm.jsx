import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createCategory } from '../services/eventService';
import Button from './common/Button';
import Alert from './common/Alert';
import FormInput from './common/FormInput';

const CategoryForm = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [categoryData, setCategoryData] = useState({
        name: '',
        translations: {
            en: { name: '' },
            ar: { name: '' },
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('en.')) {
            setCategoryData(prev => ({
                ...prev,
                translations: {
                    ...prev.translations,
                    en: { ...prev.translations.en, name: value },
                },
            }));
        } else if (name.startsWith('ar.')) {
            setCategoryData(prev => ({
                ...prev,
                translations: {
                    ...prev.translations,
                    ar: { ...prev.translations.ar, name: value },
                },
            }));
        } else {
            setCategoryData(prev => ({ ...prev, name: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await createCategory(categoryData);
            setSuccess(t('admin.categories.create_success')); // Add this translation key
            setTimeout(() => {
                navigate('/admin/events'); // Redirect back to events list after success
            }, 1500);
        } catch (error) {
            console.error('Error creating category:', error);
            setError(error.response?.data?.message || t('admin.categories.create_error')); // Add this translation key
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">{t('admin.categories.add_new_category')}</h1>

            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                <FormInput
                    label={t('admin.categories.default_name')} // Add this translation key
                    name="name"
                    value={categoryData.name}
                    onChange={handleChange}
                    required
                />

                <h2 className="text-xl font-semibold mt-4">{t('admin.categories.translations')}</h2> {/* Add this translation key */}

                <FormInput
                    label={t('admin.categories.english_name')} // Add this translation key
                    name="en.name"
                    value={categoryData.translations.en.name}
                    onChange={handleChange}
                    required
                />

                <FormInput
                    label={t('admin.categories.arabic_name')} // Add this translation key
                    name="ar.name"
                    value={categoryData.translations.ar.name}
                    onChange={handleChange}
                    required
                />

                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/admin/events')}
                        disabled={submitting}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        loading={submitting}
                    >
                        {t('common.create')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;