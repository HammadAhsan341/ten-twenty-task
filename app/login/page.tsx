import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Login form (white background) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12 bg-white min-h-screen lg:min-h-0">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <span className="text-3xl font-bold text-primary">ticktock</span>
          </div>

          <h2 className="text-lg font-bold text-foreground mb-6">
            Welcome back
          </h2>

          <LoginForm />
        </div>
      </div>

      {/* Right side - Blue branded panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4169E1] flex-col justify-center px-12 xl:px-16">
        <div className="max-w-xl">
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6">
            ticktock
          </h1>
          <p className="text-base xl:text-lg text-white/90 leading-relaxed">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}
