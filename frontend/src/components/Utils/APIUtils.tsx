export const ApiUrl = `${import.meta.env.VITE_FS_URL}`;

export const ApiPath = (input: string | undefined) => (input ? `${ApiUrl}/${input}` : undefined);
