import React, { useState, useEffect, useCallback } from 'react';
import jsYaml from 'js-yaml';
import { Download, Upload, FileJson,  Cpu, Network, Server, AlertTriangle, CheckCircle, FileText, Plus, Trash2, Eye, EyeOff, Settings, HardDrive, Github, X, Box, ShieldCheck, Terminal, HelpCircle, BookOpen, Command, ArrowUpRight } from 'lucide-react';
import { HarvesterConfig, DEFAULT_CONFIG, ValidationResult } from './types';
import Tooltip from './components/Tooltip';
import CodeBlock from './components/CodeBlock';

const APP_VERSION = "v1.4.0-stable";
const GITHUB_URL = "https://github.com/doccaz/harvester-configurator";
const HARVESTER_LOGO_URL = "https://harvesterhci.io/img/logo_horizontal.svg";

// Official SUSE Logo Component (SVG)
// Adapted for Dark Mode: cls-1 fill changed from #0d322c to #ffffff
const SuseLogo = ({ className }: { className?: string }) => (
  <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 227.7 121.99" className={className}>
    <defs>
      <style>{`.cls-1{fill:#ffffff;}.cls-2{fill:#30ba78;}`}</style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1-2">
      <path className="cls-1" d="M1.3,77.89l3-3c2.2,2.1,4.2,3.1,6.5,3.1,3.2,0,5-1.6,5-4,0-6.4-14-2.8-14-12.5,0-5.2,3.9-8.5,9.8-8.5,3.6,0,6.6,1.4,8.5,3.5l-3.1,3.2c-1.6-1.6-3.2-2.5-5.4-2.5-3,0-4.9,1.5-4.9,3.9,0,6.1,14.1,2.1,14.1,12.2,0,5.4-4.1,8.8-10.2,8.8-4.1,0-7.2-1.6-9.3-4.2Z"/>
      <path className="cls-1" d="M25.4,71.89v-18.3h4.9v17.9c0,4.1,2.4,6.1,6,6.1s5.9-2,5.9-6.1v-17.9h4.9v18.3c0,6.8-4.3,10.2-10.8,10.2s-10.9-3.4-10.9-10.2Z"/>
      <path className="cls-1" d="M51.6,77.89l3-3c2.2,2.2,4.2,3.1,6.5,3.1,3.2,0,5-1.6,5-4,0-6.4-14-2.8-14-12.5,0-5.2,3.9-8.5,9.8-8.5,3.6,0,6.6,1.4,8.5,3.5l-3.1,3.1c-1.6-1.6-3.2-2.5-5.4-2.5-3,0-4.9,1.5-4.9,3.9,0,6.1,14.1,2.1,14.1,12.2,0,5.4-4.1,8.8-10.2,8.8-4.1.1-7.2-1.5-9.3-4.1Z"/>
      <path className="cls-1" d="M75.3,76.89v-18.7c0-2.7,2-4.7,4.7-4.7h13.6v4.5h-12c-.8,0-1.5.6-1.5,1.4v5.9h12.6v4.3h-12.5v6c0,.8.6,1.4,1.5,1.4h12v4.5h-13.7c-2.7.1-4.7-1.9-4.7-4.6Z"/>
      <path className="cls-1" d="M0,93.59h2.8l9.2,24.7,9.1-24.7h2.8l-10.5,28h-2.9L0,93.59Z"/>
      <path className="cls-1" d="M28.5,104.69h-3.8v-2.2h6.3v19.1h-2.5v-16.9ZM28.4,93.69h2.7v4.4h-2.7v-4.4Z"/>
      <path className="cls-1" d="M37.7,102.39h2.5v3.2c.9-2.5,3-3.2,5.4-3.2h1.7v2.5h-1.9c-3.2,0-5.1,1.6-5.1,5.1v11.6h-2.6s0-19.1,0-19.2Z"/>
      <path className="cls-1" d="M52.8,116.69v-12h-3.6v-2.2h3.6v-4.8h2.5v4.8h5.3v2.2h-5.3v12.2c0,1.4,1,2.5,2.4,2.5h2.8v2.2h-2.8c-2.5,0-4.9-1.5-4.9-4.9Z"/>
      <path className="cls-1" d="M65.1,113.99v-11.6h2.5v11.2c0,4.5,2.3,6,5.3,6,3.2,0,5.8-2.1,5.8-6.3v-10.9h2.5v19.1h-2.2v-3.3c-1.5,2.8-4.4,3.7-6.6,3.7-4.2.1-7.3-2.2-7.3-7.9Z"/>
      <path className="cls-1" d="M99.8,119.39c-1,1.6-3,2.5-5.9,2.5-4.5,0-7.3-2.2-7.3-5.6s2.8-5.8,7.6-5.8c2.3,0,4.1.6,5.3,1.6v-3c0-3.3-1.7-4.8-4.8-4.8-2.1,0-4.5.8-6.1,2.4l-1.2-1.8c1.7-2,4.6-3,7.4-3,4.4,0,7.3,2.3,7.3,7.1v6.1c0,2.1,0,4.2.1,6.4h-2.3c-.1.1-.1-2.1-.1-2.1ZM94.3,119.99c3.2,0,5.1-1.5,5.1-3.7s-1.8-3.6-5.1-3.6-5.2,1.4-5.2,3.6,2,3.7,5.2,3.7Z"/>
      <path className="cls-1" d="M108.8,116.89v-22.3h-3.7v-2.2h6.2v24.6c0,1.4,1,2.4,2.4,2.4h1.7v2.2h-1.8c-2.8,0-4.8-1.9-4.8-4.7Z"/>
      <path className="cls-1" d="M120.1,104.69h-3.8v-2.2h6.4v19.1h-2.5c-.1,0-.1-16.9-.1-16.9ZM120,93.69h2.7v4.4h-2.7v-4.4Z"/>
      <path className="cls-1" d="M127,119.49l11-14.8h-10.9v-2.3h14v2.1l-11.1,14.8h11.2v2.3h-14.2v-2.1Z"/>
      <path className="cls-1" d="M157.4,119.39c-1,1.6-3,2.5-5.9,2.5-4.5,0-7.3-2.2-7.3-5.6s2.8-5.8,7.6-5.8c2.3,0,4.1.6,5.3,1.6v-3c0-3.3-1.7-4.8-4.8-4.8-2.1,0-4.5.8-6.1,2.4l-1.2-1.8c1.7-2,4.6-3,7.4-3,4.4,0,7.3,2.3,7.3,7.1v6.1c0,2.1,0,4.2.1,6.4h-2.3l-.1-2.1h0ZM151.9,119.99c3.2,0,5.1-1.5,5.1-3.7s-1.8-3.6-5.1-3.6-5.2,1.4-5.2,3.6,2,3.7,5.2,3.7Z"/>
      <path className="cls-1" d="M166.4,116.69v-12h-3.6v-2.2h3.6v-4.8h2.5v4.8h5.3v2.2h-5.3v12.2c0,1.4,1,2.5,2.4,2.5h2.8v2.2h-2.8c-2.5,0-4.9-1.5-4.9-4.9Z"/>
      <path className="cls-1" d="M179.8,104.69h-3.8v-2.2h6.4v19.1h-2.5c-.1,0-.1-16.9-.1-16.9ZM179.8,93.69h2.7v4.4h-2.7v-4.4Z"/>
      <path className="cls-1" d="M187.6,112.09v-.3c0-5.7,4-9.7,9.4-9.7s9.3,4,9.3,9.6v.4c0,5.8-3.9,9.9-9.3,9.9s-9.4-4.1-9.4-9.9h0ZM196.9,119.69c4,0,6.8-3.1,6.8-7.6v-.4c0-4.3-2.8-7.3-6.8-7.3s-6.8,3.1-6.8,7.4v.3c0,4.5,2.8,7.6,6.8,7.6Z"/>
      <path className="cls-1" d="M211.4,102.39h2.4v3.4c1.5-2.9,4.4-3.8,6.6-3.8,4.3,0,7.3,2.7,7.3,8.4v11.2h-2.6v-10.8c0-4.5-2.3-6.3-5.3-6.3-3.2,0-5.9,2.2-5.9,6.4v10.8h-2.6l.1-19.3h0Z"/>
      <g id="Layer_1-3" data-name="Layer 1-3">
        <path className="cls-2" d="M88.6,16.49c-.5.3-1.2.3-1.7,0-.8-.5-.9-1.7-.2-2.3.6-.6,1.6-.6,2.1,0,.7.6.6,1.7-.2,2.3M90.9,13.19c.9,4-2.7,7.6-6.7,6.7-2.1-.5-3.7-2.1-4.2-4.1-.9-4,2.7-7.6,6.7-6.7,2.1.4,3.8,2,4.2,4.1M63.9,34.79c.5.7.8,1.3,1.1,1.9.2.5.3,1,.8,1.3h.1c.8.3,2.9.2,2.9.2h3.9c.3,0,3.2,0,3.2-.3-.3-1.6-2.2-1.8-3.5-2.7-1.3-.8-2.5-1.6-3-3.1-.3-.8-.1-2.5.4-3.1.4-.5.9-.8,1.4-.9.6-.1,1.3,0,1.9,0,.8.1,1.5.2,2.3.3,1.5.2,3,.3,4.5.2,2.5-.1,4.9-.5,7.3-1.3,1.6-.5,3.2-1.3,4.6-2.3,1.6-1.2,1.2-1.1-.4-.9-1.9.2-3.8.2-5.8.1-1.8-.1-3.6-.3-5.2-1.1-1.3-.7-2.4-1.3-3.4-2.3-.2-.1-.2-.6,0-.9.3-.3.8-.1,1,0,1.8,1.5,4.4,2.7,7.1,2.8,1.5.1,2.9.1,4.4,0h2.6c.4,0,1.4.1,1.6-.3.1-.1.1-.2.1-.4-.3-5.7-.8-12.4-6.9-15.2-4.6-2.1-11.5-5.4-14.4-6.7-.7-.3-1.5.2-1.5.9,0,2,.1,4.8.1,7.4-1.4-1.4-3.8-2.3-5.6-3.2-2-.9-4.1-1.7-6.3-2.4-4.3-1.3-8.8-2.1-13.2-2.5C40.9-.21,35.7-.01,30.7.99c-8.3,1.8-16.4,5.7-22.6,11.5-3.8,3.6-6.8,8.6-6.9,13.8-.3,7.3,1.8,11.2,5.5,15.2,6,6.4,18.8,7.3,24-.3,2.3-3.4,2.8-8.1,1.1-11.9-1.7-3.8-5.6-6.5-9.8-6.7-3.2-.1-6.6,1.5-7.9,4.5-.9,2.3-.4,5.1,1.3,6.8.7.7,1.6,1.2,2.6,1,.6-.1,1.1-.6,1.1-1.2.1-.9-.6-1.4-1.1-2.1-.9-1.2-.7-3,.4-4,.9-.9,2.2-1.1,3.5-1.1,1.2,0,2.3.2,3.3.8,1.4.8,2.3,2.3,2.7,3.9,1,4.8-2.9,8.7-8.2,9-2.7.2-5.4-.5-7.5-2.2-5.2-4.2-6.5-13-.5-17.6,5.8-4.4,13.1-3.3,17.4-1,3.4,1.8,6,4.9,8,8.2,1,1.7,1.8,3.4,2.6,5.2.7,1.7,1.4,3.4,2.9,4.7,1,.8,2.2.8,3.5.8h7.3c1,0,.8-.7.3-1.1-1-1-2.4-1.2-3.7-1.6-3-.8-2.7-4.7-1.8-4.7,2.7,0,2.7.1,5,0,3.3,0,4.4-.2,7,.7,1.4.6,2.8,1.9,3.7,3.2"/>
      </g>
    </g>
  </svg>
);

