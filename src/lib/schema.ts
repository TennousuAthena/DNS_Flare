import { z } from "zod";

// 基础验证器
export const domainNameSchema = z
  .string()
  .min(1, "Domain name is required")
  .max(253, "Domain name is too long")
  // Allow alphanumeric, hyphen, underscore, dot, and slash (for DN42/CIDR zones).
  // This allows for formats like 160/27.1.2.3.
  .regex(
    /^[a-zA-Z0-9_/]([a-zA-Z0-9_/.-]{0,251}[a-zA-Z0-9_/])?$/,
    "Invalid domain name format"
  );

const domainName = domainNameSchema;

const ipv4Address = z
  .string()
  .regex(
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    "Invalid IPv4 address"
  );

const ipv6Address = z
  .string()
  .regex(
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/,
    "Invalid IPv6 address"
  );

// DNS 记录验证模式
export const DNSRecordSchema = z.discriminatedUnion("type", [
  // A 记录
  z.object({
    name: domainName,
    type: z.literal("A"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      ip: ipv4Address,
    }),
    context: z.array(z.string()).optional(),
  }),

  // AAAA 记录
  z.object({
    name: domainName,
    type: z.literal("AAAA"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      ip: ipv6Address,
    }),
    context: z.array(z.string()).optional(),
  }),

  // CNAME 记录
  z
    .object({
      name: domainName,
      type: z.literal("CNAME"),
      ttl: z.coerce.number().int().min(1).max(2147483647),
      data: z.object({
        dname: domainName,
      }),
      context: z.array(z.string()).optional(),
    })
    .refine((data) => data.name !== data.data.dname, {
      message: "CNAME record cannot reference itself",
      path: ["data", "dname"],
    }),

  // MX 记录
  z.object({
    name: domainName,
    type: z.literal("MX"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      preference: z.coerce.number().int().min(0).max(65535),
      exchange: domainName,
    }),
    context: z.array(z.string()).optional(),
  }),

  // NS 记录
  z.object({
    name: domainName,
    type: z.literal("NS"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      dname: domainName,
    }),
    context: z.array(z.string()).optional(),
  }),

  // TXT 记录
  z.object({
    name: domainName,
    type: z.literal("TXT"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      txts: z
        .array(z.string().max(255))
        .or(z.string().transform((val) => [val])),
    }),
    context: z.array(z.string()).optional(),
  }),

  // CAA 记录
  z.object({
    name: domainName,
    type: z.literal("CAA"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      flags: z.coerce.number().int().min(0).max(255),
      tag: z.enum(["issue", "issuewild", "iodef"]),
      value: z.string(),
    }),
    context: z.array(z.string()).optional(),
  }),

  // SRV 记录
  z.object({
    name: domainName,
    type: z.literal("SRV"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      priority: z.coerce.number().int().min(0).max(65535),
      weight: z.coerce.number().int().min(0).max(65535),
      port: z.coerce.number().int().min(1).max(65535),
      target: domainName,
    }),
    context: z.array(z.string()).optional(),
  }),

  // SOA 记录
  z.object({
    name: domainName,
    type: z.literal("SOA"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      mname: domainName,
      rname: domainName, // Email with . instead of @
      serial: z.coerce.number().int().min(1),
      refresh: z.coerce.number().int().min(1).max(2147483647),
      retry: z.coerce.number().int().min(1).max(2147483647),
      expire: z.coerce.number().int().min(1).max(2147483647),
      minimum: z.coerce.number().int().min(1).max(2147483647),
    }),
    context: z.array(z.string()).optional(),
  }),

  // DNSKEY 记录
  z.object({
    name: domainName,
    type: z.literal("DNSKEY"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      flags: z.coerce.number().int(),
      protocol: z.literal(3),
      alg: z.coerce.number().int(),
      public_key: z.string(),
      key_tag: z.coerce.number().int().optional(),
    }),
    context: z.array(z.string()).optional(),
  }),

  // DS 记录
  z.object({
    name: domainName,
    type: z.literal("DS"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      keytag: z.coerce.number().int().min(0).max(65535),
      alg: z.coerce.number().int(),
      digest_type: z.coerce.number().int(),
      digest: z.string(),
    }),
    context: z.array(z.string()).optional(),
  }),

  // CDS 记录
  z.object({
    name: domainName,
    type: z.literal("CDS"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      keytag: z.coerce.number().int().min(0).max(65535),
      alg: z.coerce.number().int(),
      digest_type: z.coerce.number().int(),
      digest: z.string(),
    }),
    context: z.array(z.string()).optional(),
  }),

  // CDNSKEY 记录
  z.object({
    name: domainName,
    type: z.literal("CDNSKEY"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      flags: z.coerce.number().int(),
      protocol: z.literal(3),
      alg: z.coerce.number().int(),
      public_key: z.string(),
    }),
    context: z.array(z.string()).optional(),
  }),

  // PTR 记录
  z.object({
    name: domainName,
    type: z.literal("PTR"),
    ttl: z.coerce.number().int().min(1).max(2147483647),
    data: z.object({
      dname: domainName,
    }),
    context: z.array(z.string()).optional(),
  }),
]);

// DNSSEC 密钥验证
export const DNSSECKeysetSchema = z
  .object({
    ksk: z.string().min(1), // PEM 格式私钥
    ksk_keytag: z.coerce.number().int().min(0).max(65535),
    ksk_alg: z.coerce.number().int().min(1).max(255),
    zsk: z.string().min(1), // PEM 格式私钥
    zsk_keytag: z.coerce.number().int().min(0).max(65535),
    zsk_alg: z.coerce.number().int().min(1).max(255),
    inception: z.string().datetime(),
    until: z.string().datetime(),
  })
  .refine((data) => new Date(data.until) > new Date(data.inception), {
    message: "Key validity end date must be after start date",
    path: ["until"],
  });

// 完整区域验证
export const DNSZoneSchema = z
  .object({
    name: domainName,
    records: z.array(DNSRecordSchema).min(1, "At least one record is required"),
    keys: z.array(DNSSECKeysetSchema).optional(),
    sha: z.string().optional(),
  })
  .refine(
    (data) => {
      // 验证 SOA 记录存在且唯一
      const soaRecords = data.records.filter((r) => r.type === "SOA");
      return soaRecords.length === 1;
    },
    {
      message: "Zone must have exactly one SOA record",
      path: ["records"],
    }
  );

export const ZoneFileSchema = z.array(DNSZoneSchema);

export type DNSRecord = z.infer<typeof DNSRecordSchema>;
export type DNSZone = z.infer<typeof DNSZoneSchema>;
export type DNSSECKeyset = z.infer<typeof DNSSECKeysetSchema>;
export type ZoneFile = z.infer<typeof ZoneFileSchema>;
export type DNSRecordType = DNSRecord["type"];
