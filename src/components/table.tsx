import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";

import { useEffect, useMemo, useState } from "react";
import DeleteConfirmation from "./delete-confirmation";
import { Button } from "@headlessui/react";
import { TableSearch } from "./table-search";

const columnHelper = createColumnHelper();

const fallbackData = [
  {
    id: "1",
    title: "Record 1",
  },
];

function Table({ tableConfig, token, previewSiteUrl = "https://dev.pokee.ai" }) {
  // debugger;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  // Default to newest-first by publish date (ignored on tables without it).
  const [sorting, setSorting] = useState<SortingState>([{ id: "datePosted", desc: true }]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(false);
  const [columnFilters, setColumnFilters] = useState([{id:'seoTitle', value: ''}]);

  // Fetch limit for the one-shot load. The table paginates/searches client-side
  // over this set, so it must be large enough to include every record (otherwise
  // rows past the limit are invisible AND unsearchable). Bump if a collection
  // ever exceeds this; the real fix is server-side pagination.
  const pageSize = 2000;

  // const columns = Object.entries(tableConfig.formFields).map(([key, value]) =>
  //   columnHelper.accessor(key, {
  //     header: value.header || key.charAt(0).toUpperCase() + key.slice(1),
  //     cell: (info) => truncateText(info.getValue(), 30),
  //   })
  // );
  // Show a curated set of columns when the table defines `listFields`
  // (industry-standard CMS list view); otherwise fall back to every field.
  const listKeys =
    tableConfig.listFields && tableConfig.listFields.length
      ? tableConfig.listFields
      : tableConfig.formFields.map((f) => f.key);
  const listColumnFields = listKeys
    .map((key) => tableConfig.formFields.find((f) => f.key === key))
    .filter(Boolean);

  const columns = listColumnFields.map((formField) => {
    return columnHelper.accessor(formField.key, {
      header:
        formField.label ||
        formField.key.charAt(0).toUpperCase() + formField.key.slice(1),
      filterFn: formField.key === "status" ? "equalsString" : undefined,
      cell: (info) => {
        if (formField.key === "status") {
          return <StatusBadge value={info.getValue()} />;
        }
        // Title doubles as the edit link, like most CMS list views.
        if (formField.key === "seoTitle") {
          return (
            <a
              href={`/admin/forms/${tableConfig.route}/${(info.row.original as any).id}`}
              className="font-medium text-pokee-purple hover:text-pokee-purple-hover"
            >
              {truncateText(info.getValue(), 60) || "(untitled)"}
            </a>
          );
        }
        if (formField.type === "datetime" || formField.key === "datePosted") {
          return formatDate(info.getValue());
        }
        if (formField.key === "id") {
          return truncateText(info.getValue(), 5);
        }
        return truncateText(info.getValue(), 40);
      },
    });
  });

  const handleDeleteClick = (id) => {
    setRecordToDelete(id);
    setShowDeleteConfirmation(true);
  };

  // console.log("columns-->", columns);

  function truncateText(text: string, maxLength: number): string {
    if (text) {
      if (text.length <= maxLength) {
        return text;
      }
      return text.toString().slice(0, maxLength) + "...";
    }
  }
  // console.log("columns", columns);
  // columnHelper.accessor((row) => `${row.firstName} ${row.surname}`, {
  //   id: "fullName",
  //   header: "Full Name",
  // }),
  //   columnHelper.accessor("id", {
  //     header: "Id",
  //   }),
  //   columnHelper.accessor("title", {
  //     header: "Title 2",
  //   }),
  //   columnHelper.accessor("updated_on", {
  //     header: "Last Updated",
  //   }),
  // ];


  const table = useReactTable({
    data: data ?? fallbackData,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    console.log("loading");
    setLoading(true);

    const offset = page * pageSize;

    const originPath = `/api/v1/${tableConfig.route}?limit=${pageSize}&offset=${offset}`;

    getData(originPath);
  }, []);

  useEffect(() => {
    if (confirmDelete) {
      (async () => {
        const result = await deleteData(recordToDelete);
        console.log("record deleted");
        // setConfirmDelete(false);
        //redirect to table
        if (result.success) {
          // Force a hard refresh to bypass any browser cache
          window.location.href = `/admin/tables/${tableConfig.route}`;
        }
      })();
    }
  }, [confirmDelete]);

  const getData = (originPath) => {
      if (originPath) {
        // Add cache-busting parameter to ensure fresh data
        const url = new URL(originPath, window.location.origin);
        url.searchParams.set('_t', Date.now().toString());
        
        fetch(url.toString(), {
          headers: {
            'Cache-Control': 'no-cache'
          }
        }).then(async (response) => {
          const responseData: { data: any } = await response.json();
          setData(responseData.data);
          setLoading(false);
        });
      }
    };

  const deleteData = async (id) => {
    console.log("deleteData with id", id);

    if (id) {
      const path = `/api/v1/${tableConfig.route}/${id}`;

      try {
        const response = await fetch(path, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("There was an error deleting the data:", error);
        throw error;
      }
    }
  };

  const pagerColor = (pageNumber) => {
  return pageNumber === table.getState().pagination.pageIndex + 1 ? "border-pokee-purple text-pokee-purple" : "border-transparent text-muted-foreground hover:text-foreground";
  }

  // Status filter (only for tables that have a status column). Options are
  // derived from the data so any value present (draft/published/archived/…)
  // shows up.
  const hasStatusColumn = listColumnFields.some((f) => f.key === "status");
  const statusOptions = data
    ? Array.from(new Set((data as any[]).map((r) => r.status).filter(Boolean)))
    : [];
  const statusFilter =
    (columnFilters.find((f) => f.id === "status")?.value as string) ?? "";
  const setStatusFilter = (value: string) => {
    setColumnFilters((prev) => {
      const others = prev.filter((f) => f.id !== "status");
      return value ? [...others, { id: "status", value }] : others;
    });
  };

  if (table) {
    console.log("sorting", table.getState().sorting);
    const pageArray = Array.from(
      { length: table.getPageCount() },
      (_, i) => i + 1
    );

    return (
      <div className="bg-background">
        {showDeleteConfirmation && (
          <DeleteConfirmation
            open={showDeleteConfirmation}
            setOpen={setShowDeleteConfirmation}
            setConfirmDelete={setConfirmDelete}
          />
        )}

        <div className="mx-auto">
          <div className="bg-background py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-foreground">
                    {tableConfig.name.toUpperCase()}
                  </h1>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <button
                    type="button"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium p-2 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokee-purple"
                    onClick={() => {
                      window.location.href = `/admin/forms/${tableConfig.route}`;
                    }}
                  >
                    <PlusIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <TableSearch columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
                </div>
                {hasStatusColumn && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter by status"
                    className="rounded-md border-0 bg-background py-1.5 pl-3 pr-8 text-sm capitalize text-foreground shadow-sm ring-1 ring-inset ring-input focus:ring-2 focus:ring-inset focus:ring-pokee-purple [&>option]:bg-card"
                  >
                    <option value="">All statuses</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        {table.getHeaderGroups().map((headerGroup) => {
                          return (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                return (
                                  <th
                                    scope="col"
                                    className="cursor-pointer select-none px-3 py-3.5 text-left text-sm font-semibold text-foreground hover:text-pokee-purple"
                                    onClick={header.column.getToggleSortingHandler()}
                                  >
                                    <span className="group inline-flex">
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                      {{
                                        asc: arrowDown(),
                                        desc: arrowUp(),
                                      }[
                                        header.column.getIsSorted() as string
                                      ] ?? null}
                                    </span>
                                  </th>

                                  // <th
                                  //   key={header.id}
                                  //   scope="col"
                                  //   className="px-3 py-3.5 text-left text-sm font-semibold text-gray-100"
                                  // >
                                  //   <a href="#" className="group inline-flex">
                                  //     {header.isPlaceholder ? null : (
                                  //       <div
                                  //         className={
                                  //           header.column.getCanSort()
                                  //             ? "cursor-pointer"
                                  //             : ""
                                  //         }
                                  //         onClick={header.column.getToggleSortingHandler()}
                                  //         title={
                                  //           header.column.getCanSort()
                                  //             ? header.column.getNextSortingOrder() ===
                                  //               "asc"
                                  //               ? "Sort ascending"
                                  //               : header.column.getNextSortingOrder() ===
                                  //                   "desc"
                                  //                 ? "Sort descending"
                                  //                 : "Clear sort"
                                  //             : undefined
                                  //         }
                                  //       >
                                  //         {flexRender(
                                  //           header.column.columnDef.header,
                                  //           header.getContext()
                                  //         )}
                                  //         {{
                                  //           asc: arrowDown(),
                                  //           desc: arrowUp(),
                                  //         }[
                                  //           header.column.getIsSorted() as string
                                  //         ] ?? null}
                                  //       </div>
                                  //     )}
                                  //   </a>
                                  // </th>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </thead>
                      <tbody>
                        {table.getRowModel().rows.map((row) => {
                          console.log("row", row);
                          return (
                            <tr key={row.id}>
                              {row.getVisibleCells().map((cell) => {
                                return (
                                  <td
                                    key={cell.id}
                                    className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground"
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </td>
                                );
                              })}
                              {(row.original as any).slug && (
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                  <a
                                    href={`${previewSiteUrl}/blog/${(row.original as any).slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-600 hover:text-amber-700"
                                  >
                                    Preview
                                  </a>
                                </td>
                              )}
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <a
                                  href={`/admin/forms/${tableConfig.route}/${(row.original as any).id}`}
                                  className="text-pokee-purple hover:text-pokee-purple-hover"
                                >
                                  Edit
                                </a>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <button
                                  onClick={() =>
                                    handleDeleteClick((row.original as any).id)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 mt-4">
              <nav className="flex items-center justify-between border-t border-border px-4 sm:px-0">
                <div className="-mt-px flex w-0 flex-1">
                  <Button
                    onClick={() => {
                      table.previousPage();
                    }}
                    disabled={table.getCanPreviousPage()}
                    className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
                  >
                    <ArrowLongLeftIcon
                      aria-hidden="true"
                      className="mr-3 h-5 w-5 text-muted-foreground"
                    />
                    Previous
                  </Button>
                </div>
                <div className="hidden md:-mt-px md:flex">
                  {pageArray.map((pageNumber) => 
                    <Button onClick={() => table.setPageIndex(pageNumber-1)} className={"inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium hover:border-border hover:text-foreground" + pagerColor(pageNumber)}>
                      {pageNumber}
                    </Button>
                  )}
                
                {/* TODO: split page buttons when there are many pages */}
                  {/* <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                    ...
                  </span> */}
                 
                </div>
                <div className="-mt-px flex w-0 flex-1 justify-end">
                  <Button
                    onClick={() => {
                      table.nextPage();
                    }}
                    disabled={table.getCanNextPage()}
                    className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
                  >
                    Next
                    <ArrowLongRightIcon
                      aria-hidden="true"
                      className="ml-3 h-5 w-5 text-muted-foreground"
                    />
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    <div>no data yet</div>;
  }
}

// Render a stored unix timestamp (ms, or seconds for legacy rows) as a readable
// date for list columns.
function formatDate(value: any): string {
  if (value === null || value === undefined || value === "") return "";
  let ms = Number(value);
  if (Number.isNaN(ms)) {
    ms = Date.parse(String(value)); // ISO / datetime-local strings
  } else if (ms < 1e11) {
    ms *= 1000; // stored as seconds → ms
  }
  if (Number.isNaN(ms)) return String(value);
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const StatusBadge = ({ value }) => {
  const v = (value || "draft").toString().toLowerCase();
  const styles: Record<string, string> = {
    published: "bg-green-50 text-green-700 ring-green-600/20",
    draft: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
    archived: "bg-gray-100 text-gray-600 ring-gray-500/20",
    deleted: "bg-red-50 text-red-700 ring-red-600/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${styles[v] ?? styles.draft}`}
    >
      {v}
    </span>
  );
};

const arrowDown = () => {
  return (
    <span className="ml-2 flex-none rounded bg-muted text-foreground group-hover:bg-secondary">
      <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
    </span>
  );
};

const arrowUp = () => {
  return (
    <span className="ml-2 flex-none rounded bg-muted text-foreground group-hover:bg-secondary">
      <ChevronUpIcon aria-hidden="true" className="h-5 w-5" />
    </span>
  );
};

export default Table;
