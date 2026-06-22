import { useState } from 'react';
import Layout from '../components/Layout';
import HomeTab       from '../components/tabs/HomeTab';
import RosterTab     from '../components/tabs/RosterTab';
import SCTab         from '../components/tabs/SCTab';
import PerformanceTab from '../components/tabs/PerformanceTab';
import CoachingTab   from '../components/tabs/CoachingTab';
import ReportsTab    from '../components/tabs/ReportsTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = {
    home:    <HomeTab onNavigate={setActiveTab} />,
    roster:  <RosterTab />,
    sc:      <SCTab />,
    perf:    <PerformanceTab />,
    coach:   <CoachingTab />,
    reports: <ReportsTab />,
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {tabs[activeTab]}
    </Layout>
  );
}
