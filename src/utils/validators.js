export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const matriculeRegex = /^ENSPD\d{7}$/;
export const phoneRegex = /^(\+237)?[26][0-9]{8}$/;

export const validateEmail = (email) => {
  return emailRegex.test(email);
};

export const validateMatricule = (matricule) => {
  return matriculeRegex.test(matricule);
};

export const validatePhone = (phone) => {
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber,
    errors: {
      minLength: !minLength ? 'Minimum 8 caractères' : null,
      hasUppercase: !hasUppercase ? 'Au moins une majuscule' : null,
      hasLowercase: !hasLowercase ? 'Au moins une minuscule' : null,
      hasNumber: !hasNumber ? 'Au moins un chiffre' : null,
    }
  };
};