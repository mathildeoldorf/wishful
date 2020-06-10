import { useState, useEffect } from "react";

const FormHandler = (submitCallback, validate) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  // preventing eternal render of the useEffect hook
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setIsSubmitting(true);
    setErrors(validate(values));
    // submitCallback();
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      submitCallback();
    }
  }, [errors]);

  const handleChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    setErrors,
    setValues,
  };
};

export default FormHandler;
