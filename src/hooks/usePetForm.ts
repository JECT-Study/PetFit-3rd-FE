import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { PetForm } from '@/types/form';
import { validators } from '@/utils/validators';

type Errors = Partial<Record<keyof PetForm, string | null>>;

export const usePetForm = (form: PetForm, setForm: Dispatch<SetStateAction<PetForm>>) => {
  const [touched, setTouched] = useState<Partial<Record<keyof PetForm, boolean>>>({});

  const raw = useMemo(() => {
    const res = validators.petName(form.name);
    return { name: res.isValid ? null : res.message } as Errors;
  }, [form.name]);

  const errors: Errors = { name: touched.name ? raw.name : null };
  const isValid = !raw.name;

  const setField = <K extends keyof PetForm>(k: K, v: PetForm[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const onBlurField = (field: keyof PetForm) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return { errors, isValid, setField, onBlurField };
};
