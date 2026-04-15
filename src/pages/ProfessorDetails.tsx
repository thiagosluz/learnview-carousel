import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProfessor } from '@/services';
import { Professor } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProfessorDetails = () => {
  const { id } = useParams();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [disciplinas, setDisciplinas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prevId, setPrevId] = useState(id);

  if (id !== prevId) {
    setPrevId(id);
    setLoading(true);
    setProfessor(null);
    setDisciplinas([]);
    setError(null);
  }

  useEffect(() => {
    if (!id) return;

    fetchProfessor(id)
      .then((data) => {
        setProfessor(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Professor não encontrado.');
        setLoading(false);
      });

    // Buscar disciplinas ministradas
    supabase
      .from('classes')
      .select('subject')
      .eq('professor_id', id)
      .then(({ data, error }) => {
        if (!error && data) {
          // Remover duplicatas
          const uniqueSubjects = Array.from(new Set(data.map((c) => c.subject)));
          setDisciplinas(uniqueSubjects);
        }
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-4">
          <Link to="/professores" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
        <div className="text-center text-red-500 text-lg">{error || 'Professor não encontrado.'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center relative">
        <Link to="/professores" className="absolute left-6 top-6 text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" /> <span className="font-medium">Voltar</span>
        </Link>
        {professor.photo_url ? (
          <img
            src={professor.photo_url}
            alt={professor.name}
            className="w-36 h-36 rounded-full object-cover mb-4 border-4 border-primary shadow-lg mt-2"
          />
        ) : (
          <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center mb-4 border-4 border-primary shadow-lg mt-2">
            <span className="text-gray-500 text-5xl">
              {professor.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-1 text-primary text-center drop-shadow-sm">{professor.name}</h1>
        {professor.minicurriculo && (
          <div className="mb-6 mt-2 bg-blue-50 border-l-4 border-blue-400 px-6 py-4 rounded-xl text-gray-700 text-center w-full shadow-sm">
            <span className="block text-lg font-semibold text-blue-900 mb-1">Minicurrículo</span>
            <span className="whitespace-pre-line text-base">{professor.minicurriculo}</span>
          </div>
        )}
        {disciplinas.length > 0 && (
          <div className="w-full mt-2 bg-purple-50 border-l-4 border-purple-400 px-6 py-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-purple-900">Disciplinas Ministradas</h2>
            <ul className="list-disc list-inside text-gray-700">
              {disciplinas.map((disciplina, idx) => (
                <li key={idx}>{disciplina}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorDetails; 