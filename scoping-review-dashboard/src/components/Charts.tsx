import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Project = {
  id: number;
  title: string;
  authors: string;
  year: number;
  domain: string[];
  duration_months: number;
  methodology: string;
  key_findings: string;
  participants: number;
  url: string;
};

export default function Charts({ projects }: { projects: Project[] }) {
  const yearData = Object.entries(
    projects.reduce<Record<number, number>>((accumulator, project) => {
      accumulator[project.year] = (accumulator[project.year] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).map(([year, count]) => ({ year: Number(year), count }));

  const domainData = Object.entries(
    projects.flatMap((project) => project.domain).reduce<Record<string, number>>((accumulator, domain) => {
      accumulator[domain] = (accumulator[domain] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold">Projects by Year</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={yearData}>
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold">Domain Distribution</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={domainData} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name">
              {domainData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
