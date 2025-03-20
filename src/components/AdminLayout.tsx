import React from 'react';
import NavMenu from './NavMenu';
import Footer from './Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavMenu />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout; 