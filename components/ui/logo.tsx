import Image from "next/image";

export function Logo() {
  return (
    <Image
      src={"/logo.png"}
      alt="logo"
      className="flex items-center rounded-[50%]"
      width={41}
      height={41}
    />
  );
}
