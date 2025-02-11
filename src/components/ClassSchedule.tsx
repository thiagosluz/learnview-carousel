
import { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';

interface Professor {
  name: string;
  photoUrl: string;
}

interface Class {
  startTime: string;
  endTime: string;
  professor: Professor;
  subject: string;
  lab: string;
}

interface ClassScheduleProps {
  classes: Class[];
}

const ClassSchedule = ({ classes }: ClassScheduleProps) => {
  const [currentClass, setCurrentClass] = useState<number | null>(null);

  useEffect(() => {
    const getCurrentClass = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const currentIndex = classes.findIndex((classItem) => {
        return currentTime >= classItem.startTime && currentTime <= classItem.endTime;
      });

      setCurrentClass(currentIndex);
    };

    getCurrentClass();
    const interval = setInterval(getCurrentClass, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [classes]);

  return (
    <div className="w-full p-8 bg-white rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-4xl font-display font-bold text-gray-900 mb-8">Horários de Hoje</h2>
      <div className="space-y-6">
        {classes.map((classItem, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl transition-all duration-300 ${
              currentClass === index
                ? 'bg-primary text-white scale-[1.02] shadow-lg'
                : 'bg-secondary/10 hover:bg-secondary/20'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <img
                  src={classItem.professor.photoUrl}
                  alt={classItem.professor.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                  <Clock className="w-5 h-5" />
                  {classItem.startTime} - {classItem.endTime}
                </div>
                <h3 className="text-xl font-bold mb-1">{classItem.subject}</h3>
                <div className="flex items-center gap-4">
                  <p className="text-lg">{classItem.professor.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    {classItem.lab}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
