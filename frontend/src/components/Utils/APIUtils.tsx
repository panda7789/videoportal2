export const ApiUrl = 'http://localhost:3000';

export const ApiPath = (input: string | undefined) => (input ? `${ApiUrl}/${input}` : undefined);
