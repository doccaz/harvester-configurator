export interface NetworkInterface {
  name: string;
  hwAddr?: string;
}

export interface ManagementInterface {
  interfaces: NetworkInterface[];
  method: 'dhcp' | 'static';
  ip?: string;
  subnet_mask?: string;
  gateway?: string;
  bond_options?: string;
  vlan_id?: number;
  mtu?: number;
}

export interface AddonConfig {
  enabled: boolean;
  values_content?: string;
}

export interface InstallConfig {
  mode: 'create' | 'join';
  management_interface: ManagementInterface;
  device?: string; // Installation disk
  data_disk?: string; // Dedicated data disk
  iso_url?: string;
  tty?: string; // Console TTY
  vip?: string; // Required for 'create' if clustering is desired
  vip_mode?: 'ssn' | 'dhcp'; // static (ssn) or dhcp
  vip_hw_addr?: string; // VIP MAC address
  
  // Partitioning / Boot
  force_gpt?: boolean;
  force_efi?: boolean;
  force_mbr?: boolean;
  
  // Install process
  debug?: boolean;
  silent?: boolean;
  poweroff?: boolean;
  no_format?: boolean;
  skip_checks?: boolean; // v1.7+
  
  // Cluster Networking
  cluster_pod_cidr?: string;
  cluster_service_cidr?: string;
  cluster_dns?: string;

  // Addons
  addons?: Record<string, AddonConfig>;
}

export interface ExternalStorageConfig {
  enabled: boolean;
  multiPathConfig?: {
    blacklist?: Array<{ vendor?: string; product?: string }>;
    blacklistWwids?: string[];
    blacklistExceptions?: Array<{ vendor?: string; product?: string }>;
    blacklistExceptionWwids?: string[];
  };
}

export interface SshdConfig {
  enabled?: boolean;
  sftp?: boolean;
  port?: number;
}

export interface OSConfig {
  ssh_authorized_keys: string[];
  write_files: Array<{
    path: string;
    content: string;
    permissions?: string;
    owner?: string;
    encoding?: string;
  }>;
  hostname?: string;
  password?: string; // Cleartext password
  ntp_servers?: string[];
  dns_nameservers?: string[];
  modules?: string[]; // Kernel modules
  sysctls?: Record<string, string>; // Kernel parameters
  labels?: Record<string, string>; // Node labels
  persistent_state_paths?: string[];
  externalStorageConfig?: ExternalStorageConfig;
  sshd?: SshdConfig;
}

export interface HarvesterConfig {
  scheme_version: number;
  server_url?: string; // Required for 'join'
  token: string; // Cluster token
  os: OSConfig;
  install: InstallConfig;
  system_settings?: {
    'http-proxy'?: string;
    'https-proxy'?: string;
    'no-proxy'?: string;
    'additional-ca'?: string;
    'auto-disk-provision-paths'?: string;
    [key: string]: any;
  };
}

export const DEFAULT_CONFIG: HarvesterConfig = {
  scheme_version: 1,
  token: '',
  os: {
    ssh_authorized_keys: [],
    write_files: [],
    hostname: 'harvester-node-1',
    ntp_servers: [],
    dns_nameservers: [],
    modules: [],
    sysctls: {},
    labels: {},
    externalStorageConfig: {
      enabled: true,
      multiPathConfig: {
        blacklist: [],
        blacklistWwids: [],
        blacklistExceptions: [],
        blacklistExceptionWwids: []
      }
    },
    sshd: {
      enabled: true,
      sftp: true
    }
  },
  install: {
    mode: 'create',
    management_interface: {
      interfaces: [{ name: 'eth0' }],
      method: 'dhcp',
      bond_options: 'mode=balance-tlb miimon=100',
    },
    device: '/dev/sda',
    iso_url: 'https://releases.rancher.com/harvester/v1.7.0/harvester-v1.7.0-amd64.iso',
    vip: '',
    vip_mode: 'ssn',
    debug: false,
    force_gpt: true,
    force_efi: true,
    skip_checks: false,
    addons: {}
  },
  system_settings: {},
};

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}