/****************************************************
 * FILE: discover.js
 * ---------------------------------------------
 * PURPOSE: Destination search using OpenAI (Client-Side).
 ****************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const findBtn = document.getElementById('findBtn');
    const destInput = document.getElementById('destInput');
    const resultBox = document.getElementById('resultBox');

    // --- ⚠️ INSECURE: YOUR OPENAI API KEY ---
    // This key is visible to anyone inspecting the page source.
    const OPENAI_API_KEY = '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'; 
    // ------------------------------------------

    if (findBtn) {
        findBtn.addEventListener('click', findDestination);
    }

    async function findDestination() {
        const userPrompt = destInput.value.trim();
        if (!userPrompt) {
            resultBox.innerHTML = 'Please describe your ideal getaway.';
            return;
        }

        resultBox.innerHTML = '<h3>🤖 Thinking...</h3><p>HiTraveller AI is finding destinations based on: "' + userPrompt + '"</p>';
        findBtn.disabled = true;

        try {
            // =======================================================
            // 💡 OPENAI API DIRECT CALL: Power text generation
            // =======================================================
            const API_URL = 'https://api.openai.com/v1/chat/completions'; 
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + OPENAI_API_KEY // Key usage
                },
                body: JSON.stringify({ 
                    model: "gpt-3.5-turbo",
                    messages: [
                        {"role": "system", "content": "You are a witty, concise travel advisor. Provide one clear, top destination recommendation based on the user's prompt, along with a brief reason."},
                        {"role": "user", "content": userPrompt}
                    ],
                    max_tokens: 150
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error ? errorData.error.message : response.statusText}`);
            }

            const data = await response.json();
            const aiRecommendation = data.choices[0].message.content;

            resultBox.innerHTML = formatAiResponse(aiRecommendation);

        } catch (error) {
            console.error('Error finding destination:', error);
            resultBox.innerHTML = '<h3>❌ AI Error</h3><p>Could not retrieve AI recommendations. Possible reasons: Invalid API Key or network error. Details: ' + error.message + '</p>';
        } finally {
            findBtn.disabled = false;
        }
    }

    function formatAiResponse(text) {
        let html = `<h2>✨ AI Recommended Destination</h2>`;
        // Replace newlines with paragraph tags for better display
        html += text.split('\n').map(p => `<p>${p}</p>`).join('');
        html += `<button class="cta-btn" onclick="window.location.href='booking.html'">Start Booking Now</button>`;
        return html;
    }
});

