import Logo from "@/components/logo";
import LoginButton from "./login-button";

export default function Login() {
    return (
        <div className="w-full h-1/2 md:w-1/2 md:h-full flex items-center justify-center flex-col p-3">
            <Logo className="w-10 h-10 text-foreground" />
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <LoginButton />
        </div>
    )
}
