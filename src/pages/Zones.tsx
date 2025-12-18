import { useStore } from "../store";
import { Link } from "react-router-dom";

export default function Zones() {
  const { zones, deleteZone } = useStore();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            DNS Zones
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the DNS zones in your account including their name,
            record count, and details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/zones/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Zone
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Records
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      DNSSEC
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {zones.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-sm text-gray-500"
                      >
                        No zones found. Create one or import from JSON.
                      </td>
                    </tr>
                  ) : (
                    zones.map((zone) => (
                      <tr key={zone.name}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {zone.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {zone.records.length}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {zone.keys && zone.keys.length > 0 ? (
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                              Disabled
                            </span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            to={`/zones/${encodeURIComponent(zone.name)}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit<span className="sr-only">, {zone.name}</span>
                          </Link>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this zone?"
                                )
                              ) {
                                deleteZone(zone.name);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete<span className="sr-only">, {zone.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
