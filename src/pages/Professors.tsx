import React, { useEffect, useState } from 'react';
import { fetchProfessors } from '@/services';
import { Professor } from '@/types';
import { Link } from 'react-router-dom';
import NavMenu from '@/components/NavMenu';

const Professors: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProfessors().then((data) => {
      setProfessors(data);
      setLoading(false);
    });
  }, []);

  const filteredProfessors = professors.filter((professor) =>
    professor.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <NavMenu />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Professores</h1>
        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-2-2"/></svg>
            <input
              type="text"
              placeholder="Pesquisar professor por nome..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {filteredProfessors.map((professor) => (
            <div key={professor.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              {professor.photo_url ? (
                <img
                  src={professor.photo_url}
                  alt={professor.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-gray-500 text-3xl">
                    {professor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="text-lg font-semibold mb-2 text-center">{professor.name}</h2>
              <Link
                to={`/professores/${professor.id}`}
                className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition text-center w-full"
              >
                Ver detalhes
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Professors; 