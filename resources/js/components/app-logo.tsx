export default function AppLogo() {
    return (
        <>
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-md">
                {/* <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" /> */}
                <img src="/supply.jpg" alt="Supply Image" className="h-10 w-10 rounded-md" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">SSMI</span>
            </div>
        </>
    );
}
