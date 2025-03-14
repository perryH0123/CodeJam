import React, { createContext, useContext, useState, ReactNode } from 'react';
import Judge from '../Models/Judge';
import { TeamRubric } from '../Models/Rubric';

interface JudgeContextType {
    isAuthenticated: boolean;
    judge: Judge | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    addNote: (teamName: string, content: string) => void;
    updateDraftAward: (award: keyof Judge['draftAwards'], teamName: string) => void;
    publishAwards: () => void;
    saveRubricEvaluation: (evaluation: TeamRubric) => void;
}

const JudgeContext = createContext<JudgeContextType | undefined>(undefined);

// This would be replaced with actual judge credentials in a real application
const JUDGE_PASSWORD = 'codejam2024';

export const JudgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [judge, setJudge] = useState<Judge | null>(null);

    const login = (username: string, password: string) => {
        if (password === JUDGE_PASSWORD) {
            setIsAuthenticated(true);
            setJudge({
                username,
                notes: [],
                draftAwards: {
                    mostCreative: '',
                    technicalAchievement: '',
                    finalistProject: '',
                    bestOverall: ''
                },
                rubricEvaluations: []
            });
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setJudge(null);
    };

    const addNote = (teamName: string, content: string) => {
        if (judge) {
            const newNote = {
                teamName,
                content,
                timestamp: new Date()
            };
            setJudge({
                ...judge,
                notes: [...judge.notes, newNote]
            });
        }
    };

    const updateDraftAward = (award: keyof Judge['draftAwards'], teamName: string) => {
        if (judge) {
            setJudge({
                ...judge,
                draftAwards: {
                    ...judge.draftAwards,
                    [award]: teamName
                }
            });
        }
    };

    const saveRubricEvaluation = (evaluation: TeamRubric) => {
        if (judge) {
            const existingIndex = judge.rubricEvaluations.findIndex(
                e => e.teamName === evaluation.teamName
            );

            const newEvaluations = [...judge.rubricEvaluations];
            if (existingIndex >= 0) {
                newEvaluations[existingIndex] = evaluation;
            } else {
                newEvaluations.push(evaluation);
            }

            setJudge({
                ...judge,
                rubricEvaluations: newEvaluations
            });
        }
    };

    const publishAwards = async () => {
        if (judge) {
            try {
                const response = await fetch("https://script.google.com/macros/s/AKfycbyAKLDv0lNMn1-WYaV7us4CHrkc4ymKzBP7L2OqfUx2VcfnfXo-bdArfr2p7WtuxTgd/exec", {
                    method: "POST",
                    body: JSON.stringify({
                        awards: [
                            { team: judge.draftAwards.mostCreative, img: '' },
                            { team: judge.draftAwards.technicalAchievement, img: '' },
                            { team: judge.draftAwards.finalistProject, img: '' },
                            { team: judge.draftAwards.bestOverall, img: '' }
                        ]
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to publish awards');
                }
            } catch (error) {
                console.error('Error publishing awards:', error);
                throw error;
            }
        }
    };

    return (
        <JudgeContext.Provider value={{ 
            isAuthenticated, 
            judge, 
            login, 
            logout, 
            addNote,
            updateDraftAward,
            publishAwards,
            saveRubricEvaluation
        }}>
            {children}
        </JudgeContext.Provider>
    );
};

export const useJudge = () => {
    const context = useContext(JudgeContext);
    if (context === undefined) {
        throw new Error('useJudge must be used within a JudgeProvider');
    }
    return context;
}; 