
import { useState, useEffect } from 'react';
import ClassSchedule from '@/components/ClassSchedule';
import NewsCarousel from '@/components/NewsCarousel';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const mockClasses = [
  {
    startTime: '08:00',
    endTime: '10:00',
    professor: {
      name: 'Prof. Silva',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    subject: 'Programação Web',
    lab: 'Laboratório 01',
  },
  {
    startTime: '10:15',
    endTime: '12:15',
    professor: {
      name: 'Profa. Santos',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    subject: 'Banco de Dados',
    lab: 'Laboratório 02',
  },
  {
    startTime: '14:00',
    endTime: '16:00',
    professor: {
      name: 'Prof. Oliveira',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    subject: 'Redes de Computadores',
    lab: 'Laboratório 03',
  },
  {
    startTime: '16:15',
    endTime: '18:15',
    professor: {
      name: 'Profa. Lima',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    subject: 'Sistemas Operacionais',
    lab: 'Laboratório 01',
  },
  {
    startTime: '19:00',
    endTime: '21:00',
    professor: {
      name: 'Prof. Costa',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    subject: 'Inteligência Artificial',
    lab: 'Laboratório 02',
  },
  {
    startTime: '21:15',
    endTime: '23:15',
    professor: {
      name: 'Prof. Pereira',
      photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    subject: 'Segurança da Informação',
    lab: 'Laboratório 03',
  },
];

const mockNews = [
  {
    type: 'text' as const,
    title: 'Semana da Computação',
    content: 'Não perca a Semana da Computação do IFG Campus Jataí! Palestras, workshops e muito mais.',
    duration: 10,
  },
  {
    type: 'image' as const,
    content: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    title: 'Laboratórios Modernizados',
    duration: 8,
  },
  {
    type: 'text' as const,
    title: 'Processo Seletivo',
    content: 'Inscrições abertas para os cursos técnicos e superiores do IFG Campus Jataí.',
    duration: 10,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent p-8">
      <div className="max-w-[2100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
          <div className="lg:h-full flex flex-col">
            <NewsCarousel items={mockNews} />
          </div>
          <div className="lg:h-full flex flex-col">
            <ClassSchedule 
              classes={mockClasses}
              date={format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
