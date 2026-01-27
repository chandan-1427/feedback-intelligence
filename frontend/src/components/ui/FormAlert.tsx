import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

type FormAlertProps = {
  type: "error" | "success";
  message: string;
};

const FormAlert: React.FC<FormAlertProps> = ({ type, message }) => {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={`
        p-4 rounded-xl text-sm font-medium flex items-start gap-3
        animate-in slide-in-from-top
        ${isError
          ? "bg-red-500/10 border border-red-500/30 text-red-300"
          : "bg-green-500/10 border border-green-500/30 text-green-300"}
      `}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      )}
      <div>{message}</div>
    </div>
  );
};

export default FormAlert;
