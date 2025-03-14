import React, { useState } from 'react';
import { useJudge } from '../context/JudgeContext';
import { useNavigate } from 'react-router-dom';
import { useModifiedPayload } from '../App';
import Team from '../Models/Team';
import RubricEvaluation from './RubricEvaluation';

const JudgeDashboard: React.FC = () => {
    const { judge, logout, addNote, updateDraftAward, publishAwards, saveRubricEvaluation } = useJudge();
    const navigate = useNavigate();
    const [selectedTeam, setSelectedTeam] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [publishError, setPublishError] = useState('');
    const [evaluatingTeam, setEvaluatingTeam] = useState<Team | null>(null);
    const { teams } = useModifiedPayload();

    const handleLogout = () => {
        logout();
        navigate('/judge/login');
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTeam && noteContent) {
            addNote(selectedTeam, noteContent);
            setNoteContent('');
        }
    };

    const handlePublishAwards = async () => {
        try {
            await publishAwards();
            setPublishError('');
            navigate('/awards');
        } catch (error) {
            setPublishError('Failed to publish awards. Please try again.');
        }
    };

    return (
        <div className="judge-dashboard">
            <div className="dashboard-header">
                <h2>Judge Dashboard</h2>
                <p>Welcome, {judge?.username}!</p>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="rubric-section">
                <h3>Team Evaluations</h3>
                <div className="team-list">
                    {teams?.map((team: Team) => {
                        const evaluation = judge?.rubricEvaluations.find(e => e.teamName === team.name);
                        return (
                            <div key={team.name} className="team-evaluation-card">
                                <div className="team-info">
                                    <h4>{team.name}</h4>
                                    <p>Members: {team.members.join(', ')}</p>
                                    {evaluation && (
                                        <p className="evaluation-score">Score: {evaluation.scores.totalScore}/40</p>
                                    )}
                                </div>
                                <button onClick={() => setEvaluatingTeam(team)}>
                                    {evaluation ? 'Edit Evaluation' : 'Evaluate Team'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {evaluatingTeam && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setEvaluatingTeam(null)}>×</button>
                        <RubricEvaluation
                            team={evaluatingTeam}
                            existingEvaluation={judge?.rubricEvaluations.find(e => e.teamName === evaluatingTeam.name)}
                            onSave={(evaluation) => {
                                saveRubricEvaluation(evaluation);
                                setEvaluatingTeam(null);
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="awards-section">
                <h3>Award Selection</h3>
                <div className="awards-grid">
                    <div className="award-item">
                        <h4>Most Creative</h4>
                        <select
                            value={judge?.draftAwards.mostCreative || ''}
                            onChange={(e) => updateDraftAward('mostCreative', e.target.value)}
                        >
                            <option value="">Select team</option>
                            {teams?.map((team: Team) => (
                                <option key={team.name} value={team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="award-item">
                        <h4>Technical Achievement</h4>
                        <select
                            value={judge?.draftAwards.technicalAchievement || ''}
                            onChange={(e) => updateDraftAward('technicalAchievement', e.target.value)}
                        >
                            <option value="">Select team</option>
                            {teams?.map((team: Team) => (
                                <option key={team.name} value={team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="award-item">
                        <h4>Finalist Project</h4>
                        <select
                            value={judge?.draftAwards.finalistProject || ''}
                            onChange={(e) => updateDraftAward('finalistProject', e.target.value)}
                        >
                            <option value="">Select team</option>
                            {teams?.map((team: Team) => (
                                <option key={team.name} value={team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="award-item">
                        <h4>Best Overall</h4>
                        <select
                            value={judge?.draftAwards.bestOverall || ''}
                            onChange={(e) => updateDraftAward('bestOverall', e.target.value)}
                        >
                            <option value="">Select team</option>
                            {teams?.map((team: Team) => (
                                <option key={team.name} value={team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {publishError && <p className="error">{publishError}</p>}
                <button 
                    onClick={handlePublishAwards}
                    className="publish-btn"
                    disabled={!judge?.draftAwards.mostCreative || 
                             !judge?.draftAwards.technicalAchievement || 
                             !judge?.draftAwards.finalistProject || 
                             !judge?.draftAwards.bestOverall}
                >
                    Publish Awards
                </button>
            </div>

            <div className="notes-section">
                <h3>Add Note</h3>
                <form onSubmit={handleAddNote}>
                    <div className="form-group">
                        <label htmlFor="team">Team:</label>
                        <select
                            id="team"
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            required
                        >
                            <option value="">Select a team</option>
                            {teams?.map((team: Team) => (
                                <option key={team.name} value={team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="note">Note:</label>
                        <textarea
                            id="note"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Add Note</button>
                </form>
            </div>

            <div className="notes-list">
                <h3>Your Notes</h3>
                {judge?.notes.length === 0 ? (
                    <p>No notes yet</p>
                ) : (
                    <div className="notes-grid">
                        {judge?.notes.map((note, index) => (
                            <div key={index} className="note-card">
                                <h4>{note.teamName}</h4>
                                <p>{note.content}</p>
                                <small>{note.timestamp.toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JudgeDashboard; 