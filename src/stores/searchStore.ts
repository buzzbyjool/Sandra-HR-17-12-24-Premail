import { create } from 'zustand';

interface SearchState {
  query: string;
  filters: {
    location: string[];
    experience: string | null;
    skills: string[];
    availability: string | null;
    salaryRange: {
      min: number | null;
      max: number | null;
    };
    employmentType: string[];
  };
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  setQuery: (query: string) => void;
  setFilters: (filters: SearchState['filters']) => void;
  setSort: (field: string, direction: 'asc' | 'desc') => void;
  clearFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  filters: {
    location: [],
    experience: null,
    skills: [],
    availability: null,
    salaryRange: {
      min: null,
      max: null
    },
    employmentType: []
  },
  sort: {
    field: 'createdAt',
    direction: 'desc'
  },
  setQuery: (query) => set({ query }),
  setFilters: (filters) => set({ filters }),
  setSort: (field, direction) => set({ sort: { field, direction } }),
  clearFilters: () => set({
    filters: {
      location: [],
      experience: null,
      skills: [],
      availability: null,
      salaryRange: {
        min: null,
        max: null
      },
      employmentType: []
    }
  })
}));