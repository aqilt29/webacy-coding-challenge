import { FC, ReactNode } from "react";

const Layout: FC<{children: ReactNode | ReactNode[] }> = ({ children }) => {
  return (
    <div className="w-screen h-screen bg-white">
      {children}
    </div>
  )
};

export default Layout;
