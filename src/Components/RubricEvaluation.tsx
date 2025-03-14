import React, { useState } from 'react';
import { TeamRubric, RubricScore } from '../Models/Rubric';
import Team from '../Models/Team';

type RubricCategory = 'functionality' | 'userExperience' | 'idea' | 'wowFactor';

type SubCategories = {
    functionality: 'solution' | 'execution';
    userExperience: 'ux' | 'ui';
    idea: 'innovation' | 'impact' | 'theme';
    wowFactor: 'overall' | 'documentation';
};

type SubCategory<T extends RubricCategory> = SubCategories[T];

type RubricDescriptionType = {
    [K in RubricCategory]: {
        [S in SubCategories[K]]: {
            [N: number]: string;
        };
    };
};

const RUBRIC_DESCRIPTIONS: RubricDescriptionType = {
    functionality: {
        solution: {
            5: "Properly specifies the demographic of the project, and that demographic fully applies to the hackathon theme, clearly addressing the problem",
            4: "Mostly specifies the demographic of the project, and that demographic mostly applies to the hackathon theme, mostly addressing the problem",
            3: "Partially specifies the demographic of the project, and that demographic partially applies to the hackathon theme, partially addressing the problem",
            2: "Does not clearly specify the demographic of the project, and that demographic does not really apply to the hackathon theme, poorly addressing the problem",
            1: "Does not specify the demographic of the project, and the project does not relate to the hackathon theme",
            0: "No solution presented"
        },
        execution: {
            5: "Flawless or close to perfection",
            4: "Mostly functional with minor glitches",
            3: "Partially functional with some components glitchy",
            2: "Little functionality",
            1: "Very limited functionality",
            0: "Program does not run/work at all"
        }
    },
    userExperience: {
        ux: {
            5: "Extremely intuitive and easy to use, perfect navigation",
            4: "Very intuitive with easy navigation to most parts",
            3: "Reasonably intuitive with some navigation challenges",
            2: "Navigation is difficult in several areas",
            1: "Poor navigation and usability",
            0: "Not usable"
        },
        ui: {
            2: "Professional look with strong design elements that match theme",
            1: "Clean display but no major design elements",
            0: "Poor display and design"
        }
    },
    idea: {
        innovation: {
            3: "Extremely creative solution",
            2: "Creative but not groundbreaking",
            1: "Somewhat creative",
            0: "Not original/copied from another source"
        },
        impact: {
            5: "Project would make significant changes in the lives of the intended audience",
            4: "Project would have a substantial impact on the target audience",
            3: "Project would have a moderate impact on the target audience",
            2: "Project would have a small impact on the target audience",
            1: "Project would have minimal impact",
            0: "No clear impact"
        },
        theme: {
            5: "Perfectly addresses the topic and relevance is easily understandable",
            4: "Strongly addresses the topic with clear relevance",
            3: "Moderately addresses the topic, needs some explanation",
            2: "Weakly addresses the topic, requires significant explanation",
            1: "Barely connects to the topic",
            0: "Completely off topic"
        }
    },
    wowFactor: {
        overall: {
            8: "Exceptional project that stands out significantly",
            7: "Outstanding project with great potential",
            6: "Very impressive project",
            5: "Good project with some standout features",
            4: "Decent project with potential",
            3: "Average project",
            2: "Below average project",
            1: "Poor project",
            0: "No wow factor"
        },
        documentation: {
            2: "Well documented code with neat instruction",
            1: "Partially documented code",
            0: "Confusing and poorly documented code"
        }
    }
};

interface RubricEvaluationProps {
    team: Team;
    existingEvaluation?: TeamRubric;
    onSave: (evaluation: TeamRubric) => void;
}

