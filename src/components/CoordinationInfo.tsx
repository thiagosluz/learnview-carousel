
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
            src="https://scontent.frec10-1.fna.fbcdn.net/v/t39.30808-6/469317382_505665579174481_5541984506667947629_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeH3UddZ5zzNq7TXOx8VZN56sgp7lNDTSUayCnuU0NNJRot-UmUaGYetQ3qNEyXverT3158ppEI0cNMFNO6cHk_L&_nc_ohc=43EFwFU8Qf4Q7kNvgGuuacY&_nc_zt=23&_nc_ht=scontent.frec10-1.fna&_nc_gid=An7C7M86beHmfHOGensTgG-&oh=00_AYBZFSmSVMYJzTbp1fGugVKxMMrhcyRcRDz80je_dG8P1w&oe=67B2D234"
            alt="Logo Coordenação"
            className="w-16 h-16 rounded-full object-cover shadow-md hover:opacity-80 transition-opacity cursor-pointer"
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
