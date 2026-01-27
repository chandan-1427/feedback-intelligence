export type SignUpPayload = {
  username: string;
  email: string;
  password: string;
};

export type SignUpResponse =
  | { success: true; message?: string }
  | { success: false; message: string };
