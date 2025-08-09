import Link from "next/link";

export default function Header() {
    return (
        <nav className="w-full px-8">
            <div className="">
                <div className="flex justify-between items-center p-4 -mx-4 rounded-full">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex flex-row items-center gap-2 font-medium">
                            JetCalc
                        </Link>
                    </div>

                    {/* Nav + Right */}
                    <div className="flex flex-row items-center gap-8">
                        {/* Nav Links */}
                        <div className="hidden md:flex items-center space-x-8 text-sm">
                            <Link href="/" className="text-foreground/80 hover:text-foreground font-medium">
                                Calculator
                            </Link>
                            <Link href="/ops" className="text-foreground/80 hover:text-foreground font-medium">
                                Operations Optimizer
                            </Link>
                        </div>

                        {/* Right Buttons */}
                        <div className="flex items-center gap-2">
                            {/* GitHub Link */}
                            <a
                                className="hover:-translate-y-[1px] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-[0_1px_0_0,0_-1px_0_0] shadow-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-4 hidden md:flex"
                                href="https://github.com/george-garzon/jet-charter-calculator"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    />
                                </svg>
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
