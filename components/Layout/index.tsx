import { FC, ReactNode } from "react";
import Head from "next/head";

const Layout: FC<{children: ReactNode | ReactNode[] }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>SomeWordsClub</title>
      </Head>
      <div className="bg-white p-1 max-w-4xl mx-auto md:p-[4rem]">
        {children}
      </div>
    </>
  )
};

export default Layout;
