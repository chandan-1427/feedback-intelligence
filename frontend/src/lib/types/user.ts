export type MeResponse =
  | {
      message: "Authorized";
      user: {
        userId: string;
        email: string;
        username: string;
        exp: number;
      };
    }
  | {
      message: string;
    };
