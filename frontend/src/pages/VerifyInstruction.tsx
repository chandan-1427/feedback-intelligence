import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const VerifyInstruction = () => {
  return (
    <div className="min-h-screen bg-[#0D0E0E] text-white font-work flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center">
        
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-[#A855F7]/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-[#A855F7]" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-3">Check your email</h2>
        
        <p className="text-white/60 mb-8 leading-relaxed">
          We've sent a verification link to your email address. <br/>
          Please click the link to activate your account.
        </p>

        <div className="space-y-4">
          <Link 
            to="/signin"
            className="block w-full py-2.5 bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-lg font-medium transition-colors"
          >
            Go to Sign In
          </Link>
          
          <p className="text-xs text-white/30">
            Did not receive the email? Check your spam folder.
          </p>
        </div>

      </div>
    </div>
  );
};

export default VerifyInstruction;