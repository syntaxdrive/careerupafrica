import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import {
  getUnmatchedParticipants,
  getFoundersForMatching,
  createMatch,
  getAllMatches,
  updateMatchStatus,
  type ParticipantForMatching,
  type FounderForMatching,
  type Match,
} from '../../lib/matchingService';
import TalentCard from '../../components/matching/TalentCard';
import FounderCard from '../../components/matching/FounderCard';
import './Matching.css';

export default function Matching() {
  const { user } = useAuthStore();
  const [participants, setParticipants] = useState<ParticipantForMatching[]>([]);
  const [founders, setFounders] = useState<FounderForMatching[]>([]);
  const [existingMatches, setExistingMatches] = useState<Match[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [selectedFounder, setSelectedFounder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [matchNotes, setMatchNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    const [participantsData, foundersData, matchesData] = await Promise.all([
      getUnmatchedParticipants(),
      getFoundersForMatching(),
      getAllMatches(),
    ]);

    setParticipants(participantsData);
    setFounders(foundersData);
    setExistingMatches(matchesData);
    setIsLoading(false);
  }

  async function handleCreateMatch() {
    if (!selectedParticipant || !selectedFounder || !user?.id) return;

    setIsMatching(true);
    setError(null);

    const result = await createMatch(
      {
        participantId: selectedParticipant,
        founderId: selectedFounder,
        notes: matchNotes,
      },
      user.id
    );

    if (result.success) {
      setShowConfirmation(false);
      setSelectedParticipant(null);
      setSelectedFounder(null);
      setMatchNotes('');
      await loadData();
    } else {
      setError(result.error || 'Failed to create match');
    }

    setIsMatching(false);
  }

  async function handleUpdateMatchStatus(matchId: string, status: 'paused' | 'completed' | 'cancelled') {
    const result = await updateMatchStatus(matchId, status);

    if (result.success) {
      await loadData();
    } else {
      setError(result.error || 'Failed to update match');
    }
  }

  const selectedParticipantData = participants.find((p) => p.id === selectedParticipant);
  const selectedFounderData = founders.find((f) => f.id === selectedFounder);

  const canMatch = selectedParticipant && selectedFounder;

  return (
    <div className="matching-page">
      <main className="matching-content">
        <div className="matching-hero">
          <div>
            <h2>Manual Matching</h2>
            <p className="text-secondary">Connect talent with founders for real-world projects</p>
          </div>
          {canMatch && (
            <button onClick={() => setShowConfirmation(true)} className="btn-match">
              Create Match
            </button>
          )}
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-state">Loading matching data...</div>
        ) : (
          <>
            {/* Matching Interface */}
            <div className="matching-grid">
              {/* Unmatched Participants */}
              <div className="matching-column">
                <div className="column-header">
                  <h3>Available Talent</h3>
                  <span className="count-badge">{participants.length}</span>
                </div>

                {participants.length === 0 ? (
                  <div className="empty-column">
                    <p>No unmatched participants available</p>
                  </div>
                ) : (
                  <div className="cards-container">
                    {participants.map((participant) => (
                      <TalentCard
                        key={participant.id}
                        participant={participant}
                        isSelected={selectedParticipant === participant.id}
                        onSelect={() =>
                          setSelectedParticipant(
                            selectedParticipant === participant.id ? null : participant.id
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Founders */}
              <div className="matching-column">
                <div className="column-header">
                  <h3>Founders</h3>
                  <span className="count-badge">{founders.length}</span>
                </div>

                {founders.length === 0 ? (
                  <div className="empty-column">
                    <p>No founders available</p>
                  </div>
                ) : (
                  <div className="cards-container">
                    {founders.map((founder) => (
                      <FounderCard
                        key={founder.id}
                        founder={founder}
                        isSelected={selectedFounder === founder.id}
                        onSelect={() =>
                          setSelectedFounder(selectedFounder === founder.id ? null : founder.id)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Existing Matches */}
            <div className="matches-section">
              <h3>Existing Matches ({existingMatches.length})</h3>

              {existingMatches.length === 0 ? (
                <div className="empty-matches">
                  <p>No matches created yet. Select a participant and founder above to create the first match.</p>
                </div>
              ) : (
                <div className="matches-table">
                  {existingMatches.map((match) => (
                    <div key={match.id} className={`match-row match-${match.status}`}>
                      <div className="match-info">
                        <div className="match-participants">
                          <span className="participant-name">{match.participant?.fullName}</span>
                          <span className="match-arrow">↔</span>
                          <span className="founder-name">
                            {match.founder?.fullName}
                            {match.founder?.companyName && ` (${match.founder.companyName})`}
                          </span>
                        </div>
                        {match.participant?.skills && match.participant.skills.length > 0 && (
                          <div className="match-skills">
                            {match.participant.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="skill-tag-small">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="match-actions">
                        <span className={`status-badge status-${match.status}`}>
                          {match.status}
                        </span>
                        {match.status === 'active' && (
                          <select
                            onChange={(e) =>
                              handleUpdateMatchStatus(
                                match.id,
                                e.target.value as 'paused' | 'completed' | 'cancelled'
                              )
                            }
                            value=""
                            className="action-dropdown"
                          >
                            <option value="">Change Status...</option>
                            <option value="paused">Pause</option>
                            <option value="completed">Complete</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && selectedParticipantData && selectedFounderData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Match</h3>
              <button onClick={() => setShowConfirmation(false)} className="close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="match-summary">
                <div className="summary-item">
                  <span className="label">Participant:</span>
                  <span className="value">{selectedParticipantData.fullName}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Skills:</span>
                  <div className="skills-list">
                    {selectedParticipantData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag-small">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="summary-divider">↓</div>
                <div className="summary-item">
                  <span className="label">Founder:</span>
                  <span className="value">{selectedFounderData.fullName}</span>
                </div>
                {selectedFounderData.companyName && (
                  <div className="summary-item">
                    <span className="label">Company:</span>
                    <span className="value">{selectedFounderData.companyName}</span>
                  </div>
                )}
              </div>

              <div className="notes-section">
                <label htmlFor="matchNotes">Notes (Optional)</label>
                <textarea
                  id="matchNotes"
                  value={matchNotes}
                  onChange={(e) => setMatchNotes(e.target.value)}
                  placeholder="Add any notes about this match..."
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowConfirmation(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleCreateMatch} className="btn-primary" disabled={isMatching}>
                  {isMatching ? 'Creating...' : 'Create Match'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
