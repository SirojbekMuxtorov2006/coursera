import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-violet-600 to-indigo-700 p-12 flex-col justify-between">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-[100px]" />
          <div className="absolute bottom-20 right-20 h-[200px] w-[200px] rounded-full bg-white/10 blur-[80px]" />
        </div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Coursa</span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white/90 text-lg leading-relaxed">
            &ldquo;Coursa changed my life. I went from zero coding knowledge to
            landing my dream job as a software engineer in just 8 months.&rdquo;
          </blockquote>
          <div className="mt-4">
            <p className="text-white font-medium">Sarah Chen</p>
            <p className="text-white/70 text-sm">
              Software Engineer at Google
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
