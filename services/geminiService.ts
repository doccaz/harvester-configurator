import { GoogleGenAI, Type } from "@google/genai";
import { HarvesterConfig, DEFAULT_CONFIG } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateConfigFromPrompt = async (prompt: string): Promise<HarvesterConfig> => {
  const ai = getAiClient();
  
  const systemInstruction = `You are a DevOps expert specializing in Harvester HCI (Hyperconverged Infrastructure). 
  Your task is to generate a valid Harvester configuration YAML converted to a JSON object based on the user's natural language request.
  
  The configuration follows a specific schema (Harvester v1.7+):
  - scheme_version: 1
  - token: string (cluster secret)
  - server_url: string (only for join mode)
  - os: { ssh_authorized_keys: [], hostname: string, password: string, ntp_servers: [], dns_nameservers: [] }
  - install: { 
      mode: 'create'|'join', 
      vip: string, 
      vip_mode: 'ssn'|'dhcp',
      device: string, 
      data_disk: string,
      force_gpt: boolean,
      debug: boolean,
      management_interface: { 
        method: 'dhcp'|'static', 
        interfaces: [{name: string}], 
        bond_options: string,
        vlan_id: number,
        mtu: number,
        ip: string, 
        gateway: string, 
        subnet_mask: string 
      } 
    }
  
  If the user does not specify details (like IPs or tokens), use sensible placeholders.
  For network bonding, if multiple interfaces are implied, populate 'interfaces' array and 'bond_options'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scheme_version: { type: Type.INTEGER },
            token: { type: Type.STRING },
            server_url: { type: Type.STRING },
            os: {
              type: Type.OBJECT,
              properties: {
                hostname: { type: Type.STRING },
                password: { type: Type.STRING },
                ssh_authorized_keys: { type: Type.ARRAY, items: { type: Type.STRING } },
                ntp_servers: { type: Type.ARRAY, items: { type: Type.STRING } },
                dns_nameservers: { type: Type.ARRAY, items: { type: Type.STRING } },
              }
            },
            install: {
              type: Type.OBJECT,
              properties: {
                mode: { type: Type.STRING, enum: ['create', 'join'] },
                vip: { type: Type.STRING },
                vip_mode: { type: Type.STRING, enum: ['ssn', 'dhcp'] },
                vip_hw_addr: { type: Type.STRING },
                device: { type: Type.STRING },
                data_disk: { type: Type.STRING },
                iso_url: { type: Type.STRING },
                tty: { type: Type.STRING },
                debug: { type: Type.BOOLEAN },
                force_gpt: { type: Type.BOOLEAN },
                management_interface: {
                  type: Type.OBJECT,
                  properties: {
                    method: { type: Type.STRING, enum: ['dhcp', 'static'] },
                    ip: { type: Type.STRING },
                    gateway: { type: Type.STRING },
                    subnet_mask: { type: Type.STRING },
                    bond_options: { type: Type.STRING },
                    vlan_id: { type: Type.INTEGER },
                    mtu: { type: Type.INTEGER },
                    interfaces: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const generated = JSON.parse(response.text);
      // Merge with default to ensure no missing optional fields break the UI
      return { 
        ...DEFAULT_CONFIG, 
        ...generated, 
        install: { 
          ...DEFAULT_CONFIG.install, 
          ...generated.install,
          management_interface: {
            ...DEFAULT_CONFIG.install.management_interface,
            ...(generated.install?.management_interface || {})
          }
        }, 
        os: { 
          ...DEFAULT_CONFIG.os, 
          ...generated.os 
        } 
      };
    }
    throw new Error("No response generated");
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};

export const explainConfig = async (config: HarvesterConfig): Promise<string> => {
  const ai = getAiClient();
  const configStr = JSON.stringify(config, null, 2);
  
  const prompt = `Analyze the following Harvester configuration and provide a summary of what this node will do. 
  Highlight key settings like the Installation Mode, Network Configuration (especially bonding), and OS settings. 
  Warn if there are any obvious missing security practices (like default passwords or missing SSH keys).
  
  Config:
  ${configStr}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini explanation error:", error);
    return "Error generating explanation. Please check your API key.";
  }
};