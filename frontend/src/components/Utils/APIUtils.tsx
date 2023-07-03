export const ApiUrl = import.meta.env.VITE_FILE_SERVER_HOST;

export const ApiPath = (input: string | undefined) => (input ? `${ApiUrl}/${input}` : undefined);
