export interface RubricScore {
    functionality: {
        solution: number; // 0-5
        execution: number; // 0-5
    };
    userExperience: {
        ux: number; // 0-5
        ui: number; // 0-2
    };
    idea: {
        innovation: number; // 0-3
        impact: number; // 0-5
        theme: number; // 0-5
    };
    wowFactor: {
        overall: number; // 0-8
        documentation: number; // 0-2
    };
    aiDeduction: number; // 0 to -4
    comments: string;
    totalScore: number; // Calculated field
}

export interface TeamRubric {
    teamName: string;
    projectName: string;
    members: string[];
    scores: RubricScore;
} 