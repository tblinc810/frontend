import axios from 'axios';

// All base URLs go through Vite proxy → HAProxy → OpenStack (no CORS)
const KEYSTONE = import.meta.env.VITE_KEYSTONE_URL;  // /proxy/keystone/v3
const NOVA = import.meta.env.VITE_NOVA_URL;       // /proxy/nova/v2.1
const NEUTRON = import.meta.env.VITE_NEUTRON_URL;    // /proxy/neutron
const GLANCE = import.meta.env.VITE_GLANCE_URL;     // /proxy/glance
const CINDER = import.meta.env.VITE_CINDER_URL;     // /proxy/cinder/v3
const IRONIC = '/proxy/baremetal';                  // Added for Bare Metal

function api(baseURL: string, token?: string) {
    return axios.create({
        baseURL,
        headers: token ? { 'X-Auth-Token': token } : {}
    });
}

export interface AuthResult {
    token: string;
    project_id?: string;
    user: { name: string; id: string };
}

export const openstackService = {
    async authenticate(
        username: string,
        password: string,
        domain = 'Default',
        project?: string
    ): Promise<AuthResult> {
        const payload: any = {
            auth: {
                identity: {
                    methods: ['password'],
                    password: {
                        user: { name: username, domain: { name: domain }, password }
                    }
                }
            }
        };

        if (project) {
            payload.auth.scope = { project: { name: project, domain: { name: domain } } };
        }

        const resp = await api(KEYSTONE).post('/auth/tokens', payload);
        const token = resp.headers['x-subject-token'];

        return {
            token,
            project_id: resp.data.token.project?.id,
            user: {
                name: resp.data.token.user.name,
                id: resp.data.token.user.id
            }
        };
    },

    async getMyProjects(token: string) {
        // GET /v3/auth/projects
        const resp = await api(KEYSTONE, token).get('/auth/projects');
        return resp.data.projects;
    },

    async getInstances(token: string, projectId: string) {
        // Nova requires project ID in path: /v2.1/{project_id}/servers/detail
        const resp = await api(`${NOVA}/${projectId}`, token).get('/servers/detail');
        return resp.data.servers ?? [];
    },

    async getImages(token: string) {
        const resp = await api(GLANCE, token).get('/v2/images');
        return resp.data.images ?? [];
    },

    async getVolumes(token: string, projectId: string) {
        // Cinder requires project ID in path: /v3/{project_id}/volumes/detail
        const resp = await api(`${CINDER}/${projectId}`, token).get('/volumes/detail');
        return resp.data.volumes ?? [];
    },

    async getNetworks(token: string) {
        const resp = await api(NEUTRON, token).get('/v2.0/networks');
        return resp.data.networks ?? [];
    },

    async getSubnets(token: string) {
        const resp = await api(NEUTRON, token).get('/v2.0/subnets');
        return resp.data.subnets ?? [];
    },

    async getRouters(token: string) {
        const resp = await api(NEUTRON, token).get('/v2.0/routers');
        return resp.data.routers ?? [];
    },

    async getFlavors(token: string, projectId: string) {
        const resp = await api(`${NOVA}/${projectId}`, token).get('/flavors/detail');
        return resp.data.flavors ?? [];
    },

    async getKeypairs(token: string, projectId: string) {
        const resp = await api(`${NOVA}/${projectId}`, token).get('/os-keypairs');
        return resp.data.keypairs ?? [];
    },

    async getSecurityGroups(token: string) {
        const resp = await api(NEUTRON, token).get('/v2.0/security-groups');
        return resp.data.security_groups ?? [];
    },

    async getFloatingIPs(token: string) {
        const resp = await api(NEUTRON, token).get('/v2.0/floatingips');
        return resp.data.floatingips ?? [];
    },

    async createInstance(token: string, projectId: string, payload: any) {
        // Nova server creation: POST /v2.1/{project_id}/servers
        const resp = await api(`${NOVA}/${projectId}`, token).post('/servers', { server: payload });
        return resp.data.server;
    },

    async serverAction(token: string, projectId: string, serverId: string, action: string, data: any = null) {
        // Nova server actions: POST /v2.1/{project_id}/servers/{server_id}/action
        const payload: any = {};
        payload[action] = data;
        const resp = await api(`${NOVA}/${projectId}`, token).post(`/servers/${serverId}/action`, payload);
        return resp.data;
    },

    async getVncConsole(token: string, projectId: string, serverId: string) {
        const payload = { 'os-getVNCConsole': { type: 'novnc' } };
        const resp = await api(`${NOVA}/${projectId}`, token).post(`/servers/${serverId}/action`, payload);
        return resp.data.console;
    },

    // Keystone Management (v3)
    async createUser(token: string, payload: any) {
        // POST /v3/users
        const resp = await api(KEYSTONE, token).post('/users', { user: payload });
        return resp.data.user;
    },

    async createProject(token: string, payload: any) {
        // POST /v3/projects
        const resp = await api(KEYSTONE, token).post('/projects', { project: payload });
        return resp.data.project;
    },

    async grantRole(token: string, projectId: string, userId: string, roleId: string) {
        // PUT /v3/projects/{project_id}/users/{user_id}/roles/{role_id}
        await api(KEYSTONE, token).put(`/projects/${projectId}/users/${userId}/roles/${roleId}`);
    },

    async getRoles(token: string) {
        const resp = await api(KEYSTONE, token).get('/roles');
        return resp.data.roles;
    },

    // Quota Management
    async setComputeQuota(token: string, projectId: string, quotas: any) {
        // PUT /v2.1/os-quota-sets/{tenant_id}
        await api(NOVA, token).put(`/os-quota-sets/${projectId}`, { quota_set: quotas });
    },

    async setNetworkQuota(token: string, projectId: string, quotas: any) {
        // PUT /v2.0/quotas/{tenant_id}
        await api(NEUTRON, token).put(`/quotas/${projectId}`, { quota: quotas });
    },

    async setVolumeQuota(token: string, projectId: string, quotas: any) {
        // PUT /v3/{project_id}/os-quota-sets/{project_id}
        await api(`${CINDER}/${projectId}`, token).put(`/os-quota-sets/${projectId}`, { quota_set: quotas });
    },

    async createKeypair(token: string, projectId: string, name: string) {
        // POST /v2.1/{project_id}/os-keypairs
        const resp = await api(`${NOVA}/${projectId}`, token).post('/os-keypairs', { keypair: { name } });
        return resp.data.keypair;
    },

    async deleteKeypair(token: string, projectId: string, name: string) {
        await api(`${NOVA}/${projectId}`, token).delete(`/os-keypairs/${name}`);
    },

    async getBaremetalNodes(token: string) {
        const resp = await api(IRONIC, token).get('/v1/nodes');
        return resp.data.nodes ?? [];
    }
};
