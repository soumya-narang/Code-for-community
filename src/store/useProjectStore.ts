import { create } from 'zustand';

export type Category = 'Education' | 'Health' | 'Roads' | 'Water' | 'Electricity' | 'Sanitation' | 'Other' | 'All';
export type Status = 'Prioritized' | 'In Review' | 'Deferred' | 'Approved for Funding';

export interface Submission {
  id: string;
  text: string;
  timestamp: string;
  language?: string;
}

export interface Signal {
  label: string;
  value: number;
  color: string;
}

export interface Project {
  id: string;
  theme: string;
  ward: string;
  category: Category;
  score: number;
  submissionCount: number;
  justification: string;
  signals: Signal[];
  submissions: Submission[];
  status: Status;
  statusJustification?: string;
  lastUpdated: string;
}

interface ProjectStore {
  projects: Project[];
  fetchProjects: () => Promise<void>;
  updateStatus: (id: string, status: Status, justification: string) => void;
  addSubmission: (projectId: string, text: string, language?: string) => void;
}

const seedProjects: Project[] = [
  {
    id: 'p1',
    theme: 'Vocational Centre Access',
    ward: 'Ward 6',
    category: 'Education',
    score: 87,
    submissionCount: 12,
    justification: 'Ranked #1 because travel-distance data shows 3× the population is underserved, despite fewer raw complaints than the school upgrade request.',
    status: 'Prioritized',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    signals: [
      { label: "Citizen complaint volume", value: 30, color: "bg-slate" },
      { label: "Urgency / sentiment", value: 15, color: "bg-slate" },
      { label: "Demand-gap (public data)", value: 35, color: "bg-signal" },
      { label: "Recency / trend", value: 20, color: "bg-slate" },
    ],
    submissions: [
      { id: 's1', text: 'Youth in Ward 6 have to travel 12km for skill training. We need a center here.', timestamp: '2 days ago' },
      { id: 's2', text: 'Mera beta skill center jane ke liye roz 2 ghante bus mein bitata hai.', timestamp: '4 days ago', language: 'Hindi' }
    ]
  },
  {
    id: 'p2',
    theme: 'Arterial Road Potholes',
    ward: 'Ward 2',
    category: 'Roads',
    score: 82,
    submissionCount: 34,
    justification: 'High volume and high urgency. Traffic data confirms a 40% drop in speed due to severe degradation.',
    status: 'In Review',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    signals: [
      { label: "Citizen complaint volume", value: 75, color: "bg-signal" },
      { label: "Urgency / sentiment", value: 90, color: "bg-signal" },
      { label: "Demand-gap (public data)", value: 50, color: "bg-slate" },
      { label: "Recency / trend", value: 85, color: "bg-signal" },
    ],
    submissions: [
      { id: 's6', text: 'Multiple accidents happened this week due to huge craters on main road.', timestamp: '1 day ago' },
      { id: 's7', text: 'Auto rickshaws refuse to come here because of the road condition.', timestamp: '2 days ago' }
    ]
  },
  {
    id: 'p3',
    theme: 'Clean Drinking Water Pipe Replacement',
    ward: 'Ward 9',
    category: 'Water',
    score: 78,
    submissionCount: 12,
    justification: 'Severe health risk indicated by sentiment analysis, corroborated by municipal pipe age data (over 40 years old).',
    status: 'In Review',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    signals: [
      { label: "Citizen complaint volume", value: 20, color: "bg-slate" },
      { label: "Urgency / sentiment", value: 95, color: "bg-signal" },
      { label: "Demand-gap (public data)", value: 80, color: "bg-signal" },
      { label: "Recency / trend", value: 40, color: "bg-slate" },
    ],
    submissions: [
      { id: 's8', text: 'Water is coming out yellow and smells bad. Children are falling sick.', timestamp: '1 month ago' }
    ]
  },
  {
    id: 'p4',
    theme: 'Primary Health Clinic Staffing',
    ward: 'Ward 1',
    category: 'Health',
    score: 72,
    submissionCount: 3,
    justification: 'Only 3 complaints, but demographic data shows 15,000 residents rely on a clinic currently operating with 1 doctor.',
    status: 'In Review',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    signals: [
      { label: "Citizen complaint volume", value: 5, color: "bg-slate" },
      { label: "Urgency / sentiment", value: 60, color: "bg-slate" },
      { label: "Demand-gap (public data)", value: 90, color: "bg-signal" },
      { label: "Recency / trend", value: 10, color: "bg-slate" },
    ],
    submissions: [
      { id: 's9', text: 'Stood in line for 6 hours, doctor was not available.', timestamp: '5 days ago' }
    ]
  },
  {
    id: 'p5',
    theme: 'School Upgrade',
    ward: 'Ward 6',
    category: 'Education',
    score: 64,
    submissionCount: 50,
    justification: 'High volume of complaints, but capacity utilization data shows the existing school is only at 70% capacity.',
    status: 'Deferred',
    statusJustification: 'Deferred due to lower accessibility gap compared to vocational center.',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    signals: [
      { label: "Citizen complaint volume", value: 85, color: "bg-signal" },
      { label: "Urgency / sentiment", value: 40, color: "bg-slate" },
      { label: "Demand-gap (public data)", value: 10, color: "bg-slate" },
      { label: "Recency / trend", value: 30, color: "bg-slate" },
    ],
    submissions: [
      { id: 's3', text: 'The school building needs a new coat of paint and more benches.', timestamp: '1 day ago' },
      { id: 's4', text: 'We need more facilities in the school. 50 parents signed this.', timestamp: '3 days ago' }
    ]
  }
];

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: seedProjects, // Keep seed as initial or fallback
  fetchProjects: async () => {
    try {
      const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
      const res = await fetch(`${API_BASE}/api/themes`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          set({ projects: data });
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  },
  updateStatus: (id, status, justification) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id 
        ? { ...p, status, statusJustification: justification, lastUpdated: new Date().toISOString() } 
        : p
    )
  })),
  addSubmission: (projectId, text, language) => set((state) => ({
    projects: state.projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            submissionCount: p.submissionCount + 1,
            lastUpdated: new Date().toISOString(),
            submissions: [
              { id: `s-${Date.now()}`, text, timestamp: 'Just now', language },
              ...p.submissions
            ]
          }
        : p
    )
  })),
}));
