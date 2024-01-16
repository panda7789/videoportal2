export const ApiUrl = `${import.meta.env.VITE_FS_URL}`;

export const ApiPath = (input: string | undefined) => (input ? `${ApiUrl}/${input}` : undefined);

export const NotPermittedGuid = '00000000-0000-0000-0000-000000000000';
