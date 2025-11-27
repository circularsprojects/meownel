import type { V1DeploymentList, V1PodList } from "@kubernetes/client-node";

export async function fetchDeployments(fetch: typeof globalThis.fetch = globalThis.fetch) {
    const promise: Promise<V1DeploymentList> = new Promise((resolve, reject) => {
        let statusCode: number;

        fetch("/api/deployments")
            .then(res => {
                statusCode = res.status;
                return res.json();
            })
            .then(data => {
                if (statusCode === 200) {
                    resolve(data);
                } else {
                    reject(data);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
    return promise;
}

export async function fetchPods(fetch: typeof globalThis.fetch = globalThis.fetch) {
    const promise: Promise<V1PodList> = new Promise((resolve, reject) => {
        let statusCode: number;

        fetch("/api/pods")
            .then(res => {
                statusCode = res.status;
                return res.json();
            })
            .then(data => {
                if (statusCode === 200) {
                    resolve(data);
                } else {
                    reject(data);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
    return promise;
}

export async function fetchNodes(fetch: typeof globalThis.fetch = globalThis.fetch) {
    const promise: Promise<string[]> = new Promise((resolve, reject) => {
        let statusCode: number;

        fetch("/api/nodes")
            .then(res => {
                statusCode = res.status;
                return res.json();
            })
            .then(data => {
                if (statusCode === 200) {
                    resolve(data);
                } else {
                    reject(data);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
    return promise;
}

export async function newDeployment({name, displayName, image, nodeName, env, mounts}: {name: string, displayName: string, image: string, nodeName: string, env: Record<string, string>, mounts: Record<string, string>}, fetch: typeof globalThis.fetch = globalThis.fetch) {
    const promise: Promise<string> = new Promise((resolve, reject) => {
        let statusCode: number;

        fetch("/api/deployments/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                displayName,
                image,
                nodeName,
                env,
                mounts
            })
        })
        .then(res => {
            statusCode = res.status;
            return res.json();
        })
        .then(data => {
            if (statusCode === 200) {
                resolve(data);
            } else {
                reject(data);
            }
        })
        .catch(err => {
            reject(err);
        })
    });
    
    return promise;
}