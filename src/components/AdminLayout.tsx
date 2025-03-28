import { ReactNode } from "react";
import NavMenu from "./NavMenu";
import Footer from './Footer';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavMenu />
      <div className="grow">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout; 