const SECTIONS = {
  INSTALL: 'install',
  NETWORK: 'network',
  OS: 'os',
  STORAGE: 'storage',
  ADDONS: 'addons',
  SYSTEM: 'system',
  PREVIEW: 'preview',
  ABOUT: 'about',
};

const COMMON_ADDONS = [
  'rancher-monitoring',
  'rancher-logging',
  'harvester-vm-import-controller',
  'harvester-pcidevices-controller',
  'harvester-seeder'
];

// Bonding Modes Definition
const BOND_MODES = [
  { value: 'balance-tlb', label: 'Balance-TLB (Mode 5)', description: 'Adaptive transmit load balancing. No switch config required. (Default)' },
  { value: 'active-backup', label: 'Active-Backup (Mode 1)', description: 'One link active, others backup. No switch config required.' },
  { value: 'balance-rr', label: 'Balance-RR (Mode 0)', description: 'Round-robin policy. Requires static Etherchannel/trunk on switch.' },
  { value: 'balance-xor', label: 'Balance-XOR (Mode 2)', description: 'Transmit based on hash policy. Requires static Etherchannel/trunk.' },
  { value: 'broadcast', label: 'Broadcast (Mode 3)', description: 'Transmits on all slave interfaces. Fault tolerance only.' },
  { value: '802.3ad', label: '802.3ad (Mode 4)', description: 'IEEE 802.3ad Dynamic link aggregation. Requires LACP on switch.' },
  { value: 'balance-alb', label: 'Balance-ALB (Mode 6)', description: 'Adaptive load balancing (IPv4). No switch config required.' },
];

