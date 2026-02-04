# Harvester Automated Install Configurator

An interactive web application designed to generate, validate, and manage **Harvester HCI** configuration files (YAML) for automated installations.

### 🚀 **[See it in action here](https://doccaz.github.io/harvester-configurator)**

---

## Overview

Harvester uses cloud-init style YAML configuration files to automate the node installation process (commonly used with PXE boot or custom ISOs). Manually writing these files can be error-prone and often requires cross-referencing documentation.

This tool simplifies the process by providing a guided UI to:
*   **Create** compliant configuration files for Harvester v1.7+.
*   **Validate** essential settings (Tokens, VIPs, Interfaces) in real-time.
*   **Configure** complex networking (Bonding modes, VLANs, MTU).
*   **Manage** storage multipath rules (Blacklisting/Exceptions by Attribute or WWID).
*   **Export** ready-to-use YAML files for your infrastructure.

## Key Features

*   **Installation Modes**: Seamlessly switch between creating a new cluster (VIP/DHCP) or joining an existing one.
*   **Network Configuration**: Visual builder for Management interfaces, Bonding options (active-backup, balance-tlb, LACP, etc.), and Static vs. DHCP IP settings.
*   **OS Customization**: Configure SSH keys, Root passwords, NTP servers, DNS, and Kernel modules.
*   **External Storage**: dedicated UI for configuring Multipath blacklists and exceptions to handle specific storage devices.
*   **YAML Preview**: View the generated YAML in real-time, with options to exclude empty sections for cleaner output.
*   **Import/Export**: Load existing YAML files to edit them or save your configuration for later use.

## Development

To run this project locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm start
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

## License

MIT

---
*Built for the Harvester Community.*