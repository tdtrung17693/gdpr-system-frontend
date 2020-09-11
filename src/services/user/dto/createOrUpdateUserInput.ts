export interface CreateOrUpdateUserInput {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  status: boolean;
  roleId: string;
  id: number;
}
