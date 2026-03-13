// Generic wrapper for Server Action responses
export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
};

// Generic App Error
export class AppError extends Error {
  constructor(public message: string, public code?: string) {
    super(message);
    this.name = "AppError";
  }
}
