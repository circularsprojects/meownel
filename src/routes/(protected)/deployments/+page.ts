import { fetchDeployments, fetchPods, fetchNodes } from "$lib/fetch";
import type { V1DeploymentList, V1PodList } from "@kubernetes/client-node";

// async function fetchBoth() {
//     const promise: Promise<{ deployments: V1DeploymentList; pods: V1PodList }> = new Promise(async (resolve, reject) => {
//         try {
//             const deployments = await fetchDeployments();
//             const pods = await fetchPods();
//             resolve({ deployments, pods });
//         } catch (error) {
//             reject(error);
//         }
//     });
//     return promise;
// }

export async function load({ fetch }) {
    // let both = $state(fetchBoth());
    let [deployments, pods, nodes] = await Promise.all([
        fetchDeployments(fetch),
        fetchPods(fetch),
        fetchNodes(fetch)
    ])

    return { deployments, pods, nodes };
}