// Helper to remove empty values
const pruneEmpty = (obj: any): any => {
  if (obj === null || obj === undefined || obj === '') return undefined;
  if (typeof obj === 'boolean' || typeof obj === 'number') return obj;
  
  if (Array.isArray(obj)) {
    const cleaned = obj.map(pruneEmpty).filter(v => v !== undefined);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  
  if (typeof obj === 'object') {
    const newObj: any = {};
    let hasKeys = false;
    for (const key in obj) {
      const cleaned = pruneEmpty(obj[key]);
      if (cleaned !== undefined) {
        newObj[key] = cleaned;
        hasKeys = true;
      }
    }
    return hasKeys ? newObj : undefined;
  }
  
  return obj;
};

export default function App() {
  const [config, setConfig] = useState<HarvesterConfig>(DEFAULT_CONFIG);
  const [activeSection, setActiveSection] = useState(SECTIONS.INSTALL);
  const [validation, setValidation] = useState<ValidationResult>({ valid: true, errors: [] });
  const [showPassword, setShowPassword] = useState(false);
  const [excludeEmpty, setExcludeEmpty] = useState(true);
  
  // Storage Filter State
  const [newFilterType, setNewFilterType] = useState<'attribute' | 'wwid'>('attribute');
  const [newFilterVendor, setNewFilterVendor] = useState('');
  const [newFilterProduct, setNewFilterProduct] = useState('');
  const [newFilterWWID, setNewFilterWWID] = useState('');
  const [filterAction, setFilterAction] = useState<'blacklist' | 'exception'>('blacklist');

  // Validation Logic
  const validateConfig = useCallback((cfg: HarvesterConfig): ValidationResult => {
    const errors: string[] = [];
    
    if (!cfg.token) errors.push("Cluster Token is required.");
    if (cfg.token && cfg.token.length < 5) errors.push("Cluster Token is too short (unsafe).");
    
    if (cfg.install?.mode === 'join' && !cfg.server_url) {
      errors.push("Server URL is required when joining an existing cluster.");
    }
    
    if (cfg.install?.mode === 'create' && cfg.install.vip_mode === 'ssn' && !cfg.install.vip) {
      errors.push("VIP (Virtual IP) is required for creating a cluster when VIP Mode is SSN.");
    }

    if (cfg.install?.management_interface?.method === 'static') {
      if (!cfg.install.management_interface.ip) errors.push("Static IP is required for static network method.");
      if (!cfg.install.management_interface.subnet_mask) errors.push("Subnet Mask is required for static network method.");
      if (!cfg.install.management_interface.gateway) errors.push("Gateway is required for static network method.");
    }
    
    if (!cfg.install?.management_interface?.interfaces || cfg.install.management_interface.interfaces.length === 0) {
      errors.push("At least one network interface is required.");
    }

    if ((!cfg.os?.ssh_authorized_keys || cfg.os.ssh_authorized_keys.length === 0) && !cfg.os?.password) {
      errors.push("Either SSH Keys or a Password must be set to access the node.");
    }

    return { valid: errors.length === 0, errors };
  }, []);

  useEffect(() => {
    setValidation(validateConfig(config));
  }, [config, validateConfig]);

  const generateFinalYaml = useCallback(() => {
    // 1. Deep clone to avoid mutating state
    let finalConfig = JSON.parse(JSON.stringify(config));
    
    // 2. Prune empty fields if requested
    if (excludeEmpty) {
      finalConfig = pruneEmpty(finalConfig);
    }

    // 3. Dump YAML using forceQuotes to ensure all string values (including storage regexes) are quoted.
    // This avoids the issue where special characters might be interpreted or left bare.
    // We also use lineWidth: -1 to prevent line wrapping for long regexes/keys.
    return jsYaml.dump(finalConfig, {
      noRefs: true,
      lineWidth: -1,
      forceQuotes: true 
    });
  }, [config, excludeEmpty]);

  const handleExport = () => {
    const yamlStr = generateFinalYaml();
    const blob = new Blob([yamlStr], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harvester-config-${config.os.hostname || 'node'}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const loadedConfig = jsYaml.load(content) as HarvesterConfig;
          
          // Deep merge logic
          const newConfig = {
            ...DEFAULT_CONFIG,
            ...loadedConfig,
            os: { 
              ...DEFAULT_CONFIG.os, 
              ...(loadedConfig.os || {}),
              externalStorageConfig: {
                ...DEFAULT_CONFIG.os.externalStorageConfig,
                ...(loadedConfig.os?.externalStorageConfig || {})
              },
              sshd: {
                ...DEFAULT_CONFIG.os.sshd,
                ...(loadedConfig.os?.sshd || {})
              }
            },
            install: {
              ...DEFAULT_CONFIG.install,
              ...(loadedConfig.install || {}),
              management_interface: {
                ...DEFAULT_CONFIG.install.management_interface,
                ...(loadedConfig.install?.management_interface || {})
              },
              addons: {
                ...(loadedConfig.install?.addons || {})
              }
            },
            system_settings: {
              ...DEFAULT_CONFIG.system_settings,
              ...(loadedConfig.system_settings || {})
            }
          };

          setConfig(newConfig);
        } catch (error) {
          alert("Failed to parse YAML file");
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  const addStorageRule = () => {
    const currentStorage = config.os.externalStorageConfig || { enabled: true };
    const multiPathConfig = currentStorage.multiPathConfig || { 
      blacklist: [], blacklistWwids: [], blacklistExceptions: [], blacklistExceptionWwids: [] 
    };
    
    // Create new config object to update state
    const newStorageConfig = { ...currentStorage, multiPathConfig: { ...multiPathConfig } };

    if (newFilterType === 'attribute') {
      if (!newFilterVendor && !newFilterProduct) return;
      const rule = {};
      if (newFilterVendor) (rule as any).vendor = newFilterVendor;
      if (newFilterProduct) (rule as any).product = newFilterProduct;

      if (filterAction === 'blacklist') {
        newStorageConfig.multiPathConfig!.blacklist = [...(multiPathConfig.blacklist || []), rule];
      } else {
        newStorageConfig.multiPathConfig!.blacklistExceptions = [...(multiPathConfig.blacklistExceptions || []), rule];
      }
    } else {
      if (!newFilterWWID) return;
      if (filterAction === 'blacklist') {
         newStorageConfig.multiPathConfig!.blacklistWwids = [...(multiPathConfig.blacklistWwids || []), newFilterWWID];
      } else {
         newStorageConfig.multiPathConfig!.blacklistExceptionWwids = [...(multiPathConfig.blacklistExceptionWwids || []), newFilterWWID];
      }
    }

    setConfig({ ...config, os: { ...config.os, externalStorageConfig: newStorageConfig } });
    setNewFilterVendor('');
    setNewFilterProduct('');
    setNewFilterWWID('');
  };

  const removeStorageRule = (idx: number, type: 'blacklist' | 'exception', isWwid: boolean) => {
    const currentStorage = config.os.externalStorageConfig || { enabled: true };
    const multiPathConfig = currentStorage.multiPathConfig || {};
    const newStorageConfig = { ...currentStorage, multiPathConfig: { ...multiPathConfig } };

    if (type === 'blacklist') {
      if (isWwid) {
        newStorageConfig.multiPathConfig!.blacklistWwids = (multiPathConfig.blacklistWwids || []).filter((_, i) => i !== idx);
      } else {
        newStorageConfig.multiPathConfig!.blacklist = (multiPathConfig.blacklist || []).filter((_, i) => i !== idx);
      }
    } else {
      if (isWwid) {
         newStorageConfig.multiPathConfig!.blacklistExceptionWwids = (multiPathConfig.blacklistExceptionWwids || []).filter((_, i) => i !== idx);
      } else {
         newStorageConfig.multiPathConfig!.blacklistExceptions = (multiPathConfig.blacklistExceptions || []).filter((_, i) => i !== idx);
      }
    }
    setConfig({ ...config, os: { ...config.os, externalStorageConfig: newStorageConfig } });
  };

  const toggleAddon = (name: string, enabled: boolean) => {
    const currentAddons = config.install.addons || {};
    let newAddons = { ...currentAddons };
    
    if (enabled) {
      if (!newAddons[name]) {
        newAddons[name] = { enabled: true, values_content: '' };
      } else {
        newAddons[name] = { ...newAddons[name], enabled: true };
      }
    } else {
       if (newAddons[name]) {
        newAddons[name] = { ...newAddons[name], enabled: false };
      }
    }
    setConfig({ ...config, install: { ...config.install, addons: newAddons } });
  };

  const updateAddonContent = (name: string, content: string) => {
    const currentAddons = config.install.addons || {};
    const newAddons = { ...currentAddons };
    if (newAddons[name]) {
      newAddons[name] = { ...newAddons[name], values_content: content };
    }
    setConfig({ ...config, install: { ...config.install, addons: newAddons } });
  };

  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="mb-4">
           <img src={HARVESTER_LOGO_URL} alt="Harvester" className="h-8 w-auto mb-2 opacity-90" />
           <p className="text-xs text-gray-500 font-medium">Auto-Install Configurator</p>
        </div>
        <p className="text-[10px] text-gray-600 font-mono mt-1">{APP_VERSION}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-4">
        <SidebarItem 
          active={activeSection === SECTIONS.INSTALL} 
          onClick={() => setActiveSection(SECTIONS.INSTALL)} 
          icon={<Server size={18} />} 
          label="Installation Mode" 
        />
        <SidebarItem 
          active={activeSection === SECTIONS.NETWORK} 
          onClick={() => setActiveSection(SECTIONS.NETWORK)} 
          icon={<Network size={18} />} 
          label="Network" 
        />
        <SidebarItem 
          active={activeSection === SECTIONS.STORAGE} 
          onClick={() => setActiveSection(SECTIONS.STORAGE)} 
          icon={<HardDrive size={18} />} 
          label="External Storage" 
        />
        <SidebarItem 
          active={activeSection === SECTIONS.ADDONS} 
          onClick={() => setActiveSection(SECTIONS.ADDONS)} 
          icon={<Box size={18} />} 
          label="Addons" 
        />
        <SidebarItem 
          active={activeSection === SECTIONS.OS} 
          onClick={() => setActiveSection(SECTIONS.OS)} 
          icon={<Cpu size={18} />} 
          label="OS Settings" 
        />
        <SidebarItem 
          active={activeSection === SECTIONS.SYSTEM} 
          onClick={() => setActiveSection(SECTIONS.SYSTEM)} 
          icon={<Settings size={18} />} 
          label="System Settings" 
        />
        <div className="my-4 border-t border-gray-800"></div>
        <SidebarItem 
          active={activeSection === SECTIONS.PREVIEW} 
          onClick={() => setActiveSection(SECTIONS.PREVIEW)} 
          icon={<FileText size={18} />} 
          label="Preview & Export" 
        />
        <SidebarItem 
          active={activeSection === SECTIONS.ABOUT} 
          onClick={() => setActiveSection(SECTIONS.ABOUT)} 
          icon={<HelpCircle size={18} />} 
          label="About & Usage" 
        />
      </nav>

      <div className="p-4 border-t border-gray-800 flex-none">
        <div className={`p-3 rounded-lg border ${validation.valid ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
          <div className="flex items-center gap-2 mb-1">
            {validation.valid ? <CheckCircle className="text-green-500 w-4 h-4"/> : <AlertTriangle className="text-red-500 w-4 h-4"/>}
            <span className={`text-sm font-medium ${validation.valid ? 'text-green-400' : 'text-red-400'}`}>
              {validation.valid ? 'Valid Config' : 'Invalid Config'}
            </span>
          </div>
          {!validation.valid && (
            <p className="text-xs text-red-300 mt-1">{validation.errors.length} issues found</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderInstallSection = () => (
    <div className="space-y-6 max-w-3xl">
      <SectionHeader title="Installation Mode" description="Configure how Harvester is installed on this node." />
      
      <div className="grid grid-cols-2 gap-4">
        <SelectionCard 
          selected={config.install?.mode === 'create'} 
          onClick={() => setConfig({...config, install: {...config.install, mode: 'create'}})}
          title="Create Cluster"
          description="Initialize a new Harvester cluster. This node will be the first management node."
        />
        <SelectionCard 
          selected={config.install?.mode === 'join'} 
          onClick={() => setConfig({...config, install: {...config.install, mode: 'join'}})}
          title="Join Cluster"
          description="Join an existing Harvester cluster. You will need the management URL and token."
        />
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Cluster Details</h3>
        
        {config.install?.mode === 'join' && (
          <InputGroup label="Server URL" required value={config.server_url} tooltip="The URL of the existing cluster's management VIP.">
            <input 
              type="text" 
              className="input-field" 
              placeholder="https://192.168.1.100:8443"
              value={config.server_url || ''}
              onChange={(e) => setConfig({...config, server_url: e.target.value})}
            />
          </InputGroup>
        )}

        <InputGroup label="Cluster Token" required value={config.token} tooltip="A shared secret used for nodes to join the cluster.">
           <input 
             type="text"
             className="input-field" 
             placeholder="Secret Token"
             value={config.token}
             onChange={(e) => setConfig({...config, token: e.target.value})}
           />
        </InputGroup>

         {config.install?.mode === 'create' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="VIP Mode" value={config.install.vip_mode} tooltip="Method for assigning the Management Virtual IP. (v1.0.3+)">
                <select 
                  className="input-field"
                  value={config.install.vip_mode || 'ssn'}
                  onChange={(e) => setConfig({...config, install: {...config.install, vip_mode: e.target.value as 'ssn' | 'dhcp'}})}
                >
                  <option value="ssn">Static (SSN)</option>
                  <option value="dhcp">DHCP</option>
                </select>
              </InputGroup>
              
              <InputGroup label="VIP HW Addr (Optional)" value={config.install.vip_hw_addr} tooltip="MAC address to reserve for the VIP if using DHCP.">
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="52:54:00:..."
                  value={config.install.vip_hw_addr || ''}
                  onChange={(e) => setConfig({...config, install: {...config.install, vip_hw_addr: e.target.value}})}
                />
              </InputGroup>
            </div>

            {config.install.vip_mode !== 'dhcp' && (
              <InputGroup label="Management VIP" required value={config.install.vip} tooltip="Virtual IP for high availability access to the management dashboard.">
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="192.168.1.100"
                  value={config.install.vip || ''}
                  onChange={(e) => setConfig({...config, install: {...config.install, vip: e.target.value}})}
                />
              </InputGroup>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-800">
               <h4 className="text-sm font-semibold text-gray-300 mb-3">Cluster Networking (Advanced)</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputGroup label="Pod CIDR" value={config.install.cluster_pod_cidr}>
                    <input type="text" className="input-field" placeholder="10.52.0.0/16" 
                      value={config.install.cluster_pod_cidr || ''} 
                      onChange={e => setConfig({...config, install: {...config.install, cluster_pod_cidr: e.target.value}})} />
                  </InputGroup>
                  <InputGroup label="Service CIDR" value={config.install.cluster_service_cidr}>
                    <input type="text" className="input-field" placeholder="10.53.0.0/16" 
                      value={config.install.cluster_service_cidr || ''} 
                      onChange={e => setConfig({...config, install: {...config.install, cluster_service_cidr: e.target.value}})} />
                  </InputGroup>
                  <InputGroup label="Cluster DNS" value={config.install.cluster_dns}>
                    <input type="text" className="input-field" placeholder="10.53.0.10" 
                      value={config.install.cluster_dns || ''} 
                      onChange={e => setConfig({...config, install: {...config.install, cluster_dns: e.target.value}})} />
                  </InputGroup>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Target Device</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Installation Disk" value={config.install.device} tooltip="The block device where Harvester OS will be installed.">
            <input 
              type="text" 
              className="input-field" 
              placeholder="/dev/sda"
              value={config.install.device || ''}
              onChange={(e) => setConfig({...config, install: {...config.install, device: e.target.value}})}
            />
          </InputGroup>
          <InputGroup label="Data Disk (Optional)" value={config.install.data_disk} tooltip="Separate block device for storing data.">
            <input 
              type="text" 
              className="input-field" 
              placeholder="/dev/sdb"
              value={config.install.data_disk || ''}
              onChange={(e) => setConfig({...config, install: {...config.install, data_disk: e.target.value}})}
            />
          </InputGroup>
        </div>
        
        <InputGroup label="ISO URL" value={config.install.iso_url} tooltip="Source URL for the Harvester ISO if installing via network boot.">
          <input 
            type="text" 
            className="input-field" 
            placeholder="https://..."
            value={config.install.iso_url || ''}
            onChange={(e) => setConfig({...config, install: {...config.install, iso_url: e.target.value}})}
          />
        </InputGroup>

        <InputGroup label="TTY Console" value={config.install.tty} tooltip="Default TTY console parameter.">
          <input 
            type="text" 
            className="input-field" 
            placeholder="ttyS0,115200n8"
            value={config.install.tty || ''}
            onChange={(e) => setConfig({...config, install: {...config.install, tty: e.target.value}})}
          />
        </InputGroup>

        <div className="mt-4 pt-4 border-t border-gray-800">
           <h4 className="text-sm font-semibold text-gray-300 mb-3">Partitioning & Boot</h4>
           <div className="flex flex-wrap gap-6">
              <Checkbox label="Force GPT" checked={config.install.force_gpt} 
                onChange={c => setConfig({...config, install: {...config.install, force_gpt: c}})} />
              <Checkbox label="Force EFI" checked={config.install.force_efi} 
                onChange={c => setConfig({...config, install: {...config.install, force_efi: c}})} />
              <Checkbox label="Force MBR" checked={config.install.force_mbr} 
                onChange={c => setConfig({...config, install: {...config.install, force_mbr: c}})} />
           </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
           <h4 className="text-sm font-semibold text-gray-300 mb-3">Advanced Install Options</h4>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Checkbox label="Debug Mode" checked={config.install.debug} 
                onChange={c => setConfig({...config, install: {...config.install, debug: c}})} />
              <Checkbox label="Silent Install" checked={config.install.silent} 
                onChange={c => setConfig({...config, install: {...config.install, silent: c}})} />
              <Checkbox label="Poweroff After" checked={config.install.poweroff} 
                onChange={c => setConfig({...config, install: {...config.install, poweroff: c}})} />
              <Checkbox label="No Format" checked={config.install.no_format} 
                onChange={c => setConfig({...config, install: {...config.install, no_format: c}})} />
              <Checkbox label="Skip Checks (v1.7+)" checked={config.install.skip_checks} 
                onChange={c => setConfig({...config, install: {...config.install, skip_checks: c}})} />
           </div>
        </div>
      </div>
    </div>
  );

  const renderNetworkSection = () => (
    <div className="space-y-6 max-w-3xl">
      <SectionHeader title="Network Configuration" description="Configure the management interface, bonding, and IP settings." />

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
         <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Management Interface</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="md:col-span-2">
             <InputGroup label="Physical Interfaces" required value={config.install.management_interface.interfaces} tooltip="List of physical interface names (e.g. eth0, eth1) to use.">
               <div className="space-y-2">
                 {config.install.management_interface.interfaces.map((iface, idx) => (
                   <div key={idx} className="flex gap-2">
                     <input 
                       type="text" 
                       className="input-field" 
                       placeholder="eth0"
                       value={iface.name}
                       onChange={(e) => {
                          const newInterfaces = [...config.install.management_interface.interfaces];
                          newInterfaces[idx] = { ...newInterfaces[idx], name: e.target.value };
                          setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, interfaces: newInterfaces}}});
                       }}
                     />
                     {config.install.management_interface.interfaces.length > 1 && (
                       <button 
                         onClick={() => {
                           const newInterfaces = config.install.management_interface.interfaces.filter((_, i) => i !== idx);
                           setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, interfaces: newInterfaces}}});
                         }}
                         className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                       >
                         <Trash2 size={16} />
                       </button>
                     )}
                   </div>
                 ))}
                 <button 
                   onClick={() => {
                     const newInterfaces = [...config.install.management_interface.interfaces, { name: '' }];
                     setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, interfaces: newInterfaces}}});
                   }}
                   className="text-xs text-harvester-500 hover:text-harvester-400 flex items-center gap-1 font-medium"
                 >
                   <Plus size={14} /> Add Interface
                 </button>
               </div>
             </InputGroup>
           </div>

           <div className="md:col-span-2">
              <InputGroup label="Bonding Mode" value={config.install.management_interface.bond_options} tooltip="Bonding mode for the management interface.">
                <select 
                  className="input-field"
                  value={config.install.management_interface.bond_options?.split('mode=')[1]?.split(' ')[0] || 'balance-tlb'}
                  onChange={(e) => {
                     // construct bond options string. Preserving miimon=100 default if not present or just resetting it.
                     // Default is 'mode=balance-tlb miimon=100'
                     const mode = e.target.value;
                     const current = config.install.management_interface.bond_options || '';
                     const miimon = current.includes('miimon=') ? current.split('miimon=')[1].split(' ')[0] : '100';
                     setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, bond_options: `mode=${mode} miimon=${miimon}`}}});
                  }}
                >
                   {BOND_MODES.map(m => (
                     <option key={m.value} value={m.value}>{m.label}</option>
                   ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {BOND_MODES.find(m => config.install.management_interface.bond_options?.includes(`mode=${m.value}`))?.description || BOND_MODES[0].description}
                </p>
              </InputGroup>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800 pt-4 mt-2">
            <InputGroup label="VLAN ID (Optional)" value={config.install.management_interface.vlan_id} tooltip="VLAN tag for the management network.">
              <input 
                type="number" 
                className="input-field" 
                placeholder="e.g. 100"
                value={config.install.management_interface.vlan_id || ''}
                onChange={(e) => setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, vlan_id: parseInt(e.target.value)}}})}
              />
            </InputGroup>
            <InputGroup label="MTU (Optional)" value={config.install.management_interface.mtu} tooltip="Maximum Transmission Unit.">
              <input 
                type="number" 
                className="input-field" 
                placeholder="1500"
                value={config.install.management_interface.mtu || ''}
                onChange={(e) => setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, mtu: parseInt(e.target.value)}}})}
              />
            </InputGroup>
         </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">IP Configuration</h3>
        
        <div className="flex gap-4 mb-4">
           <div onClick={() => setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, method: 'dhcp'}}})}
                className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${config.install.management_interface.method === 'dhcp' ? 'bg-harvester-900/50 border-harvester-500 text-white' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
              DHCP
           </div>
           <div onClick={() => setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, method: 'static'}}})}
                className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${config.install.management_interface.method === 'static' ? 'bg-harvester-900/50 border-harvester-500 text-white' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
              Static IP
           </div>
        </div>

        {config.install.management_interface.method === 'static' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
            <InputGroup label="IP Address" required value={config.install.management_interface.ip}>
               <input 
                  type="text" className="input-field" placeholder="192.168.1.10"
                  value={config.install.management_interface.ip || ''}
                  onChange={(e) => setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, ip: e.target.value}}})}
               />
            </InputGroup>
            <InputGroup label="Subnet Mask" required value={config.install.management_interface.subnet_mask}>
               <input 
                  type="text" className="input-field" placeholder="255.255.255.0"
                  value={config.install.management_interface.subnet_mask || ''}
                  onChange={(e) => setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, subnet_mask: e.target.value}}})}
               />
            </InputGroup>
            <InputGroup label="Gateway" required value={config.install.management_interface.gateway}>
               <input 
                  type="text" className="input-field" placeholder="192.168.1.1"
                  value={config.install.management_interface.gateway || ''}
                  onChange={(e) => setConfig({...config, install: {...config.install, management_interface: {...config.install.management_interface, gateway: e.target.value}}})}
               />
            </InputGroup>
          </div>
        )}
      </div>
    </div>
  );

  const renderStorageSection = () => {
    const multiPath = config.os.externalStorageConfig?.multiPathConfig || {};
    const blacklist = multiPath.blacklist || [];
    const blacklistWwids = multiPath.blacklistWwids || [];
    const exceptions = multiPath.blacklistExceptions || [];
    const exceptionWwids = multiPath.blacklistExceptionWwids || [];

    const hasFilters = blacklist.length > 0 || blacklistWwids.length > 0 || exceptions.length > 0 || exceptionWwids.length > 0;

    return (
    <div className="space-y-6 max-w-3xl">
      <SectionHeader title="External Storage Configuration" description="Configure multipath rules to blacklist or whitelist specific storage devices." />

      <div className="bg-blue-900/10 border border-blue-900/50 p-4 rounded-lg mb-6">
        <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
           <HardDrive className="w-4 h-4"/> How to identify disks
        </h4>
        <p className="text-sm text-blue-200/80 mb-2">
          Run <code>lsblk -o NAME,MODEL,VENDOR,SERIAL</code> to find the strings.
        </p>
        <p className="text-xs text-blue-200/60 mt-1">
          <strong>Tip:</strong> You can use <code>!</code> inside the string to act as a regex negation (e.g., <code>!QEMU</code> matches everything except QEMU).
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700 w-fit mb-4">
           <button onClick={() => setNewFilterType('attribute')} className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${newFilterType === 'attribute' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>Device Attributes</button>
           <button onClick={() => setNewFilterType('wwid')} className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${newFilterType === 'wwid' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>WWID</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {newFilterType === 'attribute' ? (
            <>
              <div className="md:col-span-4">
                <InputGroup label="Vendor" value={newFilterVendor}>
                  <input type="text" className="input-field" placeholder="e.g. Samsung" value={newFilterVendor} onChange={(e) => setNewFilterVendor(e.target.value)}/>
                </InputGroup>
              </div>
              <div className="md:col-span-4">
                 <InputGroup label="Product / Model" value={newFilterProduct}>
                  <input type="text" className="input-field" placeholder="e.g. SSD 860" value={newFilterProduct} onChange={(e) => setNewFilterProduct(e.target.value)}/>
                </InputGroup>
              </div>
            </>
          ) : (
            <div className="md:col-span-8">
               <InputGroup label="World Wide Identifier (WWID)" value={newFilterWWID} tooltip="A regex string to match the device WWID.">
                  <input type="text" className="input-field" placeholder="e.g. ^0QEMU_QEMU_HARDDISK_disk[0-9]+" value={newFilterWWID} onChange={(e) => setNewFilterWWID(e.target.value)}/>
               </InputGroup>
            </div>
          )}
          
          <div className="md:col-span-2">
             <label className="block text-sm font-medium mb-1.5 ml-1 text-gray-500">List Type</label>
             <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
               <button onClick={() => setFilterAction('blacklist')} className={`flex-1 py-1.5 text-xs font-medium rounded ${filterAction === 'blacklist' ? 'bg-red-900/50 text-red-200' : 'text-gray-400 hover:text-gray-200'}`}>Blacklist</button>
               <button onClick={() => setFilterAction('exception')} className={`flex-1 py-1.5 text-xs font-medium rounded ${filterAction === 'exception' ? 'bg-green-900/50 text-green-200' : 'text-gray-400 hover:text-gray-200'}`}>Exception</button>
             </div>
          </div>
          <div className="md:col-span-2">
            <button 
              onClick={addStorageRule}
              disabled={newFilterType === 'attribute' ? (!newFilterVendor && !newFilterProduct) : !newFilterWWID}
              className="w-full px-4 py-2 bg-harvester-600 hover:bg-harvester-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blacklist Column */}
          <div className="space-y-3">
             <h3 className="text-sm font-medium text-red-400 flex items-center gap-2">
               <X size={14} /> Blacklist (Exclude)
             </h3>
             {(blacklist.length === 0 && blacklistWwids.length === 0) ? (
               <div className="text-xs text-gray-600 italic p-3 bg-black/20 rounded border border-gray-800">No active blacklist rules.</div>
             ) : (
               <div className="space-y-2">
                 {blacklist.map((rule, idx) => (
                   <StorageRuleItem key={`bl-${idx}`} rule={rule} onDelete={() => removeStorageRule(idx, 'blacklist', false)} />
                 ))}
                 {blacklistWwids.map((wwid, idx) => (
                   <StorageRuleItem key={`blw-${idx}`} wwid={wwid} onDelete={() => removeStorageRule(idx, 'blacklist', true)} />
                 ))}
               </div>
             )}
          </div>

          {/* Exceptions Column */}
          <div className="space-y-3">
             <h3 className="text-sm font-medium text-green-400 flex items-center gap-2">
               <CheckCircle size={14} /> Exceptions (Include)
             </h3>
             {(exceptions.length === 0 && exceptionWwids.length === 0) ? (
               <div className="text-xs text-gray-600 italic p-3 bg-black/20 rounded border border-gray-800">No active exception rules.</div>
             ) : (
                <div className="space-y-2">
                 {exceptions.map((rule, idx) => (
                   <StorageRuleItem key={`ex-${idx}`} rule={rule} onDelete={() => removeStorageRule(idx, 'exception', false)} />
                 ))}
                 {exceptionWwids.map((wwid, idx) => (
                   <StorageRuleItem key={`exw-${idx}`} wwid={wwid} onDelete={() => removeStorageRule(idx, 'exception', true)} />
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )};

  const renderAddonsSection = () => {
    const activeAddons = config.install.addons || {};
    
    return (
      <div className="space-y-6 max-w-3xl">
        <SectionHeader title="Addons" description="Enable and configure Harvester addons automatically during installation." />
        
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
          {COMMON_ADDONS.map(addon => {
             const isEnabled = activeAddons[addon]?.enabled;
             return (
              <div key={addon} className={`p-4 rounded-lg border transition-all ${isEnabled ? 'bg-gray-800/50 border-harvester-600/50' : 'bg-black/20 border-gray-800'}`}>
                <div className="flex items-center justify-between mb-2">
                   <Checkbox 
                      label={addon} 
                      checked={isEnabled} 
                      onChange={(checked) => toggleAddon(addon, checked)}
                      className="text-lg font-medium"
                   />
                </div>
                {isEnabled && (
                  <div className="mt-2 pl-6 animate-in fade-in">
                    <label className="block text-xs text-gray-400 mb-1">Values Content (YAML)</label>
                    <textarea 
                      className="input-field min-h-[80px] font-mono text-xs"
                      placeholder="Leave empty for default values..."
                      value={activeAddons[addon]?.values_content || ''}
                      onChange={(e) => updateAddonContent(addon, e.target.value)}
                    />
                  </div>
                )}
              </div>
             );
          })}

          <div className="mt-6 pt-6 border-t border-gray-800">
             <p className="text-sm text-gray-500 italic">
               Note: You can add other custom addons by editing the YAML directly in the Preview section.
             </p>
          </div>
        </div>
      </div>
    );
  };

  const renderOSSection = () => (
    <div className="space-y-6 max-w-3xl">
      <SectionHeader title="OS Settings" description="Configure the underlying operating system users and networking." />
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <InputGroup label="Hostname" value={config.os.hostname}>
          <input 
            type="text" 
            className="input-field" 
            value={config.os.hostname || ''}
            onChange={(e) => setConfig({...config, os: {...config.os, hostname: e.target.value}})}
          />
        </InputGroup>
        
        <InputGroup label="Root Password" value={config.os.password} tooltip="Password for the 'rancher' user. It's recommended to use SSH keys instead.">
          <div className="relative flex-1">
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field pr-10" 
              placeholder="Optional if SSH keys are provided"
              value={config.os.password || ''}
              onChange={(e) => setConfig({...config, os: {...config.os, password: e.target.value}})}
            />
             <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </InputGroup>

        <InputGroup label="SSH Authorized Keys" value={config.os.ssh_authorized_keys} tooltip="One key per line. Allows passwordless login for the 'rancher' user.">
           <textarea 
             className="input-field min-h-[100px] font-mono text-xs" 
             placeholder="ssh-rsa AAAAB3..."
             value={(config.os.ssh_authorized_keys || []).join('\n')}
             onChange={(e) => setConfig({...config, os: {...config.os, ssh_authorized_keys: e.target.value.split('\n')}})}
           />
        </InputGroup>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
         <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2 flex items-center gap-2">
           <ShieldCheck className="w-5 h-5 text-harvester-500" /> SSHD Configuration
         </h3>
         <div className="flex flex-wrap gap-6 mb-4">
             <Checkbox label="Enable SSHD" checked={config.os.sshd?.enabled ?? true} 
                onChange={c => setConfig({...config, os: {...config.os, sshd: {...config.os.sshd, enabled: c}}})} />
             <Checkbox label="Allow SFTP" checked={config.os.sshd?.sftp ?? true} 
                onChange={c => setConfig({...config, os: {...config.os, sshd: {...config.os.sshd, sftp: c}}})} />
         </div>
         <InputGroup label="SSH Port" value={config.os.sshd?.port}>
            <input type="number" className="input-field" placeholder="22" 
               value={config.os.sshd?.port || ''}
               onChange={e => setConfig({...config, os: {...config.os, sshd: {...config.os.sshd, port: parseInt(e.target.value)}}})} />
         </InputGroup>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">DNS & NTP</h3>
        <InputGroup label="DNS Nameservers" value={config.os.dns_nameservers}>
           <input 
            type="text" 
            className="input-field" 
            placeholder="8.8.8.8, 1.1.1.1"
            value={config.os.dns_nameservers?.join(', ') || ''}
            onChange={(e) => setConfig({...config, os: {...config.os, dns_nameservers: e.target.value.split(',').map(s => s.trim())}})}
          />
        </InputGroup>
        <InputGroup label="NTP Servers" value={config.os.ntp_servers}>
           <input 
            type="text" 
            className="input-field" 
            placeholder="0.suse.pool.ntp.org, 1.suse.pool.ntp.org"
            value={config.os.ntp_servers?.join(', ') || ''}
            onChange={(e) => setConfig({...config, os: {...config.os, ntp_servers: e.target.value.split(',').map(s => s.trim())}})}
          />
        </InputGroup>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Advanced OS Options</h3>
        
        <InputGroup label="Kernel Modules" value={config.os.modules} tooltip="Comma-separated list of kernel modules to load.">
           <input 
            type="text" 
            className="input-field" 
            placeholder="nvme_tcp, e1000e"
            value={config.os.modules?.join(', ') || ''}
            onChange={(e) => setConfig({...config, os: {...config.os, modules: e.target.value.split(',').map(s => s.trim())}})}
          />
        </InputGroup>

        <InputGroup label="Sysctls" value={config.os.sysctls} tooltip="Kernel parameters in key=value format, one per line.">
           <textarea 
             className="input-field min-h-[80px]" 
             placeholder="net.ipv4.ip_forward=1"
             value={Object.entries(config.os.sysctls || {}).map(([k, v]) => `${k}=${v}`).join('\n')}
             onChange={(e) => {
               const newSysctls: Record<string, string> = {};
               e.target.value.split('\n').forEach(line => {
                 const [k, v] = line.split('=');
                 if (k && v) newSysctls[k.trim()] = v.trim();
               });
               setConfig({...config, os: {...config.os, sysctls: newSysctls}});
             }}
           />
        </InputGroup>
        
        <InputGroup label="Node Labels" value={config.os.labels} tooltip="Labels to apply to the node, one per line (key=value).">
           <textarea 
             className="input-field min-h-[80px]" 
             placeholder="topology.kubernetes.io/region=us-east-1"
             value={Object.entries(config.os.labels || {}).map(([k, v]) => `${k}=${v}`).join('\n')}
             onChange={(e) => {
               const newLabels: Record<string, string> = {};
               e.target.value.split('\n').forEach(line => {
                 const [k, v] = line.split('=');
                 if (k && v) newLabels[k.trim()] = v.trim();
               });
               setConfig({...config, os: {...config.os, labels: newLabels}});
             }}
           />
        </InputGroup>
      </div>
    </div>
  );

  const renderSystemSection = () => (
    <div className="space-y-6 max-w-3xl">
      <SectionHeader title="System Settings" description="Configure global system-wide settings like proxies and CAs." />
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">HTTP Proxy</h3>
        <InputGroup label="HTTP Proxy" value={config.system_settings?.['http-proxy']} tooltip="Proxy URL for HTTP requests.">
          <input 
            type="text" className="input-field" placeholder="http://proxy.example.com:8080"
            value={config.system_settings?.['http-proxy'] || ''}
            onChange={(e) => setConfig({...config, system_settings: { ...config.system_settings, 'http-proxy': e.target.value }})}
          />
        </InputGroup>
        <InputGroup label="HTTPS Proxy" value={config.system_settings?.['https-proxy']} tooltip="Proxy URL for HTTPS requests.">
          <input 
            type="text" className="input-field" placeholder="http://proxy.example.com:8080"
            value={config.system_settings?.['https-proxy'] || ''}
            onChange={(e) => setConfig({...config, system_settings: { ...config.system_settings, 'https-proxy': e.target.value }})}
          />
        </InputGroup>
        <InputGroup label="No Proxy" value={config.system_settings?.['no-proxy']} tooltip="Comma-separated list of domains/IPs to bypass the proxy.">
          <input 
            type="text" className="input-field" placeholder="127.0.0.1,localhost,10.0.0.0/8"
            value={config.system_settings?.['no-proxy'] || ''}
            onChange={(e) => setConfig({...config, system_settings: { ...config.system_settings, 'no-proxy': e.target.value }})}
          />
        </InputGroup>
      </div>
       <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
         <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Other</h3>
         <InputGroup label="Auto Disk Provision Paths" value={config.system_settings?.['auto-disk-provision-paths']}>
           <input type="text" className="input-field" placeholder="" 
             value={config.system_settings?.['auto-disk-provision-paths'] || ''} 
             onChange={e => setConfig({...config, system_settings: { ...config.system_settings, 'auto-disk-provision-paths': e.target.value }})} />
         </InputGroup>
      </div>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Certificates</h3>
        <InputGroup label="Additional CA Certs" value={config.system_settings?.['additional-ca']} tooltip="PEM encoded CA certificates to trust.">
           <textarea 
             className="input-field min-h-[150px] font-mono text-xs" 
             placeholder="-----BEGIN CERTIFICATE-----..."
             value={config.system_settings?.['additional-ca'] || ''}
             onChange={(e) => setConfig({...config, system_settings: { ...config.system_settings, 'additional-ca': e.target.value }})}
           />
        </InputGroup>
      </div>
    </div>
  );

  const renderPreviewSection = () => (
    <div className="h-full flex flex-col max-w-4xl">
      <SectionHeader title="Review & Export" description="Validate your configuration and export it to a file." />
      {!validation.valid && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5"/> Configuration Errors
          </h3>
          <ul className="list-disc list-inside text-red-300 space-y-1">
            {validation.errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4 flex-none">
          <div className="flex gap-4">
            <button onClick={handleExport} className="flex items-center gap-2 bg-harvester-600 hover:bg-harvester-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Download className="w-4 h-4" /> Download YAML
            </button>
            <label className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors border border-gray-700">
              <Upload className="w-4 h-4" /> Import YAML
              <input type="file" onChange={handleImport} accept=".yaml,.yml" className="hidden" />
            </label>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
             <div className={`w-10 h-6 rounded-full p-1 transition-colors ${excludeEmpty ? 'bg-harvester-600' : 'bg-gray-700'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${excludeEmpty ? 'translate-x-4' : 'translate-x-0'}`}></div>
             </div>
             <input type="checkbox" checked={excludeEmpty} onChange={e => setExcludeEmpty(e.target.checked)} className="hidden" />
             <span className="text-sm font-medium text-gray-300">Exclude Empty Sections</span>
          </label>
        </div>
        <div className="flex-1 min-h-0 relative">
          <CodeBlock content={generateFinalYaml()} className="absolute inset-0" />
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader title="About & Usage" description="Learn how to use the generated configuration file to automate your Harvester installation." />
      
      <div className="space-y-6">
        {/* Intro */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-harvester-900/30 rounded-lg text-harvester-500">
               <BookOpen size={24} />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-white mb-2">What is this file?</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                 The YAML file you generate here contains all the instructions needed to install Harvester without human intervention. 
                 It defines network settings, disk partitioning, cluster tokens, and OS configurations. By hosting this file on a web server, 
                 you can instruct the Harvester installer to fetch and apply it automatically.
               </p>
             </div>
          </div>
        </div>

        {/* Community & Enterprise Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://harvesterhci.io" target="_blank" rel="noopener noreferrer" className="flex flex-col justify-between bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-harvester-500 transition-all hover:bg-gray-800/50 group">
                <div>
                    <div className="flex items-center mb-4">
                       <img src={HARVESTER_LOGO_URL} alt="Harvester" className="h-8 w-auto" />
                    </div>
                    <p className="text-gray-400 text-xs mb-4">
                      The open-source hyperconverged infrastructure (HCI) software built on Kubernetes.
                    </p>
                </div>
                <div className="text-harvester-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                   Official Website <ArrowUpRight size={14} />
                </div>
            </a>

            <a href="https://www.suse.com/products/rancher/virtualization/" target="_blank" rel="noopener noreferrer" className="flex flex-col justify-between bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-[#FE7C3F] transition-all hover:bg-gray-800/50 group">
                <div>
                    <div className="flex items-center mb-4">
                       <SuseLogo className="h-10 w-auto" />
                    </div>
                    <p className="text-gray-400 text-xs mb-4">
                      Enterprise-grade, fully supported virtualization management platform based on Harvester.
                    </p>
                </div>
                <div className="text-[#FE7C3F] text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                   SUSE Virtualization <ArrowUpRight size={14} />
                </div>
            </a>
        </div>

        {/* Usage Methods */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
           <div className="p-4 border-b border-gray-800 bg-gray-800/50">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                 <Terminal size={18} /> Installation Methods
              </h3>
           </div>
           
           <div className="p-6 space-y-8">
              {/* Method 1 */}
              <div>
                 <h4 className="text-harvester-400 font-medium mb-2">Method 1: Kernel Parameters (PXE / iPXE)</h4>
                 <p className="text-sm text-gray-400 mb-3">
                   This is the most common automation method. When booting the Harvester ISO via PXE, append the `harvester.install.config_url` parameter to the kernel command line.
                 </p>
                 <div className="bg-black/50 p-4 rounded-lg border border-gray-700 font-mono text-xs text-gray-300 overflow-x-auto">
                   kernel vmlinuz ip=dhcp harvester.install.config_url=<span className="text-green-400">http://192.168.1.50/config.yaml</span> ...
                 </div>
              </div>

              {/* Method 2 */}
              <div className="border-t border-gray-800 pt-6">
                 <h4 className="text-harvester-400 font-medium mb-2">Method 2: ISO GRUB Edit (Manual)</h4>
                 <p className="text-sm text-gray-400 mb-3">
                   If you are booting from a USB drive or standard ISO but want to skip the interactive wizard:
                 </p>
                 <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2 ml-2">
                    <li>Boot the Harvester ISO.</li>
                    <li>On the GRUB menu, highlight "Harvester Installer" and press <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs text-white">e</kbd>.</li>
                    <li>Find the line starting with <code className="text-gray-300">linux (loop0)/harvester...</code>.</li>
                    <li>Append the config URL parameter to the end of that line:</li>
                 </ol>
                 <div className="mt-3 bg-black/50 p-4 rounded-lg border border-gray-700 font-mono text-xs text-gray-300 overflow-x-auto">
                   harvester.install.config_url=<span className="text-green-400">http://192.168.1.50/config.yaml</span>
                 </div>
                 <p className="text-sm text-gray-400 mt-3 ml-2">
                    Press <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs text-white">Ctrl + x</kbd> or <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs text-white">F10</kbd> to boot.
                 </p>
              </div>

               {/* Method 3 */}
              <div className="border-t border-gray-800 pt-6">
                 <h4 className="text-harvester-400 font-medium mb-2">Method 3: Automated ISO Remastering</h4>
                 <p className="text-sm text-gray-400 mb-2">
                   You can embed this configuration directly into a custom ISO image.
                 </p>
                 <p className="text-sm text-gray-400">
                    Create a file named <code className="text-white">harvester-config.yaml</code> in the root of the ISO filesystem or use tools like <code className="text-white">osctl</code> to inject it.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-gray-300 font-sans relative">
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="absolute top-0 right-0 z-50 pointer-events-auto">
         <div className="relative overflow-hidden w-24 h-24">
           <div className="absolute top-0 right-0 w-[150%] h-[30px] bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-wider shadow-lg transform translate-x-[30%] translate-y-[50%] rotate-45 border-b border-gray-700 hover:bg-gray-700 transition-colors">
              <Github className="w-3 h-3 mr-1 inline-block" /> Fork Me
           </div>
         </div>
      </a>
      {renderSidebar()}
      <main className="ml-64 p-8 h-screen overflow-y-auto">
        {activeSection === SECTIONS.INSTALL && renderInstallSection()}
        {activeSection === SECTIONS.NETWORK && renderNetworkSection()}
        {activeSection === SECTIONS.STORAGE && renderStorageSection()}
        {activeSection === SECTIONS.ADDONS && renderAddonsSection()}
        {activeSection === SECTIONS.OS && renderOSSection()}
        {activeSection === SECTIONS.SYSTEM && renderSystemSection()}
        {activeSection === SECTIONS.PREVIEW && renderPreviewSection()}
        {activeSection === SECTIONS.ABOUT && renderAboutSection()}
      </main>
    </div>
  );
}

// Sub-components
const SidebarItem = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-harvester-600 text-white shadow-lg shadow-harvester-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
    {icon} {label}
  </button>
);

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="mb-8 border-b border-gray-800 pb-4">
    <h2 className="text-3xl font-light text-white mb-2">{title}</h2>
    <p className="text-gray-400">{description}</p>
  </div>
);

const SelectionCard = ({ selected, onClick, title, description }: any) => (
  <div onClick={onClick} className={`cursor-pointer p-6 rounded-xl border transition-all duration-200 ${selected ? 'bg-harvester-900/20 border-harvester-500 ring-1 ring-harvester-500' : 'bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800'}`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className={`font-semibold ${selected ? 'text-harvester-500' : 'text-white'}`}>{title}</h3>
      {selected && <CheckCircle className="w-5 h-5 text-harvester-500" />}
    </div>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

const InputGroup = ({ label, children, required = false, value, helpText, tooltip }: any) => {
  const isFilled = value !== undefined && value !== null && value !== '' && 
    (!Array.isArray(value) || value.length > 0) &&
    (typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length > 0);
  
  return (
    <div className={`transition-all duration-300 ${isFilled ? 'opacity-100' : 'opacity-90'}`}>
      <div className="flex justify-between items-center mb-1.5 ml-1">
        <label className={`block text-sm font-medium transition-colors ${isFilled ? 'text-gray-200' : 'text-gray-500'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div className={`relative rounded-lg transition-all duration-200 ${isFilled ? 'ring-1 ring-gray-600 bg-gray-900' : ''}`}>{children}</div>
      {helpText && <p className="text-xs text-gray-600 mt-1 ml-1">{helpText}</p>}
      <style>{`
        .input-field { width: 100%; background-color: #09090b; border: 1px solid #27272a; color: white; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; outline: none; transition: border-color 0.15s ease-in-out; }
        .input-field::placeholder { color: #52525b; opacity: 0.6; }
        .input-field:focus { border-color: #22c55e; ring: 1px solid #22c55e; }
      `}</style>
    </div>
  );
};

const Checkbox = ({ label, checked, onChange, className = '' }: { label: string, checked?: boolean, onChange: (val: boolean) => void, className?: string }) => (
  <label className={`flex items-center gap-2 cursor-pointer group ${className}`}>
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-harvester-500 focus:ring-harvester-500" />
    <span className={`text-sm transition-colors ${checked ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{label}</span>
  </label>
);

interface StorageRuleItemProps {
  rule?: { vendor?: string; product?: string };
  wwid?: string;
  onDelete: () => void;
}

const StorageRuleItem: React.FC<StorageRuleItemProps> = ({ rule, wwid, onDelete }) => (
  <div className="flex justify-between items-center p-3 bg-gray-950/50 rounded border border-gray-800/50 text-sm">
    <div className="flex flex-col gap-0.5">
      {wwid ? (
        <div className="text-gray-300 font-mono text-xs"><span className="text-blue-400">WWID:</span> {wwid}</div>
      ) : (
        <>
          {rule?.vendor && <div className="text-gray-300"><span className="text-gray-500 text-xs">Vendor:</span> {rule.vendor}</div>}
          {rule?.product && <div className="text-gray-300"><span className="text-gray-500 text-xs">Product:</span> {rule.product}</div>}
        </>
      )}
    </div>
    <button onClick={onDelete} className="text-gray-600 hover:text-red-400 p-1"><Trash2 size={14}/></button>
  </div>
);