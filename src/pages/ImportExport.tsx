import { useState } from "react";
import { useStore } from "../store";
import { ZoneFileSchema, DNSZone } from "../lib/schema";
import {
  UploadCloud as ArrowUpTrayIcon,
  DownloadCloud as ArrowDownTrayIcon,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function ImportExport() {
  const { zones, addZone, addImportHistory } = useStore();
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const json = JSON.parse(content);

        // Validate against schema
        const result = ZoneFileSchema.safeParse(json);

        if (result.success) {
          let count = 0;
          result.data.forEach((zone: DNSZone) => {
            // Check if zone already exists? We might want to overwrite or skip
            // For now, simple add (user should ensure uniqueness or we can handle it)
            // Ideally check if name exists
            addZone(zone);
            count++;
          });

          addImportHistory({
            id: crypto.randomUUID(),
            filename: file.name,
            timestamp: new Date().toISOString(),
            zoneCount: count,
          });

          setImportSuccess(
            `Successfully imported ${count} zones from ${file.name}`
          );
          setImportError(null);
        } else {
          console.error("Validation error:", result.error);
          let errorMessages = "Unknown validation error";

          if (result.error && Array.isArray(result.error.issues)) {
            errorMessages = result.error.issues
              .map((e) => `${e.path.join(".")}: ${e.message}`)
              .join(", ");
          } else if (result.error && typeof result.error.message === "string") {
            errorMessages = result.error.message;
          } else {
            errorMessages = JSON.stringify(result.error);
          }

          setImportError(`Validation failed: ${errorMessages}`);
          setImportSuccess(null);
        }
      } catch (err) {
        console.error("Import error:", err);
        setImportError(`Failed to parse JSON: ${(err as Error).message}`);
        setImportSuccess(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const data = JSON.stringify(zones, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "erldns-zones.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Import / Export Configuration
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Manage your DNS configuration files. Import existing zones or backup
          your current setup.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Import Section */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
              <Upload className="h-5 w-5 text-gray-400" />
              Import Zones
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Upload a JSON file containing zone definitions compatible with
              erldns.
            </p>

            <div className="mt-6">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <div className="flex max-w-lg justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <ArrowUpTrayIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".json"
                        onChange={handleFileUpload}
                      />
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      JSON up to 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {importError && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Import Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{importError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {importSuccess && (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Success
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{importSuccess}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Section */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
              <Download className="h-5 w-5 text-gray-400" />
              Export Configuration
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Download the current zone configuration as a JSON file.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex w-full justify-center items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <ArrowDownTrayIcon
                  className="-ml-0.5 h-5 w-5"
                  aria-hidden="true"
                />
                Download JSON
              </button>
            </div>

            <div className="mt-6 rounded-md bg-gray-50 p-4">
              <h4 className="text-sm font-medium text-gray-900">Preview</h4>
              <div className="mt-2 max-h-60 overflow-y-auto rounded bg-gray-900 p-4">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(zones.slice(0, 1), null, 2)}
                  {zones.length > 1 && "\n... (more zones)"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
