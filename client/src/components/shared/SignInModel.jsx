import React from "react";
import { IoClose } from "react-icons/io5";
import mainWhiteLogo from "../../assets/main-icon-white.png"; // Adjust the path
import { useAuth } from "../../context/AuthContext";
import StepLogin from "../auth/StepLogin";
import StepRegister from "../auth/StepRegister";

const steps = {
  1: StepLogin,
  2: StepRegister,
};

const SignInModel = () => {
  const { step, setStep, showModal, toggleModal } = useAuth();

  const Step = steps[step];

  const onNext = () => {
    setStep(2); // Go to Register
  };

  const onPrev = () => {
    setStep(1); // Go to Login
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-xs">
      <div className="w-[90%] max-h-[95vh] h-auto max-w-xl bg-white rounded-3xl shadow-lg animate-fadeIn overflow-y-auto">
        {/* Top Header Section */}
        <div
          className="bg-gradient-to-r from-gray-800 to-[#f74565] text-white px-6
            py-8 h-[220px] relative items-center flex flex-col justify-center "
        >
          <IoClose onClick={() => toggleModal()} className="absolute top-4 right-4 text-4xl cursor-pointer" />
          <img
            src={mainWhiteLogo}
            alt="bookMovies"
            className="mx-auto h-24 mb-2"
          />
          <p className="text-md text-white -mt-2">Where movies meet magic.</p>
        </div>

        <div>
          <Step onNext={onNext} onPrev={onPrev} />
        </div>
      </div>
    </div>
  );
};

export default SignInModel;