const RubricEvaluation: React.FC<RubricEvaluationProps> = ({ team, existingEvaluation, onSave }) => {
    const [projectName, setProjectName] = useState(existingEvaluation?.projectName || '');
    const [scores, setScores] = useState<RubricScore>(existingEvaluation?.scores || {
        functionality: { solution: 0, execution: 0 },
        userExperience: { ux: 0, ui: 0 },
        idea: { innovation: 0, impact: 0, theme: 0 },
        wowFactor: { overall: 0, documentation: 0 },
        aiDeduction: 0,
        comments: '',
        totalScore: 0
    });

    const calculateTotal = (newScores: RubricScore): number => {
        const total = (
            newScores.functionality.solution +
            newScores.functionality.execution +
            newScores.userExperience.ux +
            newScores.userExperience.ui +
            newScores.idea.innovation +
            newScores.idea.impact +
            newScores.idea.theme +
            newScores.wowFactor.overall +
            newScores.wowFactor.documentation +
            newScores.aiDeduction
        );
        return Math.max(0, total); // Ensure total doesn't go below 0
    };

    const handleScoreChange = (value: number | string, path: (string | number)[]) => {
        const newScores = { ...scores };
        let current: any = newScores;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        if (typeof value === 'number') {
            newScores.totalScore = calculateTotal(newScores);
        }
        setScores(newScores);
    };

    const renderScoreOptions = <T extends RubricCategory>(
        category: T,
        subcategory: SubCategory<T>,
        options: number[]
    ) => {
        const getCategoryScores = (scores: RubricScore, cat: RubricCategory): Record<string, number> => {
            const value = scores[cat];
            if (typeof value === 'object' && value !== null) {
                return value as Record<string, number>;
            }
            return {};
        };

        return (
            <div className="score-select">
                <select
                    value={getCategoryScores(scores, category)[subcategory]}
                    onChange={(e) => handleScoreChange(Number(e.target.value), [category, subcategory])}
                >
                    {options.map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
                <div className="score-descriptions">
                    {options.map(n => (
                        <div key={n} className="score-description">
                            <strong>{n} points:</strong> {
                                RUBRIC_DESCRIPTIONS[category][subcategory][n]
                            }
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="rubric-evaluation">
            <h3>Rubric Evaluation for {team.name}</h3>
            <div className="rubric-instructions">
                <h4>Judging Instructions:</h4>
                <ul>
                    <li>Evaluate each category based on the provided criteria</li>
                    <li>Hover over or click on score options to see detailed descriptions</li>
                    <li>Consider AI usage and apply deductions accordingly</li>
                    <li>Add detailed comments to support your evaluation</li>
                </ul>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                onSave({
                    teamName: team.name,
                    projectName,
                    members: team.members,
                    scores
                });
            }}>
                <div className="form-group">
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>

                <div className="rubric-section">
                    <h4>Functionality (10 points)</h4>
                    <p className="section-description">Evaluate how well the project addresses the problem and its technical execution.</p>
                    <div className="form-group">
                        <label>Solution (0-5):</label>
                        {renderScoreOptions('functionality', 'solution', [0, 1, 2, 3, 4, 5])}
                    </div>
                    <div className="form-group">
                        <label>Execution (0-5):</label>
                        {renderScoreOptions('functionality', 'execution', [0, 1, 2, 3, 4, 5])}
                    </div>
                </div>

                <div className="rubric-section">
                    <h4>User Experience (7 points)</h4>
                    <p className="section-description">Assess the project's usability and design quality.</p>
                    <div className="form-group">
                        <label>UX (0-5):</label>
                        {renderScoreOptions('userExperience', 'ux', [0, 1, 2, 3, 4, 5])}
                    </div>
                    <div className="form-group">
                        <label>UI (0-2):</label>
                        {renderScoreOptions('userExperience', 'ui', [0, 1, 2])}
                    </div>
                </div>

                <div className="rubric-section">
                    <h4>Idea (13 points)</h4>
                    <p className="section-description">Evaluate the project's creativity, impact, and relevance to the theme.</p>
                    <div className="form-group">
                        <label>Innovation (0-3):</label>
                        {renderScoreOptions('idea', 'innovation', [0, 1, 2, 3])}
                    </div>
                    <div className="form-group">
                        <label>Impact (0-5):</label>
                        {renderScoreOptions('idea', 'impact', [0, 1, 2, 3, 4, 5])}
                    </div>
                    <div className="form-group">
                        <label>Theme (0-5):</label>
                        {renderScoreOptions('idea', 'theme', [0, 1, 2, 3, 4, 5])}
                    </div>
                </div>

                <div className="rubric-section">
                    <h4>"Wow" Factor (10 points)</h4>
                    <p className="section-description">Rate the project's overall impression and code quality.</p>
                    <div className="form-group">
                        <label>Overall (0-8):</label>
                        {renderScoreOptions('wowFactor', 'overall', [0, 1, 2, 3, 4, 5, 6, 7, 8])}
                    </div>
                    <div className="form-group">
                        <label>Documentation (0-2):</label>
                        {renderScoreOptions('wowFactor', 'documentation', [0, 1, 2])}
                    </div>
                </div>

                <div className="rubric-section">
                    <h4>AI Deduction (0 to -4 points)</h4>
                    <p className="section-description">Apply deductions based on AI usage:</p>
                    <ul className="deduction-guide">
                        <li>-4 points: AI wrote program from the ground up</li>
                        <li>-2 points: AI used for pseudocode or code revision</li>
                        <li>0 points: No significant AI usage</li>
                    </ul>
                    <div className="form-group">
                        <label>AI Usage Deduction:</label>
                        <select
                            value={scores.aiDeduction}
                            onChange={(e) => handleScoreChange(Number(e.target.value), ['aiDeduction'])}
                        >
                            {[0, -2, -4].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Additional Comments:</label>
                    <textarea
                        value={scores.comments}
                        onChange={(e) => handleScoreChange(e.target.value, ['comments'])}
                        rows={4}
                        placeholder="Please provide detailed feedback about the project's strengths and areas for improvement..."
                    />
                </div>

                <div className="total-score">
                    <h4>Total Score: {scores.totalScore}/40</h4>
                </div>

                <button type="submit">Save Evaluation</button>
            </form>
        </div>
    );
};

export default RubricEvaluation; 