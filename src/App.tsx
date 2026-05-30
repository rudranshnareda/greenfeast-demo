import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUserFromStorage } from './lib/storage';

import PhoneAuth from './screens/onboarding/PhoneAuth';
import MenuExplore from './screens/onboarding/MenuExplore';
import SubscriptionOptions from './screens/onboarding/SubscriptionOptions';
import PersonalInfo from './screens/onboarding/PersonalInfo';
import DietaryPrefs from './screens/onboarding/DietaryPrefs';
import AILoading from './screens/onboarding/AILoading';
import MealSelection from './screens/onboarding/MealSelection';
import PlanBuilder from './screens/onboarding/PlanBuilder';
import SelectDays from './screens/onboarding/SelectDays';
import WeeklyPlan from './screens/onboarding/WeeklyPlan';
import DeliveryAddress from './screens/onboarding/DeliveryAddress';
import PaymentSummary from './screens/onboarding/PaymentSummary';
import OrderPayment from './screens/onboarding/OrderPayment';

import Home from './screens/app/Home';
import MySubscription from './screens/app/MySubscription';
import Menu from './screens/app/Menu';
import Subscription from './screens/app/Subscription';
import Account from './screens/app/Account';

function App() {
  const user = getUserFromStorage();
  const onboarded = user?.onboarded === true;

  return (
    <BrowserRouter>
      <Routes>
        {!onboarded ? (
          <>
            <Route path="/" element={<PhoneAuth />} />
            <Route path="/menu-explore" element={<MenuExplore />} />
            <Route path="/subscription-options" element={<SubscriptionOptions />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/dietary" element={<DietaryPrefs />} />
            <Route path="/ai-loading" element={<AILoading />} />
            <Route path="/meal-selection" element={<MealSelection />} />
            <Route path="/plan" element={<PlanBuilder />} />
            <Route path="/select-days" element={<SelectDays />} />
            <Route path="/weekly-plan" element={<WeeklyPlan />} />
            <Route path="/address" element={<DeliveryAddress />} />
            <Route path="/review" element={<PaymentSummary />} />
            <Route path="/payment" element={<OrderPayment />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/subscription" element={<MySubscription />} />
            <Route path="/plan-details" element={<Subscription />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/account" element={<Account />} />
            {/* Subscription flow — also available to onboarded explore users */}
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/dietary" element={<DietaryPrefs />} />
            <Route path="/ai-loading" element={<AILoading />} />
            <Route path="/meal-selection" element={<MealSelection />} />
            <Route path="/plan" element={<PlanBuilder />} />
            <Route path="/select-days" element={<SelectDays />} />
            <Route path="/address" element={<DeliveryAddress />} />
            <Route path="/review" element={<PaymentSummary />} />
            <Route path="/payment" element={<OrderPayment />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
