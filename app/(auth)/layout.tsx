export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,229,160,0.07)_0%,transparent_70%)] -top-24 -left-24 animate-pulse-slow pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,144,255,0.05)_0%,transparent_70%)] -bottom-12 -right-12 animate-pulse-slow [animation-delay:2s] pointer-events-none" />
      <div className="relative z-10 w-full px-4">{children}</div>
    </div>
  );
}
