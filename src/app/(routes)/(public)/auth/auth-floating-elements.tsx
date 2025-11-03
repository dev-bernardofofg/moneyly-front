import { FloatingElements } from "@/app/(components)/(motions)/floating-elements";
import { DollarSign, Shield, Target, TrendingUp, User, Zap } from "lucide-react";

export const AuthFloatingElements = () => {
  return (
    <>
      {/* Canto superior esquerdo */}
      <FloatingElements
        className="top-8 left-4 sm:top-12 sm:left-12"
        Icon={DollarSign}
        size="lg"
        animation="float"
        opacity="medium"
        delay={0.2}
      />

      {/* Canto superior direito */}
      <FloatingElements
        className="top-12 right-4 sm:top-16 sm:right-16"
        Icon={TrendingUp}
        size="md"
        animation="pulse"
        opacity="subtle"
        delay={0.4}
      />

      {/* Centro esquerdo */}
      <FloatingElements
        className="top-1/2 -translate-y-1/2 left-0 sm:left-8"
        Icon={Target}
        size="sm"
        animation="float"
        opacity="subtle"
        delay={0.6}
      />

      {/* Centro direito */}
      <FloatingElements
        className="top-1/2 -translate-y-1/2 right-0 sm:right-8"
        Icon={Zap}
        size="md"
        animation="spin"
        opacity="medium"
        delay={0.8}
      />

      {/* Canto inferior esquerdo */}
      <FloatingElements
        className="bottom-12 left-4 sm:bottom-16 sm:left-16"
        Icon={Shield}
        size="sm"
        animation="bounce"
        opacity="subtle"
        delay={1}
      />

      {/* Canto inferior direito */}
      <FloatingElements
        className="bottom-8 right-4 sm:bottom-12 sm:right-12"
        Icon={User}
        size="lg"
        animation="float"
        opacity="medium"
        delay={1.2}
      />
    </>
  );
};

