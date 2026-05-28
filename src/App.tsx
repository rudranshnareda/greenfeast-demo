import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getUserFromStorage } from './lib/storage';

import PhoneAuth from './screens/onboarding/PhoneAuth';
import MenuExplore from './screens/onboarding/MenuExplore';
import PlanBuilder from './screens/onboarding/PlanBuilder';
import SelectDays from './screens/onboarding/SelectDays';
import WeeklyPlan from './screens/onboarding/WeeklyPlan';
import DietaryProfile from './screens/onboarding/DietaryProfile';
import DeliveryAddress from './screens/onboarding/DeliveryAddress';
import PaymentSummary from './screens/onboarding/PaymentSummary';

import Home from './screens/app/Home';
import Menu from './screens/app/Menu';
import Subscription from './screens/app/Subscription';
import Account from './screens/app/Account';

function AnimatedRoutes() {
  const location = useLocation();
  const user = getUserFromStorage();
  const onboarded = user?.onboarded === true;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!onboarded ? (
          <>
            <Route path="/" element={<PhoneAuth />} />
            <Route path="/menu-explore" element={<MenuExplore />} />
            <Route path="/plan" element={<PlanBuilder />} />
            <Route path="/select-days" element={<SelectDays />} />
            <Route path="/weekly-plan" element={<WeeklyPlan />} />
            <Route path="/dietary" element={<DietaryProfile />} />
            <Route path="/address" element={<DeliveryAddress />} />
            <Route path="/payment" element={<PaymentSummary />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="grain-global">
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
