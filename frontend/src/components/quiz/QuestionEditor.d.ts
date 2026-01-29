import React from 'react';
import type { QuizQuestion } from '../../types/quiz.js';
interface QuestionEditorProps {
    question?: QuizQuestion;
    onSave: (data: Omit<QuizQuestion, 'id' | 'order'>) => void;
    onCancel: () => void;
    isNew?: boolean;
    quizType?: 'QUIZ' | 'SURVEY';
}
declare const QuestionEditor: React.FC<QuestionEditorProps>;
export default QuestionEditor;
//# sourceMappingURL=QuestionEditor.d.ts.map