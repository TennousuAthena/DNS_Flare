import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { Plus, ArrowLeft } from "lucide-react";
import { Dialog } from "@headlessui/react";
import RecordForm from "../components/RecordForm";
import { DNSRecord } from "../lib/schema";

export default function ZoneDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getZone, deleteRecord, addRecord, updateRecord } = useStore();
  const zone = getZone(id || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecordIndex, setEditingRecordIndex] = useState<number | null>(
    null
  );

  if (!zone) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Zone not found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          The requested zone does not exist.
        </p>
        <div className="mt-6">
          <Link to="/zones" className="text-indigo-600 hover:text-indigo-500">
            Go back to zones
          </Link>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    setEditingRecordIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingRecordIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: DNSRecord) => {
    if (editingRecordIndex !== null) {
      updateRecord(zone.name, editingRecordIndex, data);
    } else {
      addRecord(zone.name, data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteRecord(zone.name, index);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-x-3">
            <Link to="/zones" className="text-gray-400 hover:text-gray-500">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {zone.name}
            </h2>
          </div>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={handleAdd}
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Record
          </button>
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
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Content
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      TTL
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
                  {zone.records.map((record, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {record.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {record.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-md truncate">
                        {record.type === "A" && record.data.ip}
                        {record.type === "AAAA" && record.data.ip}
                        {record.type === "CNAME" && record.data.dname}
                        {record.type === "MX" &&
                          `${record.data.preference} ${record.data.exchange}`}
                        {record.type === "NS" && record.data.dname}
                        {record.type === "TXT" &&
                          (Array.isArray(record.data.txts)
                            ? record.data.txts.join(", ")
                            : record.data.txts)}
                        {record.type === "SOA" &&
                          `${record.data.mname} ${record.data.rname} ${record.data.serial}`}
                        {record.type === "SRV" &&
                          `${record.data.priority} ${record.data.weight} ${record.data.port} ${record.data.target}`}
                        {record.type === "CAA" &&
                          `${record.data.flags} ${record.data.tag} "${record.data.value}"`}
                        {(record.type === "DNSKEY" ||
                          record.type === "CDNSKEY") &&
                          `${record.data.flags} ${record.data.protocol} ${record.data.alg}`}
                        {(record.type === "DS" || record.type === "CDS") &&
                          `${record.data.keytag} ${record.data.alg} ${record.data.digest_type}`}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {record.ttl}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-3xl w-full rounded bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-lg font-bold mb-4">
              {editingRecordIndex !== null ? "Edit Record" : "Add Record"}
            </Dialog.Title>

            <RecordForm
              zoneName={zone.name}
              initialData={
                editingRecordIndex !== null
                  ? zone.records[editingRecordIndex]
                  : undefined
              }
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
