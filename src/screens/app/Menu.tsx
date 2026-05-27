import BottomNav from '../../components/BottomNav';
import MenuExplore from '../onboarding/MenuExplore';

export default function Menu() {
  return (
    <div className="max-w-md mx-auto">
      <MenuExplore browseOnly />
      <BottomNav />
    </div>
  );
}
