"use client";


import React, { useState } from "react";

export default function AudioTranscriptionPage() {
	const [file, setFile] = useState<File | null>(null);
	const [transcription, setTranscription] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Placeholder for Microsoft transcription API endpoint
	const API_URL = ""; // Replace with your Microsoft Transcription API URL

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setTranscription("");
			setError(null);
		}
	};

	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		setLoading(true);
		setTranscription("");
		setError(null);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch(API_URL, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Transcription failed.");
			}

			const data = await response.json();
			setTranscription(data.transcription || "No transcription found.");
		} catch (err: any) {
			setError(err.message || "An error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
			<h1 className="text-2xl font-bold mb-4">Audio Transcription</h1>
			<form onSubmit={handleUpload} className="space-y-4">
				<input
					type="file"
					accept="audio/*"
					onChange={handleFileChange}
					className="block w-full"
				/>
				<button
					type="submit"
					disabled={!file || loading}
					className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
				>
					{loading ? "Transcribing..." : "Upload & Transcribe"}
				</button>
			</form>

			{error && <div className="mt-4 text-red-600">{error}</div>}

			{transcription && (
				<div className="result mt-6">
					<h2 className="font-semibold mb-2">Transcription Result:</h2>
					<div className="p-3 bg-gray-100 rounded">{transcription}</div>
				</div>
			)}
		</div>
	);
}
