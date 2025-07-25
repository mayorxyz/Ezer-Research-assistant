import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1c1e]">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-800 border-gray-700 shadow-xl",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-gray-300",
              socialButtonsBlockButton: "border-gray-700 bg-gray-900 text-white hover:bg-gray-700",
              socialButtonsBlockButtonText: "text-white font-medium",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-900 border-gray-700 text-white",
              footerActionText: "text-gray-400",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
            },
          }}
          signUpUrl="/sign-up"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
