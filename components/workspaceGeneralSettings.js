"use client"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Upload } from "lucide-react"

export default function WorkspaceGeneralSettings({ workspace }) {
    const [name, setName] = useState(workspace.name || "")
    const [description, setDescription] = useState(workspace.description || "")
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewURL, setPreviewURL] = useState(workspace.imageURL || null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const uploadToCloudinary = async (file) => {
        const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
        const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("cloud_name", CLOUD_NAME);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data.secure_url;
    };

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage({ type: "", text: "" })

        try {
            let imageURL = workspace.imageURL
            if (selectedFile) {
                imageURL = await uploadToCloudinary(selectedFile)
            }

            const docRef = doc(db, "workspaces", workspace.id)
            await updateDoc(docRef, {
                name,
                description,
                imageURL
            })

            setMessage({ type: "success", text: "Workspace updated successfully." })
            setSelectedFile(null)
        } catch (error) {
            console.error("Error updating workspace:", error)
            setMessage({ type: "error", text: "Failed to update workspace." })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight mb-4">General Settings</h2>
            
            <FieldGroup className="space-y-6">
                <Field>
                    <FieldLabel htmlFor="workspaceName">Workspace Name</FieldLabel>
                    <Input
                        id="workspaceName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="workspaceDescription">Description</FieldLabel>
                    <Input
                        id="workspaceDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="workspaceImage">Workspace Image</FieldLabel>
                    <div className="mt-2 flex items-center gap-6">
                        <div className="flex-1">
                            <label
                                htmlFor="workspaceImage"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="size-6 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Click to upload new image
                                    </p>
                                </div>
                                <input
                                    id="workspaceImage"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setSelectedFile(file)
                                            setPreviewURL(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        {previewURL && (
                            <div className="size-24 lg:size-32 shrink-0 rounded-xl overflow-hidden border-2 border-border shadow-sm">
                                <img src={previewURL} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </Field>

                {message.text && (
                    <p className={`text-sm font-medium ${message.type === 'error' ? 'text-destructive' : 'text-green-500'}`}>
                        {message.text}
                    </p>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting || (!selectedFile && name === workspace.name && description === workspace.description)}
                        className="bg-vertex-primary hover:bg-vertex-primary/90 text-white"
                    >
                        {isSubmitting ? <Spinner className="mr-2" /> : null}
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    )
}
