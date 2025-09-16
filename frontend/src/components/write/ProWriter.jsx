import "react"
import { useState } from "react"
import { Dropdown } from "../../utils/Dropdown"

export function ProWriter() {
    const [inputText, setInputText] = useState("")
    const [rewrittenText, setRewrittenText] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null);

    const [selectedOption, setSelectedOption] = useState("Cover Letter");

    const handleRewrite = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setError(null);
        setRewrittenText(null);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8000/ai/improve-text', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputText, type: selectedOption }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP ${response.status}`);
            }

            const data = await response.json();

            setRewrittenText(data.improved_text);
        } catch (error) {
            console.error(error);
            setError(`Failed to rewrite text: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="text-rephraser-container">
            <h2>Rewrite Your Text</h2>

            <div className="dropdown-wrapper">
                <Dropdown
                    options={["Email", "Text Rewriter"]}
                    selected={selectedOption}
                    onSelect={setSelectedOption}
                />

                <p className="dropdown-description">
                    {selectedOption === "Email"
                        ? "Improve your email's clarity, tone, and professionalism."
                        : "Rephrase any text to improve flow, grammar, or style."}
                </p>
            </div>

            <div className="rephraser-flex">
                <div className="rephraser-box">
                <textarea
                    placeholder="Type your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={10}
                    maxLength={1500}
                    disabled={isLoading}
                />
                </div>

                <button
                    onClick={handleRewrite}
                    disabled={isLoading}
                    className="rephraser-arrow"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "2rem" }}
                >
                    ➡️
                </button>

                <div className="rephraser-box">
                    {error && <div className="error-message">{error}</div>}
                    <textarea
                        value={error ? `Error: ${error}` : rewrittenText || ""}
                        placeholder={isLoading ? "Rewriting..." : "Your rewritten text will appear here..."}
                        readOnly
                        rows={10}
                    />
                </div>
            </div>

            <button
                onClick={handleRewrite}
                disabled={isLoading}
                className="generate-button"
                style={{ marginTop: "1rem" }}
            >
                {isLoading ? "Rewriting..." : "Rewrite Text"}
            </button>
        </div>

    );

}