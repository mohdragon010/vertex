"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function NewWorkspaceForm() {
    const { user } = useAuth()
    const router = useRouter()
    const [workspaceFormData, setWorkspaceFormData] = useState({
        workspaceName: "",
        workspaceDescription: "",
        workspaceImageURL: "",
        workspaceSlug: "",
        workspaceMembers: [],
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

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

    const handleCreateNewWorkSpace = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageURL = workspaceFormData.workspaceImageURL;
            if (selectedFile) {
                imageURL = await uploadToCloudinary(selectedFile);
            }


            const collectionRef = collection(db, "workspaces");
            const q = query(collectionRef, where("slug", "==", workspaceFormData.workspaceSlug));
            const docSnap = await getDocs(q);
            if(!docSnap.empty) {setError("Another workpace with this slug already exsists"); return}
            await addDoc(collectionRef, {
                name:workspaceFormData.workspaceName,
                description:workspaceFormData.workspaceDescription,
                imageURL:imageURL,
                slug:workspaceFormData.workspaceSlug,
                members:[user?.uid],
                adminId:user?.uid,
                projects: [],
                createdAt:serverTimestamp(),
                updatedAt:serverTimestamp(),
            });

            setWorkspaceFormData({
                workspaceName: "",
                workspaceDescription: "",
                workspaceImageURL: "",
                workspaceSlug: "",
                workspaceMembers: [],
            })
            setSelectedFile(null);
            setPreviewURL(null)
        } catch(error){
            setError(error?.message || "Something went wrong, please try again.");
        }finally {
            setIsSubmitting(false);
            router.push("/workspaces")
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto py-10">
            <Card className="border-border/60 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        Create Workspace
                    </CardTitle>
                    <CardDescription>
                        Set up a new workspace for your team and projects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateNewWorkSpace}>
                        <FieldGroup className="space-y-6">
                            <Field>
                                <FieldLabel htmlFor="workspaceName">Workspace Name</FieldLabel>
                                <Input
                                    id="workspaceName"
                                    name="workspaceName"
                                    placeholder="e.g. Acme Corp"
                                    value={workspaceFormData.workspaceName}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        const newSlug = newName
                                            .toLowerCase()
                                            .replace(/ /g, "-")
                                            .replace(/[^\w-]+/g, "");
                                        setWorkspaceFormData({ ...workspaceFormData, workspaceName: newName, workspaceSlug: newSlug });
                                    }}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="workspaceSlug">Workspace URL</FieldLabel>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
                                        vertex.app/
                                    </span>
                                    <Input
                                        id="workspaceSlug"
                                        name="workspaceSlug"
                                        placeholder="workspace-url"
                                        value={workspaceFormData.workspaceSlug}
                                        onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, workspaceSlug: e.target.value })}
                                        required
                                    />
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="workspaceDescription">Description</FieldLabel>
                                <Input
                                    id="workspaceDescription"
                                    name="workspaceDescription"
                                    placeholder="What's this workspace about?"
                                    value={workspaceFormData.workspaceDescription}
                                    onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, workspaceDescription: e.target.value })}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="workspaceImage">Workspace Icon</FieldLabel>
                                <div className="mt-2 flex items-center justify-center w-full">
                                    <label
                                        htmlFor="workspaceImage"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="size-6 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                Click to upload workspace icon
                                            </p>
                                        </div>
                                        <input
                                            id="workspaceImage"
                                            name="workspaceImage"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setSelectedFile(file);
                                                    setPreviewURL(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                {previewURL && (
                                    <div className="mt-4 flex justify-center">
                                        <div className="size-20 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-md">
                                            <img src={previewURL} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                )}
                            </Field>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-[0.98]"
                            >
                                {isSubmitting ? <Spinner className="mr-2" /> : null}
                                {isSubmitting ? "Creating..." : "Create Workspace"}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}