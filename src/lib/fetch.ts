import type { V1DeploymentList, V1PodList } from "@kubernetes/client-node";

export async function fetchDeployments() {
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

export async function fetchPods() {
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

export async function fetchNodes() {
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