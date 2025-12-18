import { useStore } from "../store";
import { Link } from "react-router-dom";
import { Globe, FileText, Plus, Upload } from "lucide-react";

export default function Dashboard() {
  const { zones } = useStore();

  const totalZones = zones.length;
  const totalRecords = zones.reduce(
    (acc, zone) => acc + zone.records.length,
    0
  );

  const stats = [
    { name: "Total Zones", stat: totalZones, icon: Globe, href: "/zones" },
    {
      name: "Total Records",
      stat: totalRecords,
      icon: FileText,
      href: "/zones",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard
      </h2>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link
                    to={item.href}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all<span className="sr-only"> {item.name}</span>
                  </Link>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Quick Actions
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/zones/new"
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Plus className="h-6 w-6" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                Create New Zone
              </p>
              <p className="truncate text-sm text-gray-500">
                Add a new DNS zone manually
              </p>
            </div>
          </Link>

          <Link
            to="/import-export"
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Upload className="h-6 w-6" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                Import Configuration
              </p>
              <p className="truncate text-sm text-gray-500">
                Import JSON zone files
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
