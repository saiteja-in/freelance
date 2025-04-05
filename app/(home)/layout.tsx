import { auth } from "@/auth";
import { currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/schemas";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import NavBar from "../_components/navbar";
import { Spinner } from "@/components/ui/spinner";





const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // get the user from the server
//   const user = (await currentUser()) as ExtendedUser;


  return (
    <html 
    suppressHydrationWarning={true}
    
    lang="en">
      <body>
        {/* <Suspense fallback={<Spinner />}>
          <NavBar
          /> */}

          {children}
        {/* </Suspense> */}
      </body>
    </html>
  );
};

export default HomeLayout;
