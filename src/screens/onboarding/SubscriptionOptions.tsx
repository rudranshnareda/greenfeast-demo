import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { saveUserToStorage } from '../../lib/storage';

export default function SubscriptionOptions() {
  const navigate = useNavigate();

  const handleExplore = () => {
    saveUserToStorage({ onboarded: true });
    window.location.replace('/');
  };

  return (
    <Layout title="What's next?" showBack>
      <div className="space-y-8 pb-32">
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/personal-info')}
            fullWidth
          >
            Build your subscription →
          </Button>
          <Button
            onClick={handleExplore}
            variant="secondary"
            fullWidth
          >
            Explore more
          </Button>
        </div>
      </div>
    </Layout>
  );
}
