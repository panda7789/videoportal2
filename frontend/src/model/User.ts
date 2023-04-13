export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  rights: Privileges[];
}

export enum Privileges {
  user,
  videoEditor,
  admin,
}
