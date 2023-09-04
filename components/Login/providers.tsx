import { signIn } from "next-auth/react";
import Google from "./google.svg";
import GoogleDark from "./google-dark.svg";
import Facebook from "./facebook.svg";
import FacebookDark from "./facebook-dark.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { StyleLogo, Providers } from "../../lib/types/providers";

// if more providers to be added just add it on nextauth api and page/auth/signin.tsx and on here
const styleProvider: { [key: string]: StyleLogo } = {
  facebook: {
    Provider: Facebook,
    ProviderDark: FacebookDark,
    text: "text-blue-500",
    textDark: "text-blue-200",
    bg: "bg-blue-500",
    bgDark: "bg-black",
  },
  google: {
    Provider: Google,
    ProviderDark: GoogleDark,
    text: "text-white",
    textDark: "text-white",
    bg: "bg-white",
    bgDark: "bg-[#4285F4]",
  },
};

// fix this page and trim down coding for conciseness
// i dont know if this truly typesafe recommend looking at this one more time
const LoginPage = ({ providers }: Providers) => {
  const { Provider, ProviderDark, text, textDark, bg, bgDark } =
    styleProvider[providers?.id as string];
  const router = useRouter();
  const { callbackUrl } = router.query;

  return (
    <div className="flex flex-row">
      {/* input provder and write logic if dark then ProviderDark */}
      {/* go back to homepage after successful signin */}
      <button
        onClick={() =>
          signIn(providers?.id as string, {
            callbackUrl: (callbackUrl ?? "http://localhost:3000") as string,
          })
        }
        // possible that 'my-4' has to be inside google
        className={`
            ${
              (providers?.id as string) === "google"
                ? "first-of-type:mt-7 border-slate-300"
                : null
            }
            ${
              (providers?.id as string) === "facebook"
                ? "bg-blue-500/70 mb-5 border-blue-200"
                : null
            }
            flex flex-row items-center my-3 h-11 w-full border-solid border-2 rounded-md shadow-sm focus:outline-none focus:shadow-md md:min-w-[310px]`}
      >
        <div className="mx-2 inline-flex">
          <Image
            src={Provider}
            alt={(providers?.name as string) + "log"}
            // this is google svg looks bigger with the same size
            width={Provider === "Google" ? "24" : "26"}
            height={Provider === "Google" ? "24" : "26"}
          />
        </div>
        <span
          className={`
              ${
                (providers?.id as string) === "google"
                  ? "tracking-wider pl-2 pr-7"
                  : null
              }
              ${
                (providers?.id as string) === "facebook"
                  ? "text-white tracking-wide py-2 pr-3"
                  : null
              }
              flex-1 text-center inline-block py-2 md:px-9`}
        >
          Continue with {providers?.name as string}
        </span>
      </button>
    </div>
  );
};

export default LoginPage;
