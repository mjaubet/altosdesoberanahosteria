import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const contactSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(30, 'Máximo 30 caracteres').regex(/^[a-zA-Z\s]*$/, 'Solo se permiten letras'),
    email: z.string().email('Email inválido'),
    phone: z.string().regex(/^[0-9]*$/, 'Solo números').optional().or(z.literal('')),
    message: z.string().min(10, 'Mínimo 10 caracteres').max(999, 'Máximo 999 caracteres'),
});

type FormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
    const [isValid, setIsValid] = useState(false);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Validate on change
    useEffect(() => {
        const result = contactSchema.safeParse(formData);
        setIsValid(result.success);

        // realtime validation update for touched fields
        if (!result.success) {
            const newErrors: any = {};
            result.error.issues.forEach((issue) => {
                newErrors[issue.path[0]] = issue.message;
            });
            // Only show errors for touched fields? Or sync errors state. 
            // For "Disabled until valid", we need strict sync.
            // But we usually only show RED text if touched.
        } else {
            setErrors({});
        }
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate single field
        try {
            contactSchema.pick({ [name]: true } as any).parse({ [name]: formData[name as keyof FormData] });
            setErrors(prev => ({ ...prev, [name]: undefined }));
        } catch (err) {
            if (err instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, [name]: err.issues[0].message }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setStatus('submitting');

        try {
            const res = await fetch('/api/send-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Error al enviar');

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTouched({});
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full mx-auto bg-white shadow-sm lg:flex lg:flex-wrap lg:gap-3 lg:items-start lg:justify-between">
            <div className="space-y-1 lg:w-[48%]">
                <label htmlFor="name" className="block text-sm font-medium text-stone-700">Nombre Completo</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded-md focus:ring-1 focus:ring-patagonia-lake outline-none transition-colors ${errors.name && touched.name ? 'border-red-500' : 'border-stone-300'
                        }`}
                    placeholder="Su nombre"
                />
                {errors.name && touched.name && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>
                )}
            </div>

            <div className="space-y-1 lg:w-[48%] lg:!m-0">
                <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded-md focus:ring-1 focus:ring-patagonia-lake outline-none transition-colors ${errors.email && touched.email ? 'border-red-500' : 'border-stone-300'
                        }`}
                    placeholder="ejemplo@correo.com"
                />
                {errors.email && touched.email && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
                )}
            </div>

            <div className="space-y-1 lg:w-full">
                <label htmlFor="phone" className="block text-sm font-medium text-stone-700">Teléfono <span className="text-stone-400 font-normal">(Opcional)</span></label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded-md focus:ring-1 focus:ring-patagonia-lake outline-none transition-colors ${errors.phone && touched.phone ? 'border-red-500' : 'border-stone-300'
                        }`}
                    placeholder="Sólo números"
                />
                {errors.phone && touched.phone && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>
                )}
            </div>

            <div className="space-y-1 lg:w-full">
                <label htmlFor="message" className="block text-sm font-medium text-stone-700">Mensaje</label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded-md focus:ring-1 focus:ring-patagonia-lake outline-none transition-colors ${errors.message && touched.message ? 'border-red-500' : 'border-stone-300'
                        }`}
                    placeholder="Escriba su consulta aquí..."
                />
                <div className="flex justify-between items-start">
                    {errors.message && touched.message ? (
                        <p className="text-red-500 text-[11px] mt-1">{errors.message}</p>
                    ) : <span></span>}
                    <span className="text-[10px] text-stone-400">{formData.message.length}/999</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={!isValid || status === 'submitting' || status === 'success'}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-all duration-300
          ${isValid && status !== 'submitting' && status !== 'success'
                        ? 'bg-patagonia-lake hover:bg-opacity-90 shadow-md'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
            >
                {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                    </span>
                ) : status === 'success' ? (
                    '¡Mensaje Enviado!'
                ) : (
                    'Enviar Consulta'
                )}
            </button>

            {status === 'success' && (
                <p className="text-center text-green-600 text-sm mt-2">Gracias por contactarnos. Responderemos a la brevedad.</p>
            )}
            {status === 'error' && (
                <p className="text-center text-red-500 text-sm mt-2">Hubo un error al enviar. Por favor intente nuevamente.</p>
            )}
        </form>
    );
}
