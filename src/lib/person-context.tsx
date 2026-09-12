"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Person = { id: string; name: string };

const STORAGE_KEY = "familyhub:personId";

type PersonContextValue = {
  people: Person[];
  personId: string | null;
  person: Person | null;
  loading: boolean;
  choosePerson: (id: string) => void;
  switchPerson: () => void;
};

const PersonContext = createContext<PersonContextValue | null>(null);

export function PersonProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [personId, setPersonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/people")
      .then((res) => res.json())
      .then((data: Person[]) => {
        if (cancelled) return;
        setPeople(data);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && data.some((p) => p.id === stored)) {
          setPersonId(stored);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const choosePerson = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setPersonId(id);
  };

  const switchPerson = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPersonId(null);
  };

  const person = people.find((p) => p.id === personId) ?? null;

  return (
    <PersonContext.Provider
      value={{ people, personId, person, loading, choosePerson, switchPerson }}
    >
      {children}
    </PersonContext.Provider>
  );
}

export function usePerson() {
  const ctx = useContext(PersonContext);
  if (!ctx) throw new Error("usePerson must be used within PersonProvider");
  return ctx;
}
