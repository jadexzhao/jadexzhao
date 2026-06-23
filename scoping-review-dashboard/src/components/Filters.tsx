import { Search } from 'lucide-react';

type FiltersProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDomains: string[];
  setSelectedDomains: (domains: string[]) => void;
  minDuration: number;
  setMinDuration: (months: number) => void;
  allDomains: string[];
};

export default function Filters({
  searchTerm,
  setSearchTerm,
  selectedDomains,
  setSelectedDomains,
  minDuration,
  setMinDuration,
  allDomains,
}: FiltersProps) {
  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Title, authors, or findings..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Domains</label>
          <div className="flex flex-wrap gap-2">
            {allDomains.map((domain) => {
              const isSelected = selectedDomains.includes(domain);

              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedDomains(selectedDomains.filter((item) => item !== domain));
                      return;
                    }

                    setSelectedDomains([...selectedDomains, domain]);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {domain}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Minimum Duration (months): {minDuration}
          </label>
          <input
            type="range"
            min="0"
            max="60"
            step="6"
            value={minDuration}
            onChange={(event) => setMinDuration(Number(event.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>
    </section>
  );
}
