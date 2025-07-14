import { useEffect, useState } from 'preact/hooks';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface DocumentContent {
	title: string;
	author: string;
	institution: string;
	content: string;
	pageNumbers: boolean;
	fontSize: number;
	lineSpacing: number;
}

export function PdfEditor() {
	const [documentContent, setDocumentContent] = useState<DocumentContent>({
		title: 'Título del Documento',
		author: 'Nombre del Autor',
		institution: 'Institución',
		content:
			'Escriba aquí el contenido de su documento académico...\n\nI. INTRODUCCIÓN\n\nEste documento sigue el formato IEEE para publicaciones académicas. El formato IEEE es ampliamente utilizado en ingeniería, ciencias de la computación y tecnología.\n\nII. DESARROLLO\n\nDesarrolle aquí el contenido principal de su documento, organizándolo en secciones numeradas con números romanos para las secciones principales y números arábigos para las subsecciones.\n\nIII. CONCLUSIONES\n\nPresente aquí las conclusiones de su trabajo.',
		pageNumbers: true,
		fontSize: 10,
		lineSpacing: 1.0,
	});

	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);


	// Clean up blob URL
	useEffect(() => {
		return () => {
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
			}
		};
	}, [pdfUrl]);

	const handleFileUpload = async (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file && file.type === 'application/pdf') {
			setIsLoading(true);
			try {
				// Solo actualizar el título basado en el nombre del archivo
				setDocumentContent((prev) => ({
					...prev,
					title: file.name.replace('.pdf', '').replace(/[-_]/g, ' '),
				}));

				// Mostrar mensaje informativo
				alert(
					'PDF importado correctamente. El contenido debe ser editado manualmente en el editor.'
				);
			} catch (error) {
				console.error('Error al importar PDF:', error);
				alert('Error al importar el archivo PDF.');
			} finally {
				setIsLoading(false);
			}
		}
	};

	const updateContent = (field: keyof DocumentContent, value: any) => {
		setDocumentContent((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const generatePDF = async () => {
		setIsLoading(true);
		try {
			const pdfDoc = await PDFDocument.create();
			const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
			const timesRomanBold = await pdfDoc.embedFont(
				StandardFonts.TimesRomanBold
			);

			// IEEE format: Letter size (8.5" x 11")
			const pageWidth = 612;
			const pageHeight = 792;
			const margin = 72; // 1 inch margins
			const contentWidth = pageWidth - 2 * margin;

			let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
			let currentY = pageHeight - margin;

			// Helper function to add text with word wrapping
			const addText = (
				text: string,
				fontSize: number,
				font: any,
				isBold = false,
				isCenter = false
			) => {
				const lines = text.split('\n');

				for (const line of lines) {
					if (line.trim() === '') {
						currentY -= fontSize * 0.8;
						continue;
					}

					const words = line.split(' ');
					let currentLine = '';

					for (const word of words) {
						const testLine = currentLine + (currentLine ? ' ' : '') + word;
						const textWidth = font.widthOfTextAtSize(testLine, fontSize);

						if (textWidth > contentWidth && currentLine) {
							// Draw current line
							const xPos = isCenter
								? (pageWidth - font.widthOfTextAtSize(currentLine, fontSize)) /
								  2
								: margin;

							currentPage.drawText(currentLine, {
								x: xPos,
								y: currentY,
								size: fontSize,
								font: font,
								color: rgb(0, 0, 0),
							});

							currentY -= fontSize * documentContent.lineSpacing;
							currentLine = word;
						} else {
							currentLine = testLine;
						}

						// Check if we need a new page
						if (currentY < margin + 50) {
							currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
							currentY = pageHeight - margin;
						}
					}

					// Draw the last line
					if (currentLine) {
						const xPos = isCenter
							? (pageWidth - font.widthOfTextAtSize(currentLine, fontSize)) / 2
							: margin;

						currentPage.drawText(currentLine, {
							x: xPos,
							y: currentY,
							size: fontSize,
							font: font,
							color: rgb(0, 0, 0),
						});
						currentY -= fontSize * documentContent.lineSpacing;
					}
				}
			};

			// IEEE Title (centered, bold, 14pt)
			currentY -= 10;
			addText(documentContent.title, 14, timesRomanBold, true, true);
			currentY -= 20;

			// Author (centered, 12pt)
			addText(documentContent.author, 12, timesRomanFont, false, true);
			currentY -= 8;

			// Institution (centered, italic style, 10pt)
			addText(documentContent.institution, 10, timesRomanFont, false, true);
			currentY -= 30;

			// Content (justified, 10pt Times Roman)
			addText(
				documentContent.content,
				documentContent.fontSize,
				timesRomanFont
			);

			// Add page numbers if enabled (IEEE format: bottom center)
			if (documentContent.pageNumbers) {
				const pages = pdfDoc.getPages();
				pages.forEach((page, index) => {
					const pageNumber = `${index + 1}`;
					const pageNumWidth = timesRomanFont.widthOfTextAtSize(pageNumber, 10);
					page.drawText(pageNumber, {
						x: (pageWidth - pageNumWidth) / 2,
						y: 30,
						size: 10,
						font: timesRomanFont,
						color: rgb(0, 0, 0),
					});
				});
			}

			const pdfBytes = await pdfDoc.save();
			downloadPdf(pdfBytes, `${documentContent.title}.pdf`);
		} catch (error) {
			console.error('Error generando PDF:', error);
			alert('Error al generar el PDF. Por favor, intente nuevamente.');
		} finally {
			setIsLoading(false);
		}
	};

	const downloadPdf = (bytes: Uint8Array, filename: string) => {
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
		}

		const blob = new Blob([bytes], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		setPdfUrl(url);

		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
					<div className="flex items-center gap-3">
						<input
							type="file"
							accept="application/pdf"
							className="file-input file-input-sm w-full"
							onChange={handleFileUpload}
						/>
						<button
							className="btn btn-primary btn-sm"
							onClick={generatePDF}
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="loading loading-spinner loading-sm"></span>
							) : (
								'Generar PDF'
							)}
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Main Editor */}
					<div className="lg:col-span-3">
						<div className="bg-white rounded-lg shadow-sm border">
							<div className="p-6">
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold text-gray-700">
													Título del documento
												</span>
											</label>
											<input
												type="text"
												className="input input-bordered"
												value={documentContent.title}
												onInput={(e) =>
													updateContent(
														'title',
														(e.target as HTMLInputElement).value
													)
												}
											/>
										</div>

										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold text-gray-700">
													Autor
												</span>
											</label>
											<input
												type="text"
												className="input input-bordered"
												value={documentContent.author}
												onInput={(e) =>
													updateContent(
														'author',
														(e.target as HTMLInputElement).value
													)
												}
											/>
										</div>
									</div>

									<div className="form-control">
										<label className="label">
											<span className="label-text font-semibold text-gray-700">
												Institución
											</span>
										</label>
										<input
											type="text"
											className="input input-bordered"
											value={documentContent.institution}
											onInput={(e) =>
												updateContent(
													'institution',
													(e.target as HTMLInputElement).value
												)
											}
										/>
									</div>

									<div className="form-control">
										<label className="label">
											<span className="label-text font-semibold text-gray-700">
												Contenido principal
											</span>
										</label>
										<textarea
											className="textarea textarea-bordered h-96 font-serif text-sm leading-relaxed"
											value={documentContent.content}
											onInput={(e) =>
												updateContent(
													'content',
													(e.target as HTMLTextAreaElement).value
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Preview Panel */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm border sticky top-4">
							<div className="p-4">
								<h3 className="font-bold text-lg text-gray-900 mb-4">
									Vista Previa
								</h3>

								<div className="border-2 border-gray-200 bg-white rounded">
									<div className="p-4 h-96 overflow-y-auto text-xs">
										<div className="text-center mb-6">
											<h4 className="font-bold text-sm mb-2">
												{documentContent.title}
											</h4>
											<p className="text-xs">{documentContent.author}</p>
											<p className="text-xs italic text-gray-600">
												{documentContent.institution}
											</p>
										</div>

										<div className="text-xs leading-relaxed font-serif">
											{documentContent.content
												.split('\n')
												.map((paragraph, index) => (
													<p key={index} className="mb-2 text-justify">
														{paragraph || '\u00A0'}
													</p>
												))}
										</div>
									</div>
								</div>

								{pdfUrl && (
									<div className="mt-4">
										<a
											href={pdfUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="btn btn-outline btn-sm w-full"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											Ver PDF Generado
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
