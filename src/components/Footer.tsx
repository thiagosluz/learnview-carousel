import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 mt-8">
      <div className="container mx-auto text-center text-sm text-gray-600">
      <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} IFG Câmpus Jataí \ CINFO (Coordenação dos Cursos de Informática). Todos os direitos reservados.
          </p>
        <p>Desenvolvido por Th1!.Lx (Thiago Silva da Luz)</p>
      </div>
    </footer>
  );
};

export default Footer; 