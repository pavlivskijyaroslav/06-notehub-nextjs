import css from '@/components/NoteForm/NoteForm.module.css';

import * as Yup from 'yup';

import { useId } from 'react';
import { ErrorMessage, Formik, Form, Field, type FormikHelpers } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type NoteFormValues } from '@/lib/api';

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: '',
};

interface NoteFormProps {
  onCancel: () => void;
}

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),

  content: Yup.string().max(500, 'Content must be at most 500 characters'),

  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

function NoteForm({ onCancel }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      onCancel();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });

  const handleSubmit = async (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>,
  ) => {
    console.log('Submitting values:', values);
    await mutation.mutateAsync(values);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}title`}>Title</label>
          <Field
            id={`${fieldId}title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title">
            {(msg) => <span className={css.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content">
            {(msg) => <span className={css.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}tag`}
            name="tag"
            className={css.select}
          >
            <option value=""></option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag">
            {(msg) => <span className={css.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default NoteForm;
