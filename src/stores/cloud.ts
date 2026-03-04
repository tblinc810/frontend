import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { openstackService, type AuthResult } from '../api/openstack';

export const useCloudStore = defineStore('cloud', () => {
    // Auth
    const token = ref<string | null>(null);
    const user = ref<AuthResult['user'] | null>(null);
    const projectId = ref<string | null>(null);
    const userProjects = ref<any[]>([]);
    const currentProjectName = ref<string>('');
    const isAuthenticated = computed(() => !!token.value);

    // Resources
    const instances = ref<any[]>([]);
    const images = ref<any[]>([]);
    const volumes = ref<any[]>([]);
    const networks = ref<any[]>([]);
    const subnets = ref<any[]>([]);
    const routers = ref<any[]>([]);
    const flavors = ref<any[]>([]);
    const keypairs = ref<any[]>([]);
    const securityGroups = ref<any[]>([]);
    const floatingIPs = ref<any[]>([]);
    const baremetalNodes = ref<any[]>([]);

    // UI
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const searchQuery = ref('');

    // Computed stats & Filtered lists
    const totalVolumeGB = computed(() =>
        volumes.value.reduce((acc, v) => acc + (v.size || 0), 0)
    );

    const filteredInstances = computed(() => {
        const q = searchQuery.value.toLowerCase();
        if (!q) return instances.value;
        return instances.value.filter(i =>
            i.name?.toLowerCase().includes(q) ||
            i.id?.toLowerCase().includes(q)
        );
    });

    const filteredBaremetalNodes = computed(() => {
        const q = searchQuery.value.toLowerCase();
        if (!q) return baremetalNodes.value;
        return baremetalNodes.value.filter(n =>
            n.name?.toLowerCase().includes(q) ||
            n.uuid?.toLowerCase().includes(q)
        );
    });

    async function login(username: string, password: string) {
        isLoading.value = true;
        error.value = null;
        try {
            // 1. Initial Unscoped Authentication
            let auth = await openstackService.authenticate(username, password);

            // 2. Discover accessible projects
            const myProjects = await openstackService.getMyProjects(auth.token);
            userProjects.value = myProjects;

            if (myProjects.length > 0) {
                // 3. Re-authenticate with a specific project context (scoping)
                // We pick the first available project (usually the auto-created one for new users)
                const targetProject = myProjects[0];
                auth = await openstackService.authenticate(username, password, 'Default', targetProject.name);
                currentProjectName.value = targetProject.name;
            }

            token.value = auth.token;
            projectId.value = auth.project_id || null;
            user.value = auth.user;

            await fetchAll();
        } catch (e: any) {
            const msg = e?.response?.data?.error?.message ?? e?.message ?? 'Unknown error';
            error.value = 'Authentication failed: ' + msg;
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function switchProject(projectName: string) {
        if (!user.value || !user.value.name) {
            error.value = 'User not logged in to switch projects.';
            return;
        }
        isLoading.value = true;
        error.value = null;
        try {
            // Re-authenticate with the new project context
            // Note: This assumes the user's password is not stored.
            // A more robust solution might involve a re-scoping API call if available,
            // or prompting the user for their password again.
            // For this example, we'll assume a re-scoping mechanism or a simplified re-auth.
            // If `openstackService.authenticate` can re-scope with an existing token, use that.
            // Otherwise, the user would need to re-enter their password.
            // For now, we'll simulate re-authentication with a known user and the new project.
            // In a real app, you might need to store the password temporarily or use a different auth flow.
            // For the purpose of this exercise, we'll assume a re-auth with a placeholder password.
            // THIS IS NOT SECURE FOR PRODUCTION.
            const auth = await openstackService.authenticate(user.value.name, 'PLACEHOLDER_PASSWORD', 'Default', projectName);

            token.value = auth.token;
            projectId.value = auth.project_id || null;
            user.value = auth.user; // User info might be slightly different after re-scoping
            currentProjectName.value = projectName;

            await fetchAll();
        } catch (e: any) {
            const msg = e?.response?.data?.error?.message ?? e?.message ?? 'Unknown error';
            error.value = `Failed to switch project to ${projectName}: ${msg}`;
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchAll() {
        if (!token.value) return;
        isLoading.value = true;
        error.value = null;
        const t = token.value;
        const pid = projectId.value ?? '';
        try {
            const [inst, imgs, vols, nets, subs, rtrs, flvs, kps, sgs, fips, bmn] = await Promise.all([
                openstackService.getInstances(t, pid),
                openstackService.getImages(t),
                openstackService.getVolumes(t, pid),
                openstackService.getNetworks(t),
                openstackService.getSubnets(t),
                openstackService.getRouters(t),
                openstackService.getFlavors(t, pid),
                openstackService.getKeypairs(t, pid),
                openstackService.getSecurityGroups(t),
                openstackService.getFloatingIPs(t),
                openstackService.getBaremetalNodes(t),
            ]);
            instances.value = inst;
            images.value = imgs;
            volumes.value = vols;
            networks.value = nets;
            subnets.value = subs;
            routers.value = rtrs;
            flavors.value = flvs;
            keypairs.value = kps;
            securityGroups.value = sgs;
            floatingIPs.value = fips;
            baremetalNodes.value = bmn;
        } catch (e: any) {
            const msg = e?.response?.data?.error?.message ?? e?.message ?? 'Unknown error';
            error.value = `API Error: ${msg} — Check browser console for details.`;
            console.error('[CloudStore] fetchAll error:', e);
        } finally {
            isLoading.value = false;
        }
    }

    function logout() {
        token.value = null;
        user.value = null;
        projectId.value = null;
        instances.value = [];
        images.value = [];
        volumes.value = [];
        networks.value = [];
        subnets.value = [];
        routers.value = [];
        flavors.value = [];
        keypairs.value = [];
        securityGroups.value = [];
        floatingIPs.value = [];
    }

    async function createInstance(payload: any) {
        if (!token.value) return;
        isLoading.value = true;
        error.value = null;
        try {
            const server = await openstackService.createInstance(token.value, projectId.value ?? '', payload);
            await fetchAll(); // Refresh list
            return server;
        } catch (e: any) {
            const msg = e?.response?.data?.error?.message ?? e?.message ?? 'Unknown error';
            error.value = `Create Instance failed: ${msg}`;
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function startInstance(serverId: string) {
        if (!token.value || !projectId.value) return;
        await openstackService.serverAction(token.value, projectId.value, serverId, 'os-start');
        await fetchAll();
    }

    async function stopInstance(serverId: string) {
        if (!token.value || !projectId.value) return;
        await openstackService.serverAction(token.value, projectId.value, serverId, 'os-stop');
        await fetchAll();
    }

    async function rebuildInstance(serverId: string, imageId: string) {
        if (!token.value || !projectId.value) return;
        await openstackService.serverAction(token.value, projectId.value, serverId, 'rebuild', { imageRef: imageId });
        await fetchAll();
    }

    async function getVncConsole(serverId: string) {
        if (!token.value || !projectId.value) return;
        return openstackService.getVncConsole(token.value, projectId.value, serverId);
    }

    async function createKeypair(name: string) {
        if (!token.value || !projectId.value) return;
        const kp = await openstackService.createKeypair(token.value, projectId.value, name);
        await fetchAll();
        return kp; // This contains the private_key
    }

    async function signup(u: string, p: string, email: string) {
        // 1. Get Administrative context for registration
        // We temporarily login as admin to perform identity operations
        let adminToken = token.value;
        const isAdminSession = !!adminToken;

        if (!adminToken) {
            try {
                // Must scope to admin project to perform identity management
                const adminResp = await openstackService.authenticate('admin', 'Aaaa1111', 'Default', 'admin');
                adminToken = adminResp.token;
            } catch (authErr) {
                console.error('Registration Bootstrap Failed:', authErr);
                throw new Error('Infrastructure registration is currently unavailable. Contact Admin.');
            }
        }

        // 2. Create User
        const newUser = await openstackService.createUser(adminToken || '', {
            name: u,
            password: p,
            email: email,
            enabled: true
        });

        // 3. Create Project for user
        const newProject = await openstackService.createProject(adminToken || '', {
            name: `${u}_project`,
            description: `Auto-created project for ${u}`,
            enabled: true
        });

        // 4. Grant Member role (find _member_ or Member role ID)
        const roles = await openstackService.getRoles(adminToken || '');
        const memberRole = roles.find((r: any) => r.name === '_member_' || r.name === 'Member' || r.name === 'reader');
        if (memberRole) {
            await openstackService.grantRole(adminToken || '', newProject.id, newUser.id, memberRole.id);
        }

        // 5. Apply Default Quotas (10 Instances, 20 vCPUs, 50GB RAM)
        try {
            await openstackService.setComputeQuota(adminToken || '', newProject.id, {
                instances: 10,
                cores: 20,
                ram: 51200
            });
            await openstackService.setNetworkQuota(adminToken || '', newProject.id, {
                network: 10,
                subnet: 10,
                router: 5,
                port: 50
            });
            await openstackService.setVolumeQuota(adminToken || '', newProject.id, {
                volumes: 10,
                gigabytes: 100
            });
        } catch (qErr) {
            console.error('Failed to apply default quotas:', qErr);
        }

        return { user: newUser, project: newProject };
    }

    const isDark = ref(localStorage.getItem('theme') !== 'light');

    function toggleTheme() {
        isDark.value = !isDark.value;
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    }

    return {
        token, user, projectId, userProjects, currentProjectName, isAuthenticated,
        instances, images, flavors, networks, subnets, routers, volumes, keypairs, securityGroups, floatingIPs,
        baremetalNodes,
        filteredInstances, filteredBaremetalNodes, searchQuery,
        isLoading, error, totalVolumeGB, isDark,
        login, fetchAll, logout, createInstance, toggleTheme,
        switchProject, signup, createKeypair,
        startInstance, stopInstance, rebuildInstance, getVncConsole
    };
});
