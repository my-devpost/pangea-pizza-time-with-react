// Import the Pangea SDK
import { PangeaConfig, Vault, VaultService, AuditService, PangeaErrors } from "pangea-node-sdk";
//const Pangea = require('pangea-node-sdk');


export const vault = (vaultToken, pangeaDomain) => {
	console.log(pangeaDomain, vaultToken);

    const config = new PangeaConfig({ domain: pangeaDomain });
    return new VaultService(vaultToken, config);
}

export const getVaultItem = async (vault, id, pangeaDomain) => {
  const config = new PangeaConfig({ domain: pangeaDomain });
  // get item from vault by id

  const response = await vault.getItem(
      id,
      {
          version: 1,
          version_state: Vault.ItemVersionState.ACTIVE,
          verbose: true,
      }
  )
  const item = response.result.current_version.secret;
  return item;
}

export const audit = async (vault, auditID, pangeaDomain) => {
    const config = new PangeaConfig({ domain: pangeaDomain });
    // get audit token from vault

    const response = await vault.getItem(
        auditID,
        {
            version: 1,
            version_state: Vault.ItemVersionState.ACTIVE,
            verbose: true,
        }
    )
    const auditToken = response.result.current_version.secret;

    console.log('>>>>>>>>>>>>>', auditToken);

    return new AuditService(auditToken, config);
}

export const clientIpAddress = (req) => {
  return (
    req?.headers['origin'] ||
    req?.socket.remoteAddress ||
    'localhost'
  )
}

export const hostIpAddress = (req) => {
  return (
    req?.headers['host'] ||
    req?.hostname ||
    'localhost'
  )
}

// Export the reference to the AuditService and convenience functions
//module.exports = { vault, audit, clientIpAddress, hostIpAddress }
