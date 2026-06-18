import type { ColumnFiltersState } from "@tanstack/react-table";
import { useCallback, useRef, type Dispatch, type SetStateAction } from "react";

type TableSearchProps = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  searchField?: string;
};

export const TableSearch = ({
  columnFilters,
  setColumnFilters,
  searchField,
}: TableSearchProps) => {
  const defaultSearchField = useRef(columnFilters[0]?.id ?? "");
  const fieldToFilterOn = searchField ?? defaultSearchField.current;
  const filterValue =
    columnFilters.find((filter) => filter.id === fieldToFilterOn)?.value ?? "";

  const onFilterChange = (id: string, value: string) =>
    setColumnFilters((prev) => {
      const filters = prev.filter((f) => f.id !== id);
      return value ? filters.concat({ id, value }) : filters;
    });

  const searchInput = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div className="w-96">
      <div className="mt-2">
        <div className="flex rounded-md bg-background ring-1 ring-inset ring-input focus-within:ring-2 focus-within:ring-inset focus-within:ring-pokee-purple">
          <input
            type="text"
            name="search"
            id="search"
            value={String(filterValue)}
            onChange={(e) => {
              if (fieldToFilterOn) {
                onFilterChange(fieldToFilterOn, e.target.value);
              }
            }}
            className="flex-1 border-0 bg-transparent py-1.5 pl-2 text-foreground focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Search"
            autoFocus
            ref={searchInput}
          />
        </div>
      </div>
    </div>
  );
};
