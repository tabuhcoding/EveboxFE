import QuestionsPage from "./components/questionPage";

interface CreateQuestionsProps {
    showingIds: string[];
}

export default function CreateQuestions({ showingIds }: CreateQuestionsProps) {
    return(
        <QuestionsPage showingIds={showingIds} />
    )
}
