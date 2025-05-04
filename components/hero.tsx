export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="txt-5xl lg:text-6xl font-bold">Job Seeker</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Looking for work is miserable.<br></br>It helps to stay organized.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
