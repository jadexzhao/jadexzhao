import { useMemo, useState } from 'react';
import Charts from './components/Charts';
import DataTable from './components/DataTable';
import Filters from './components/Filters';
import projectsData from './data/projects.json';

type Project = {
  id: number;
  title: string;
  authors: string[];
  year: number;
  domain: string[];
  duration_months: number;
  methodology: string;
  key_findings: string;
  participants: number;
  url: string;
};

function App() {
  const [projects] = useState<Project[]>(projectsData as Project[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [minDuration, setMinDuration] = useState(0);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.authors.join(' ').toLowerCase().includes(query) ||
        project.key_findings.toLowerCase().includes(query);

      const matchesDomain =
        selectedDomains.length === 0 ||
        selectedDomains.some((domain) => project.domain.includes(domain));

      const matchesDuration = project.duration_months >= minDuration;

      return matchesSearch && matchesDomain && matchesDuration;
    });
  }, [projects, searchTerm, selectedDomains, minDuration]);

  const allDomains = Array.from(new Set(projects.flatMap((project) => project.domain))).sort();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-3xl font-semibold tracking-tight">Scoping Review Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Interactive exploration of structured research and project metadata.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDomains={selectedDomains}
          setSelectedDomains={setSelectedDomains}
          minDuration={minDuration}
          setMinDuration={setMinDuration}
          allDomains={allDomains}
        />

        <Charts projects={filteredProjects} />

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Projects ({filteredProjects.length})</h2>
            <p className="text-sm text-gray-500">Showing results from {projects.length} total entries</p>
          </div>

          <DataTable projects={filteredProjects} />
        </section>
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
          Built by Jade Zhao • Interactive Scoping Review Dashboard • Summer 2025
        </div>
      </footer>
    </div>
  );
}

export default App;
