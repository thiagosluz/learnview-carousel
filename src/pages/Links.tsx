import React from 'react';

const Links: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        {/* Links content */}
      </div>
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto py-4 px-4">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} IFG Câmpus Jataí \ CINFO (Coordenação dos Cursos de Informática). Todos os direitos reservados.
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Desenvolvido por Th1!.Lx (Thiago Silva da Luz)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Links; 