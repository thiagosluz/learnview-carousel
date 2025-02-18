
import { QRCodeSVG } from 'qrcode.react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface CoordinationLink {
  id: string;
  name: string;
  url: string;
}

const CoordinationInfo = () => {
  const { data: links } = useQuery({
    queryKey: ['coordination-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coordination_links')
        .select('*');
      
      if (error) throw error;
      return data as CoordinationLink[];
    },
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-4 mb-4">
      <div className="flex items-center gap-6">
        <Link to="/professors">
          <img
            src="https://tquredrvexziwipkonhn.supabase.co/storage/v1/object/public/images/nova_logo.png"
            alt="Logo Coordenação"
            className="w-24 h-24 rounded-full object-cover shadow-md hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
        <div className="flex-1 flex justify-around">
          {links?.map((link) => (
            <div key={link.id} className="flex flex-col items-center gap-2">
              <QRCodeSVG
                value={link.url}
                size={64}
                level="L"
                className="bg-white p-1 rounded-lg"
              />
              <span className="text-sm font-medium text-gray-600">{link.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordinationInfo;
