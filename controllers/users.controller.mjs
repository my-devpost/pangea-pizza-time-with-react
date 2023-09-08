// import { PangeaConfig, AuditService, VaultService, Vault, PangeaErrors } from "pangea-node-sdk";
//import { audit, clientIpAddress, hostIpAddress } from "../lib/pangea.mjs";
import * as Pangea from "../lib/pangea.mjs";

import * as userServices from "../services/users.service.mjs"

/*
const token = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const vault = new VaultService(token, config);
const id = process.env.PANGEA_AUDIT_TOKEN_ID;
*/

const vaultToken = process.env.PANGEA_VAULT_TOKEN;
const pangeaDomain = process.env.PANGEA_DOMAIN;
const vault = Pangea.vault(vaultToken, pangeaDomain);
const auditID = process.env.PANGEA_AUDIT_TOKEN_ID;
const audit = await Pangea.audit(vault, auditID, pangeaDomain);


export const getUsers = (req, res) => {
    userServices.getUsers()
        .then((result) => {
            res.status(200).json({
                message: "Users retrieved",
                data: result[0]
            })
        }).catch((err) => {
            res.status(500).send(err)
        })
};
export const getUser = (req, res) => {
    const { id } = req.params;
    userServices.getUser(id)
        .then((result) => {
            res.status(200).json({
                message: "User retrieved",
                data: result[0]
            })
        }).catch((err) => {
            res.status(500).send(err)
        })
};
export const createUser = (req, res) => {
    const user = req.body;
    console.log('user >>> ', user);
    userServices.createUser(user)
        .then(async () => {
		/*
	    // get audit token from vault
            const response = await vault.getItem(
	        id,
		{
		    version: 1,
		    version_state: Vault.ItemVersionState.ACTIVE,
		    verbose: true,
		}
	    );
	    
	    // audit log to pangea
	    const audit_token = response.result.current_version.secret;
	    console.log('audit token ', audit_token);
            const audit = new AuditService(audit_token, config);
  	    const data = {
		actor: user.email,
		action: "Create User",
		status: "Success",
		target:`${Pangea.hostIpAddress(req)}`,
		source:`${Pangea.clientIpAddress(req)}`,
		message: `User '${user.email}' created`,
	    };
	    const option = {
                verbose: true
            };
            const logResponse = await audit.log(data, option);
            console.log("Response: %s", logResponse.result);
*/

            const option = {
                verbose: true
            };
            const logResponse = await audit.log({
            actor: user.email,
            action: "Create User",
            status: "Success",
            target:`${Pangea.hostIpAddress(req)}`,
            source:`${Pangea.clientIpAddress(req)}`,
            message: `User '${user.email}' created`,
            }, option);
            console.log("Response: %s", logResponse.result);
		 
            res.status(200).json({
                message: "User created",
                data: user
            })
        }).catch((err) => {
    	    console.log('create user err >>> ', err);

            const option = {
                verbose: true
            };
            const logResponse = audit.log({
            actor: user.email,
            action: "Create User",
            status: "Failed",
            target:`${Pangea.hostIpAddress(req)}`,
            source:`${Pangea.clientIpAddress(req)}`,
            message: `User '${user.email}' failed to create`,
            }, option);
            console.log("Response: %s", logResponse.result);

            res.status(500).send(err)
        })
};
export const updateUser = (req, res) => {
    const user = req.body;
    const { id } = req.params;
    userServices.updateUser(id, user)
        .then(() => {
            const option = {
                verbose: true
            };
            const logResponse = audit.log({
            actor: user.email,
            action: "Update User",
            status: "Success",
            target:`${Pangea.hostIpAddress(req)}`,
            source:`${Pangea.clientIpAddress(req)}`,
            message: `User '${user.email}' updated`,
            }, option);
            console.log("Response: %s", logResponse.result);

            res.status(200).json({
                message: `User updated`,
                data: user
            })
        }).catch((err) => {
            const option = {
                verbose: true
            };
            const logResponse = audit.log({
            actor: user.email,
            action: "Update User",
            status: "Failed",
            target:`${Pangea.hostIpAddress(req)}`,
            source:`${Pangea.clientIpAddress(req)}`,
            message: `User '${user.email}' failed to update`,
            }, option);
            console.log("Response: %s", logResponse.result);


            res.status(500).send(err)
        })
};
export const deleteUser = (req, res) => {
    const { id } = req.params;
    userServices.deleteUser(id)
        .then(() => {
            res.status(200).json({
                message: "User deleted"
            })
        }).catch((err) => {
            res.status(500).send(err)
        })
};
