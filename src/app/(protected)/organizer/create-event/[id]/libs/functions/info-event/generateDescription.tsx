import { GenerationProps } from "../../../components/info-event/components/descriptionWithAI"

export const generateDescripton = async(generationForm: GenerationProps) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_AI_URL}/description-generate`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(generationForm)
    });

    if (!response.ok) {
      throw new Error('Error generating description');
    }

    const data = await response.json();
    return data.result.answer;
    return 
  } catch (error) {
    console.error('Error generating description', error);
    return null;
  }
}