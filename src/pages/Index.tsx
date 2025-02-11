
import { useState, useEffect } from 'react';
import ClassSchedule from '@/components/ClassSchedule';
import NewsCarousel from '@/components/NewsCarousel';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[2100px] mx-auto space-y-8">
        <NewsCarousel items={mockNews} />
        <ClassSchedule classes={mockClasses} />
      </div>
    </div>
  );
};

export default Index;
