import { useState } from 'react';

const useSubmitClassification = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitClassification = async (files: string[], classifications: string[]) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('http://<ip address>:58000/api/users/model-improve/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ audio_file: files, classification: classifications })
            });

            if (!response.ok) {
                throw new Error('Failed to submit classification.');
            }

            alert("모델 개선이 완료되었습니다!");
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submitClassification, isSubmitting, error };
};

export default useSubmitClassification;
