import * as yup from 'yup';

export const baseCredentialSchema = yup.object({
  nome: yup
    .string()
    .trim()
    .min(3, 'O nome da credencial deve ter no mínimo 3 caracteres.')
    .required('O nome da credencial é obrigatório.'),
  tipoServico: yup
    .string()
    .required('O tipo de serviço é obrigatório.'),
});

export const newCredentialSchema = yup.object({
  fornecedor: yup
    .string()
    .required('Selecione um fornecedor.'),
  nome: yup
    .string()
    .trim()
    .min(3, 'O nome da credencial deve ter no mínimo 3 caracteres.')
    .required('O nome da credencial é obrigatório.'),
  tipoServico: yup
    .string()
    .required('O tipo de serviço é obrigatório.'),
});

export async function validateCredentialForm(
  data: { nome: string; fornecedor?: string; tipoServico: string },
  parameters: Array<{ uuid: string; title?: string; name?: string; required?: boolean }>,
  paramValues: Record<string, string>,
  isEditing = false
): Promise<{ isValid: boolean; error?: string }> {
  try {
    const schema = isEditing ? baseCredentialSchema : newCredentialSchema;
    await schema.validate(data, { abortEarly: false });

    for (const param of parameters) {
      if (param.required) {
        const val = paramValues[param.uuid]?.trim();
        if (!val) {
          const label = param.title || param.name || 'Parâmetro obrigatório';
          return { isValid: false, error: `O campo "${label}" é obrigatório.` };
        }
      }
    }

    return { isValid: true };
  } catch (err: any) {
    if (err instanceof yup.ValidationError) {
      return { isValid: false, error: err.errors[0] };
    }
    return { isValid: false, error: 'Dados do formulário inválidos.' };
  }
}
