// Mock AI function for pixel description generation
export interface GeneratePixelDescriptionInput {
  coordinates: { x: number; y: number };
  region: string;
  surroundingPixels?: Array<{ x: number; y: number; color: string }>;
}

export async function generatePixelDescription(input: GeneratePixelDescriptionInput) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const descriptions = [
    `Este pixel em ${input.region} oferece uma vista deslumbrante da paisagem portuguesa.`,
    `Localizado nas coordenadas (${input.coordinates.x}, ${input.coordinates.y}), este pixel representa uma área histórica importante.`,
    `Um pixel único em ${input.region} com características especiais da região.`,
    `Este local em ${input.region} é conhecido pela sua beleza natural e importância cultural.`
  ];
  
  return {
    description: descriptions[Math.floor(Math.random() * descriptions.length)]
  };
}