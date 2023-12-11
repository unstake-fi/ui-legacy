import { useLocation, useNavigate } from "react-router-dom";

// Overload for when T extends string
export function useQueryParam<T extends string>(
  key: string,
  initial: T
): [T, (v: T) => void];

// Overload for when T does not extend string
export function useQueryParam<T>(
  key: string,
  initial: T,
  toString: (t: T) => string,
  fromString: (v: string) => T
): [T, (v: T) => void];

// Implementation
export function useQueryParam<T>(
  key: string,
  initial: T,
  toString?: (t: T) => string,
  fromString?: (v: string) => T
): [T, (v: T) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const q = new URLSearchParams(useLocation().search);
  const stored = q.get(key);

  const fromString_ = fromString ?? ((v: string) => v as unknown as T);
  const toString_ = toString ?? String;

  const val = stored ? fromString_(stored) : initial;

  const setVal = (t: T) => {
    t ? q.set(key, toString_(t)) : q.delete(key);
    navigate(`${location.pathname}?${q.toString()}`);
  };

  return [val, setVal];
}
