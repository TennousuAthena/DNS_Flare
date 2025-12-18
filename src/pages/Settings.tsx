import { useStore } from "../store";
import { Switch } from "@headlessui/react";
import { cn } from "../lib/utils";

export default function Settings() {
  const { settings, updateSettings, clearZones } = useStore();

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Application Settings
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Configure how the dashboard behaves and validates data.
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="default-ttl"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Default TTL
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="default-ttl"
                    id="default-ttl"
                    value={settings.defaultTTL}
                    onChange={(e) =>
                      updateSettings({
                        defaultTTL: parseInt(e.target.value) || 3600,
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex items-center justify-between">
                  <span className="flex flex-grow flex-col">
                    <span className="text-sm font-medium leading-6 text-gray-900">
                      Strict Validation Mode
                    </span>
                    <span className="text-sm text-gray-500">
                      Enforce strict schema validation for all records.
                    </span>
                  </span>
                  <Switch
                    checked={settings.validation.strictMode}
                    onChange={(checked: boolean) =>
                      updateSettings({
                        validation: {
                          ...settings.validation,
                          strictMode: checked,
                        },
                      })
                    }
                    className={cn(
                      settings.validation.strictMode
                        ? "bg-indigo-600"
                        : "bg-gray-200",
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        settings.validation.strictMode
                          ? "translate-x-5"
                          : "translate-x-0",
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to clear all data? This cannot be undone."
                  )
                ) {
                  clearZones();
                }
              }}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Clear All Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
