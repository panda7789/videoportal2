export const ApiUrl = process.env.FILE_SERVER_HOST;

export const ApiPath = (input: string | undefined) => (input ? `${ApiUrl}/${input}` : undefined);
