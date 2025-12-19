import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DNSRecordSchema, DNSRecord, DNSRecordType } from "../lib/schema";

interface RecordFormProps {
  initialData?: DNSRecord;
  zoneName: string;
  onSubmit: (data: DNSRecord) => void;
  onCancel: () => void;
}

const RECORD_TYPES: DNSRecordType[] = [
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "NS",
  "TXT",
  "SOA",
  "SRV",
  "CAA",
  "DNSKEY",
  "DS",
  "CDS",
  "CDNSKEY",
  "PTR",
];

export default function RecordForm({
  initialData,
  zoneName,
  onSubmit,
  onCancel,
}: RecordFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DNSRecord>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(DNSRecordSchema) as any,
    defaultValues: initialData || {
      name: zoneName,
      type: "A",
      ttl: 3600,
      data: {},
    },
  });

  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!initialData) {
      // Optional: clear data fields on type change
    }
  }, [type, setValue, initialData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorData = errors.data as any;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="name"
              {...register("name")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="type"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Type
          </label>
          <div className="mt-2">
            <select
              id="type"
              {...register("type")}
              disabled={!!initialData && initialData.type === "SOA"}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="ttl"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            TTL
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="ttl"
              {...register("ttl")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errors.ttl && (
              <p className="text-red-500 text-xs mt-1">{errors.ttl.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-900/10 pt-4">
        <h3 className="text-sm font-semibold leading-6 text-gray-900">
          Record Data
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
          {type === "A" && (
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                IPv4 Address
              </label>
              <input
                type="text"
                {...register("data.ip")}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errorData?.ip && (
                <p className="text-red-500 text-xs mt-1">
                  {errorData.ip.message}
                </p>
              )}
            </div>
          )}

          {type === "AAAA" && (
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                IPv6 Address
              </label>
              <input
                type="text"
                {...register("data.ip")}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errorData?.ip && (
                <p className="text-red-500 text-xs mt-1">
                  {errorData.ip.message}
                </p>
              )}
            </div>
          )}

          {(type === "CNAME" || type === "NS" || type === "PTR") && (
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Target Domain
              </label>
              <input
                type="text"
                {...register("data.dname")}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errorData?.dname && (
                <p className="text-red-500 text-xs mt-1">
                  {errorData.dname.message}
                </p>
              )}
            </div>
          )}

          {type === "MX" && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Preference
                </label>
                <input
                  type="number"
                  {...register("data.preference")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.preference && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.preference.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Mail Server
                </label>
                <input
                  type="text"
                  {...register("data.exchange")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.exchange && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.exchange.message}
                  </p>
                )}
              </div>
            </>
          )}

          {type === "TXT" && (
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Text Content
              </label>
              <textarea
                {...register("data.txts")}
                rows={3}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errorData?.txts && (
                <p className="text-red-500 text-xs mt-1">
                  {errorData.txts.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                For multiple strings, validation might need adjustment or UI to
                handle array input.
              </p>
            </div>
          )}

          {type === "SRV" && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Priority
                </label>
                <input
                  type="number"
                  {...register("data.priority")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.priority && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.priority.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Weight
                </label>
                <input
                  type="number"
                  {...register("data.weight")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.weight && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.weight.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Port
                </label>
                <input
                  type="number"
                  {...register("data.port")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.port && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.port.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Target
                </label>
                <input
                  type="text"
                  {...register("data.target")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.target && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.target.message}
                  </p>
                )}
              </div>
            </>
          )}

          {type === "SOA" && (
            <>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  MNAME (Primary NS)
                </label>
                <input
                  type="text"
                  {...register("data.mname")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.mname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.mname.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  RNAME (Email)
                </label>
                <input
                  type="text"
                  {...register("data.rname")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.rname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.rname.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Serial
                </label>
                <input
                  type="number"
                  {...register("data.serial")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.serial && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.serial.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Refresh
                </label>
                <input
                  type="number"
                  {...register("data.refresh")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.refresh && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.refresh.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Retry
                </label>
                <input
                  type="number"
                  {...register("data.retry")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.retry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.retry.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Expire
                </label>
                <input
                  type="number"
                  {...register("data.expire")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.expire && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.expire.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Minimum
                </label>
                <input
                  type="number"
                  {...register("data.minimum")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.minimum && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.minimum.message}
                  </p>
                )}
              </div>
            </>
          )}

          {type === "CAA" && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Flags
                </label>
                <input
                  type="number"
                  {...register("data.flags")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.flags && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.flags.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Tag
                </label>
                <select
                  {...register("data.tag")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="issue">issue</option>
                  <option value="issuewild">issuewild</option>
                  <option value="iodef">iodef</option>
                </select>
                {errorData?.tag && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.tag.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Value
                </label>
                <input
                  type="text"
                  {...register("data.value")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.value && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.value.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* DNSSEC Types simplified */}
          {(type === "DNSKEY" || type === "CDNSKEY") && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Flags
                </label>
                <input
                  type="number"
                  {...register("data.flags")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.flags && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.flags.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Protocol
                </label>
                <input
                  type="number"
                  {...register("data.protocol")}
                  defaultValue={3}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.protocol && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.protocol.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Algorithm
                </label>
                <input
                  type="number"
                  {...register("data.alg")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.alg && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.alg.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Public Key
                </label>
                <textarea
                  {...register("data.public_key")}
                  rows={3}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.public_key && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.public_key.message}
                  </p>
                )}
              </div>
            </>
          )}

          {(type === "DS" || type === "CDS") && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Key Tag
                </label>
                <input
                  type="number"
                  {...register("data.keytag")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.keytag && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.keytag.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Algorithm
                </label>
                <input
                  type="number"
                  {...register("data.alg")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.alg && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.alg.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Digest Type
                </label>
                <input
                  type="number"
                  {...register("data.digest_type")}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.digest_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.digest_type.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Digest
                </label>
                <textarea
                  {...register("data.digest")}
                  rows={2}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errorData?.digest && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorData.digest.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
