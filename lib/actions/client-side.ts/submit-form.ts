"use server"
import { getSignedUri } from "../aws/s3";
import { reqRoles } from "../require-auth";

export async function pushFileToS3(file: File) {
    await reqRoles.allowRoles(["dev"])
    
    const  { url, key } = await getSignedUri(file.name);

    const putRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": "text/csv"
        }
    })

    if (!putRes.ok) {
        const text = await putRes.text().catch(() => "");
        console.error("S3 PUT failed", {
            status: putRes.status,
            statusText: putRes.statusText,
            body: text,
        });
        throw new Error(`S3 upload failed: ${putRes.status} ${putRes.statusText}`);
    }
    return key
}

export async function postDataToServer(file: File) {
    await reqRoles.allowRoles(["dev"])
    const form = new FormData();
    form.append("file", file)

    const res = await fetch("http://localhost:3030/api/csv-upload", {
        method: "POST",
        body: form
    })
    if (!res.ok) {
        throw new Error("That didnt go well")
    }

    const result = await res.json()
    return result
}