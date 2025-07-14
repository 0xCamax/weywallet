export function extractActionPrompt(responseText: string): string | null {
	const match = responseText.match(/Prompt para acción:\s*["“](.+?)["”]/);
	return match ? match[1] : null;
}