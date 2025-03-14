import { TeamRubric } from './Rubric';

export default interface Judge {
    username: string;
    notes: {
        teamName: string;
        content: string;
        timestamp: Date;
    }[];
    draftAwards: {
        mostCreative: string;
        technicalAchievement: string;
        finalistProject: string;
        bestOverall: string;
    };
    rubricEvaluations: TeamRubric[];
} 