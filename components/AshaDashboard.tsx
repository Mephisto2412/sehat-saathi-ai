import React, { useState } from 'react';
import { AshaPatient, ExtractedHealthData } from '../types';

interface Props {
  currentUser: AshaPatient;
  otherPatients: AshaPatient[];
  onBack: () => void;
}

const AshaDashboard: React.FC<Props> = ({ currentUser, otherPatients, onBack }) => {
  const [view, setView] = useState<'alerts' | 'list' | 'detail'>('alerts');
  const [selectedPatient, setSelectedPatient] = useState<AshaPatient | null>(null);

  const allPatients = [currentUser, ...otherPatients];
  
  // Risk Filtering
  const criticalPatients = allPatients.filter(p => p.risk_level === 'critical');
  const moderatePatients = allPatients.filter(p => p.risk_level === 'moderate');

  const handlePatientClick = (patient: AshaPatient) => {
    setSelectedPatient(patient);
    setView('detail');
  };

  // Helper to determine Postpartum Status vs Pregnancy
  // Requirement: "42-day postpartum tracking"
  const renderWeekStatus = (weeks: number) => {
    if (weeks > 40) {
      const daysPost = (weeks - 40) * 7;
      return (
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold border border-purple-200">
           Postpartum: Day {daysPost}
        </span>
      );
    }
    return (
      <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
         Week {weeks} (ANC)
      </span>
    );
  };

  const renderAlerts = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Critical Alerts Card */}
        <div className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
          <h3 className="text-red-700 font-bold flex items-center mb-3">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            CRITICAL RISKS ({criticalPatients.length})
          </h3>
          <div className="space-y-3">
            {criticalPatients.length === 0 && <p className="text-sm text-slate-400">No critical alerts.</p>}
            {criticalPatients.map(p => (
              <div key={p.id} className="bg-red-50 p-3 rounded border border-red-100 cursor-pointer hover:bg-red-100 transition" onClick={() => handlePatientClick(p)}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-800 block">{p.name}</span>
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                       {/* Specific Risk Display */}
                       {p.timeline[0]?.suspected_conditions?.[0] || 'High Risk'}
                    </span>
                  </div>
                  {renderWeekStatus(p.weeks_pregnant)}
                </div>
                <p className="text-xs text-red-700 mt-2 line-clamp-2">{p.timeline[0]?.summary || "Urgent attention needed"}</p>
                <div className="mt-2 flex gap-2">
                  <button className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 shadow-sm">Call Now</button>
                  <button className="bg-white border border-red-200 text-red-700 text-xs px-3 py-1 rounded hover:bg-red-50">Arrange 108</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moderate Alerts Card */}
        <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500 shadow-sm">
          <h3 className="text-yellow-700 font-bold flex items-center mb-3">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            MODERATE WATCHLIST ({moderatePatients.length})
          </h3>
          <div className="space-y-3">
             {moderatePatients.length === 0 && <p className="text-sm text-slate-400">No moderate alerts.</p>}
             {moderatePatients.map(p => (
              <div key={p.id} className="bg-yellow-50 p-3 rounded border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition" onClick={() => handlePatientClick(p)}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-800 block">{p.name}</span>
                    <span className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider">
                      {p.timeline[0]?.suspected_conditions?.[0] || 'Check Vitals'}
                    </span>
                  </div>
                  {renderWeekStatus(p.weeks_pregnant)}
                </div>
                <p className="text-xs text-yellow-800 mt-2 line-clamp-2">{p.timeline[0]?.summary || "Requires monitoring"}</p>
                <div className="mt-2">
                   <button className="text-yellow-700 text-xs underline decoration-yellow-400 font-medium">Review History &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientList = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-in fade-in">
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Stage</th>
            <th className="px-6 py-3">Risk Category</th>
            <th className="px-6 py-3">Last Vitals</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {allPatients.map(p => (
            <tr key={p.id} className="bg-white border-b hover:bg-slate-50 transition">
              <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
              <td className="px-6 py-4">{renderWeekStatus(p.weeks_pregnant)}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                  ${p.risk_level === 'critical' ? 'bg-red-100 text-red-700' : 
                    p.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {p.risk_level}
                </span>
              </td>
              <td className="px-6 py-4">{p.timeline[0]?.vitals?.blood_pressure || 'Not Recorded'}</td>
              <td className="px-6 py-4">
                <button onClick={() => handlePatientClick(p)} className="text-teal-600 hover:text-teal-800 font-medium">View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPatientDetail = () => {
    if (!selectedPatient) return null;
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-100">
           <div>
             <h2 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h2>
             <div className="flex items-center gap-2 mt-1">
                {renderWeekStatus(selectedPatient.weeks_pregnant)}
                <span className="text-slate-400 text-sm">• {selectedPatient.location}</span>
             </div>
           </div>
           <div className="flex gap-3">
             <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm shadow-sm transition">Call Patient</button>
             <button onClick={() => setView('list')} className="text-slate-500 hover:bg-slate-100 px-4 py-2 rounded text-sm transition">Close</button>
           </div>
        </div>

        {/* Timeline Feed */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex justify-between items-center">
             <span>Clinical Timeline</span>
             <span className="text-xs font-normal text-slate-400">Synced from Sehat Saathi AI</span>
          </h3>
          
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
            {selectedPatient.timeline.length === 0 && (
                <p className="ml-6 text-slate-400 italic">No recent health updates recorded.</p>
            )}
            {selectedPatient.timeline.map((entry, idx) => (
              <div key={idx} className="ml-6 relative">
                {/* Dot */}
                <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm
                  ${entry.action_needed === 'critical' ? 'bg-red-500' : 
                    entry.action_needed === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                </span>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-400 font-mono">
                        {entry.symptoms[0]?.timestamp ? new Date(entry.symptoms[0].timestamp).toLocaleString() : 'Just now'}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded 
                       ${entry.action_needed === 'critical' ? 'bg-red-100 text-red-700' : 
                         entry.action_needed === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {entry.action_needed} Priority
                    </span>
                  </div>
                  
                  <p className="text-slate-800 font-medium mb-3">{entry.summary}</p>
                  
                  {/* Suspected Condition Badge */}
                  {entry.suspected_conditions && entry.suspected_conditions.length > 0 && (
                      <div className="mb-3">
                          {entry.suspected_conditions.map((cond, i) => (
                              <span key={i} className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded mr-1">
                                  {cond}
                              </span>
                          ))}
                      </div>
                  )}

                  {/* Detailed Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {entry.symptoms.length > 0 && (
                      <div className="bg-white p-3 rounded border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Symptoms</h4>
                        <ul className="space-y-1">
                          {entry.symptoms.map((s, i) => (
                            <li key={i} className="flex justify-between text-slate-700">
                               <span>{s.symptom}</span>
                               <span className="text-xs text-slate-400">{s.severity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Vitals Section */}
                    {entry.vitals && Object.keys(entry.vitals).length > 0 && (
                         <div className="bg-white p-3 rounded border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Vitals Captured</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {entry.vitals.blood_pressure && (
                                    <div className="bg-slate-50 p-1.5 rounded text-center">
                                        <div className="text-[10px] text-slate-400">BP</div>
                                        <div className={`font-mono font-bold ${parseInt(entry.vitals.blood_pressure.split('/')[0]) > 140 ? 'text-red-600' : 'text-slate-700'}`}>
                                            {entry.vitals.blood_pressure}
                                        </div>
                                    </div>
                                )}
                                {entry.vitals.fetal_movement && (
                                    <div className="bg-slate-50 p-1.5 rounded text-center">
                                        <div className="text-[10px] text-slate-400">Fetal Move</div>
                                        <div className="font-bold text-slate-700 text-xs">
                                            {entry.vitals.fetal_movement}
                                        </div>
                                    </div>
                                )}
                            </div>
                         </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* Sehat Saathi ASHA Header */}
      <header className="bg-teal-700 text-white p-4 shadow-md flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
             <span className="text-xl font-bold">SS</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">Sehat Saathi ASHA</h1>
            <p className="text-xs text-teal-200">Zone: Village Sector 1-4 • Worker: Sunita</p>
          </div>
        </div>
        <button onClick={onBack} className="bg-teal-800 hover:bg-teal-900 px-4 py-2 rounded text-sm transition border border-teal-600 shadow-sm">
           &larr; Back to App
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col p-4 space-y-1">
          <button 
            onClick={() => setView('alerts')}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${view === 'alerts' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <span className="mr-3">🚨</span> Alerts Dashboard
          </button>
          <button 
            onClick={() => setView('list')}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${view === 'list' || view === 'detail' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <span className="mr-3">👥</span> My Patients
          </button>
          
          <div className="mt-auto pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Sehat Saathi Metrics</p>
            <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                   <span>Active Pregnancies</span>
                   <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                   <span>Postpartum (42d)</span>
                   <span className="font-bold text-purple-600">2</span>
                </div>
                 <div className="flex justify-between text-xs text-slate-600">
                   <span>High Risk</span>
                   <span className="font-bold text-red-500">3</span>
                </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {view === 'alerts' && renderAlerts()}
          {view === 'list' && renderPatientList()}
          {view === 'detail' && renderPatientDetail()}
        </main>
      </div>
    </div>
  );
};

export default AshaDashboard;