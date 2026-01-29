export async function postDataToServer(file: File) {
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