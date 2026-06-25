import { Navbar } from "@/components/layout/Navbar";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Iniciar Sesión - Vzla Al Rescate",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-2">Iniciar Sesión</h1>
            <p className="text-center text-gray-600 mb-6">
              Ingresa tu correo para reportar desaparecidos
            </p>
            <LoginForm />
          </div>
        </div>
      </main>
    </>
  );
}
