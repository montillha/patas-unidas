import { PetCard } from './PetCard';
import './PetGrade.css';

export function PetGrade({ pets }) {
  return (
    <div className="pet-grade">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
